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
- `assets/`: public images, animation, video, CV, and generated BibTeX.

After editing, run `python scripts/build.py`. This refreshes `dist/`, the downloadable BibTeX, and `sharmita-dey-website.zip`. Deploy the **contents of `dist/`** to any static web host. No Node.js, build framework, API key, analytics, or backend is required. When deploying from the development machine, use `dist/`: the working folder also contains ignored document extracts and local review tools. GitHub Pages can safely publish the repository root because those local files are not committed.

The website is configured for https://shar-01.github.io/shar01.github.io/ with an absolute social-preview image and canonical URL. The `.nojekyll` file enables direct static publishing through GitHub Pages. Existing Academic Pages source files remain in the repository as an archive; the new root `index.html` is the active homepage. Publication and profile links point to external services; access is controlled by those services.

## Content provenance and details to confirm

Sources were reviewed on September 29, 2026. Primary publisher records and publicly available LinkedIn announcements were used alongside the supplied CV and presentations. Google Scholar's exact profile address came from the CV; direct automated access was blocked. The live LinkedIn feed was not fully accessible, so the news is a curated selection of verifiable public posts, not an exhaustive feed.

- The incoming UC Berkeley visiting role follows the owner's explicit request. No host, lab, or start date is invented.
- The new group leadership uses the publicly announced research focus. The exact formal title and host institution await the owner's details.
- ETH Zurich and Göttingen roles follow the CV; the IPAI residency follows the official announcement.
- €2M Volkswagen funding is supported by the newer public announcement, superseding the older CV's pending status. The €210K Innovation Park AI grant is stated in the supplied presentations.
- Workshop papers and preprints are labeled separately from main-conference publications.
- KIT appears in a proposed lab vision within a presentation and is not represented as a current appointment.
- The downloadable PDF is the supplied CV, unchanged; its funding status predates the newer news on the site.

The original figures and video are preserved; no scientific visuals or personal portrait were AI-generated. Publication links and figure attributions are included on the website. Working source notes, document extracts, and asset inventories are maintained locally under `research/` and are intentionally excluded from Git.

## Review

`scripts/validate_site.py` runs the browser review using Python Playwright and a locally installed Chrome on Windows. The site itself needs neither. Review output and screenshots live under `research/` and are excluded from Git and the public build.

Only the website, its public assets, documentation, and build/review scripts are versioned. Local tooling, source-document extracts, screenshots, and generated distributions remain on the development machine.
