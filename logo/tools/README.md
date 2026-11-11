# Logo tools

Scripts that draw every logo option in this folder. Text is outlined from the fonts, and the symbols are drawn as real shapes, so the SVG files need no fonts and have no masks.

| File | What it does |
|---|---|
| `build.py` | Draws the logo, symbol and spacing drawing of each option, light and dark, as SVG |
| `export.py` | Makes the PNG (transparent) and PDF of every SVG, using Chrome |
| `lib.py` | Outlines text with kerning and draws the current ASC half sun |
| `fonts.sh` | Downloads the four typefaces (SIL Open Font License) |

## Setup

```sh
cd logo/tools
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
./fonts.sh
```

## Use

```sh
.venv/bin/python build.py ..                       # every option
.venv/bin/python build.py .. option-1-glass        # one option
.venv/bin/python export.py .. "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" option-1-glass
```

`build.py` prints the width of each logo. When a width changes, update the matching `.w-*` class in `assets/logo.css`, and raise the `?v=` number in `index.html` so browsers load the new files.

## The rules in the code

- One unit (u) is one sixth of the text block. The symbol is 7u, centred on the text.
- Title case: capitals 2.5u, with 1u from a baseline to the next capitals.
- Lower case: ascenders 2.75u, with 0.5u between lines.
- Symbol to text: 1.25u from a straight edge, 1u from a round one.
- Clear space: 2u on every side.
- Hand kerning is in `KERN`, in 1/1000 em.

Running `build.py ..` with the files as they are reproduces the published SVG files exactly.
