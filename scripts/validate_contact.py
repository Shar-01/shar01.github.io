"""Exercise contact delivery in Chrome without contacting the delivery provider.

Run: python scripts/validate_contact.py
Every external request is intercepted. FormSubmit POSTs receive a local mock
response; a dummy endpoint is injected only into the browser's DOM. This checks
browser behavior and multipart construction, not actual email delivery.
"""
from email import policy
from email.parser import BytesParser
from pathlib import Path
import functools
import http.server
import json
import re
import sys
import threading
import time
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools'))
from playwright.sync_api import sync_playwright

CHROME = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
RESULT = ROOT / 'research' / 'validation-contact-results.json'
MOCK_ENDPOINT = 'https://formsubmit.co/CONTACT_TEST_ONLY_0123456789'
PDF = b'%PDF-1.4\n% contact test attachment; never delivered\n%%EOF\n'
DOCX = b'PK\x03\x04contact test document; never delivered'
checks = []
browser_errors = []
submissions = []
blocked_external = []


def check(name, ok, details=None):
    item = {'check': name, 'passed': bool(ok)}
    if details is not None:
        item['details'] = details
    checks.append(item)
    print(('PASS ' if ok else 'FAIL ') + name, flush=True)
    return bool(ok)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass


def connect_mock(page):
    page.evaluate('''endpoint => {
      const form = document.querySelector('#contact-form');
      form.action = endpoint;
      form.dataset.delivery = 'active';
      window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true}));
    }''', MOCK_ENDPOINT)


def fill_valid(page):
    page.locator('#contact-name').fill('Contact form browser test')
    page.locator('#contact-email').fill('visitor@example.org')
    page.locator('#contact-message').fill('An isolated test message that will never be delivered.')


def attachment(page, name, body, mime='application/pdf'):
    page.locator('#contact-attachment').set_input_files({
        'name': name, 'mimeType': mime, 'buffer': body,
    })


def multipart_fields(submission):
    header = ('Content-Type: ' + submission['content_type'] + '\r\nMIME-Version: 1.0\r\n\r\n').encode()
    message = BytesParser(policy=policy.default).parsebytes(header + submission['body'])
    return {
        part.get_param('name', header='content-disposition'): {
            'filename': part.get_filename(),
            'body': part.get_payload(decode=True),
        }
        for part in message.iter_parts()
    }


