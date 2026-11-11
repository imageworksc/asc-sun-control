"""Builds the ASC logo options as SVG: logo, symbol and spacing drawing, light and dark.

Grid: u = H / 6, the height of the text block. The symbol is 7u, centred on the text.
Title case: capitals 2.5u, 1u from a baseline to the next capitals; the S hangs 1.5 left of the A.
Lower case: ascenders 2.75u, 0.5u between lines.
Symbol to text: 1.25u from a straight edge, 1u from a round one. Clear space: 2u.

Usage: python build.py OUT [option names...]
  python build.py ..                  every option, into the logo folder
  python build.py .. option-1-glass   one option
"""
import os
import sys
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from pathops import Path, op, PathOp
from lib import load, outline, cap_height, sun as current_sun

OUT = sys.argv[1]
ONLY = sys.argv[2:]
ORANGE, INK, WHITE, TINT = '#E8540A', '#1E2129', '#FFFFFF', '#F9B48C'
K = .5522847
H = 200.0
U = H / 6
EXT = U / 2      # the symbol extends 0.5u above and below the text block
ROUND = 1.5      # the S hangs slightly left of the A so both lines look flush


# Shapes, drawn with real boolean operations so the files have no masks

def circle(cx, cy, r):
    p = Path(); n = p.getPen(); k = K * r
    n.moveTo((cx + r, cy))
    n.curveTo((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))
    n.curveTo((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))
    n.curveTo((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))
    n.curveTo((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))
    n.closePath()
    return p


def rect(x, y, w, h, r=0):
    p = Path(); n = p.getPen(); k = (1 - K) * r
    n.moveTo((x + r, y)); n.lineTo((x + w - r, y))
    if r: n.curveTo((x + w - k, y), (x + w, y + k), (x + w, y + r))
    n.lineTo((x + w, y + h - r))
    if r: n.curveTo((x + w, y + h - k), (x + w - k, y + h), (x + w - r, y + h))
    n.lineTo((x + r, y + h))
    if r: n.curveTo((x + k, y + h), (x, y + h - k), (x, y + h - r))
    n.lineTo((x, y + r))
    if r: n.curveTo((x, y + k), (x + k, y), (x + r, y))
    n.closePath()
    return p


def both(a, b, how):
    return op(a, b, how)


