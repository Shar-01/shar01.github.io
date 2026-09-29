(() => {
  'use strict';
  const { news, projects, publications } = window.SITE_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const external = (url) => /^(https?:|assets\/)/.test(url) ? ' target="_blank" rel="noopener"' : '';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !motionPreference.matches;
  let activeFilter = 'all';
  let lastDialogTrigger = null;

  $('#news-list').innerHTML = news.map((item, index) => `<a class="news-row" href="${escape(item.url)}"${external(item.url)}${index > 2 ? ' hidden data-extra-news' : ''}><span class="news-date">${escape(item.date)}</span><div><h3>${escape(item.title)}${(item.tags || []).map(tag => ` <span class="news-tag">${escape(tag)}</span>`).join('')}</h3><p>${escape(item.description)}</p></div><span class="news-arrow" aria-hidden="true">${item.url.startsWith('#') ? '↘' : '↗'}</span></a>`).join('');
  $('#news-more').addEventListener('click', event => {
    const expanded = event.currentTarget.getAttribute('aria-expanded') !== 'true';
    $$('[data-extra-news]').forEach(row => row.hidden = !expanded);
    event.currentTarget.setAttribute('aria-expanded', String(expanded));
    event.currentTarget.innerHTML = expanded ? 'Fewer updates <span aria-hidden="true">−</span>' : 'More updates <span aria-hidden="true">＋</span>';
  });

  $('#project-grid').innerHTML = projects.map(project => `<article class="project-card${project.featured ? ' featured' : ''}"><button class="project-button" data-project="${escape(project.id)}" aria-haspopup="dialog"><span class="project-image${project.still ? ' object-image' : ''}"><img src="${escape(project.still && !motionEnabled ? project.still : project.image)}" alt="${escape(project.alt)}" loading="lazy" decoding="async"${project.still ? ` data-motion-image data-animated="${escape(project.image)}" data-still="${escape(project.still)}"` : ''}></span><span class="project-type">${escape(project.label)}</span><span class="project-title-row"><span class="project-title" role="heading" aria-level="3">${escape(project.title)}</span><span aria-hidden="true">↗</span></span><span class="project-description">${escape(project.description)}</span><span class="project-meta">${escape(project.meta)}</span></button>${project.still ? `<button class="motion-toggle" aria-label="${motionEnabled ? 'Pause' : 'Play'} object dynamics animation">${motionEnabled ? 'Ⅱ Pause' : '▷ Play'} animation</button>` : ''}</article>`).join('');

  function setMotion(enabled) {
    motionEnabled = enabled;
    $$('[data-motion-image]').forEach(img => { img.src = enabled ? img.dataset.animated : img.dataset.still; });
    $$('.motion-toggle').forEach(button => {
      button.textContent = enabled ? 'Ⅱ Pause animation' : '▷ Play animation';
      button.setAttribute('aria-label', `${enabled ? 'Pause' : 'Play'} object dynamics animation`);
    });
  }
  document.addEventListener('click', event => {
    if (event.target.closest('.motion-toggle')) setMotion(!motionEnabled);
  });
  motionPreference.addEventListener('change', event => setMotion(!event.matches));

  function openDialog(dialog, trigger) {
    lastDialogTrigger = trigger;
    dialog.showModal();
    document.body.classList.add('modal-open');
    $('.dialog-close', dialog).focus();
  }
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      const video = $('video', dialog);
      if (video) video.pause();
      document.body.classList.remove('modal-open');
      lastDialogTrigger?.focus({ preventScroll: true });
    });
  });

  $('#project-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-project]');
    if (!button) return;
    const project = projects.find(item => item.id === button.dataset.project);
    const dialogImage = project.dialogImage || project.image;
    $('#project-dialog-content').innerHTML = `<p class="eyebrow">${escape(project.category)}</p><h2 id="dialog-title">${escape(project.title)}</h2><p class="dialog-description">${escape(project.detail)}</p><figure class="dialog-figure"><img class="${project.still ? 'dialog-gif' : ''}" src="${escape(project.still && !motionEnabled ? project.still : dialogImage)}" alt="${escape(project.alt)}"${project.still ? ` data-motion-image data-animated="${escape(project.image)}" data-still="${escape(project.still)}"` : ''}><figcaption class="dialog-caption">${escape(project.caption)}</figcaption></figure>${project.still ? `<button class="motion-toggle dialog-motion" style="position:static;margin-top:12px" aria-label="${motionEnabled ? 'Pause' : 'Play'} object dynamics animation">${motionEnabled ? 'Ⅱ Pause' : '▷ Play'} animation</button>` : ''}${project.secondaryImage ? `<figure class="dialog-figure"><img src="${escape(project.secondaryImage)}" alt="${escape(project.secondaryAlt)}" loading="lazy"><figcaption class="dialog-caption">${escape(project.secondaryAlt)}. Figure from my research presentation.</figcaption></figure>` : ''}${project.video ? `<h3 class="dialog-subheading">From the model to the physical world</h3><video class="dialog-video" controls playsinline preload="none" poster="${escape(project.poster)}" aria-label="Embodied adaptation experiment" aria-describedby="video-description"><source src="${escape(project.video)}" type="video/mp4">Your browser does not support embedded video. <a href="${escape(project.video)}">Download the experiment video</a>.</video><p class="dialog-caption" id="video-description">${escape(project.videoDescription)}</p>` : ''}<div class="dialog-links">${project.links.map(link => `<a class="text-link" href="${escape(link.url)}"${external(link.url)}>${escape(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
    openDialog($('#project-dialog'), button);
  });

  function bibtex(publication) {
    const fields = { title: `{${publication.title}}`, author: publication.authors.join(' and '), year: publication.year };
    ['journal','booktitle','volume','number','pages','doi','eprint','archivePrefix','url'].forEach(key => {
      if (publication[key]) fields[key] = publication[key];
    });
    return `@${publication.bibType}{${publication.id},\n${Object.entries(fields).map(([key,value]) => `  ${key} = {${value}}`).join(',\n')}\n}`;
  }
  function renderPublications() {
    const query = $('#publication-search').value.trim().toLocaleLowerCase();
    const shown = publications.filter(paper => (activeFilter === 'all' || paper.categories.includes(activeFilter)) && `${paper.title} ${paper.authors.join(' ')} ${paper.venue} ${paper.year} ${paper.type} ${paper.summary}`.toLocaleLowerCase().includes(query));
    $('#publication-list').innerHTML = shown.map(paper => {
      const displayAuthors = paper.shortAuthors ? paper.authors.slice(0,4) : paper.authors;
      const authors = displayAuthors.map(author => author === 'Sharmita Dey' ? `<strong>${escape(author)}</strong>` : escape(author)).join(', ') + (paper.shortAuthors ? ', et al.' : '');
      return `<article class="publication-row"><div><span class="publication-venue${paper.venueClass ? ` venue-${escape(paper.venueClass)}` : ''}">${escape(paper.venue)}</span><span class="publication-year">${paper.year} · ${escape(paper.type)}</span></div><div><h3><a href="${escape(paper.url)}" target="_blank" rel="noopener">${escape(paper.title)}</a></h3><p class="publication-authors">${authors}</p><p class="publication-summary">${escape(paper.summary)}</p></div><div class="publication-actions"><a href="${escape(paper.url)}" target="_blank" rel="noopener" aria-label="Read ${escape(paper.title)}">Paper ↗</a>${paper.pdf ? `<a href="${escape(paper.pdf)}" target="_blank" rel="noopener" aria-label="PDF of ${escape(paper.title)}">PDF ↗</a>` : ''}<button data-cite="${escape(paper.id)}" aria-haspopup="dialog" aria-label="Cite ${escape(paper.title)}">Cite ⧉</button></div></article>`;
    }).join('');
    $('#publication-empty').hidden = shown.length > 0;
    $('#publication-count').textContent = `${shown.length} ${shown.length === 1 ? 'publication' : 'publications'} shown`;
  }
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    $$('.filter-button').forEach(filter => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
    renderPublications();
  }));
  $('#publication-search').addEventListener('input', renderPublications);
  renderPublications();
  $('#publication-list').addEventListener('click', event => {
    const button = event.target.closest('[data-cite]');
    if (!button) return;
    $('#citation-text').textContent = bibtex(publications.find(paper => paper.id === button.dataset.cite));
    $('#citation-status').textContent = '';
    openDialog($('#citation-dialog'), button);
  });
  $('#copy-citation').addEventListener('click', async () => {
    const content = $('#citation-text').textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      } else {
        const field = document.createElement('textarea');
        field.value = content;
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        $('#citation-dialog').append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      $('#citation-status').textContent = 'Citation copied to clipboard.';
    } catch {
      $('#citation-status').textContent = 'Select the citation above to copy it, or download all citations below the publication list.';
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents($('#citation-text'));
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  $('#project-dialog').addEventListener('click', event => {
    if (!event.target.closest('a[href="#contact"]')) return;
    event.preventDefault();
    lastDialogTrigger = null;
    $('#project-dialog').close();
    $('#contact').scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth' });
    $('#contact-name').focus({ preventScroll: true });
  });

  const menu = $('.menu-toggle');
  const nav = $('#primary-nav');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); $('span',menu).textContent = '＋'; }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    $('span',menu).textContent = open ? '−' : '＋';
  });
  $$('a',nav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) {closeMenu(); menu.focus();} });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) $$('a',nav).forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin:'-10% 0px -60% 0px', threshold:0 });
  $$('main section[id]').forEach(section => navObserver.observe(section));
  $('#copyright-year').textContent = new Date().getFullYear();
})();
