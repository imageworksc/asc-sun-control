/* =========================================================================
   Atlantic Sun Control — Mega menu
   menu.js — builds the navbar links, the Products & Services dropdown and
   the mobile drawer from one list of categories
   ========================================================================= */

const CATS = [
  { head: 'Safety & Security Films', items: ['Anti-Intrusion', 'Blast Mitigation', 'Radio Frequency Shielding', 'Anti-Graffiti Films', 'Casper Cloaking Film'] },
  { head: 'Sun Control', items: ['Anti-Glare Window Film', 'Heat Control Window Films', 'UV Window Film', 'Low-E Films', 'Blinds & Shades'] },
  { head: 'Decorative Films & Graphics', items: ['Custom Window Films & Graphics', 'Signs, Graphics & Logos', 'Wall Murals', 'Frosted & Etch Look Films'] },
  { head: 'Privacy Films', items: ['Frosted / Etch Look Films', 'Smart Films', 'Blinds & Shades', 'One-Way Mirror Films', 'Casper Cloaking Film'] },
  { head: 'Specialty Films', items: ['Casper Cloaking Film', 'Smart Films', 'Architectural Finishes', 'Blackout Films'] },
];

const TOP = [
  { label: 'About Us', href: '#' },
  { label: 'Products & Services', dropdown: true },
  { label: 'Who We Serve', href: '#serve' },
  { label: 'Resources', href: '#faq' },
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
    cat.items.forEach((label) => {
      const item = el('li');
      item.append(link(null, label));
      list.append(item);
    });
    const foot = el('div', 'asc-dd-foot');
    foot.append(link('asc-btn-line', `View ${cat.head}`));
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
    cat.items.forEach((label) => {
      const li = el('li');
      li.append(link(null, label));
      list.append(li);
    });
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
