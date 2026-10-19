# Esgrow Studio visual assets

All images used by the website are local. Runtime versions are optimised WebP, with 800px responsive variants for generated images. Original generated PNG files are preserved under `client/src/assets/generated/`. The built-in ImageGen tool was used; no API-key/CLI fallback was used.

## Supplied references used as assets

| Supplied file | Local asset | Used in |
| --- | --- | --- |
| `2be0d14d5febfe730d10aff091f6342d.jpg` | `client/public/images/growth-spiral.webp` | Process/framework, SEO service, journal graphics |
| `9d296c86bb8ea1772ef693e29811b3b8.jpg` | `client/public/images/emerald-fold.webp` | Results section, performance marketing, journal |
| `12a6682e14179fa4c7a94d371479310a.jpg` | `client/public/images/glass-ribbon.webp` | Services illustration and service detail pages |
| `634d6b20ecfaca8a928aaac51979b3bc.jpg` | `client/public/images/organic-glass.webp` | Studio story/about artwork |
| `960cd0a66c5a796b1058188d73726b12.jpg` | `client/public/images/sage-waves.webp` | Partnership panel, bento card, journal and design service |

The two blue/green gradient layout references, brand-guidelines cover and Wispr Flow graphic informed soft gradients, restrained typography and glass treatments. Their third-party text and logos are not displayed as Esgrow's work. The Zenith GIF informed the immersive landscape and inset ivory footer composition; it is not embedded as another brand's website.

## Original generated images and final prompt set

### `client/public/images/esgrow-glass-sprout.webp`

Original: `client/src/assets/generated/esgrow-glass-sprout.png`. Hero artwork; 1536 × 1024, approximately 120 KB WebP. Responsive variant: `esgrow-glass-sprout-800.webp`.

Prompt: Use case: stylized-concept. Asset type: premium website hero artwork for Esgrow Studio, an independent digital growth agency. Create an original high-end photorealistic 3D studio sculpture, landscape 1536x1024 composition. A single elegant continuous translucent frosted glass ribbon twists upward into a sculptural botanical sprout, with finely pleated edges and softly rounded emerald-to-lime glass leaves. A subtle path of three small ivory stone steps rises toward it, suggesting roots to results. Materials: luminous green optical glass, fine ribbing, satin pale stone, realistic caustics, refined tactile detail. Pale warm ivory/sage seamless studio background #e7edcf with subtle soft gradient and generous breathing space. The sculpture occupies the central-right 65% with no clipping; floor plane with soft grounded shadows. Sculptural, architectural, sophisticated art direction, not cartoon, no generic potted plant, no plastic. Gentle sunlight from upper left, airy atmosphere, calm optimism. Inspired by the supplied abstract ribbed green sculptural ribbon references in spirit, but create a new original composition. Absolutely no text, letters, logos, watermarks, UI panels, charts or people.

### `client/public/images/esgrow-meadow.webp`

Original: `client/src/assets/generated/esgrow-meadow.png`. Shared landscape CTA/footer; 1659 × 948, approximately 185 KB WebP. Responsive variant: `esgrow-meadow-800.webp`.

Prompt: Use case: photorealistic-natural. Asset type: immersive landscape background for the closing call-to-action and footer of a premium digital growth studio website. Generate an original wide cinematic landscape photograph, 1792x1024 composition: rolling fresh green meadow hills in gentle morning sunlight, fine natural grass with little white wildflowers in the foreground, an elegant narrow winding pale trail leading toward a single lush deciduous tree near the far right horizon, distant soft green hills. Airy very pale warm blue/ivory sky occupies the upper 60 percent of the image and is calm almost empty negative space for large dark-green website text. The hills occupy the bottom 40 percent, with graceful diagonals and a beautiful believable horizon, more sage than oversaturated green. Realistic editorial photography, natural grass texture, subtle atmospheric depth, sophisticated optimistic mood, premium countryside art direction. Camera slightly above the meadow so the scene feels expansive. Absolutely no people, runners, buildings, logos, text, interface elements or watermark. No dramatic mountains, no sunset, no overly fantasy CGI.

