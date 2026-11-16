"""Animated logos: the symbol builds, then the name comes in. Loops every 7 seconds.

- Window (Option 2): the four panes appear, then each quarter of the sun lights up in turn.
  The panes stand for Solar, Security, Graphics and Shades.
- Horizon (Options 3 and 3B): the sun rises over the horizon, then the bands appear one by one.
- Current Sun (Option 4B): the half sun rises.

The symbol stays where it sits in the static logo, and no words other than the name appear.
Each file is a self-contained SVG with CSS animation, so it works as a plain <img>.
With reduced motion on, it shows the finished logo without moving.

Usage: python animate.py OUT [option names...]   writes OUT/<option>/animation/*.svg
"""
import os
import sys
from pathops import PathOp
from build import (H, U, EXT, INK, WHITE, ORANGE, INS, SCH, NEWS, FIG, rect, circle, both, d_of,
                   lettering, current_sun)

LOOP = 7.0
WORDS_IN = (3.2, 3.9)
FADE_OUT = (6.4, 7.0)


def pct(t):
    return f'{t / LOOP * 100:.2f}%'


def keyframes(name, start, end, hidden, shown):
    """Hidden until start, shown from end until the loop fades out."""
    return (f'@keyframes {name}{{0%,{pct(start)}{{{hidden}}}{pct(end)},{pct(FADE_OUT[0])}{{{shown}}}'
            f'100%{{opacity:0;{shown.replace("opacity:1", "")}}}}}')


def window_symbol(ink):
    g, r = 6, 4; p = (100 - g) / 2
    s = (H + 2 * EXT) / 100
    sun = circle(50, 50, 38)
    css, body = [], []
    for i, (x, y) in enumerate([(x, y) for y in (0, p + g) for x in (0, p + g)]):
        pane = rect(x, y, p, p, r)
        a, b = 0.2 + i * 0.12, 0.65 + i * 0.12
        css.append(f'.pane-{i}{{animation-name:pane{i}}}' + keyframes(f'pane{i}', a, b, 'opacity:0;transform:scale(.6)', 'opacity:1;transform:scale(1)'))
        a, b = 1.0 + i * 0.5, 1.45 + i * 0.5
        css.append(f'.sun-{i}{{animation-name:sun{i}}}' + keyframes(f'sun{i}', a, b, 'opacity:0', 'opacity:1'))
        body.append(f'<path class="part pane-{i}" fill="{ink}" d="{d_of(pane, s, 0, -EXT)}"/>')
        body.append(f'<path class="part sun-{i}" fill="{ORANGE}" d="{d_of(both(pane, sun, PathOp.INTERSECTION), s, 0, -EXT)}"/>')
    return 100 * s, 0.0, '', ''.join(css), ''.join(body)


def horizon_symbol(ink):
    over, ink_h = 4.0, 96.5
    s = (H + 2 * EXT + over) / ink_h; dy = -over - EXT
    sun = circle(50, 50, 50)
    cap = both(sun, rect(0, 0, 100, 49), PathOp.INTERSECTION)
    css = ['.rise{animation-name:rise}' + keyframes('rise', 0.3, 1.5, f'opacity:0;transform:translate(0,{49 * s:.1f}px)', 'opacity:1;transform:translate(0,0)')]
    clip = f'<clipPath id="above"><rect x="-1" y="{dy - 10:.1f}" width="{100 * s + 2:.1f}" height="{49 * s + 10:.1f}"/></clipPath>'
    body = [f'<g clip-path="url(#above)"><path class="part rise" fill="{ORANGE}" d="{d_of(cap, s, 0, dy)}"/></g>']
    for i, (y, t) in enumerate(((54, 10), (69, 8), (82, 6), (93, 3.5))):
        band = both(sun, rect(0, y, 100, t), PathOp.INTERSECTION)
        a, b = 1.5 + i * 0.3, 1.95 + i * 0.3
        css.append(f'.band-{i}{{animation-name:band{i}}}' + keyframes(f'band{i}', a, b, 'opacity:0;transform:scale(0,1)', 'opacity:1;transform:scale(1,1)'))
        body.append(f'<path class="part band-{i}" fill="{ORANGE}" d="{d_of(band, s, 0, dy)}"/>')
    return 100 * s, over, clip, ''.join(css), ''.join(body)


def sun_symbol(ink):
    MH = 7 * U
    defs, sun = current_sun(MH / 2, -EXT, MH, 'a')
    css = '.rise{animation-name:rise}' + keyframes('rise', 0.3, 1.8, f'opacity:0;transform:translate(0,{MH * .6:.1f}px)', 'opacity:1;transform:translate(0,0)')
    clip = f'{defs}<clipPath id="above"><rect x="-1" y="{-EXT - 10:.1f}" width="{MH / 2 + 2:.1f}" height="{MH + 10:.1f}"/></clipPath>'
    return MH / 2, 0.0, clip, css, f'<g clip-path="url(#above)"><g class="part rise">{sun}</g></g>'


OPTIONS = {   # folder: (file key, short name, symbol, typeface, case, symbol-to-text gap in u)
    'option-2-window': ('2', 'window', window_symbol, INS, 'title', 1.25),
    'option-3-horizon': ('3', 'horizon', horizon_symbol, NEWS, 'title', 1.0),
    'option-3b-horizon-title': ('3b', 'horizon-title', horizon_symbol, FIG, 'title', 1.0),
    'option-3b-horizon-grotesk': ('3b', 'horizon-grotesk', horizon_symbol, SCH, 'title', 1.0),
    'option-4b-current-sun-serif': ('4b', 'current-sun-serif', sun_symbol, NEWS, 'title', 1.25),
}


def build(out, name):
    num, short, symbol, font, case, gap = OPTIONS[name]
    p1, q1, p2, q2, a, shift, size, steps = lettering(font, case)
    folder = f'{out}/{name}/animation'
    os.makedirs(folder, exist_ok=True)
    for theme in ('light', 'dark'):
        ink = INK if theme == 'light' else WHITE
        mw, over, defs, css, body = symbol(ink)
        tx = mw + gap * U
        x1, x2 = tx - q1[0], tx - q2[0] - shift
        width = max(x1 + q1[2], x2 + q2[2])
        top = max(-q1[1] - a, over + EXT); bottom = max(q1[3], q2[3], EXT); height = H + top + bottom
        style = (f'.part,.words{{animation-duration:{LOOP:g}s;animation-iteration-count:infinite;animation-timing-function:ease-in-out;'
                 f'transform-box:fill-box;transform-origin:center}}'
                 f'.words{{fill:{ink};animation-name:words}}'
                 + keyframes('words', *WORDS_IN, 'opacity:0;transform:translate(-24px,0)', 'opacity:1;transform:translate(0,0)')
                 + css + '@media (prefers-reduced-motion:reduce){.part,.words{animation:none}}')
        words = (f'<g class="words"><path transform="translate({x1:.2f} {a:.2f})" d="{p1}"/>'
                 f'<path transform="translate({x2:.2f} {H:.2f})" d="{p2}"/></g>')
        open(f'{folder}/asc-logo-option-{num}-{short}-animated-{theme}.svg', 'w').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.2f}" height="{height:.2f}" viewBox="0 {-top:.2f} {width:.2f} {height:.2f}" '
            f'role="img" aria-label="Atlantic Sun Control"><style>{style}</style><defs>{defs}</defs>{body}{words}</svg>')
    print(f'{name}: animated, {width:.0f} x {height:.0f}')


if __name__ == '__main__':
    for job in (sys.argv[2:] or OPTIONS):
        build(sys.argv[1], job)
