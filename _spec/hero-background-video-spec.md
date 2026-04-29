# Hero Background Video Spec

## Context

The hero section is implemented in:

- `client/src/components/Landing/LandingBase.jsx`
- `client/src/components/Landing/landing.styles.scss`

The section currently uses a CSS radial/linear gradient background with a grain texture overlay and a lime gradient orb. The layout is a two-column grid: left column contains the headline, description, process flow, CTAs, and stats; right column contains the portrait frame with tilt/parallax, experience badge, and workflow panel.

All assets are hosted on Cloudinary and referenced from `client/src/constants/constants.js`.

Reference screenshots:

- `_suggestion/block-01-desktop.png`
- `_suggestion/ai-workflow-after-desktop.png`

---

## Goal

Add a dark, moody looping video behind the entire hero section. The video must sit at the lowest visual layer — beneath the grain, gradient orbs, and all content — and be covered by a dark gradient overlay that preserves text legibility and the existing brand atmosphere. The text layout, portrait column, animations, and all interactive elements must remain completely unchanged.

---

## Non-Goals

- Do not change the hero layout, grid, or column structure.
- Do not change any existing animations (tilt, parallax, rotating headline, Framer Motion stagger).
- Do not add audio to the video — it must remain silent.
- Do not add any video controls or UI chrome.
- Do not move images or assets from Cloudinary to local files.
- Do not change routing, Redux, TanStack Query, or service structure.
- Do not add new npm dependencies — use native HTML5 `<video>`.
- Do not implement custom React hooks; use the existing `useReducedMotion` already imported.

---

## Video Content Direction

The video should feel like a dark developer workspace at night — atmospheric and immersive, not distracting. The content layer (text and portrait) should always dominate visually. The video's purpose is to add depth and mood, not to communicate information.

**Appropriate content (any one of these works):**
- Dark room with multiple monitors, soft blue/white code glow, shallow depth of field
- Terminal output scrolling in a dimly lit workspace
- Bokeh city lights at night — dark, defocused, minimal color
- Abstract dark particle or smoke motion — no bright highlights
- Close macro shot of keyboard/trackpad with ambient screen glow

**What to avoid:**
- Bright or high-contrast footage that competes with the white headline text
- Fast cuts or rapid motion
- Footage with text, logos, or faces that could distract from the hero content
- Any audio track

**Technical requirements for the source video:**
- Duration: 8–20 seconds (loops seamlessly)
- Resolution: minimum 1280×720; ideal 1920×1080
- Format: export as both `.mp4` (H.264) and `.webm` (VP9) for broad browser support
- File size: target under 4 MB for MP4, under 3 MB for WebM after compression
- Frame rate: 24fps is sufficient; 30fps maximum
- The first frame must be visually usable as a poster (dark, readable)

**Hosting:** Upload both files to Cloudinary and export two constants:

```js
// client/src/constants/constants.js
export const heroVideoMp4 = "https://res.cloudinary.com/.../hero-bg.mp4";
export const heroVideoWebm = "https://res.cloudinary.com/.../hero-bg.webm";
```

---

## Visual Layer Stack

From bottom to top after this implementation:

| Layer | Element | z-index |
|---|---|---|
| 0 — Video | `<video>` — position absolute, inset 0 | −2 |
| 1 — Video overlay | `.hero-video-overlay` div — position absolute, inset 0 | −1 |
| 2 — Grain | `.hero-grain` — position absolute, inset 0 | 0 |
| 3 — Gradient orb | `.hero-gradient-orb--1` | 0 |
| 4 — Content grid | `.landing-grid` | 1 (existing) |

The video overlay (layer 1) is a dark gradient that:
- Makes the dark background even darker for text contrast
- Tints slightly toward the existing brand colors (very subtle lime at the top-right)
- Ensures the video content never overpowers the foreground

---

## Structural Changes

### JSX — `LandingBase.jsx`

Import the video constants:

```jsx
import { profileImage, heroVideoMp4, heroVideoWebm } from "../../constants/constants";
```

Add two elements directly inside `<section id="landing" ref={heroRef}>`, before the `.hero-grain` div:

```jsx
<section id="landing" ref={heroRef}>
  <video
    className="hero-bg-video"
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    poster={undefined}
    aria-hidden="true"
    tabIndex={-1}
    ref={videoRef}
  >
    <source src={heroVideoWebm} type="video/webm" />
    <source src={heroVideoMp4} type="video/mp4" />
  </video>

  <div className="hero-video-overlay" aria-hidden="true" />
  <div className="hero-grain" aria-hidden="true" />
  <div className="hero-gradient-orb hero-gradient-orb--1" aria-hidden="true" />

  <div className="landing-grid">
    {/* ...existing content unchanged */}
  </div>
</section>
```

