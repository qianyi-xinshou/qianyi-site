export {};

const canvas = document.querySelector<HTMLCanvasElement>('[data-dot-grid]');
const hero = canvas?.closest<HTMLElement>('.hero');

if (canvas && hero) {
  const context = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dots: Array<{ x: number; y: number }> = [];
  const pulses: Array<{ x: number; y: number; started: number }> = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let pointer = { x: -1000, y: -1000, active: false };
  let frame = 0;

  const getColor = (name: string, fallback: string) => getComputedStyle(hero).getPropertyValue(name).trim() || fallback;

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    dots.length = 0;
    const spacing = width < 700 ? 24 : 28;
    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) dots.push({ x, y });
    }
    draw(performance.now());
  };

  const draw = (now: number) => {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const accent = getColor('--accent', '#9cdbb1');
    const base = getColor('--strong-line', '#617968');
    const interactive = pointer.active && document.documentElement.classList.contains('motion-enabled') && !reducedMotion.matches;
    const radius = width < 700 ? 130 : 190;

    for (const dot of dots) {
      const dx = dot.x - pointer.x;
      const dy = dot.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const influence = interactive ? Math.max(0, 1 - distance / radius) : 0;
      let pulseInfluence = 0;
      for (const pulse of pulses) {
        const wave = (now - pulse.started) / 900 * 260;
        const difference = Math.abs(Math.hypot(dot.x - pulse.x, dot.y - pulse.y) - wave);
        pulseInfluence = Math.max(pulseInfluence, Math.max(0, 1 - difference / 34) * Math.max(0, 1 - wave / 300));
      }
      const strength = Math.min(1, influence * .9 + pulseInfluence * .8);
      const offset = strength * 7;
      const safeDistance = distance || 1;
      const x = dot.x + dx / safeDistance * offset;
      const y = dot.y + dy / safeDistance * offset;
      const size = 1 + strength * 1.8;
      context.globalAlpha = .11 + strength * .72;
      context.fillStyle = strength > .04 ? accent : base;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    pulses.splice(0, pulses.length, ...pulses.filter(pulse => now - pulse.started < 1000));
    if (interactive || pulses.length > 0) frame = requestAnimationFrame(draw);
    else frame = 0;
  };

  const move = (event: PointerEvent) => {
    const bounds = hero.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    if (!frame) frame = requestAnimationFrame(draw);
  };

  hero.addEventListener('pointermove', move, { passive: true });
  hero.addEventListener('pointerleave', () => {
    pointer.active = false;
    if (!frame) draw(performance.now());
  });
  hero.addEventListener('pointerdown', event => {
    if (!reducedMotion.matches && document.documentElement.classList.contains('motion-enabled')) {
      const bounds = hero.getBoundingClientRect();
      pulses.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, started: performance.now() });
      if (!frame) frame = requestAnimationFrame(draw);
    }
  });
  window.addEventListener('resize', resize, { passive: true });
  reducedMotion.addEventListener('change', () => draw(performance.now()));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) cancelAnimationFrame(frame);
    frame = 0;
  });
  resize();
}
