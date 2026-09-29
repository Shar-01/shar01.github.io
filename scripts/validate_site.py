"""Browser QA for the static website using local Playwright and system Chrome.

Run after content.js and app.js have been written:
    python scripts/validate_site.py

Only writes review artifacts under research/validation*.
"""
from pathlib import Path
import contextlib
import functools
import http.server
import json
import sys
import threading
import time
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools'))
from playwright.sync_api import sync_playwright

CHROME = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
RESULT = ROOT / 'research' / 'validation-results.json'
checks = []
errors = []
screenshots = []


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
        except (ConnectionResetError, BrokenPipeError):
            # Browsers may stop an on-demand MP4 transfer when its dialog closes.
            pass


def screenshot(page, name):
    page.evaluate('''async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(im=>im.loading='eager');
      await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));
    }''')
    path = ROOT / 'research' / f'validation-{name}.png'
    page.screenshot(path=str(path), full_page=True, animations='disabled')
    screenshots.append(str(path.relative_to(ROOT)).replace('\\', '/'))


def viewport_screenshot(page, name):
    path = ROOT / 'research' / f'validation-{name}.png'
    page.screenshot(path=str(path), full_page=False, animations='disabled')
    screenshots.append(str(path.relative_to(ROOT)).replace('\\', '/'))


def collect_layout(page, width):
    result = page.evaluate('''() => ({
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      overflow: [...document.querySelectorAll('main *, header *, footer *')]
        .filter(el => {const s=getComputedStyle(el),r=el.getBoundingClientRect();
          return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && (r.right>innerWidth+1 || r.left < -1);})
        .map(el => ({tag:el.tagName,class:el.className,right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left)})).slice(0,12)
    })''')
    check(f'{width}px: no horizontal page overflow', result['documentWidth'] <= width + 1 and result['bodyWidth'] <= width + 1, result)
    check(f'{width}px: project cards populated', page.locator('.project-card').count() == 5)
    check(f'{width}px: hero visible', page.locator('#hero-title').is_visible())
    return result


