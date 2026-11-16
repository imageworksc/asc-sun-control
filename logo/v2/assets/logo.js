/* Light / dark toggle (also ?theme=dark) and the section dots */
const root = document.documentElement;
const buttons = document.querySelectorAll('.toggle button');

const setTheme = (theme) => {
  root.dataset.theme = theme;
  buttons.forEach((button) => button.setAttribute('aria-pressed', button.dataset.set === theme));
};

buttons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.set)));
if (new URLSearchParams(location.search).get('theme') === 'dark') setTheme('dark');

const dots = new Map([...document.querySelectorAll('.dots a')].map((dot) => [dot.getAttribute('href').slice(1), dot]));
const observer = new IntersectionObserver((entries) => {
  entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
    dots.forEach((dot, id) => dot.classList.toggle('active', id === entry.target.id));
  });
}, { threshold: 0.6 });

document.querySelectorAll('.screen').forEach((screen) => observer.observe(screen));
