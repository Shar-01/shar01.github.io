# Sharmita Dey — personal research website

A responsive, dependency-free website about physical AI, world models, robot learning, and embodied interaction. It includes six research projects, original presentation figures, an animated object-interaction example, an embedded robotics experiment, selected publications, BibTeX citations, current positions, and news.

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
- `assets/`: public images, animation, video, and generated BibTeX.

After editing, run `python scripts/build.py`. This refreshes `dist/`, the downloadable BibTeX, and `sharmita-dey-website.zip`. Deploy the **contents of `dist/`** to any static web host. No Node.js, build framework, analytics, or self-hosted backend is required. Contact delivery uses FormSubmit after recipient activation. When deploying from the development machine, use `dist/`: the working folder also contains ignored document extracts and local review tools. GitHub Pages can safely publish the repository root because those local files are not committed.

The website is configured for https://shar-01.github.io/shar01.github.io/ with an absolute social-preview image and canonical URL. The `.nojekyll` file enables direct static publishing through GitHub Pages. Existing Academic Pages source files remain in the repository as an archive; the new root `index.html` is the active homepage. Publication and profile links point to external services; access is controlled by those services.

## Content provenance and details to confirm

Sources were reviewed on September 29, 2026. Primary publisher records and publicly available LinkedIn announcements were used alongside the supplied CV and presentations. Google Scholar's exact profile address came from the CV; direct automated access was blocked. The live LinkedIn feed was not fully accessible, so the news is a curated selection of verifiable public posts, not an exhaustive feed.

- September 2026 recognition in Top 100+ Women in AI, Data & Robotics in Switzerland is verified in the Academia category on page 14 of the [official report](https://www.greaterzuricharea.com/sites/default/files/2026-09/Report_100_AI_Data_women_ch_2026_komp.pdf). This is a selection, not a ranking; the news entry links to the owner-provided LinkedIn announcement.
- The owner confirmed the PhD dates as 2019 to 2023, with summa cum laude (highest distinction).
- The UC Berkeley Visiting Scholar role is current, as corrected by the owner. No host, lab, or start date is invented.
- The incoming group leadership uses the publicly announced research focus and the owner's confirmed incoming status. The exact formal title and host institution await the owner's details.
- ETH Zurich is now Guest Scientist, as corrected by the owner; the postdoctoral appointment ran from November 2024 through August 2026. The owner corrected the Göttingen Guest Scientist appointment to 2024 to 2025. The Innovation Park Artificial Intelligence Foundation residency follows the official announcement and is also shown among the introductory roles.
- The owner supplied July 2026 for the Volkswagen Foundation award and February 2026 for the €210K assistive robotics grant.
- The vision statement, including the passage adapted from the supplied quotation, and the goals for trustworthy foundation models for bionic intelligence were supplied by the owner. The new project is presented as a research direction, with a representative figure from the supplied presentation.
- The owner confirmed €2.2 million in Volkswagen Foundation funding, updating the earlier public announcement's rounded amount and superseding the older CV's pending status. The €210K Innovation Park Artificial Intelligence Foundation grant is stated in the supplied presentations.
- Workshop papers and preprints are labeled separately from main-conference publications.
- KIT appears in a proposed lab vision within a presentation and is not represented as a current appointment.
- The owner requested removal of the CV from the public website. The source PDF is retained only as an ignored local research reference; Google Scholar is the public publication link.

The original figures and video are preserved; no scientific visuals or personal portrait were AI-generated. Publication links and figure attributions are included on the website. Working source notes, document extracts, and asset inventories are maintained locally under `research/` and are intentionally excluded from Git.

## Review

`scripts/validate_site.py` runs the browser review using Python Playwright and a locally installed Chrome on Windows. The site itself needs neither. `scripts/validate_contact.py` adds isolated contact-form checks; all delivery requests are intercepted and mocked so the tests send no emails. Review output and screenshots live under `research/` and are excluded from Git and the public build.

Only the website, its public assets, documentation, and build/review scripts are versioned. Local tooling, source-document extracts, screenshots, and generated distributions remain on the development machine.

## Contact form

The form collects a name, reply email, institution, enquiry topic, message, and an optional CV (PDF, DOC, or DOCX; 10 MB maximum). `contact-form.js` validates file selection; native multipart submission preserves attachments and the provider CAPTCHA. The email subject is `website_contact`. `thanks.html` is the provider's post-submission redirect.

The owner authorized FormSubmit and recipient activation was completed on September 29, 2026. A direct routing test reached the inbox with subject `website_contact`. Delivery through the public opaque endpoint and delivery of attachments remain unverified, so the live form stays in `pending` mode with submission disabled. Do not mark it active until an end-to-end test confirms both the message and attachment arrive through the opaque endpoint. Once verified, put that endpoint in the form action, change `data-delivery` to `active`, and remove the submit button's initial disabled attribute. The recipient address must not be included in browser-visible form markup or scripts.

The provider's public endpoint token is safe to include in the form action. Never publish activation links, archive/API keys, or mailbox credentials. The redesigned page and form do not display the recipient address. The owner’s CV is excluded from the published assets.

## Search discovery

The live homepage is indexable and declares its canonical URL. The sitemap at https://shar-01.github.io/shar01.github.io/sitemap.xml contains only that homepage; the thank-you page remains noindex. Update its lastmod date after substantive page changes. Person structured data identifies Sharmita Dey, her portrait, UC Berkeley and ETH Zurich, and her established profiles.

In Google Search Console, verify a URL-prefix property for https://shar-01.github.io/shar01.github.io/ using the generated HTML verification tag or file, then inspect the homepage URL, request indexing, and submit sitemap.xml. The owner-supplied Google verification meta tag is published in the homepage head. Keep it in place after verification. Link to this same homepage from established public profiles. Indexing and ranking are controlled by search engines and are not guaranteed.

This is a GitHub Pages project site. Search engines read robots.txt only at the host root, so a robots.txt inside this project directory would not control crawling. The host root currently returns 404 for robots.txt, which does not block crawling.
