# Website Improvement Plan

Branch: `redesign-improvements-audit`

## Goals

- Refresh the portfolio visual system with a cleaner, more modern palette and tighter surfaces.
- Fix high-impact accessibility and semantic markup issues.
- Reduce avoidable client weight and make the gallery path friendlier to future thumbnails/private assets.
- Improve contact/gallery backend validation and failure handling.
- Keep generated deploy artifacts out of version control.
- Verify with lint, production build, and a final self-review before deployment.

## Priority Fixes

1. Private gallery correctness
   - Do not bundle locked gallery screenshots into public production JavaScript.
   - Keep private media behind a real authenticated delivery path before re-enabling a locked screenshot gallery.

2. Media performance
   - Add lazy/async image behavior where possible.
   - Support `thumbnailSrc` in the gallery so future optimized thumbnail assets can be used without changing component code.
   - Compress large source images where safe.

3. Accessibility and semantics
   - Replace nested anchor/button CTA markup with valid anchors styled as buttons.
   - Replace clickable `div` controls with real buttons.
   - Add state labels for mobile navigation.

4. Serverless form safety
   - Guard JSON parsing.
   - Validate required fields, email shape, and field lengths on the Lambda side.
   - Avoid leaking raw backend errors to visitors.
   - Use configurable frontend API URLs.

5. Frontend organization
   - Centralize colors and surface tokens.
   - Remove stale implementation comments and unused prop plumbing.
   - Reduce direct DOM querying where reasonably scoped.

## Verification Checklist

- Completed: `npx eslint .`
- Completed: `npm run build`
- Completed: `npm audit`
- Completed: `npm audit --prefix lambda --omit=dev`
- Completed: local static build smoke test
- Completed: manual review of changed files
- Completed: deploy with `./deploy.sh`

## Frontend Cohesion Pass

Completed on branch `redesign-improvements-audit`:

- Replaced the primary teal/cyan accent system with a dark-green palette.
- Added shared action, chip, feedback, overlay, focus, radius, and shadow tokens in `src/App.css`.
- Normalized button, pill, tag, modal, and overlay colors around those tokens.
- Updated hard-coded themed SVG fills and the PWA manifest to match the green palette.
- Removed interactive hover treatment from static tags/chips.
- Replaced the expanded-card close image with a real button.
- Cleaned up duplicate accessible names from hover-swap social icons.
- Added modal semantics, Escape behavior, focus trapping, and focus restoration to the video overlay and fullscreen gallery.
- Prevented hidden mobile nav/gallery controls from staying keyboard-focusable.
- Added a shared inline `IconGlyph` system for action/button icons so SVG paths inherit `currentColor`.
- Removed the old mask-based button icon path that could turn icons into solid white blocks.
- Kept social/project hover logos as explicit image assets so their two-tone SVG artwork is preserved.

## Performance Plan

Implemented in this pass:

- Defer `tsparticles` engine loading until idle time and lazy-load the React particles module.
- Reduce particle count, FPS, interactivity, retina work, and link rendering on small screens.
- Honor `prefers-reduced-motion` globally and skip particles for reduced-motion users.
- Replace card descendant `ResizeObserver` subscriptions with a single content observer throttled through `requestAnimationFrame`.
- Throttle active-section scroll work through `requestAnimationFrame`, cache header height, and narrow lazy-section mutation observation to the `main` element.
- Use passive scroll listeners for header work.

Next performance work:

- Generate real gallery thumbnails and WebP/AVIF responsive variants for large project images.
- Render heavy gallery modules only when a gallery is opened or near viewport.
- Split the broad SVG icon map so home/header do not import the full tech-stack icon set.
- Add Playwright visual/performance smoke checks for desktop and mobile once the repo includes a browser test harness.

## Deployment Result

- Live URL checked: `https://brianjames.dev`
- HTTP status: `200`
- Live bundle confirmed: `/assets/index-BpUGv_Iu.js`
- Live CSS confirmed: `/assets/index-BLc10jUn.css`
- CloudFront invalidation created by deploy script: `IF0SUYCMCUY95ZL0DBX81P3D4F`

Latest icon-system pass:

- Completed: `npx eslint .`
- Completed: `npm run build`
- Completed: source scan for old button SVG mask/image usage.
- Attempted: `./deploy.sh`
- Result: build completed, but the S3 sync failed because this session could not connect to `https://s3.us-west-1.amazonaws.com/...`.

## Deferred Hardening

- Add persistent rate limiting for public Lambda endpoints through API Gateway/WAF or a durable store.
- Move private gallery images to authenticated storage with short-lived signed URLs.
- Add visual regression checks for desktop/mobile once Playwright is added to the project.