def run():
    missing = [p for p in ('content.js', 'app.js') if not (ROOT / p).exists()]
    if missing:
        print('Application files not ready: ' + ', '.join(missing))
        return 2
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=str(CHROME), headless=True)
            context = browser.new_context(viewport={'width':1440, 'height':1000}, device_scale_factor=1)
            page = context.new_page()
            page.on('pageerror', lambda e: errors.append({'type':'pageerror','message':str(e)}))
            page.on('console', lambda m: errors.append({'type':'console','message':m.text}) if m.type == 'error' else None)
            page.on('requestfailed', lambda r: errors.append({'type':'requestfailed','url':r.url,'message':str(r.failure)}))
            page.on('response', lambda r: errors.append({'type':'http','url':r.url,'status':r.status}) if r.status>=400 else None)
            page.goto(base, wait_until='networkidle')
            page.locator('.project-card').first.wait_for()
            check('Page title identifies researcher', 'Sharmita Dey' in page.title(), page.title())
            check('Page has a single H1', page.locator('h1').count()==1)
            check('Document language is English', page.locator('html').get_attribute('lang')=='en')
            check('Five research directions are present', page.locator('.project-card').count()==5)
            total_publications = page.locator('.publication-row:visible').count()
            check('Selected publications rendered', total_publications>=5, {'count':total_publications})

            local_links = page.evaluate('''() => [...document.querySelectorAll('a[href], img[src], script[src], link[href]')].map(el=>({tag:el.tagName,value:el.getAttribute('href')||el.getAttribute('src')}))''')
            missing_assets = []
            missing_anchors = []
            for item in local_links:
                value = item['value']
                parsed = urlparse(value)
                if value.startswith('#') and len(value)>1:
                    if page.locator('[id="'+value[1:]+'"]').count()==0:
                        missing_anchors.append(value)
                elif not parsed.scheme and not value.startswith('//') and parsed.path:
                    if not (ROOT / unquote(parsed.path.lstrip('/'))).exists():
                        missing_assets.append(value)
            check('All local asset and download links exist', not missing_assets, missing_assets)
            check('All section links have targets', not missing_anchors, missing_anchors)

            for width,height in ((1440,1000),(768,1024),(390,844),(320,720)):
                page.set_viewport_size({'width':width,'height':height})
                page.evaluate('scrollTo(0,0)')
                page.wait_for_timeout(150)
                collect_layout(page,width)
                screenshot(page,str(width))
                viewport_screenshot(page,f'{width}-hero')
                if width<=768 and page.locator('.menu-toggle').is_visible():
                    page.locator('.menu-toggle').click()
                    check(f'{width}px: menu opens', page.locator('.menu-toggle').get_attribute('aria-expanded')=='true' and page.locator('#primary-nav').is_visible())
                    page.locator('#primary-nav a[href="#research"]').click()
                    check(f'{width}px: navigation closes menu', page.locator('.menu-toggle').get_attribute('aria-expanded')=='false')
                    page.evaluate('scrollTo(0,0)')
                    page.locator('.menu-toggle').click()
                    page.keyboard.press('Escape')
                    check(f'{width}px: Escape closes menu and restores focus', page.locator('.menu-toggle').get_attribute('aria-expanded')=='false' and page.locator('.menu-toggle').evaluate('(el)=>document.activeElement===el'))

            page.set_viewport_size({'width':1440,'height':1000})
            animation=page.locator('.motion-toggle').first
            animation.click()
            check('Object animation can be paused',not page.locator('img[data-motion-image]').first.get_attribute('src').endswith('.gif'))
            animation.click()
            check('Object animation can be resumed',page.locator('img[data-motion-image]').first.get_attribute('src').endswith('.gif'))
            for i in range(page.locator('.project-button').count()):
                button=page.locator('.project-button').nth(i)
                title=button.inner_text().replace('\n',' ')[:100]
                button.click()
                dialog=page.locator('#project-dialog')
                check(f'Project {i+1}: details open', dialog.is_visible() and bool(dialog.get_attribute('open') is not None), title)
                check(f'Project {i+1}: accessible heading populated', bool(page.locator('#dialog-title').inner_text().strip()))
                for im in dialog.locator('img').all():
                    im.wait_for(state='visible')
                    im.evaluate('(el)=>el.decode()')
                    check(f'Project {i+1}: figure loads', im.evaluate('(el)=>el.complete && el.naturalWidth>0'), im.get_attribute('src'))
                if dialog.locator('video').count():
                    video=dialog.locator('video').first
                    src=video.get_attribute('src')
                    if not src and video.locator('source').count(): src=video.locator('source').first.get_attribute('src')
                    check('Embodied control: video asset exists', bool(src) and (ROOT/src).exists(), src)
                    check('Embodied control: explicit video controls', video.get_attribute('controls') is not None)
                    check('Embodied control: conservative video loading', video.get_attribute('preload') in ('none','metadata'), video.get_attribute('preload'))
                    video.evaluate('(el)=>el.load()')
                    page.wait_for_function('''() => {const v=document.querySelector('#project-dialog video');return v.readyState>=1||v.error;}''',timeout=15000)
                    metadata=video.evaluate('(v)=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null})')
                    check('Embodied control: video metadata decodes', metadata['duration']>0 and not metadata['error'],metadata)
                if i==0:
                    screenshot(page,'project-dialog')
                    dialog.locator('.dialog-close').click()
                else:
                    page.keyboard.press('Escape')
                check(f'Project {i+1}: dialog closes', not dialog.is_visible())
                check(f'Project {i+1}: focus returns to project', button.evaluate('(el)=>document.activeElement===el'))

            for width,height in ((390,844),(320,720)):
                page.set_viewport_size({'width':width,'height':height})
                page.locator('.project-button').first.click()
                dialog=page.locator('#project-dialog')
                bounds=dialog.bounding_box()
                check(f'{width}px: project dialog fits viewport',bounds['x']>=0 and bounds['x']+bounds['width']<=width+1,bounds)
                check(f'{width}px: project dialog has no horizontal content overflow',dialog.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1'))
                if width==390: viewport_screenshot(page,'390-project-dialog')
                page.keyboard.press('Escape')
            page.set_viewport_size({'width':1440,'height':1000})

            for filter_button in page.locator('.filter-button').all():
                label=filter_button.inner_text()
                filter_button.click()
                count=page.locator('.publication-row:visible').count()
                check(f'Publications: {label} filter works', count>0 and (label=='All selected' or count<total_publications),{'count':count,'total':total_publications})
                check(f'Publications: {label} pressed state',filter_button.get_attribute('aria-pressed')=='true')
            page.locator('[data-filter="all"]').click()
            search=page.locator('#publication-search')
            search.fill('NeurIPS')
            count=page.locator('.publication-row:visible').count()
            check('Publication search matches venue',0<count<total_publications,{'matches':count})
            search.fill('no-paper-should-match-this-qa-string')
            check('Publication search exposes empty state',page.locator('.publication-row:visible').count()==0 and page.locator('#publication-empty').is_visible())
            search.fill('')
            check('Clearing search restores all publications',page.locator('.publication-row:visible').count()==total_publications)
            cite=page.locator('.publication-actions button').first
            cite.click()
            check('Citation dialog opens with BibTeX',page.locator('#citation-dialog').is_visible() and '@' in page.locator('#citation-text').inner_text())
            page.locator('#copy-citation').click()
            page.wait_for_timeout(200)
            status=page.locator('#citation-status').inner_text()
            check('Citation copy provides feedback',bool(status.strip()),status)
            page.keyboard.press('Escape')
            check('Citation closes on Escape',not page.locator('#citation-dialog').is_visible())
            check('Citation returns focus',cite.evaluate('(el)=>document.activeElement===el'))

            news=page.locator('#news-more')
            if news.is_visible():
                before=page.locator('.news-row:visible').count()
                news.click()
                after=page.locator('.news-row:visible').count()
                check('More updates expands the news list',after>before and news.get_attribute('aria-expanded')=='true',{'before':before,'after':after})
                news.click()
                check('News list collapses again',page.locator('.news-row:visible').count()==before and news.get_attribute('aria-expanded')=='false')

            all_images=page.locator('main img').all()
            for im in all_images:
                im.scroll_into_view_if_needed()
                im.evaluate('(el)=>el.decode()')
            broken=page.evaluate('''()=>[...document.querySelectorAll('main img')].filter(im=>!im.complete||im.naturalWidth===0).map(im=>im.src)''')
            check('All page images decode',not broken,broken)
            page.emulate_media(reduced_motion='reduce')
            page.reload(wait_until='networkidle')
            object_image=page.locator('img[src*="object-dynamics"]').first
            reduced_src=object_image.get_attribute('src')
            check('Reduced motion uses still object figure',not reduced_src.lower().endswith('.gif'),reduced_src)
            check('Reduced motion disables smooth scrolling',page.locator('html').evaluate('(el)=>getComputedStyle(el).scrollBehavior')=='auto')
            check('No browser console, page, or asset errors',not errors,errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
        report={'timestamp':time.strftime('%Y-%m-%dT%H:%M:%S'),'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'browser_errors':errors,'screenshots':screenshots}
        RESULT.write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
        lines=['# Browser validation','','System Chrome; locally served static site; viewports 1440, 768, 390 and 320 pixels.','',f"Passed: {report['passed']} · Failed: {report['failed']}",'']
        lines += [f"- {'PASS' if c['passed'] else 'FAIL'}: {c['check']}" + (f" — {c['details']}" if not c['passed'] and 'details' in c else '') for c in checks]
        lines += ['', '## Screenshots', '']+[f'- `{path}`' for path in screenshots]
        (ROOT/'research'/'validation-report.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    return 1 if any(not c['passed'] for c in checks) else 0


if __name__=='__main__':
    raise SystemExit(run())
