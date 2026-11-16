# ASC logo proposal, round 2

Live page: https://imageworksc.github.io/asc-sun-control/logo/v2/

Round 1 stays at https://imageworksc.github.io/asc-sun-control/logo/

| Option | What changed | Typeface |
|---|---|---|
| 2 · Window | Kept. The four panes stand for Solar, Security, Graphics and Shades | Instrument Sans 600 |
| 3 · Horizon | Kept | Newsreader 500 |
| 3B · Upper case | Option 3B with a capital first letter on each word | Figtree 600 |
| 3B · Option 1 type | Option 3B in the typeface of Option 1 | Schibsted Grotesk 600 |
| 4B · Current Sun, serif | Kept | Newsreader 500 |

## Animation

Every option has an animated version in its `animation/` folder, light and dark. The symbol builds, then the name comes in, and it loops every 5.6 seconds. No other words appear.

- Option 2: the panes appear, then each quarter of the sun lights up in turn. The panes stand for Solar, Security, Graphics and Shades.
- Options 3 and 3B: the sun rises over the horizon, then the bands appear one by one.
- Option 4B: the half sun rises.

Each is one SVG file with its own CSS animation, so it works as a normal image:

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
| 3B · Upper case | 28 px | 24 px |
| 3B · Option 1 type | 28 px | 24 px |
| 4B · Current Sun, serif | 40 px | 16 px |
