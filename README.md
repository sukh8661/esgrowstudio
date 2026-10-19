# Esgrow Studio

A complete MERN agency website for **Esgrow Studio — From Roots to Results**. Built in this folder with React 19, Vite, Tailwind 4, GSAP, Lenis, Express and MongoDB. The visual system combines original SVG/CSS, five original ImageGen images and five user-supplied abstract references, all served locally as optimised WebP. Fonts are also local. See `IMAGE_ASSETS.md` for the source map, saved originals and complete generation prompts.

## Run locally

Requirements: Node.js 22.12+ and MongoDB 8 (local or Atlas).

```powershell
npm install
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
# Edit server/.env: set database URI, a random JWT secret, admin email/password.
npm run seed
npm run dev
```

Website: http://127.0.0.1:5173 · API: http://127.0.0.1:5000/api · Admin: http://127.0.0.1:5173/admin

For this workspace, a local `server/.env` was already generated with random admin credentials. A dedicated MongoDB is running on **127.0.0.1:27018** with a 256 MB cache and data in `.local/mongodb`; `server/.env` points there. The pre-existing Windows MongoDB service stopped during system memory pressure; the project instance uses a separate database directory and does not modify that service's data. **Read the admin email/password in the ignored env file** to sign in. No password is hardcoded in source. Do not overwrite this file with the example unless you intend to reconfigure it. The idempotent seed preserves existing records and does not reset an existing admin password.

After restarting your computer, run `npm run db:local` in one terminal, then `npm run dev` in another. `db:local` locates MongoDB 8 on Windows or uses `mongod` from PATH; set `MONGOD_PATH` for another installation. You can instead point `MONGODB_URI` at your regular MongoDB service or Atlas.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start API and Vite together |
| `npm run db:local` | Start the dedicated local MongoDB on port 27018 |
| `npm run seed` | Seed 9 services, 3 concept projects, 6 articles, 3 illustrative perspectives, FAQs and the admin |
| `npm run build` | Production Vite build + prerender 29 public routes, metadata and sitemap |
| `npm start` | Express API and built client on port 5000 |
| `npm test` | API integration tests using an isolated temporary MongoDB database |
| `npm run test:browser` | Desktop/mobile routes, enquiry, admin login, menu and accessibility checks; start dev servers first |

Browser checks use installed Microsoft Edge. Change the Playwright channel in `scripts/browser-check.mjs` if using another browser. Screenshots and reports are ignored in `.local/qa/`. API tests use the server's configured MongoDB host with a random isolated database name, or `TEST_MONGODB_URI` pointing to a **disposable database named `esgrow_test_*`**; that test database is dropped afterwards. Production database names are rejected by the test harness. Automated accessibility checks cover home/contact/admin, excluding the expensive color-contrast rule; they do not constitute a full accessibility certification.

## Structure

```text
client/
  src/
    App.jsx                 Route composition and code splitting
    Home.jsx                Complete home, services, process and work components
    Pages.jsx               Public detail/listing/contact/legal pages
    Admin.jsx               Login, leads, CRUD, subscribers and stats
    Art.jsx                 Original garden, logo and project artwork
    components.jsx          Shared interaction/design system
    content.js              High-quality seed/demo content
    siteConfig.js           Brand, contact, socials and indicative prices
    SEO.jsx                 Per-route metadata and JSON-LD
    entry-server.jsx        Build-time rendering
    styles.css              Theme, responsive styles, animation and reduced motion
  public/                   Local fonts, favicon, OG image and hosting redirects
server/
  src/
    routes/                 REST route definitions
    controllers/            Validation and response orchestration
    services/               Content, admin and email business logic
    models/                 MongoDB schemas
    middleware/             Auth, validation, consistent errors
    seed.js                 Non-destructive seed
scripts/                    Prerender and browser verification
DESIGN_NOTES.md              Reference analysis and implementation decisions
```

## Environment variables

### Client

`VITE_API_URL` defaults to `/api` (Vite proxies to localhost:5000). For split hosting, set it to the absolute HTTPS API address, e.g. `https://api.yourdomain.com/api`.

`VITE_SITE_URL` sets canonical links, structured data and sitemap base URL. `VITE_WHATSAPP_NUMBER` accepts an international number with digits only. Until a number is set, the floating contact button opens the contact page. Client environment values are public and fixed at build time.

### Server

- `MONGODB_URI`: local connection or Atlas URI.
- `JWT_SECRET`: at least 32 random characters; use a unique production secret.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: seed-time admin identity (password at least 12 characters).
- `PORT`: defaults to 5000; optional `HOST` defaults to `0.0.0.0` for deployment.
- `CLIENT_URL`: comma-separated allowed client origins, including protocol and port.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `STUDIO_EMAIL`: email delivery settings.
- `SITE_URL`: reserved server-side canonical domain configuration; keep it aligned with `VITE_SITE_URL`.

