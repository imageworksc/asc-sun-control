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
   Desktop: top links + dropdown under "Products & Services"
   (categories on the left, the hovered category's products on the right)
   --------------------------------------------------------------------- */
const initDesktop = (bar) => {
  const nav = bar.querySelector('#ascNav');
  const panel = bar.querySelector('#ascPanel');
  let dropBtn = null;
  let open = false;
  let activeCat = 0;

  TOP.forEach((item) => {
    const li = el('li');
    if (item.dropdown) {
      dropBtn = el('button', 'asc-navbtn');
      dropBtn.type = 'button';
      dropBtn.setAttribute('aria-expanded', 'false');
      dropBtn.setAttribute('aria-controls', panel.id);
      dropBtn.append(el('span', null, item.label), el('span', 'asc-caret'));
      li.append(dropBtn, panel);
    } else {
      li.append(link('asc-navbtn', item.label, item.href));
    }
    nav.append(li);
  });

  const cats = el('ul', 'asc-dd-cats');
  const products = el('div', 'asc-dd-items');
  panel.append(cats, products);

  const show = (n) => {
    activeCat = n;
    [...cats.querySelectorAll('.asc-dd-cat')].forEach((cat, i) => cat.classList.toggle('is-active', i === n));
    const list = el('ul', 'asc-dd-list');
    CATS[n].items.forEach((label) => {
      const li = el('li');
      li.append(link(null, label));
      list.append(li);
    });
    const foot = el('div', 'asc-dd-foot');
    foot.append(link('asc-btn-line', `View ${CATS[n].head}`));
    products.replaceChildren(list, foot);
  };

  CATS.forEach((cat, i) => {
    const li = el('li');
    const a = link('asc-dd-cat', cat.head);
    ['mouseenter', 'focus'].forEach((type) => a.addEventListener(type, () => show(i)));
    a.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
    });
    li.append(a);
    cats.append(li);
  });

  const setOpen = (on) => {
    open = on;
    dropBtn.setAttribute('aria-expanded', on);
    panel.classList.toggle('is-open', on);
    if (on) show(activeCat);
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
    if (!a || a.classList.contains('asc-dd-cat')) return;
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
