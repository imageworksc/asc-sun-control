/* =========================================================================
   Atlantic Sun Control — Mega menu
   menu.js — builds the navbar links, the Products & Services dropdown and
   the mobile drawer from one list of categories
   ========================================================================= */

/* Pages on the live Atlantic Sun Control site */
const site = (path) => `https://www.atlanticsun.net${path}`;

const CATS = [
  {
    head: 'Safety & Security Films',
    href: site('/safety-security-films'),
    items: [
      ['Anti-Intrusion', '/safety-and-security-window-film'],
      ['Blast Mitigation', '/blast-mitigation-film'],
      ['Radio Frequency Shielding', '/radio-frequency-shielding-film'],
      ['Anti-Graffiti Films', '/anti-graffiti-film'],
      ['Casper Cloaking Film', '/casper-cloaking-film'],
    ],
  },
  {
    head: 'Sun Control',
    href: site('/solar-window-films'),
    items: [
      ['Anti-Glare Window Film', '/anti-glare-window-film'],
      ['Heat Control Window Films', '/heat-control-window-film'],
      ['UV Window Film', '/products/solar-window-films/uv-window-film'],
      ['Low-E Films', '/low-e-films'],
      ['Blinds & Shades', '/products/blinds-and-shades'],
    ],
  },
  {
    head: 'Decorative Films & Graphics',
    href: site('/decorative-frosted-films'),
    items: [
      ['Custom Window Films & Graphics', '/custom-window-film'],
      ['Signs, Graphics & Logos', '/signs-graphics-logos'],
      ['Wall Murals', '/wall-murals'],
      ['Frosted & Etch Look Films', '/frosted-window-films'],
    ],
  },
  {
    head: 'Privacy Films',
    href: site('/privacy-window-glass-films'),
    items: [
      ['Frosted / Etch Look Films', '/frosted-window-films'],
      ['Smart Films', '/electric-privacy-glass-films'],
      ['Blinds & Shades', '/products/blinds-and-shades'],
      ['One-Way Mirror Films', '/one-way-mirror-film'],
      ['Casper Cloaking Film', '/casper-cloaking-film'],
    ],
  },
  {
    head: 'Specialty Films',
    href: site('/solutions-overview'),
    items: [
      ['Casper Cloaking Film', '/casper-cloaking-film'],
      ['Smart Films', '/electric-privacy-glass-films'],
      ['Architectural Finishes', '/architectural-finishes'],
      ['Blackout Films', '/blackout-film'],
    ],
  },
].map((cat) => ({ ...cat, items: cat.items.map(([label, path]) => ({ label, href: site(path) })) }));

const TOP = [
  { label: 'About Us', href: site('/about-us') },
  { label: 'Products & Services', dropdown: true },
  { label: 'Who We Serve', href: '#serve' },
  { label: 'Resources', href: site('/resources') },
];

/* Creates an element with an optional class and text */
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

/* Placeholder links (#) don't jump to the top of the page */
const isPlaceholder = (link) => link.getAttribute('href') === '#';

const link = (className, text, href = '#') => {
  const a = el('a', className, text);
  a.href = href;
  return a;
};

/* ---------------------------------------------------------------------
   Desktop: top links + "Products & Services" panel — a row of categories
   under the bar, each with its own dropdown of products
   --------------------------------------------------------------------- */