def run():
    source_email = re.compile(r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}', re.I)
    for filename in ('index.html', 'content.js', 'app.js', 'contact-form.js'):
        source = (ROOT / filename).read_text(encoding='utf-8')
        emails = set(source_email.findall(source)) - {'you@university.edu'}
        check(f'{filename}: no recipient email or mailto URL', not emails and 'mailto:' not in source.lower())

    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'

    def isolate_network(route):
        request = route.request
        host = urlparse(request.url).hostname
        if host == 'formsubmit.co':
            submissions.append({
                'method': request.method,
                'content_type': request.headers.get('content-type', ''),
                'body': request.post_data_buffer or b'',
                'url': request.url,
            })
            # HTTP 204 leaves the source document alive for duplicate-submit
            # and pageshow checks; no request reaches the actual provider.
            route.fulfill(status=204)
        elif host == '127.0.0.1':
            route.continue_()
        else:
            blocked_external.append(request.url)
            route.abort()

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=str(CHROME), headless=True)
            context = browser.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', isolate_network)
            page = context.new_page()
            page.on('pageerror', lambda error: browser_errors.append(str(error)))
            page.goto(base, wait_until='networkidle')
            page.locator('#contact-form').wait_for()
            form = page.locator('#contact-form')
            submit = page.locator('#contact-submit')
            file_input = page.locator('#contact-attachment')
            status = page.locator('#contact-status')

            # Inspect the checked-in configuration before isolating test states.
            # A future live endpoint must never receive a browser-test submission.
            mode = form.get_attribute('data-delivery')
            endpoint = urlparse(form.get_attribute('action') or '')
            private_endpoint = (endpoint.scheme == 'https' and endpoint.hostname == 'formsubmit.co'
                                and re.fullmatch(r'/[a-zA-Z0-9_-]{20,128}', endpoint.path) is not None)
            check('Production form state matches its declared delivery configuration',
                  (mode == 'pending' and submit.is_disabled())
                  or (mode == 'active' and private_endpoint and submit.is_enabled()))
            form.evaluate("""form => {
              form.removeAttribute('action');
              form.dataset.delivery = 'pending';
              window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true}));
            }""")
            check('Unconfigured form cannot be submitted through its button', submit.is_disabled())
            fill_valid(page)
            blocked = form.evaluate('''form => !form.dispatchEvent(new Event('submit', {bubbles:true,cancelable:true}))''')
            check('Unconfigured form also blocks programmatic submit events', blocked and not submissions)
            check('Unconfigured form provides an honest status and contact alternative',
                  'connected' in status.inner_text().lower() and 'linkedin' in status.inner_text().lower())

            connect_mock(page)
            check('An activated opaque endpoint enables submission', submit.is_enabled())
            for selector in ('#contact-name', '#contact-email', '#contact-message'):
                field = page.locator(selector)
                old_value = field.input_value()
                field.fill('')
                submit.click()
                check(f'{selector}: empty required field blocks delivery',
                      field.evaluate('(el) => el.validity.valueMissing') and not submissions)
                field.fill(old_value)
            page.locator('#contact-email').fill('not-an-email')
            submit.click()
            check('Invalid visitor email blocks delivery',
                  page.locator('#contact-email').evaluate('(el) => el.validity.typeMismatch') and not submissions)
            page.locator('#contact-email').fill('visitor@example.org')
            page.locator('#contact-message').fill('Short')
            submit.click()
            check('Too-short message blocks delivery',
                  page.locator('#contact-message').evaluate('(el) => el.validity.tooShort') and not submissions)
            fill_valid(page)

            for name, body, expected in (
                ('empty.pdf', b'', 'empty'),
                ('not-a-cv.exe', b'unaccepted', 'PDF, DOC, or DOCX'),
                ('oversized.pdf', b'x' * 10_000_001, '10 MB'),
            ):
                attachment(page, name, body)
                submit.click()
                check(f'{name}: rejected with a specific accessible error',
                      file_input.get_attribute('aria-invalid') == 'true'
                      and expected in page.locator('#attachment-status').inner_text()
                      and not submissions)

            attachment(page, 'boundary.pdf', b'x' * 10_000_000)
            check('A file at the stated 10 MB limit is accepted',
                  file_input.evaluate('(el) => el.checkValidity()'))
            page.locator('#remove-attachment').click()
            check('Remove file clears the selection, validity, and announcement',
                  file_input.evaluate('(el) => el.files.length === 0 && el.checkValidity()')
                  and page.locator('#attachment-status').inner_text() == ''
                  and page.locator('#remove-attachment').is_hidden())
            check('Removing a file returns focus to the attachment control',
                  file_input.evaluate('(el) => document.activeElement === el'))

            for name, body, mime in (
                ('CV.PDF', PDF, 'application/pdf'),
                ('CV.doc', b'legacy document test', 'application/msword'),
                ('CV.docx', DOCX, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
            ):
                attachment(page, name, body, mime)
                check(f'{name}: valid extension is accepted and name is announced',
                      file_input.evaluate('(el) => el.checkValidity()')
                      and name in page.locator('#attachment-status').inner_text())
            hostile_name = '<img src=x onerror=alert(1)>.pdf'
            attachment(page, hostile_name, PDF)
            check('Attachment filenames remain text, never HTML elements',
                  hostile_name in page.locator('#attachment-status').inner_text()
                  and page.locator('#attachment-status img').count() == 0)

            attachment(page, 'research-cv.pdf', PDF)
            with page.expect_response(lambda response: response.url == MOCK_ENDPOINT):
                submit.click()
            check('A valid submission makes one native multipart POST',
                  len(submissions) == 1 and submissions[0]['method'] == 'POST'
                  and submissions[0]['content_type'].startswith('multipart/form-data; boundary='))
            fields = multipart_fields(submissions[0])
            check('POST preserves the requested email subject', fields['_subject']['body'] == b'website_contact')
            check('POST preserves the CV filename and exact file bytes',
                  fields['attachment']['filename'] == 'research-cv.pdf' and fields['attachment']['body'] == PDF)
            check('POST preserves the visitor reply address and message',
                  fields['email']['body'] == b'visitor@example.org'
                  and fields['message']['body'].startswith(b'An isolated test message'))
            check('POST uses the absolute production thank-you URL',
                  fields['_next']['body'] == b'https://shar-01.github.io/shar01.github.io/thanks.html')
            check('Submission announces verification without claiming delivery',
                  form.get_attribute('aria-busy') == 'true' and submit.is_disabled()
                  and 'verification' in status.inner_text().lower()
                  and 'success' not in status.inner_text().lower())
            form.evaluate('(form) => form.requestSubmit()')
            page.wait_for_timeout(100)
            check('A repeated submission is suppressed while pending', len(submissions) == 1)
            page.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true}))")
            check('Returning to the page restores the submit state',
                  submit.is_enabled() and form.get_attribute('aria-busy') is None
                  and 'Send message' in submit.inner_text())

            page.locator('#remove-attachment').click()
            with page.expect_response(lambda response: response.url == MOCK_ENDPOINT):
                submit.click()
            check('A message can be submitted without an optional CV', len(submissions) == 2)
            fields = multipart_fields(submissions[1])
            check('Submission after removal does not reuse the previous attachment',
                  'attachment' not in fields or fields['attachment']['body'] == b'')
            page.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted:true}))")

            for index in range(page.locator('.project-button').count()):
                page.locator('.project-button').nth(index).click()
                contact_link = page.locator('#project-dialog a[href="#contact"]')
                if contact_link.count():
                    contact_link.click()
                    page.wait_for_timeout(150)
                    check('Project contact link closes the modal',
                          not page.locator('#project-dialog').is_visible()
                          and 'modal-open' not in (page.locator('body').get_attribute('class') or ''))
                    check('Project contact link moves keyboard focus to the form',
                          page.locator('#contact-name').evaluate('(el) => document.activeElement === el'))
                    break
                page.keyboard.press('Escape')
            else:
                check('Project contact link exists', False)

            page.goto(base + '/thanks.html', wait_until='networkidle')
            check('Thank-you page loads and offers a working return link',
                  page.locator('h1').is_visible()
                  and page.get_by_role('link', name='Back to the website').get_attribute('href') == './')
            check('No JavaScript exceptions occur', not browser_errors, browser_errors)
            check('All delivery requests were captured using the dummy endpoint',
                  all(item['url'] == MOCK_ENDPOINT for item in submissions))
            browser.close()
    except Exception as error:
        check('Browser validation completed', False, f'{type(error).__name__}: {error}')
    finally:
        server.shutdown()
        server.server_close()
        RESULT.parent.mkdir(exist_ok=True)
        report = {
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%S'),
            'passed': sum(item['passed'] for item in checks),
            'failed': sum(not item['passed'] for item in checks),
            'checks': checks,
            'real_delivery_requests': 0,
            'mocked_submissions': len(submissions),
            'blocked_external_requests': blocked_external,
            'browser_errors': browser_errors,
        }
        RESULT.write_text(json.dumps(report, indent=2), encoding='utf-8')
        print(f"{report['passed']} passed; {report['failed']} failed; no real form submissions", flush=True)
    return 1 if any(not item['passed'] for item in checks) else 0


if __name__ == '__main__':
    raise SystemExit(run())
