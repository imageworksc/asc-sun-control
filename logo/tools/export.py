import glob, os, subprocess, sys
L, chrome = sys.argv[1], sys.argv[2]; only = sys.argv[3:]
tmp = os.path.abspath('out/x'); os.makedirs(tmp, exist_ok=True)
for f in sorted(glob.glob(f'{L}/*/svg/*.svg')):
    if only and not any(f'/{o}/' in f for o in only): continue
    base = os.path.basename(f)[:-4]; root = os.path.dirname(os.path.dirname(f))
    head = open(f).read(400)
    w = float(head.split(' width="')[1].split('"')[0]); h = float(head.split(' height="')[1].split('"')[0])
    os.makedirs(f'{root}/png', exist_ok=True); os.makedirs(f'{root}/pdf', exist_ok=True)
    k = 2400 / w if w > h else 1600 / h
    W, H = round(w * k), round(h * k)
    page = f'{tmp}/{base}.html'
    open(page, 'w').write(f'<!doctype html><style>@page{{size:{w}px {h}px;margin:0}}html,body{{margin:0;background:transparent}}img{{display:block;width:100vw;height:100vh}}@media print{{img{{width:{w}px;height:{h}px}}}}</style><img src="file://{os.path.abspath(f)}">')
    common = [chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files']
    subprocess.run(common + [f'--window-size={W},{H}', '--default-background-color=00000000', f'--screenshot={root}/png/{base}.png', f'file://{page}'], capture_output=True)
    subprocess.run(common + ['--no-pdf-header-footer', f'--print-to-pdf={root}/pdf/{base}.pdf', f'file://{page}'], capture_output=True)
    print(base, W, H)
