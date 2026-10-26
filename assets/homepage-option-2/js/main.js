/* =========================================================================
   Atlantic Sun Control — Homepage option 2
   main.js — product tabs, process timeline, service-area maps, FAQ
   ========================================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Adds `className` to `el` the first time it scrolls into view */
const revealOnce = (el, className, threshold) => {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    el.classList.add(className);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      el.classList.add(className);
      io.disconnect();
    }
  }, { threshold });
  io.observe(el);
};

/* ---------------------------------------------------------------------
   Product category tabs
   --------------------------------------------------------------------- */
const initTabs = () => {
  const tabs = [...document.querySelectorAll('.tab')];
  if (!tabs.length) return;

  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const keys = {
        ArrowDown: tabs[(i + 1) % tabs.length],
        ArrowRight: tabs[(i + 1) % tabs.length],
        ArrowUp: tabs[(i - 1 + tabs.length) % tabs.length],
        ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      };
      const next = keys[e.key];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  select(tabs[0]);
};

/* ---------------------------------------------------------------------
   Who we serve: clicking (or pressing Enter / Space on) an audience
   opens its description and cross-fades the matching photo
   --------------------------------------------------------------------- */
const initAudience = () => {
  const items = [...document.querySelectorAll('.aud')];
  const photos = [...document.querySelectorAll('.aud-media img')];
  if (!items.length) return;

  const activate = (n) => {
    items.forEach((item, i) => {
      const on = i === n;
      item.classList.toggle('is-active', on);
      item.querySelector('.aud-head').setAttribute('aria-expanded', on);
    });
    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === n));
  };

  items.forEach((item, i) => {
    item.querySelector('.aud-head').addEventListener('click', () => activate(i));
  });

  activate(0);
};

/* ---------------------------------------------------------------------
   Process timeline: hovering, tapping or focusing a step fills the line
   up to it; the steps it passes light up in turn
   --------------------------------------------------------------------- */
const initTimeline = () => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const steps = [...timeline.querySelectorAll('.step')];
  let current = 0;

  const goTo = (n) => {
    const from = current;
    current = n;
    timeline.style.setProperty('--p', (n / (steps.length - 1)).toFixed(3));
    steps.forEach((step, i) => {
      const delay = n > from && i > from && i <= n ? (i - from) * 0.18 : 0;
      step.style.setProperty('--d', `${delay}s`);
      step.classList.toggle('on', i <= n);
      step.classList.toggle('current', i === n);
    });
  };

  steps.forEach((step, i) => {
    ['mouseenter', 'focus', 'click'].forEach((type) => step.addEventListener(type, () => goTo(i)));
  });

  goTo(0);
};

/* ---------------------------------------------------------------------
   Service area: draw the region outlines once they come into view
   --------------------------------------------------------------------- */
const initMaps = () => {
  const maps = document.querySelector('.maps');
  if (maps) revealOnce(maps, 'in', 0.25);
};

/* ---------------------------------------------------------------------
   FAQ: staggered reveal + animated open / close
   --------------------------------------------------------------------- */
const initFaq = () => {
  const faq = document.querySelector('.faq');
  if (!faq) return;
  revealOnce(faq, 'in', 0.15);

  faq.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.a');
    let busy = false;

    summary.addEventListener('click', (e) => {
      if (reduceMotion || !answer.animate) return;
      e.preventDefault();
      if (busy) return;
      busy = true;

      if (details.open) {
        const height = answer.offsetHeight;
        answer.animate(
          [{ height: `${height}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
          { duration: 280, easing: 'ease-in' },
        ).onfinish = () => {
          details.open = false;
          busy = false;
        };
      } else {
        details.open = true;
        const height = answer.offsetHeight;
        answer.animate(
          [{ height: '0px', opacity: 0 }, { height: `${height}px`, opacity: 1 }],
          { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' },
        ).onfinish = () => {
          busy = false;
        };
      }
    });
  });
};

initTabs();
initAudience();
initTimeline();
initMaps();
initFaq();