### `client/public/images/flora-living.webp`

Original: `client/src/assets/generated/flora-living.png`. Flora Living concept portfolio/case-study cover; 1536 × 1024. Responsive variant: `flora-living-800.webp`.

Prompt: Use case: photorealistic-natural. Asset type: original portfolio concept cover for an ecommerce brand named Flora Living. Create a premium editorial interior still life in a wide 1536x1024 composition. A beautiful mature olive tree in a rounded warm ivory ceramic planter stands on the right side of a sunlit minimalist room. A smaller sculptural deep green houseplant sits in a textured terracotta vessel to the left foreground, a pale travertine side table, folded linen, warm natural plaster walls, softly dappled late morning sunlight, refined architecture magazine photography, realistic tactile surfaces. Palette: pale sage, warm cream, olive green and natural earthy clay. Calm, curated lifestyle atmosphere. Compose the upper left wall with generous clean negative space so website title can be overlaid in code. Plants should feel lush and healthy, not tropical jungle. Restrained high-end styling, subtle fine grain. Absolutely no words, letters, logos, interface elements, people or watermark.

### `client/public/images/forma-studio.webp`

Original: `client/src/assets/generated/forma-studio.png`. Forma Studio concept portfolio/case-study cover; 1536 × 1024. Responsive variant: `forma-studio-800.webp`.

Prompt: Use case: photorealistic-natural. Asset type: original portfolio concept cover for a contemporary architecture studio. Wide 1536x1024 high-end architectural photograph of a quiet modern Mediterranean interior: tall sculptural archway to the right, warm ivory limewash plaster, a monolithic curved travertine wall, polished pale limestone floor, one carefully positioned dark olive sculptural chair near the right arch, hard warm sunlight drawing a geometric shadow across the floor. Through the arch, a glimpse of a courtyard with a small olive tree. Architectural Digest editorial quality, real stone texture, subtle film grain, sophisticated minimal composition with strong volumes and depth. Keep the upper left third as calm pale plaster wall negative space for a typography overlay in code. Warm cream, sand, muted taupe, touch of olive. No people, text, lettering, logos, interface elements or watermark. Restrained and beautiful, an original concept not a copy of an existing building.

### `client/public/images/daily-ritual.webp`

Original: `client/src/assets/generated/daily-ritual.png`. Daily Ritual concept portfolio/case-study cover; 1536 × 1024. Responsive variant: `daily-ritual-800.webp`.

Prompt: Use case: product-mockup. Asset type: original portfolio concept cover for a fictional contemporary wellness brand, Daily Ritual. Premium wide 1536x1024 studio still-life product photograph. Two elegantly proportioned translucent moss-green glass bottles with rounded shoulders and brushed pale-gold caps, a small ivory cylindrical supplement jar, minimalist blank cream labels with absolutely no writing. Arrange on a softly curved matte lavender plinth, one bottle standing and one angled gracefully against a second lavender architectural block. One small botanical leaf and an ivory sphere as restrained styling. Backdrop warm muted lilac, sophisticated directional studio lighting, beautiful glass reflections and soft long shadows. Composition objects predominantly in the right half, left third is clean muted lavender negative space for typography to be overlaid in code. Palette muted lavender, cream, moss green, soft gold, tactile luxury materials, high-end editorial beauty campaign. No text, letters, brand marks, people, interface elements or watermark.

## Implementation

- `client/src/visuals.css` contains the image treatments, glass panels, responsive cropping and landscape footer styling.
- `client/src/Art.jsx` renders portfolio images with live HTML brand typography.
- Artwork is illustrative, including the three concept portfolio brands. It does not represent commissioned client work or a real location.
- Descriptive content images have alt text and explicit dimensions. Decorative image layers use empty alt text. Below-the-fold images are lazy-loaded; the hero has high fetch priority and responsive source selection.
- Motion is transform-based, with gentle hero/landscape parallax and existing GSAP reveals; reduced-motion preferences disable it.
