# Verification

Verified locally on 20 October 2026.

## Production build

`npm run build` creates the Vite production bundle and 29 pre-rendered public routes with canonical metadata, structured data, sitemap and robots.txt. The CMS snapshot mode was exercised against the running MongoDB-backed API via `CONTENT_API_URL`.

## Backend

Six integration tests pass using a temporary isolated MongoDB database. Coverage includes validation/mass-assignment rejection, enquiry persistence and sanitisation, honeypot spam handling, newsletter deduplication, protected admin login/CRUD/status changes/logout revocation, and safe CSV quoting/formula escaping. The application database is separate from the test database.

## Browser

Production browser verification covers 16 representative routes, including detail pages, legal pages, 404 and admin. Layout checks cover 360, 390, 768, 1440 and 1920px widths. The quote form was completed in the browser and its saved enquiry verified in the admin dashboard. Admin login/logout and mobile navigation also pass. No JavaScript page errors were observed.

Automated WCAG checks on home/contact/admin reported no violations in the selected rule set; the expensive contrast rule was excluded there. Lighthouse separately included its own accessibility audit. This is not a complete manual accessibility certification.

## Measured desktop Lighthouse

| Category | Score |
| --- | --- |
| Performance | 95 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Measured against the production Express build at a 1440 × 1000 desktop viewport using Lighthouse 12.8.2 and installed Microsoft Edge, with provided local throttling. These are local desktop results, not a claim about mobile or deployed-network performance. The report is saved in `.local/qa/lighthouse.html` and `.local/qa/lighthouse.json`. Subsequent label-name and touch-target refinements preserve the visual design; HTTP compression was added afterwards.

Original generated images and final desktop/mobile hero, portfolio and footer compositions were visually inspected. The image sources and exact generation prompts are documented in `IMAGE_ASSETS.md`.

## Operational limits

- SMTP credentials are not configured, so real email delivery and auto-replies have not been tested. Leads still persist and admin shows notification status.
- Contact/business/social details, illustrative testimonials, concept portfolio and indicative prices are clearly identified for replacement before public launch.
- Legal policies are starter drafts pending business-specific completion.
- Public hosting/domain deployment has not been performed; this is the requested local MERN project.
- MongoDB runs as a separate small-cache project instance on port 27018. The setup and restart instructions are in `README.md`.
