/**
 * Login page — peach/blue animated canvas (2D).
 * Hundreds of twinkling stars + frequent shooting stars. Login card unchanged.
 */
(function initLoginBackground() {
  if (!document.body.classList.contains("login-body")) return;
  if (document.getElementById("nexus-login-bg")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "nexus-login-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let running = true;
  let t0 = performance.now();
  const stars = [];
  const shooters = [];
  const STAR_COUNT = 480;
  const MAX_SHOOTERS = 28;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    if (stars.length < STAR_COUNT) {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.78,
          r: 0.3 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 2.8,
          glint: Math.random() < 0.12
        });
      }
    }
  }

  function spawnShooter() {
    if (shooters.length >= MAX_SHOOTERS) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 9;
    shooters.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.55,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.6 + 2,
      life: 1,
      len: 50 + Math.random() * 100
    });
  }

  function drawSky(t) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#060818");
    g.addColorStop(0.3, "#1a1040");
    g.addColorStop(0.5, "#3d2060");
    g.addColorStop(0.68, "#7851a9");
    g.addColorStop(0.78, "#ff8866");
    g.addColorStop(0.88, "#ffcb9a");
    g.addColorStop(1, "#0c1e38");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const galaxy = ctx.createRadialGradient(w * 0.72, h * 0.16, 0, w * 0.72, h * 0.16, w * 0.4);
    galaxy.addColorStop(0, "rgba(255,200,150,0.4)");
    galaxy.addColorStop(0.35, "rgba(255,127,80,0.2)");
    galaxy.addColorStop(0.6, "rgba(120,81,169,0.18)");
    galaxy.addColorStop(1, "transparent");
    ctx.fillStyle = galaxy;
    ctx.fillRect(0, 0, w, h);

    const neb1 = ctx.createRadialGradient(w * 0.2, h * 0.22, 0, w * 0.2, h * 0.22, w * 0.25);
    neb1.addColorStop(0, `rgba(230,230,250,${0.12 + Math.sin(t * 0.3) * 0.04})`);
    neb1.addColorStop(1, "transparent");
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, w, h);

    const horizon = ctx.createLinearGradient(0, h * 0.72, 0, h * 0.82);
    horizon.addColorStop(0, "transparent");
    horizon.addColorStop(0.5, "rgba(255,215,170,0.35)");
    horizon.addColorStop(1, "transparent");
    ctx.fillStyle = horizon;
    ctx.fillRect(0, h * 0.65, w, h * 0.2);
  }

  function drawStar(s, t) {
    const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,240,${a})`;
    ctx.fill();
    if (s.glint && a > 0.7) {
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.5})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 2.5, s.y);
      ctx.lineTo(s.x + s.r * 2.5, s.y);
      ctx.moveTo(s.x, s.y - s.r * 2.5);
      ctx.lineTo(s.x, s.y + s.r * 2.5);
      ctx.stroke();
    }
  }

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (document.hidden) return;

    const t = (now - t0) / 1000;
    drawSky(t);

    for (const s of stars) drawStar(s, t);

    if (Math.random() < 0.14) spawnShooter();
    if (Math.random() < 0.06) spawnShooter();

    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.016;
      const tailX = sh.x - sh.vx * sh.len * 0.1;
      const tailY = sh.y - sh.vy * sh.len * 0.1;
      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
      grad.addColorStop(0.4, `rgba(255,200,150,${sh.life * 0.6})`);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (sh.life <= 0 || sh.x < -80 || sh.x > w + 80 || sh.y > h + 40) shooters.splice(i, 1);
    }
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) t0 = performance.now();
  });
  requestAnimationFrame(frame);
})();
