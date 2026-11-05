type Particle = { lat: number; lon: number; phase: number };

const orbitRegions = document.querySelectorAll<HTMLElement>('[data-design-orbit]');

orbitRegions.forEach(region => {
  const canvas = region.querySelector<HTMLCanvasElement>('[data-orbit-canvas]');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const particles: Particle[] = [];
  const latitudes = 24;
  const longitudes = 96;
  for (let lat = 1; lat < latitudes; lat += 1) {
    for (let lon = 0; lon < longitudes; lon += 1) particles.push({ lat, lon, phase: Math.random() * Math.PI * 2 });
  }

  let width = 1;
  let height = 1;
  let ratio = 1;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let time = 0;
  let last = 0;

  const resize = () => {
    const bounds = region.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const project = (x: number, y: number, z: number, scale: number) => {
    const depth = 1 / (1.55 - z * .34);
    return { x: width * .42 + x * scale * depth, y: height * .36 + y * scale * depth, z, depth };
  };

  const render = (now: number) => {
    requestAnimationFrame(render);
    const dt = Math.min(40, last ? now - last : 16);
    last = now;
    time += dt / 1000;
    pointerX += (targetX - pointerX) * .055;
    pointerY += (targetY - pointerY) * .055;
    context.clearRect(0, 0, width, height);

    const scale = Math.min(width, height) * .48;
    const rotationY = time * .18 + pointerX * .16;
    const rotationX = pointerY * .14;
    const projected = particles.map(particle => {
      const phi = (particle.lat / latitudes) * Math.PI;
      const theta = (particle.lon / longitudes) * Math.PI * 2;
      const pulse = 1 + Math.sin(time * .9 + particle.phase + theta * 3) * .045;
      const mouseWave = Math.exp(-Math.hypot(pointerX - Math.cos(theta) * .7, pointerY - Math.sin(phi) * .7) * 2.4) * .1;
      const radius = (1 + mouseWave) * pulse;
      let x = Math.sin(phi) * Math.cos(theta) * radius;
      let y = Math.cos(phi) * radius;
      let z = Math.sin(phi) * Math.sin(theta) * radius;
      const cy = Math.cos(rotationY);
      const sy = Math.sin(rotationY);
      const nextX = x * cy - z * sy;
      const nextZ = x * sy + z * cy;
      const cx = Math.cos(rotationX);
      const sx = Math.sin(rotationX);
      const nextY = y * cx - nextZ * sx;
      const finalZ = y * sx + nextZ * cx;
      x = nextX;
      y = nextY;
      z = finalZ;
      const point = project(x, y, z, scale);
      const mouseX = width * .42 + pointerX * width * .32;
      const mouseY = height * .36 + pointerY * height * .32;
      const dx = point.x - mouseX;
      const dy = point.y - mouseY;
      const distance = Math.hypot(dx, dy);
      const influenceRadius = Math.min(width, height) * .34;
      const force = Math.max(0, 1 - distance / influenceRadius);
      if (force > 0 && distance > 0.001) {
        const push = force * force * 72;
        point.x += (dx / distance) * push;
        point.y += (dy / distance) * push;
        point.z += force * .35;
      }
      return point;
    });

    context.save();
    context.globalCompositeOperation = 'lighter';
    for (const current of projected) {
      const alpha = .16 + Math.max(0, current.z + .5) * .18;
      context.fillStyle = `rgba(198,224,207,${alpha})`;
      context.beginPath();
      context.arc(current.x, current.y, .65 + current.depth * .5, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  };

  region.addEventListener('pointermove', event => {
    const bounds = region.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    targetY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  }, { passive: true });
  region.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });
  new ResizeObserver(resize).observe(region);
  resize();
  requestAnimationFrame(render);
});
