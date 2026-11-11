#!/bin/sh
# Downloads the typefaces used by the logos (all SIL Open Font License) into tools/fonts.
set -e
cd "$(dirname "$0")"; mkdir -p fonts; cd fonts
base=https://raw.githubusercontent.com/google/fonts/main/ofl
curl -fsSL -o Schibsted.ttf "$base/schibstedgrotesk/SchibstedGrotesk%5Bwght%5D.ttf"
curl -fsSL -o InstrumentSans.ttf "$base/instrumentsans/InstrumentSans%5Bwdth,wght%5D.ttf"
curl -fsSL -o Newsreader.ttf "$base/newsreader/Newsreader%5Bopsz,wght%5D.ttf"
curl -fsSL -o Figtree.ttf "$base/figtree/Figtree%5Bwght%5D.ttf"
echo "Fonts ready in $(pwd)"
