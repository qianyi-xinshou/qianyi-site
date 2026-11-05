export {};

type Rgb = [number, number, number];
type Palette = { accent: string; cool: string; line: string };

const page = document.querySelector<HTMLElement>('.home-page');
const cards = [...document.querySelectorAll<HTMLElement>('[data-palette]')];

if (page && cards.length > 0) {
  const palettes: Record<string, Palette> = {
    aurora: { accent: '#9cdbb1', cool: '#9acbd2', line: '#617968' },
    ocean: { accent: '#7dd3fc', cool: '#60a5fa', line: '#52748e' },
    dune: { accent: '#f9c27d', cool: '#f59e67', line: '#8c7256' },
    dusk: { accent: '#e5b3fe', cool: '#a78bfa', line: '#75658e' },
    silk: { accent: '#e5e7eb', cool: '#cbd5e1', line: '#7b8491' },
  };
  const defaultPalette = palettes.aurora;
  let current = defaultPalette;
  let target = defaultPalette;
  let frame = 0;
  let transitionStarted = 0;
  let hoverLocked = false;
  let paletteIndex = 0;
  const paletteNames = ['aurora', 'ocean', 'dune', 'dusk', 'silk'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const parseHex = (value: string): Rgb => {
    const hex = value.replace('#', '');
    return [Number.parseInt(hex.slice(0, 2), 16), Number.parseInt(hex.slice(2, 4), 16), Number.parseInt(hex.slice(4, 6), 16)];
  };
  const toHex = (value: Rgb) => `#${value.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
  const mix = (from: string, to: string, amount: number) => {
    const a = parseHex(from);
    const b = parseHex(to);
    return toHex([a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount]);
  };
  const apply = (palette: Palette, amount = 1) => {
    page.style.setProperty('--accent', mix(current.accent, palette.accent, amount));
    page.style.setProperty('--accent-cool', mix(current.cool, palette.cool, amount));
    page.style.setProperty('--strong-line', mix(current.line, palette.line, amount));
  };
  const transition = () => {
    const amount = Math.min(1, .12 + (performance.now() - transitionStarted) / 420);
    apply(target, amount);
    if (amount < 1) frame = requestAnimationFrame(transition);
    else {
      current = target;
      frame = 0;
    }
  };

  const setPalette = (name: string) => {
    const next = palettes[name] || defaultPalette;
    if (next === target) return;
    current = {
      accent: getComputedStyle(page).getPropertyValue('--accent').trim() || current.accent,
      cool: getComputedStyle(page).getPropertyValue('--accent-cool').trim() || current.cool,
      line: getComputedStyle(page).getPropertyValue('--strong-line').trim() || current.line,
    };
    target = next;
    transitionStarted = performance.now();
    if (!frame) frame = requestAnimationFrame(transition);
  };

  const cyclePalette = () => {
    window.setTimeout(() => {
      if (!hoverLocked && !reducedMotion.matches && !document.hidden) {
        paletteIndex = (paletteIndex + 1) % paletteNames.length;
        setPalette(paletteNames[paletteIndex]);
      }
      cyclePalette();
    }, 6500);
  };

  for (const card of cards) {
    const name = card.dataset.palette || 'aurora';
    card.addEventListener('pointerenter', () => { hoverLocked = true; setPalette(name); });
    card.addEventListener('focusin', () => { hoverLocked = true; setPalette(name); });
    card.addEventListener('pointerleave', () => { hoverLocked = false; setPalette('aurora'); });
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget as Node | null)) {
        hoverLocked = false;
        setPalette('aurora');
      }
    });
  }
  cyclePalette();
}
