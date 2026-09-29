# Sharmita Dey — personal research website

A responsive, dependency-free website about physical AI, world models, robot learning, and embodied interaction. It includes five research projects, original presentation figures, an animated object-interaction example, an embedded robotics experiment, selected publications, BibTeX citations, current positions, and news.

## Preview

Open `index.html` directly, or run from this folder:

```powershell
python scripts/serve.py
```

Visit **http://localhost:8000**. The server builds and serves only the public site. Restart after editing to refresh the build.

## Update

- `content.js`: news, project descriptions, media, publications, and citation metadata.
- `index.html`: introduction, vision, positions, contact links, and page metadata.
- `styles.css`: responsive layout, typography, colors, accessibility, and print styles.
- `app.js`: project dialogs, video, reduced-motion controls, publication search and filtering, citations, and navigation.
- `contact-form.js`: attachment validation, delivery checks, and native multipart form submission.
- `thanks.html`: confirmation after the delivery service accepts a submission.
- `assets/`: public images, animation, video, CV, and generated BibTeX.

After editing, run `python scripts/build.py`. This refreshes `dist/`, the downloadable BibTeX, and `sharmita-dey-website.zip`. Deploy the **contents of `dist/`** to any static web host. No Node.js, build framework, analytics, or self-hosted backend is required. Contact delivery uses FormSubmit after recipient activation. When deploying from the development machine, use `dist/`: the working folder also contains ignored document extracts and local review tools. GitHub Pages can safely publish the repository root because those local files are not committed.

The website is configured for https://shar-01.github.io/shar01.github.io/ with an absolute social-preview image and canonical URL. The `.nojekyll` file enables direct static publishing through GitHub Pages. Existing Academic Pages source files remain in the repository as an archive; the new root `index.html` is the active homepage. Publication and profile links point to external services; access is controlled by those services.

## Content provenance and details to confirm

Sources were reviewed on September 29, 2026. Primary publisher records and publicly available LinkedIn announcements were used alongside the supplied CV and presentations. Google Scholar's exact profile address came from the CV; direct automated access was blocked. The live LinkedIn feed was not fully accessible, so the news is a curated selection of verifiable public posts, not an exhaustive feed.

- The incoming UC Berkeley visiting role follows the owner's explicit request. No host, lab, or start date is invented.
- The new group leadership uses the publicly announced research focus. The exact formal title and host institution await the owner's details.
- ETH Zurich is now Guest Scientist, as corrected by the owner; the postdoctoral appointment ran from November 2024 through September 2026. Göttingen follows the CV, and the IPAI residency follows the official announcement.
- €2M Volkswagen funding is supported by the newer public announcement, superseding the older CV's pending status. The €210K Innovation Park AI grant is stated in the supplied presentations.
- Workshop papers and preprints are labeled separately from main-conference publications.
- KIT appears in a proposed lab vision within a presentation and is not represented as a current appointment.
- The downloadable PDF is the supplied CV, unchanged; its funding status predates the newer news on the site.

The original figures and video are preserved; no scientific visuals or personal portrait were AI-generated. Publication links and figure attributions are included on the website. Working source notes, document extracts, and asset inventories are maintained locally under `research/` and are intentionally excluded from Git.

## Review

`scripts/validate_site.py` runs the browser review using Python Playwright and a locally installed Chrome on Windows. The site itself needs neither. `scripts/validate_contact.py` adds isolated contact-form checks; all delivery requests are intercepted and mocked so the tests send no emails. Review output and screenshots live under `research/` and are excluded from Git and the public build.

Only the website, its public assets, documentation, and build/review scripts are versioned. Local tooling, source-document extracts, screenshots, and generated distributions remain on the development machine.

## Contact form

The form collects a name, reply email, institution, enquiry topic, message, and an optional CV (PDF, DOC, or DOCX; 10 MB maximum). `contact-form.js` validates file selection; native multipart submission preserves attachments and the provider CAPTCHA. The email subject is `website_contact`. `thanks.html` is the provider's post-submission redirect.

The owner authorized FormSubmit and recipient activation was completed on September 29, 2026. A direct routing test reached the inbox with subject `website_contact`. Delivery through the public opaque endpoint and delivery of attachments remain unverified, so the live form stays in `pending` mode with submission disabled. Do not mark it active until an end-to-end test confirms both the message and attachment arrive through the opaque endpoint. Once verified, put that endpoint in the form action, change `data-delivery` to `active`, and remove the submit button's initial disabled attribute. The recipient address must not be included in browser-visible form markup or scripts.

The provider's public endpoint token is safe to include in the form action. Never publish activation links, archive/API keys, or mailbox credentials. The original downloadable CV and legacy Academic Pages source retain their historical contact details; the redesigned page and form do not display the recipient address.
