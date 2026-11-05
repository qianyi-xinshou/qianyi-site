import { required } from './dom';

const header = required<HTMLElement>('.site-header');
let frame = 0;

const update = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
  frame = 0;
};

window.addEventListener('scroll', () => {
  if (!frame) frame = requestAnimationFrame(update);
}, { passive: true });
window.addEventListener('pageshow', update);
update();