def d_of(path, s=1.0, dx=0.0, dy=0.0):
    pen = SVGPathPen(None, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    path.draw(TransformPen(pen, (s, 0, 0, s, dx, dy)))
    return pen.getCommands()


# Symbols on a 100-high box. Each returns (width, [(colour key, path)], ink height)

def glass():
    """A pane of glass with the sun centred on its right edge: solid outside, in bands of film inside."""
    pw, r = 73.0, 37.0
    g = 3.2; pane = rect(0, 0, pw, 100, 4); sun = circle(pw, 50, r)
    strips = Path(); x = pw - g
    for w in (9, 7.5, 5, 3.4):     # the bands narrow as the light is filtered
        strips = both(strips, rect(x - w, 0, w, 100), PathOp.UNION)
        x -= w + g
    return pw + r, [('sun', sun), ('pane', pane), ('tint', both(sun, strips, PathOp.INTERSECTION))], 100.0


def window():
    """The sun seen through a four-pane window. The mullions match the stroke of the type."""
    g, r = 6, 4; p = (100 - g) / 2
    panes = Path()
    for x in (0, p + g):
        for y in (0, p + g):
            panes = both(panes, rect(x, y, p, p, r), PathOp.UNION)
    sun = circle(50, 50, 38)
    return 100, [('pane', panes), ('sun', both(panes, sun, PathOp.INTERSECTION))], 100.0


def horizon():
    """The sun over the Atlantic, in bands that thin out towards the bottom."""
    sun = circle(50, 50, 50)
    bars = rect(0, 0, 100, 49)
    for y, t in ((54, 10), (69, 8), (82, 6), (93, 3.5)):
        bars = both(bars, rect(0, y, 100, t), PathOp.UNION)
    return 100, [('sun', both(sun, bars, PathOp.INTERSECTION))], 96.5


# Colours per theme. Option 1 is soft orange glass on light and white glass on dark.
FLAT = {'light': {'pane': INK, 'tint': TINT, 'sun': ORANGE}, 'dark': {'pane': WHITE, 'tint': TINT, 'sun': ORANGE}}
GLASS = {'light': {'pane': '#FAD0B8', 'tint': '#F2803F', 'sun': ORANGE}, 'dark': FLAT['dark']}


def flat_mark(shape, colours=FLAT, over=0.0):
    """A solid-colour symbol, 7u high; a round top rises a little further (over)."""
    def mark(theme):
        w, shapes, ink = shape(); s = (H + 2 * EXT + over) / ink
        if theme == 'size':
            return w * s, over
        return '', ''.join(f'<path fill="{colours[theme][k]}" d="{d_of(p, s, 0, -over - EXT)}"/>' for k, p in shapes)
    return mark


def flat_symbol(shape, colours=FLAT):
    def symbol(theme):
        w, shapes, ink = shape(); s = H / ink
        return w * s, '', ''.join(f'<path fill="{colours[theme][k]}" d="{d_of(p, s)}"/>' for k, p in shapes)
    return symbol


def sun_mark(prefix):
    """The current half sun, unchanged, 7u high."""
    def mark(theme):
        MH = 7 * U
        if theme == 'size':
            return MH / 2, 0.0
        return current_sun(MH / 2, -EXT, MH, prefix)
    return mark


def sun_symbol(theme):
    d, b = current_sun(H / 2, 0, H, 'a')
    return H / 2, f'<defs>{d}</defs>', b


# Type: hand kerning in 1/1000 em
KERN = {
    'Schibsted.ttf': {'ro': -22, 'Co': -16},
    'InstrumentSans.ttf': {'ro': -16, 'Co': -14},
    'Newsreader.ttf': {'ro': -14, 'Co': -18, 'tl': -10, 'ti': -10, 'At': -10},
    'Figtree.ttf': {'ro': -12},
}
SCH = ('Schibsted.ttf', {'wght': 600})
INS = ('InstrumentSans.ttf', {'wght': 600, 'wdth': 100})
NEWS = ('Newsreader.ttf', {'wght': 500, 'opsz': 72})
FIG = ('Figtree.ttf', {'wght': 600})
LABEL = load('Schibsted.ttf', {'wght': 500})


def lockup(name, num, short, mark, symbol, font, case, gap):
    fp = load(*font); kern = KERN[font[0]]
    if case == 'lower':
        t1, t2, a = 'atlantic', 'sun control', 2.75 * U
        size = 100 * a / -outline(t1, fp, 100, pairs=kern)[1][1]
        shift, steps = 0, ('2.75u', '0.5u', '2.75u')
    else:
        t1, t2, a = 'Atlantic', 'Sun Control', (H - U) / 2
        size = 100 * a / cap_height(fp, 100)
        shift, steps = ROUND, ('2.5u', '1u', '2.5u')
    p1, q1 = outline(t1, fp, size, pairs=kern)
    p2, q2 = outline(t2, fp, size, pairs=kern)
    mw, over = mark('size')
    tx = mw + gap * U
    x1, x2 = tx - q1[0], tx - q2[0] - shift
    width = max(x1 + q1[2], x2 + q2[2])
    top = max(-q1[1] - a, over + EXT)          # ascenders or the symbol, whichever is higher
    bottom = max(q1[3], q2[3], EXT)            # round letters dip below the baseline
    height = H + top + bottom
    os.makedirs(f'{OUT}/{name}/svg', exist_ok=True)
    os.makedirs(f'{OUT}/construction', exist_ok=True)
    for theme, col in (('light', INK), ('dark', WHITE)):
        defs, body = mark(theme)
        dtag = f'<defs>{defs}</defs>' if defs else ''
        words = (f'<g fill="{col}"><path transform="translate({x1:.2f} {a:.2f})" d="{p1}"/>'
                 f'<path transform="translate({x2:.2f} {H:.2f})" d="{p2}"/></g>')
        open(f'{OUT}/{name}/svg/asc-logo-option-{num}-{short}-{theme}.svg', 'w').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.2f}" height="{height:.2f}" viewBox="0 {-top:.2f} {width:.2f} {height:.2f}" role="img" aria-label="Atlantic Sun Control">{dtag}{body}{words}</svg>')
        sw, sdefs, sbody = symbol(theme)
        open(f'{OUT}/{name}/svg/asc-symbol-option-{num}-{short}-{theme}.svg', 'w').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{sw:.2f}" height="{H:.0f}" viewBox="0 0 {sw:.2f} {H:.0f}" role="img" aria-label="Atlantic Sun Control symbol">{sdefs}{sbody}</svg>')
        # Spacing drawing: the grid, the gaps and the clear space, on one shared canvas width
        guide = '#2F80ED' if theme == 'light' else '#6FB1FF'
        Z = 2 * U; ax, ay, aw, ah = -Z, -top - Z, width + 2 * Z, height + 2 * Z
        lines = ''.join(f'<path d="M{-Z:.1f} {y:.2f}H{width + Z:.1f}"/>' for y in (0, a, H - a, H))
        lines += ''.join(f'<path d="M{x:.2f} {ay:.1f}V{ay + ah:.1f}"/>' for x in (mw, tx))
        tg = lambda t, x, y: f'<path fill="{guide}" transform="translate({x:.1f} {y:.1f})" d="{outline(t, LABEL, 22)[0]}"/>'
        tags = (tg(steps[0], width + Z + 12, a / 2 + 8) + tg(steps[1], width + Z + 12, H / 2 + 8) + tg(steps[2], width + Z + 12, H - a / 2 + 8)
                + tg(f'{gap:g}u', mw - 6, ay + ah + 30) + tg('2u clear space', ax, ay - 12))
        open(f'{OUT}/construction/construction-option-{num}-{short}-{theme}.svg', 'w').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="1190.0" height="{ah + 90:.1f}" viewBox="{ax - 2:.1f} {ay - 44:.1f} 1190.0 {ah + 90:.1f}" role="img" aria-label="Spacing of option {num}">{dtag}'
            f'{body}{words}<g fill="none" stroke="{guide}" stroke-width="1.5" opacity=".75">{lines}</g>'
            f'<rect x="{ax:.1f}" y="{ay:.1f}" width="{aw:.1f}" height="{ah:.1f}" fill="none" stroke="{guide}" stroke-width="2" stroke-dasharray="10 8"/>{tags}</svg>')
    print(f'{name}: {width:.0f} x {height:.0f}, type size {size:.1f} (use the width in logo.css)')


horizon_mark = flat_mark(horizon, over=4.0)
JOBS = {
    'option-1-glass': lambda: lockup('option-1-glass', '1', 'glass', flat_mark(glass, GLASS), flat_symbol(glass, GLASS), SCH, 'title', 1.0),
    'option-2-window': lambda: lockup('option-2-window', '2', 'window', flat_mark(window), flat_symbol(window), INS, 'title', 1.25),
    'option-3-horizon': lambda: lockup('option-3-horizon', '3', 'horizon', horizon_mark, flat_symbol(horizon), NEWS, 'title', 1.0),
    'option-3b-horizon-lower': lambda: lockup('option-3b-horizon-lower', '3b', 'horizon-lower', horizon_mark, flat_symbol(horizon), FIG, 'lower', 1.0),
    'option-4-current-sun': lambda: lockup('option-4-current-sun', '4', 'current-sun', sun_mark('a'), sun_symbol, FIG, 'lower', 1.25),
    'option-4b-current-sun-serif': lambda: lockup('option-4b-current-sun-serif', '4b', 'current-sun-serif', sun_mark('a'), sun_symbol, NEWS, 'title', 1.25),
}
for job in (ONLY or JOBS):
    JOBS[job]()
