"""Outlines text to SVG paths and draws the ASC half-sun, for logo exploration and export."""
import os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = {}


def load(name, axes=None):
    """Returns (TTFont, hb.Font) for a static instance of a font file."""
    key = (name, tuple(sorted((axes or {}).items())))
    if key in CACHE:
        return CACHE[key]
    path = os.path.join(HERE, 'fonts', name)
    font = TTFont(path)
    if 'fvar' in font:
        pins = {a.axisTag: a.defaultValue for a in font['fvar'].axes}
        pins.update(axes or {})
        font = instancer.instantiateVariableFont(font, pins, inplace=False)
        path = os.path.join(HERE, 'fonts', 'inst-' + name.replace('.ttf', '') + '-' +
                            '-'.join(f'{k}{v}' for k, v in sorted(pins.items())) + '.ttf')
        font.save(path)
        font = TTFont(path)
    blob = hb.Blob.from_file_path(path)
    pair = (font, hb.Font(hb.Face(blob)))
    CACHE[key] = pair
    return pair


def outline(text, fontpair, size, tracking=0.0, features=None, space=1.0, pairs=None):
    """Shapes text (with kerning) and returns (path_d, ink_bounds) at the origin baseline."""
    font, hbfont = fontpair
    upem = font['head'].unitsPerEm
    scale = size / upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, features or {'kern': True, 'liga': False})
    gs = font.getGlyphSet()
    order = font.getGlyphOrder()
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    bpen = BoundsPen(gs)
    x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        g = gs[order[info.codepoint]]
        t = (scale, 0, 0, -scale, x + pos.x_offset * scale, -pos.y_offset * scale)
        g.draw(TransformPen(pen, t))
        g.draw(TransformPen(bpen, t))
        wide = space if order[info.codepoint] == 'space' else 1.0
        x += pos.x_advance * scale * wide + tracking * size
        x += (pairs or {}).get(text[info.cluster:info.cluster + 2], 0) * size / 1000  # hand kerning, 1/1000 em
    return pen.getCommands(), bpen.bounds


def cap_height(fontpair, size):
    font = fontpair[0]
    gs = font.getGlyphSet()
    b = BoundsPen(gs)
    gs[font.getBestCmap()[ord('H')]].draw(b)
    return b.bounds[3] / font['head'].unitsPerEm * size


# Half-sun, drawn from the current logo: unit radius 410, flat edge at x=0, centre on the origin
R, CX, CY, RI = 410, 24, -20, 378.7
SUN_DEFS = '''<linearGradient id="{p}rim" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#F05523"/><stop offset=".5" stop-color="#C24024"/><stop offset="1" stop-color="#9E2D22"/>
</linearGradient>
<linearGradient id="{p}face" x1="1" y1="0" x2=".15" y2="1">
<stop offset="0" stop-color="#F9A77F"/><stop offset=".5" stop-color="#F15825"/><stop offset="1" stop-color="#C94324"/>
</linearGradient>
<linearGradient id="{p}cap" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#F26A34"/><stop offset="1" stop-color="#F47C48"/>
</linearGradient>'''


def inner_edge():
    import math
    half = math.sqrt(RI ** 2 - CX ** 2)
    return CY - half, CY + half  # y where the inner circle meets the flat edge


def sun(x, y, height, prefix='s'):
    """Returns (defs, body) with the sun's flat edge at x and top at y. Width is height / 2."""
    k = height / (2 * R)
    top, bottom = inner_edge()
    body = (
        f'<g transform="translate({x:.2f} {y + height / 2:.2f}) scale({k:.5f})">'
        f'<path fill="url(#{prefix}rim)" d="M0 {-R}A{R} {R} 0 0 0 0 {R}Z"/>'
        f'<path fill="url(#{prefix}face)" d="M0 {top:.2f}A{RI} {RI} 0 1 0 0 {bottom:.2f}Z"/>'
        f'<path fill="url(#{prefix}cap)" d="M-243 -330A{R} {R} 0 0 1 0 {-R}V-262Z"/>'
        '</g>'
    )
    return SUN_DEFS.format(p=prefix), body