Enquiries persist even when SMTP is unavailable. Their email status is visible in admin: `pending`, `sent`, `failed` or `not-configured`. SMTP is intentionally blank locally, so live notifications and auto-replies require your provider credentials. They have not been delivery-tested without those credentials.

## Content and editing

Change contact details, company positioning and pricing in `client/src/siteConfig.js`. Update the starter content in `client/src/content.js`; this also supplies API seed data and offline public-page previews. Seed inserts only missing seed records; use admin for updates to an existing database.

Admin supports service/project/article/testimonial/FAQ create, edit and delete; leads can be filtered, assigned a status or deleted, and all leads can be exported as CSV. Newsletter subscribers have a separate read-only list. List fields are edited one entry per line, articles one paragraph per line. Rich HTML is intentionally not accepted. Sessions last up to 8 hours; logout revokes existing tokens for that admin.

Public content comes from MongoDB when available. Static fallback data lets you preview the design without a connected API; **forms never pretend to succeed without the API**. Server errors appear inline and entered form data is preserved. The blog listing queries MongoDB with search, category and pagination. The contact and quote forms use the same three-step flow and store different enquiry types.

Build-time prerendering supplies crawler-readable HTML for starter routes. To snapshot current MongoDB content and discover new service/project/article slugs, set **`CONTENT_API_URL`** to a reachable API base URL during `npm run build` (e.g. `http://127.0.0.1:5000/api`). This setting is build-only and can go in your build environment or `client/.env`. The build fetches all published records, renders them and embeds matching hydration data. If an explicitly configured content API fails, the build fails rather than silently replacing live content with examples. Without this setting, the seed content is used. Runtime admin updates appear after fetching the API; rebuild with `CONTENT_API_URL` to update static crawler snapshots and sitemap. Dynamic detail-page metadata also refreshes from the API in the browser.

## API contract

All JSON responses use `{ success, message, data }`. Invalid input returns 422; protected routes return 401 without a valid JWT. Form endpoints and login are rate-limited. Honeypot fields silently discard spam; strings are restricted to plain text and unknown fields are rejected. CSV exports escape formula-leading characters.

Public routes under `/api`:

- `GET /services`, `/services/:slug`, `/projects`, `/projects/:slug`
- `GET /blog?page=1&limit=6&category=SEO&search=local`, `/blog/:slug`
- `GET /testimonials`, `/faqs`, `/health`
- `POST /contact`, `/quote`, `/newsletter/subscribe`

Admin routes under `/api/admin`:

- `POST /login`, `POST /logout`, `GET /me`, `GET /stats`
- `GET /leads?status=new`, `PATCH /leads/:id`, `DELETE /leads/:id`, `GET /leads/export`
- `GET /subscribers`
- `GET/POST /:resource`, `PUT/DELETE /:resource/:id` for services, projects, blog, testimonials and faqs

## Deploy

### One server / VPS

Set production environment values, run `npm ci`, `npm run seed`, `npm run build`, then `npm start`. Express serves `client/dist` and `/api` together. Put a TLS reverse proxy in front, configure database backups and use a process manager. If deploying behind a proxy, configure Express `trust proxy` for that specific proxy topology before relying on per-IP rate limits; do not blindly trust arbitrary forwarded headers.

### Client on Vercel or Netlify

Use repository root as the project directory, build command `npm run build`, output/publish directory `client/dist`. Configure `VITE_API_URL`, `VITE_SITE_URL`, optional `VITE_WHATSAPP_NUMBER` **before building**. SPA fallback configuration is supplied. Public starter routes are also prerendered. The external API must be deployed separately.

### API on Render / Railway

Deploy the repository with build/install `npm ci` and start `npm start -w server`. Provide `MONGODB_URI`, `JWT_SECRET`, the public client origin in `CLIENT_URL`, and SMTP variables. Run `npm run seed -w server` once with admin seed credentials. Use the host-assigned `PORT`; bind is `0.0.0.0` by default. Connect MongoDB Atlas with the hosting platform’s network access configured. Keep all secrets in platform settings, not in Git.

## Before public launch

- Replace/verify the email, WhatsApp number, business identity/address and social URLs. Missing social links are omitted instead of linking to `#`.
- Replace concept projects, illustrative testimonials and role-based team placeholders with authorised real work, verified quotes and team details. No ratings, client counts or performance results are fabricated.
- Confirm actual pricing and scope. Package prices are explicitly indicative INR figures; ads, third-party platform fees and taxes are separate.
- Complete the privacy and terms drafts for the business’s jurisdiction, retention policy and actual service agreement.
- Configure SMTP, verify delivery, set the canonical domain and regenerate the production build.

No site has been publicly deployed and no messages have been sent to third parties. The project is ready for local use and deployment configuration. Measured desktop Lighthouse results are Performance 95, Accessibility 100, Best Practices 100 and SEO 100. See `VERIFICATION.md` for scope, evidence and limits; these are local desktop measurements, not a mobile or live-hosting guarantee.
