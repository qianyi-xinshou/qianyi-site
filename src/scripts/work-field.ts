export {};

const stage = document.querySelector<HTMLElement>('[data-work-field]');
const canvas = stage?.querySelector<HTMLCanvasElement>('[data-work-canvas]');

if (stage && canvas) {
  const context = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ripples: Array<{ x: number; y: number; started: number }> = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let pointer = { x: 0.7, y: 0.4, active: false };

  const color = (name: string, fallback: string) => getComputedStyle(stage).getPropertyValue(name).trim() || fallback;

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(performance.now());
  };

  const draw = (now: number) => {
    if (!context) return;
    const accent = color('--accent', '#9cdbb1');
    const cool = color('--accent-cool', '#9acbd2');
    const animated = document.documentElement.classList.contains('motion-enabled') && !reducedMotion.matches;
    const drift = now / 3200;
    const targetX = pointer.active ? pointer.x * width : width * (.62 + Math.sin(drift) * .16);
    const targetY = pointer.active ? pointer.y * height : height * (.42 + Math.cos(drift * .8) * .12);
    const glow = context.createRadialGradient(targetX, targetY, 0, targetX, targetY, Math.max(width, height) * .65);
    glow.addColorStop(0, `${accent}22`);
    glow.addColorStop(.45, `${cool}0d`);
    glow.addColorStop(1, `${accent}00`);
    context.clearRect(0, 0, width, height);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const isMoving = pointer.active && animated;
    const motion = animated ? now / 2600 : 0;
    for (let index = 0; index < 4; index += 1) {
      const baseY = height * (.22 + index * .22);
      const lift = isMoving ? (pointer.y * height - baseY) * .1 : 0;
      context.beginPath();
      context.moveTo(-40, baseY + lift);
      for (let x = 0; x <= width + 80; x += 80) {
        const wave = Math.sin(x / (170 + index * 35) + motion + index * 1.7) * (18 + index * 4);
        context.lineTo(x, baseY + lift + wave);
      }
      context.strokeStyle = index % 2 === 0 ? accent : cool;
      context.globalAlpha = .12 - index * .014;
      context.lineWidth = 1.4 + index * .45;
      context.shadowColor = context.strokeStyle;
      context.shadowBlur = 18;
      context.stroke();
    }

    context.shadowBlur = 0;
    for (const ripple of ripples) {
      const age = (now - ripple.started) / 1100;
      const radius = age * Math.max(width, height) * .55;
      context.globalAlpha = Math.max(0, .18 * (1 - age));
      context.strokeStyle = accent;
      context.lineWidth = 1.2;
      context.beginPath();
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      context.stroke();
    }
    context.globalAlpha = 1;
    ripples.splice(0, ripples.length, ...ripples.filter(ripple => now - ripple.started < 1100));
    if (animated && !document.hidden) frame = requestAnimationFrame(draw);
    else frame = 0;
  };

  stage.addEventListener('pointermove', event => {
    const bounds = stage.getBoundingClientRect();
    pointer = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, active: true };
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointer.active = false; });
  stage.addEventListener('pointerdown', event => {
    if (reducedMotion.matches || !document.documentElement.classList.contains('motion-enabled')) return;
    const bounds = stage.getBoundingClientRect();
    ripples.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, started: performance.now() });
    if (!frame) frame = requestAnimationFrame(draw);
  });
  window.addEventListener('resize', resize, { passive: true });
  reducedMotion.addEventListener('change', () => { if (!frame) draw(performance.now()); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) cancelAnimationFrame(frame);
    frame = 0;
    if (!document.hidden) draw(performance.now());
  });
  resize();
}