Add a `videoRef` alongside the existing refs:

```jsx
const videoRef = useRef(null);
```

**Reduced motion handling — pause the video:**

After the existing `useEffect` cleanup patterns, add:

```jsx
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (shouldReduceMotion) {
    video.pause();
  } else {
    video.play().catch(() => {
      // Autoplay blocked by browser — video stays paused, fallback background visible
    });
  }
}, [shouldReduceMotion]);
```

This means:
- `prefers-reduced-motion: reduce` users receive a static first frame (the video is paused on mount).
- Normal users get the looping autoplay.
- If autoplay is blocked (e.g., a power-save policy), the `.hero-bg-video` element is invisible and the solid fallback `background` on `#landing` is shown.

---

## SCSS Changes — `landing.styles.scss`

### 1. Update `#landing` background to a solid fallback

Remove the current multi-layer gradient background. Replace with a solid off-black that acts as the fallback when the video hasn't loaded or is paused:

```scss
#landing {
  // existing properties stay...
  background: $bg-dark; // was: radial-gradient + linear-gradient
}
```

The visual richness previously provided by the gradient (the lime top-right hint) is now reproduced by:
- The lime gradient orb (`.hero-gradient-orb--1`) which remains unchanged
- The `hero-video-overlay` gradient which adds a subtle lime accent from the top-right
- The video itself for depth

### 2. Add `.hero-bg-video` styles

```scss
.hero-bg-video {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  pointer-events: none;
  user-select: none;
  will-change: transform; // promote to own compositor layer
}
```

### 3. Add `.hero-video-overlay` styles

The overlay sits directly on top of the video. It must be dark enough to:
- Bring the background luminance down to near the original solid gradient
- Not flatten the video so much that it becomes invisible (the video should be subtly perceptible)
- Preserve a hint of the existing lime glow at the top-right to maintain brand atmosphere

```scss
.hero-video-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 88% 8%,
      rgba(163, 230, 53, 0.07) 0%,
      transparent 38%
    ),
    linear-gradient(
      to bottom,
      rgba(9, 9, 11, 0.72) 0%,
      rgba(9, 9, 11, 0.58) 50%,
      rgba(9, 9, 11, 0.78) 100%
    );
}
```

**Overlay opacity calibration:**

The `linear-gradient` dark stop values (0.72 / 0.58 / 0.78) are the primary levers for how visible the video is:
- Higher values → darker → video almost invisible, more like original gradient
- Lower values → brighter → video more visible, risk of text contrast issues
- The spec calls for `0.72 / 0.58 / 0.78` as the starting point; adjust during implementation if the video is too dark or too light

### 4. Reduced motion — freeze video via CSS as a belt-and-suspenders approach

The JS `useEffect` pauses the video, but add a CSS rule to handle any edge cases where JS is slow:

```scss
@media (prefers-reduced-motion: reduce) {
  .hero-bg-video {
    animation: none !important;
    // Note: CSS cannot pause video playback; the JS useEffect handles that.
    // This rule is a placeholder for any CSS animation fallbacks on this element.
  }
}
```

### 5. Mobile — reduce preload and accept paused video

On mobile, the video will autoplay if the browser allows it (iOS Safari allows muted autoplay). No special CSS disabling is needed — native browser behavior handles low-power states. The `preload="metadata"` attribute ensures only the first frame and metadata are fetched until the user navigates to the page, keeping initial load weight low on mobile.

---

## Attribute Rationale

| Attribute | Reason |
|---|---|
| `autoPlay` | Start immediately on page load without user interaction |
| `muted` | Required for autoplay to work across all browsers |
| `loop` | Seamless repeat — no end-of-video pause |
| `playsInline` | Required on iOS Safari — prevents fullscreen takeover on mobile |
| `preload="metadata"` | Only loads the first frame and duration metadata initially; balances fast first-frame poster with not downloading the full video file before the user is on the page |
| `aria-hidden="true"` | Screen readers must not announce the decorative video |
| `tabIndex={-1}` | Prevents keyboard users from accidentally focusing the video element |
| No `controls` | Video has no audio and is purely decorative — no UI needed |
| No `poster` | The first video frame is the poster; setting an explicit poster URL requires an additional Cloudinary fetch and is unnecessary if the first frame is suitably dark |

---

## Accessibility Requirements

