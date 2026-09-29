(() => {
  'use strict';
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const submit = document.querySelector('#contact-submit');
  const attachment = document.querySelector('#contact-attachment');
  const attachmentStatus = document.querySelector('#attachment-status');
  const removeAttachment = document.querySelector('#remove-attachment');
  const status = document.querySelector('#contact-status');
  const maxBytes = 10_000_000;
  const fileTypes = /\.(pdf|doc|docx)$/i;
  let isSubmitting = false;

  function isConnected() {
    try {
      const endpoint = new URL(form.getAttribute('action'));
      return form.dataset.delivery === 'active' && endpoint.protocol === 'https:' &&
        endpoint.hostname === 'formsubmit.co' && /^[a-zA-Z0-9_-]{20,128}$/.test(endpoint.pathname.slice(1));
    } catch {
      return false;
    }
  }

  function showStatus(message, state = '') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function validateAttachment() {
    const file = attachment.files[0];
    let error = '';
    if (file && !fileTypes.test(file.name)) error = 'Please choose a PDF, DOC, or DOCX file.';
    else if (file && file.size === 0) error = 'This file is empty. Please choose another file.';
    else if (file && file.size > maxBytes) error = 'Please choose a file smaller than 10 MB.';
    attachment.setCustomValidity(error);
    attachment.setAttribute('aria-invalid', String(Boolean(error)));
    attachmentStatus.textContent = error || (file ? `${file.name} (${(file.size / 1_000_000).toFixed(2)} MB)` : '');
    attachmentStatus.classList.toggle('field-error', Boolean(error));
    removeAttachment.hidden = !file;
    return !error;
  }

  attachment.addEventListener('change', validateAttachment);
  removeAttachment.addEventListener('click', () => {
    attachment.value = '';
    validateAttachment();
    attachment.focus();
  });

  function ready() {
    isSubmitting = false;
    submit.disabled = !isConnected();
    submit.innerHTML = 'Send message <span aria-hidden="true">\u2197</span>';
    form.removeAttribute('aria-busy');
    if (isConnected()) showStatus('You may be asked to complete a spam-prevention check before your message is submitted.');
  }
  ready();
  window.addEventListener('pageshow', ready);

  form.addEventListener('submit', event => {
    if (!isConnected()) {
      event.preventDefault();
      showStatus('The form is being connected. Please use the LinkedIn link to get in touch for now.', 'error');
      return;
    }
    if (isSubmitting) {
      event.preventDefault();
      return;
    }
    if (!validateAttachment() || !form.reportValidity()) {
      event.preventDefault();
      attachment.reportValidity();
      return;
    }
    // Native multipart POST preserves attachments and the provider's CAPTCHA flow.
    // Success is shown only after the delivery service redirects to thanks.html.
    isSubmitting = true;
    submit.disabled = true;
    submit.textContent = 'Opening delivery check\u2026';
    form.setAttribute('aria-busy', 'true');
    showStatus('Opening the delivery check. Complete any verification to finish submitting your message.');
  });
})();
