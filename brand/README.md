# OpenAstra brand kit

**Open Orbit (A1).** An "O" left open, with a star (*astra*) in the gap. The ring is a
boundary with a way through, which is what the Gates do. It is drawn on a 100u grid:

| Element | Spec |
|---|---|
| Ring | r 34u about (50, 50), stroke 10u, round caps, open from −10° to −80° |
| Star | concave 4-point, R 13u, centre (77, 23) |
| Small cut (≤ 48 px) | stroke 13u, star R 17u at (78, 22) |
| Clear space | ≥ 15u around the mark (the star's height) |

Every file in this folder is generated from that geometry by [`build.mjs`](build.mjs).

## Colour & type

| Token | Hex | Use |
|---|---|---|
| Paper | `#F6F3EC` | background |
| Ink | `#1B1B1B` | ring, wordmark, text |
| Rust | `#B4441F` | star, emphasis (on paper) |
| Rust light | `#E0724A` | star on dark backgrounds (keeps ≥ 4.5:1) |
| Muted | `#5E5B55` | secondary text |

Wordmark: **Newsreader** 400, "Open" roman + "*Astra*" italic. Mono details:
**JetBrains Mono**. Both are SIL OFL; copies and licences are in [`fonts/`](fonts).

## What's here

```
logo/svg       mark (colour, reversed, mono-ink, mono-white, small), lockup (+reversed, stacked), wordmark
logo/png       the same at 256–2000 px
social/        linkedin · github · x · facebook · instagram · _profile (generic 1080 avatars)
app-icons/     ios (AppIcon.appiconset: light/dark/tinted + legacy sizes) · android (adaptive + mipmaps + Play) · pwa
web/           favicon.svg (auto dark mode) · favicon.ico (16/32/48) · apple-touch-icon · og-image · site.webmanifest
motion/        intro + pulse GIFs (paper/ink) · intro MP4s (1:1 and 9:16 story) for social posts
```

### Social sizes

| Platform | Profile | Cover / banner | Posts |
|---|---|---|---|
| LinkedIn | `linkedin-profile-400` | `company-cover-1128x191`, `personal-cover-1584x396` | `post-1200x627` |
| GitHub | `github-avatar-500` | `readme-banner-1280x320` (+dark) | `social-preview-1280x640` (repo → Settings → Social preview) |
| X | `x-profile-400` | `x-header-1500x500` | `x-post-1600x900` |
| Facebook | `facebook-profile-720` | `facebook-cover-1640x624` | `facebook-post-1200x630` |
| Instagram | `instagram-profile-1080` | `highlight-cover-1080x1920` | `post-1080x1080` (+dark), `portrait-1080x1350`, `story-1080x1920` |

Covers keep text out of the areas where each platform overlays the profile photo: the
LinkedIn and X bottom-left, and Facebook's mobile side-crop (content is centred).
Profile pictures keep the mark inside 80 % of the circle crop.

## Motion

- **Intro** (3.2 s loop): the ring draws in, the star pops in with a quarter-turn, then it all retracts.
  Use it for video intros, posts and READMEs.
- **Pulse** (1.6 s loop): the star turns a quarter with a breath. Use it as a loading indicator.
- **On the site**: `src/components/Logo.jsx` draws in once on load and turns the star on hover.
  Both respect `prefers-reduced-motion`.

## Rebuild

Requires `hb-view` (harfbuzz), `rsvg-convert` (librsvg) and `ffmpeg`, e.g. `brew install harfbuzz librsvg ffmpeg`.

```sh
node brand/build.mjs                 # everything (also copies web icons into public/)
node brand/build.mjs social motion   # or just some steps: logos social apps web motion
```

## Don'ts

Don't close the ring, recolour the star outside the palette, add gradients or shadows,
rotate the mark, or set the wordmark in another typeface.
