"""Animated Option 2 (Window): each pane is one service, and together they make the sun.

The four panes appear, then each quarter of the sun lights up with its service name
(Solar, Security, Graphics, Shades). The names leave, the symbol moves into place and
the name of the company comes in. It loops every 9 seconds.

The output is a self-contained SVG with CSS animation, so it works as a plain <img>.
With reduced motion on, it shows the finished logo without moving.

Usage: python animate.py OUT     writes OUT/option-2-window/animation/*.svg
"""
import os
import sys
from pathops import Path, PathOp
from build import (H, U, EXT, INK, WHITE, ORANGE, INS, KERN, ROUND, rect, circle, both, d_of,
                   lettering, load, outline)

SERVICES = ('Solar', 'Security', 'Graphics', 'Shades')   # top left, top right, bottom left, bottom right
LOOP = 9.0       # seconds
GAP = 1.25       # symbol to text, as in the static logo


def pct(t):
    return f'{t / LOOP * 100:.2f}%'


def build(out):
    # Symbol: the same geometry as build.window(), split into its four panes
    g, r = 6, 4; p = (100 - g) / 2
    s = (H + 2 * EXT) / 100
    sun = circle(50, 50, 38)
    cells = [(x, y) for y in (0, p + g) for x in (0, p + g)]     # reading order
    mw = 100 * s

    p1, q1, p2, q2, a, shift, size, steps = lettering(INS, 'title')
    tx = mw + GAP * U
    x1, x2 = tx - q1[0], tx - q2[0] - shift
    width = max(x1 + q1[2], x2 + q2[2])
    top = max(-q1[1] - a, EXT); bottom = max(q1[3], q2[3], EXT); height = H + top + bottom
    centre = (width - mw) / 2            # where the symbol sits while the services show

    label_font = load('InstrumentSans.ttf', {'wght': 500, 'wdth': 100})
    label_size = 44
    cap = 0.7 * label_size

    # Timeline, in seconds
    pane_in = [(0.2 + i * 0.12, 0.65 + i * 0.12) for i in range(4)]
    quarter_in = [(1.0 + i * 0.6, 1.45 + i * 0.6) for i in range(4)]
    labels_out = (4.6, 5.1)
    move = (5.0, 5.8)
    words_in = (5.6, 6.3)
    fade_out = (8.4, 9.0)

    def svg(theme):
        ink = INK if theme == 'light' else WHITE
        css = [
            f'.pane{{fill:{ink};transform-box:fill-box;transform-origin:center}}',
            f'.sun{{fill:{ORANGE}}}',
            f'.ink{{fill:{ink}}}',
            '.label{opacity:0}',
            '.mark,.label,.words,.pane,.sun{animation-duration:9s;animation-iteration-count:infinite;animation-timing-function:ease-in-out}',
            f'.mark{{animation-name:move}}',
            f'@keyframes move{{0%,{pct(move[0])}{{transform:translate({centre:.1f}px,0)}}{pct(move[1])},100%{{transform:translate(0,0)}}}}',
            f'.words{{animation-name:words}}',
            f'@keyframes words{{0%,{pct(words_in[0])}{{opacity:0;transform:translate(-24px,0)}}{pct(words_in[1])},{pct(fade_out[0])}{{opacity:1;transform:translate(0,0)}}100%{{opacity:0}}}}',
        ]
        body = []
        for i, ((x, y), name) in enumerate(zip(cells, SERVICES)):
            pane = rect(x, y, p, p, r)
            css.append(f'.pane-{i}{{animation-name:pane{i}}}')
            css.append(f'@keyframes pane{i}{{0%,{pct(pane_in[i][0])}{{opacity:0;transform:scale(.6)}}'
                       f'{pct(pane_in[i][1])},{pct(fade_out[0])}{{opacity:1;transform:scale(1)}}100%{{opacity:0;transform:scale(1)}}}}')
            css.append(f'.sun-{i}{{animation-name:sun{i}}}')
            css.append(f'@keyframes sun{i}{{0%,{pct(quarter_in[i][0])}{{opacity:0}}{pct(quarter_in[i][1])},{pct(fade_out[0])}{{opacity:1}}100%{{opacity:0}}}}')
            css.append(f'.label-{i}{{animation-name:label{i}}}')
            css.append(f'@keyframes label{i}{{0%,{pct(quarter_in[i][0])}{{opacity:0}}{pct(quarter_in[i][1])},{pct(labels_out[0])}{{opacity:1}}{pct(labels_out[1])},100%{{opacity:0}}}}')
            body.append(f'<path class="pane pane-{i}" d="{d_of(pane, s, 0, -EXT)}"/>')
            body.append(f'<path class="sun sun-{i}" d="{d_of(both(pane, sun, PathOp.INTERSECTION), s, 0, -EXT)}"/>')
            d, b = outline(name, label_font, label_size)
            cy = (y + p / 2) * s - EXT + cap / 2
            lx = -28 - b[2] if x == 0 else mw + 28 - b[0]          # left panes: name on the left
            body.append(f'<path class="ink label label-{i}" transform="translate({lx:.2f} {cy:.2f})" d="{d}"/>')
        css.append('@media (prefers-reduced-motion:reduce){.mark,.label,.words,.pane,.sun{animation:none}}')
        words = (f'<g class="ink words"><path transform="translate({x1:.2f} {a:.2f})" d="{p1}"/>'
                 f'<path transform="translate({x2:.2f} {H:.2f})" d="{p2}"/></g>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.2f}" height="{height:.2f}" viewBox="0 {-top:.2f} {width:.2f} {height:.2f}" '
                f'role="img" aria-label="Atlantic Sun Control. Four panes for Solar, Security, Graphics and Shades make up the sun.">'
                f'<style>{"".join(css)}</style><g class="mark">{"".join(body)}</g>{words}</svg>')

    folder = f'{out}/option-2-window/animation'
    os.makedirs(folder, exist_ok=True)
    for theme in ('light', 'dark'):
        open(f'{folder}/asc-logo-option-2-window-animated-{theme}.svg', 'w').write(svg(theme))
    print(f'animation: {width:.0f} x {height:.0f}, symbol centred at {centre:.0f} while the services show')


if __name__ == '__main__':
    build(sys.argv[1])
