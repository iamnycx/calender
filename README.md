# Interactive Calendar Component

A polished Next.js calendar demo with a two-mode experience:

- A non-zen calendar that keeps the classic paper-card feel.
- A zen calendar that emphasizes a larger, cleaner viewing surface.
- Sticky note editing with month, day, and range notes.
- Motion-driven transitions for month changes and card entry states.
- Theme-aware image art that adapts to light and dark mode.

## Live URL

https://calender-one-self.vercel.app/

## Design Choices

This project keeps the interface intentionally tactile and editorial rather than generic:

- Motion is restrained to opacity and blur for month changes so transitions feel smooth without distracting horizontal movement.
- Day cards use lightweight entrance motion to keep the grid readable while still feeling alive.
- The hero image and calendar card are split into distinct visual zones to support the paper-and-collage style of the UI.
- Light mode is the default theme so the experience opens in the most readable state by default.
- The zen calendar is spaced for a calmer reading flow, while the regular calendar keeps the compact dashboard layout.

## Notes

- Theme selection is handled with `next-themes`.
- Calendar and note state live in local Zustand stores.
- Motion is powered by `motion/react`.

## Run Locally

This project uses Bun.

1. Clone the repository and enter it:

```bash
git clone https://github.com/iamnycx/calender
cd calender
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Useful Commands

```bash
bun run build
bun run check
bun run lint
bun run typecheck
bun run format:check
```