- `aria-hidden="true"` on the `<video>` element — decorative, must not be announced.
- `aria-hidden="true"` on `.hero-video-overlay` — decorative.
- No audio track in the source video files.
- `prefers-reduced-motion: reduce` users: video is paused via `useEffect` on mount, leaving a static dark first frame. All foreground content (text, CTAs, animations) is already gated by the existing `shouldReduceMotion` check.
- All existing focus order, heading structure, and landmark roles on the hero remain untouched.
- Text contrast: the overlay gradient must keep the hero headline (`#ffffff` on the overlay background) above WCAG AA 4.5:1. The overlay at `rgba(9,9,11,0.72)` gives an effective background luminance close to `#1a1a1a`, which yields approximately 11.5:1 contrast with white — well above AA.

---

## Performance Considerations

- Use `will-change: transform` on `.hero-bg-video` to promote the video to its own compositor layer, preventing repaint during decode.
- `object-fit: cover` with GPU compositing means the browser scales on the compositor thread — no layout thrash.
- The `.hero-video-overlay` div uses only `background` (no blur, no filter) — no compositor overhead beyond the video itself.
- `preload="metadata"` avoids downloading the full video file during the initial page load. The video begins downloading when the component mounts and autoplay fires.
- WebM (VP9) is listed first in `<source>` order — Chrome and Firefox will use it, which is typically 30–40% smaller than the H.264 MP4 at equivalent quality. Safari will fall through to the MP4 source.
- Do not use `backdrop-filter` or `filter: blur()` anywhere on or near the video — these are expensive on mobile GPUs.

---

## Files to Modify

```
client/src/components/Landing/LandingBase.jsx
client/src/components/Landing/landing.styles.scss
client/src/constants/constants.js
```

---

## Implementation Order

1. **Upload video to Cloudinary** — export both `.webm` and `.mp4`. Get the two CDN URLs.
2. **Update `constants.js`** — add `heroVideoMp4` and `heroVideoWebm` exports.
3. **Update `LandingBase.jsx`** — add `videoRef`, import video constants, add `<video>` + `.hero-video-overlay` elements before `.hero-grain`, add reduced-motion `useEffect`.
4. **Update `landing.styles.scss`** — change `#landing` background to `$bg-dark`, add `.hero-bg-video` rule, add `.hero-video-overlay` rule.
5. **Visual calibration pass** — view at desktop 1440px. Adjust the overlay dark stop values (`0.72 / 0.58 / 0.78`) if the video is too dominant or too invisible.
6. **Reduced motion check** — enable `prefers-reduced-motion` in browser devtools. Confirm the video pauses and the hero renders cleanly with a static dark frame.
7. **Mobile check** — view at 390px. Confirm video plays (or stays paused gracefully if the browser blocks autoplay) and text is readable.
8. **Run build and lint** — `cd client && npm run build && npm run lint`.
9. **Screenshot verification** — capture desktop and mobile after-state screenshots.

---

## Testing and Verification

### Automated

```bash
cd client && npm run build
cd client && npm run lint
cd client && npx vitest run
```

The existing `Landing` component tests do not assert the background — no test changes expected.

### Manual

At desktop 1440px:
- [ ] Video plays silently and loops seamlessly.
- [ ] Hero text (headline, description, process steps, CTAs, stats) is fully readable.
- [ ] The lime gradient orb is still subtly visible in the top-right quadrant.
- [ ] The portrait column (image frame, tilt, experience badge, workflow panel) is unchanged.
- [ ] The video is perceptible as a moving texture in the background — not completely blacked out.
- [ ] No video player UI (controls, progress bar) is visible.
- [ ] The video has no audio.

At mobile 390px:
- [ ] Video plays (or is gracefully paused) without layout shift.
- [ ] Text is readable over the overlay.
- [ ] No horizontal scroll caused by the video element.

Reduced motion (enable in devtools):
- [ ] Video is paused — a static dark frame is visible as the background.
- [ ] All foreground content renders statically (existing reduced-motion behavior preserved).

Autoplay blocked (disable autoplay in browser settings):
- [ ] Hero background falls back to `$bg-dark` solid color.
- [ ] No JS error or broken layout.

---

## Acceptance Criteria

- [ ] A dark, moody video loops silently behind the full hero viewport.
- [ ] The `<video>` element is at `z-index: -2` and fully covered by the `.hero-video-overlay`.
- [ ] The hero layout, grid, typography, CTAs, portrait, animations, and interactions are pixel-identical to the current state.
- [ ] Text contrast meets WCAG AA (white on the overlay background).
- [ ] `prefers-reduced-motion` users receive a static frame, not a looping video.
- [ ] No audio is present in either video source file.
- [ ] `aria-hidden="true"` is on the video element.
- [ ] `tabIndex={-1}` is on the video element.
- [ ] `playsInline`, `muted`, `loop`, `autoPlay`, `preload="metadata"` are all set.
- [ ] Both `.webm` and `.mp4` sources are provided, WebM listed first.
- [ ] `cd client && npm run build` succeeds.
- [ ] No new lint errors introduced in modified files.