const initDesktop = (bar) => {
  const nav = bar.querySelector('#ascNav');
  const panel = bar.querySelector('#ascPanel');
  let dropBtn = null;
  let open = false;

  TOP.forEach((item) => {
    const li = el('li');
    if (item.dropdown) {
      dropBtn = el('button', 'asc-navbtn');
      dropBtn.type = 'button';
      dropBtn.setAttribute('aria-expanded', 'false');
      dropBtn.setAttribute('aria-controls', panel.id);
      dropBtn.append(el('span', null, item.label), el('span', 'asc-caret'));
      li.append(dropBtn);
    } else {
      li.append(link('asc-navbtn', item.label, item.href));
    }
    nav.append(li);
  });

  const row = el('div', 'asc-panel__inner');
  const cats = el('ul', 'asc-dd-cats');
  row.append(cats);
  panel.append(row);

  const items = CATS.map((cat, i) => {
    const li = el('li', 'asc-dd-item');
    const head = el('button', 'asc-dd-cat', cat.head);
    head.type = 'button';
    head.setAttribute('aria-expanded', 'false');
    head.setAttribute('aria-controls', `asc-dd-${i}`);

    const drop = el('div', 'asc-dd-drop');
    drop.id = `asc-dd-${i}`;
    const list = el('ul', 'asc-dd-list');
    cat.items.forEach(({ label, href }) => {
      const item = el('li');
      item.append(link(null, label, href));
      list.append(item);
    });
    const foot = el('div', 'asc-dd-foot');
    foot.append(link('asc-btn-line', `View ${cat.head}`, cat.href));
    drop.append(list, foot);

    li.append(head, drop);
    cats.append(li);
    return li;
  });

  /* Opens one category's dropdown (or none with -1) */
  const showCat = (n) => {
    items.forEach((li, i) => {
      li.classList.toggle('is-open', i === n);
      li.querySelector('.asc-dd-cat').setAttribute('aria-expanded', i === n);
    });
  };

  items.forEach((li, i) => {
    li.addEventListener('mouseenter', () => showCat(i));
    li.addEventListener('mouseleave', () => showCat(-1));
    li.addEventListener('focusin', () => showCat(i));
    li.querySelector('.asc-dd-cat').addEventListener('click', () => showCat(li.classList.contains('is-open') ? -1 : i));
  });

  const setOpen = (on) => {
    open = on;
    dropBtn.setAttribute('aria-expanded', on);
    panel.classList.toggle('is-open', on);
    if (!on) showCat(-1);
  };

  dropBtn.addEventListener('click', () => setOpen(!open));
  if (window.matchMedia('(hover: hover)').matches) {
    dropBtn.addEventListener('mouseenter', () => setOpen(true));
    nav.addEventListener('mouseover', (e) => {
      const item = e.target.closest('.asc-navbtn');
      if (item && item !== dropBtn) setOpen(false);
    });
    bar.addEventListener('mouseleave', () => setOpen(false));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      dropBtn.focus();
    }
  });
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (isPlaceholder(a)) e.preventDefault();
    setOpen(false);
  });
};

/* ---------------------------------------------------------------------
   Mobile: burger + drawer with collapsible categories
   --------------------------------------------------------------------- */
const initMobile = (bar) => {
  const burger = bar.querySelector('#ascBurger');
  const drawer = bar.querySelector('#ascMnav');

  drawer.append(el('div', 'asc-mnav__group', 'Products & Services'));
  CATS.forEach((cat) => {
    const sec = el('div', 'asc-msec');
    const head = el('button', 'asc-mbtn');
    head.type = 'button';
    head.setAttribute('aria-expanded', 'false');
    head.append(el('span', null, cat.head), el('span', 'asc-caret'));
    const body = el('div', 'asc-mbody');
    body.hidden = true;
    const list = el('ul');
    cat.items.forEach(({ label, href }) => {
      const li = el('li');
      li.append(link(null, label, href));
      list.append(li);
    });
    const all = el('li');
    all.append(link('asc-mall', `View ${cat.head}`, cat.href));
    list.append(all);
    body.append(list);
    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', !expanded);
      body.hidden = expanded;
    });
    sec.append(head, body);
    drawer.append(sec);
  });

  TOP.filter((item) => !item.dropdown).forEach((item) => {
    const sec = el('div', 'asc-msec');
    sec.append(link('asc-mbtn', item.label, item.href));
    drawer.append(sec);
  });

  /* Reuse the bar's call-to-action and phone link */
  const actions = el('div', 'asc-mactions');
  const tel = bar.querySelector('.asc-actions .asc-tel').cloneNode(true);
  tel.querySelector('.asc-tel-num').className = '';
  tel.classList.add('asc-btn-line');
  actions.append(bar.querySelector('.asc-actions .asc-cta').cloneNode(true), tel);
  drawer.append(actions);

  const setOpen = (on) => {
    burger.setAttribute('aria-expanded', on);
    burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    drawer.hidden = !on;
  };

  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (isPlaceholder(a)) e.preventDefault();
    setOpen(false);
  });
};

const bar = document.getElementById('ascBar');
if (bar) {
  initDesktop(bar);
  initMobile(bar);
}
