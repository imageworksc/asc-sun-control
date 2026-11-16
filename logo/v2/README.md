# ASC logo proposal, round 2

Live page: https://imageworksc.github.io/asc-sun-control/logo/v2/

Round 1 stays at https://imageworksc.github.io/asc-sun-control/logo/

| Option | What changed | Typeface |
|---|---|---|
| 2 · Window | Kept. The four panes stand for Solar, Security, Graphics and Shades | Instrument Sans 600 |
| 3 · Horizon | Kept | Newsreader 500 |
| 3C · Horizon, title case | Option 3B with a capital first letter on each word | Figtree 600 |
| 3D · Horizon, Option 1 type | Option 3B in the typeface of Option 1 | Schibsted Grotesk 600 |
| 4B · Current Sun, serif | Kept | Newsreader 500 |

## Animation

`option-2-window/animation/` has the animated Option 2, light and dark. Each pane lights up with its service until the sun is whole, then the name comes in. It loops every 9 seconds.

It is one SVG file with its own CSS animation, so it works as a normal image:

```html
<img src="asc-logo-option-2-window-animated-light.svg" alt="Atlantic Sun Control">
```

When a visitor has reduced motion turned on, it shows the finished logo without moving.

## Files

Each option folder has `svg/`, `pdf/` and `png/` (transparent), with the logo and the symbol in light and dark versions. `construction/` has the spacing drawings. The files are built by the scripts in `../tools`.

## Minimum sizes

| Option | Logo height | Symbol height |
|---|---|---|
| 2 · Window | 36 px | 24 px |
| 3 · Horizon | 48 px | 24 px |
| 3C · Horizon, title case | 28 px | 24 px |
| 3D · Horizon, Option 1 type | 28 px | 24 px |
| 4B · Current Sun, serif | 40 px | 16 px |
