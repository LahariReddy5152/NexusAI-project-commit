/**
 * NexusCosmos — Fullscreen procedural beach-galaxy background (Canvas 2D)
 * Single global singleton · never recreated on SPA navigation · no blue particle field
 * Reference: peach/coral horizon · purple sky · spiral galaxy · reflective ocean
 */
import { PALETTE } from "../../background/shared/colors.js";

const CANVAS_ID = "nexus-galaxy-canvas";

function hex(h) {
  return `#${h.toString(16).padStart(6, "0")}`;
}

function shouldInitCosmos() {
  return typeof document !== "undefined" && document.body;
}

class NexusCosmosEngine {
  constructor() {
    if (window.__nexusCosmos) return window.__nexusCosmos;
    window.__nexusCosmos = this;

    this.w = 0;
    this.h = 0;
    this.t = 0;
    this.running = false;
    this.visible = true;
    this._mount();
    this._initData();
    this._bind();
    this.start();
  }

  _mount() {
    let el = document.getElementById(CANVAS_ID);
    if (!el) {
      el = document.createElement("canvas");
      el.id = CANVAS_ID;
      el.setAttribute("aria-hidden", "true");
      document.body.prepend(el);
    }
    this.canvas = el;
    this.ctx = el.getContext("2d", { alpha: false });
  }

  _initData() {
    this.stars = [];
    for (let i = 0; i < 2200; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.58,
        r: 0.25 + Math.random() * 2.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 3.2,
        glint: Math.random() < 0.18,
        depth: 0.3 + Math.random() * 0.7
      });
    }

    this.galaxyPts = [];
    for (let i = 0; i < 6200; i++) {
      const t = Math.pow(Math.random(), 0.5);
      const arm = i % 4;
      const spin = t * 18 + arm * ((Math.PI * 2) / 4);
      const r = t;
      this.galaxyPts.push({
        lx: Math.cos(spin) * r,
        ly: Math.sin(spin) * r * 0.35,
        t,
        arm
      });
    }

    this.nebulae = [
      { x: 0.18, y: 0.12, r: 0.38, color: hex(PALETTE.lavender), drift: 0.3, depth: 0.4 },
      { x: 0.78, y: 0.1, r: 0.42, color: hex(PALETTE.peach), drift: 0.5, depth: 0.55 },
      { x: 0.5, y: 0.16, r: 0.28, color: hex(PALETTE.coral), drift: 0.7, depth: 0.35 },
      { x: 0.32, y: 0.22, r: 0.32, color: hex(PALETTE.royalPurple), drift: 0.4, depth: 0.5 },
      { x: 0.88, y: 0.2, r: 0.26, color: hex(PALETTE.warmPink), drift: 0.6, depth: 0.45 },
      { x: 0.08, y: 0.28, r: 0.3, color: hex(PALETTE.lightBlue), drift: 0.35, depth: 0.6 },
      { x: 0.62, y: 0.3, r: 0.24, color: hex(PALETTE.softOrange), drift: 0.55, depth: 0.5 },
      { x: 0.42, y: 0.08, r: 0.36, color: hex(PALETTE.lavender), drift: 0.45, depth: 0.38 }
    ];

    this.clouds = [];
    for (let i = 0; i < 9; i++) {
      this.clouds.push({
        x: Math.random(),
        y: 0.38 + Math.random() * 0.14,
        w: 0.12 + Math.random() * 0.22,
        h: 0.03 + Math.random() * 0.05,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.06 + Math.random() * 0.1
      });
    }

    this.shooters = [];
    this.shooterPool = 160;
    this.motes = [];
    for (let i = 0; i < 320; i++) {
      this.motes.push({
        x: Math.random(),
        y: Math.random() * 0.52,
        phase: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 3.5
      });
    }

    this.horizonY = 0.52;
    this.galaxyCX = 0.5;
    this.galaxyCY = 0.11;
    this.galaxyR = 0.72;
    this.mouseX = 0;
    this.mouseY = 0;
    this.parallaxX = 0;
    this.parallaxY = 0;
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.horizonPx = this.h * this.horizonY;
    this.galaxyPx = { x: this.w * this.galaxyCX, y: this.h * this.galaxyCY, r: this.w * this.galaxyR };
  }

  _sky(ctx) {
    const h = this.horizonPx;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1a0a38");
    g.addColorStop(0.2, "#3d1a6e");
    g.addColorStop(0.4, hex(PALETTE.royalPurple));
    g.addColorStop(0.58, "#c060a8");
    g.addColorStop(0.72, hex(PALETTE.coral));
    g.addColorStop(0.86, "#ffb888");
    g.addColorStop(1, "#ffd4a0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, h + 4);

    const sunX = this.w * (0.5 + Math.sin(this.t * 0.04) * 0.01);
    const sunG = ctx.createRadialGradient(sunX, h, 0, sunX, h, this.w * 0.55);
    sunG.addColorStop(0, "rgba(255,240,210,0.95)");
    sunG.addColorStop(0.12, "rgba(255,200,150,0.55)");
    sunG.addColorStop(0.35, "rgba(255,140,100,0.18)");
    sunG.addColorStop(1, "transparent");
    ctx.fillStyle = sunG;
    ctx.fillRect(0, h - this.h * 0.15, this.w, this.h * 0.2);

    const band = ctx.createLinearGradient(0, h - 8, 0, h + 8);
    band.addColorStop(0, "transparent");
    band.addColorStop(0.5, "rgba(255,220,180,0.7)");
    band.addColorStop(1, "transparent");
    ctx.fillStyle = band;
    ctx.fillRect(0, h - 6, this.w, 12);
  }

  _rays(ctx) {
    const h = this.horizonPx;
    const cx = this.w * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * 0.6 - 0.3 + Math.sin(this.t * 0.08 + i) * 0.04;
      const len = this.h * 0.45;
      const g = ctx.createLinearGradient(cx, h, cx + Math.sin(angle) * len, h - Math.cos(angle) * len);
      const a = 0.04 + Math.abs(Math.sin(this.t * 0.4 + i * 0.6)) * 0.05;
      g.addColorStop(0, `rgba(255,220,180,${a})`);
      g.addColorStop(1, "transparent");
      ctx.strokeStyle = g;
      ctx.lineWidth = 12 + i * 2;
      ctx.beginPath();
      ctx.moveTo(cx, h);
      ctx.lineTo(cx + Math.sin(angle) * len, h - Math.cos(angle) * len * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  _nebulae(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const parallax = Math.sin(this.t * 0.04) * 18 + this.parallaxX * 0.35;
    for (const n of this.nebulae) {
      const depthShift = (n.depth || 0.5) * parallax;
      const nx = (n.x + Math.sin(this.t * 0.05 + n.drift) * 0.025) * this.w + depthShift;
      const ny = (n.y + Math.cos(this.t * 0.04 + n.drift * 1.3) * 0.018) * this.h;
      const nr = n.r * this.w * (1.05 + Math.sin(this.t * 0.1 + n.drift) * 0.08);
      const pulse = 0.18 + Math.sin(this.t * 0.12 + n.drift) * 0.08;
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
      g.addColorStop(0, n.color + "88");
      g.addColorStop(0.35, n.color + "44");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.globalAlpha = pulse + 0.75;
      ctx.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
    }
    ctx.restore();
  }

  _clouds(ctx) {
    const h = this.horizonPx;
    ctx.save();
    for (const c of this.clouds) {
      const x = ((c.x + this.t * c.speed * 0.008) % 1.2 - 0.1) * this.w;
      const y = c.y * h;
      const w = c.w * this.w;
      const ht = c.h * h;
      const g = ctx.createRadialGradient(x, y, 0, x, y, w);
      g.addColorStop(0, `rgba(255,220,200,${c.alpha})`);
      g.addColorStop(0.5, `rgba(200,180,255,${c.alpha * 0.6})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, w, ht, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + w * 0.35, y - ht * 0.3, w * 0.7, ht * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _galaxy(ctx) {
    const { x: cx, y: cy, r: R } = this.galaxyPx;
    const rot = this.t * 0.065;
    const zoom = 1 + Math.sin(this.t * 0.06) * 0.035;
    const parX = Math.sin(this.t * 0.05) * 8 + this.parallaxX;
    const parY = Math.cos(this.t * 0.04) * 5 + this.parallaxY * 0.6;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(cx + parX, cy + parY);

    for (let arm = 0; arm < 4; arm++) {
      const armAngle = rot + arm * ((Math.PI * 2) / 4);
      ctx.save();
      ctx.rotate(armAngle);
      const armG = ctx.createLinearGradient(0, 0, R * zoom, 0);
      armG.addColorStop(0, "rgba(255,240,200,0.55)");
      armG.addColorStop(0.25, "rgba(255,160,100,0.35)");
      armG.addColorStop(0.55, "rgba(200,120,220,0.22)");
      armG.addColorStop(0.8, "rgba(100,150,255,0.12)");
      armG.addColorStop(1, "transparent");
      ctx.strokeStyle = armG;
      ctx.lineWidth = 14 + arm * 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let s = 0; s <= 48; s++) {
        const t = s / 48;
        const spiralR = t * R * zoom * 0.92;
        const twist = t * 2.8;
        const ax = Math.cos(twist) * spiralR;
        const ay = Math.sin(twist) * spiralR * 0.32;
        if (s === 0) ctx.moveTo(ax, ay);
        else ctx.lineTo(ax, ay);
      }
      ctx.stroke();
      ctx.restore();
    }

    const coreG = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.14 * zoom);
    coreG.addColorStop(0, "rgba(255,255,230,0.82)");
    coreG.addColorStop(0.45, "rgba(255,210,150,0.35)");
    coreG.addColorStop(1, "transparent");
    ctx.fillStyle = coreG;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.16 * zoom, 0, Math.PI * 2);
    ctx.fill();

    const haloG = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.55 * zoom);
    haloG.addColorStop(0, "rgba(255,180,130,0.18)");
    haloG.addColorStop(0.55, "rgba(180,100,200,0.1)");
    haloG.addColorStop(1, "transparent");
    ctx.fillStyle = haloG;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.58 * zoom, 0, Math.PI * 2);
    ctx.fill();

    for (const p of this.galaxyPts) {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const gx = (p.lx * cos - p.ly * sin) * R * zoom;
      const gy = (p.lx * sin + p.ly * cos) * R * zoom;
      const flicker = 0.8 + 0.2 * Math.sin(p.arm * 3.1 + p.t * 20 + this.t * 2.2);
      let color;
      if (p.t < 0.08) color = `rgba(255,240,200,${0.75 * flicker})`;
      else if (p.t < 0.22) color = `rgba(255,180,120,${0.62 * flicker})`;
      else if (p.t < 0.42) color = `rgba(255,120,90,${0.52 * flicker})`;
      else if (p.t < 0.62) color = `rgba(230,180,250,${0.46 * flicker})`;
      else if (p.t < 0.8) color = `rgba(140,90,180,${0.42 * flicker})`;
      else color = `rgba(100,160,255,${0.38 * flicker})`;
      const sz = p.t < 0.1 ? 2.4 : 0.75 + (1 - p.t) * 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(gx, gy, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _stars(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const parallax = Math.sin(this.t * 0.03) * 12 + this.parallaxX * 0.45;
    for (const s of this.stars) {
      const a = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(this.t * s.speed + s.phase));
      const x = s.x * this.w + parallax * (s.depth || 0.5);
      const y = s.y * this.h;
      ctx.fillStyle = `rgba(255,248,240,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.glint && a > 0.65) {
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.45})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - s.r * 2.5, y);
        ctx.lineTo(x + s.r * 2.5, y);
        ctx.moveTo(x, y - s.r * 2.5);
        ctx.lineTo(x, y + s.r * 2.5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _spawnShooter() {
    if (this.shooters.length >= this.shooterPool) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 14;
    this.shooters.push({
      x: Math.random() * this.w,
      y: Math.random() * this.h * 0.55,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.7 + 2,
      life: 1,
      len: 50 + Math.random() * 90
    });
  }

  _shootingStars(ctx) {
    if (Math.random() < 0.35) this._spawnShooter();
    if (Math.random() < 0.18) this._spawnShooter();

    for (let i = this.shooters.length - 1; i >= 0; i--) {
      const sh = this.shooters[i];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.014;
      const tx = sh.x - sh.vx * sh.len * 0.12;
      const ty = sh.y - sh.vy * sh.len * 0.12;
      const g = ctx.createLinearGradient(sh.x, sh.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${sh.life})`);
      g.addColorStop(0.35, `rgba(255,200,150,${sh.life * 0.6})`);
      g.addColorStop(1, "transparent");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      if (sh.life <= 0 || sh.x < -100 || sh.x > this.w + 100 || sh.y > this.h) {
        this.shooters.splice(i, 1);
      }
    }
  }

  _motes(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const m of this.motes) {
      const x = (m.x + Math.sin(this.t * 0.25 + m.phase) * 0.02) * this.w;
      const y = (m.y + Math.cos(this.t * 0.2 + m.phase * 1.2) * 0.015) * this.h;
      const a = 0.25 + 0.35 * Math.sin(this.t * 0.5 + m.phase);
      const g = ctx.createRadialGradient(x, y, 0, x, y, m.size * 3);
      g.addColorStop(0, `rgba(255,180,130,${a})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(x - m.size * 3, y - m.size * 3, m.size * 6, m.size * 6);
    }
    ctx.restore();
  }

  _fog(ctx) {
    const h = this.horizonPx;
    ctx.save();
    for (let i = 0; i < 6; i++) {
      const fx = (i / 6) * this.w + Math.sin(this.t * 0.15 + i * 1.2) * 40;
      const fy = h * 0.92 + Math.sin(this.t * 0.2 + i) * 8;
      const fr = this.w * (0.15 + i * 0.04);
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
      g.addColorStop(0, `rgba(200,180,220,${0.04 + Math.sin(this.t + i) * 0.02})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(fx - fr, fy - fr * 0.5, fr * 2, fr);
    }
    const horizonFog = ctx.createLinearGradient(0, h - 30, 0, h + 60);
    horizonFog.addColorStop(0, "transparent");
    horizonFog.addColorStop(0.5, "rgba(255,200,160,0.22)");
    horizonFog.addColorStop(1, "rgba(140,100,180,0.14)");
    ctx.fillStyle = horizonFog;
    ctx.fillRect(0, h - 30, this.w, 90);
    ctx.restore();
  }

  _ocean(ctx) {
    const y0 = this.horizonPx;
    const h = this.h - y0;

    const bg = ctx.createLinearGradient(0, y0, 0, this.h);
    bg.addColorStop(0, "#2a5a9a");
    bg.addColorStop(0.2, "#1a4080");
    bg.addColorStop(0.5, "#0e2858");
    bg.addColorStop(1, "#061020");
    ctx.fillStyle = bg;
    ctx.fillRect(0, y0, this.w, h);

    const { x: gcx, y: gcy, r: gR } = this.galaxyPx;
    const reflY = y0 + (gcy - y0) * 0.15;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(gcx, reflY);
    ctx.scale(1, -0.55);
    ctx.globalAlpha = 0.48 + Math.sin(this.t * 0.4) * 0.12;
    const mirrorG = ctx.createRadialGradient(0, 0, 0, 0, 0, gR * 0.85);
    mirrorG.addColorStop(0, "rgba(255,200,150,0.65)");
    mirrorG.addColorStop(0.35, "rgba(200,140,220,0.35)");
    mirrorG.addColorStop(0.7, "rgba(100,160,255,0.15)");
    mirrorG.addColorStop(1, "transparent");
    ctx.fillStyle = mirrorG;
    ctx.beginPath();
    ctx.ellipse(0, 0, gR * 0.9, gR * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const refl = ctx.createLinearGradient(this.w * 0.5, y0, this.w * 0.5, this.h);
    refl.addColorStop(0, "rgba(255,210,160,0.72)");
    refl.addColorStop(0.2, "rgba(255,180,120,0.48)");
    refl.addColorStop(0.45, "rgba(180,120,220,0.22)");
    refl.addColorStop(1, "transparent");
    ctx.fillStyle = refl;
    const rw = this.w * (0.28 + Math.sin(this.t * 0.3) * 0.03);
    ctx.fillRect(this.w * 0.5 - rw, y0, rw * 2, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let row = 0; row < 36; row++) {
      const fy = y0 + (row / 36) * h;
      const shore = 1 - row / 28;
      const alpha = 0.04 + shore * 0.08;
      ctx.strokeStyle = `rgba(120,180,255,${alpha})`;
      ctx.lineWidth = 1 + shore * 1.5;
      ctx.beginPath();
      for (let x = 0; x <= this.w; x += 6) {
        const wave =
          Math.sin((x + this.parallaxX * 1.2) * 0.012 + this.t * (1.1 + row * 0.02) + row) * (3 + shore * 5) +
          Math.sin((x - this.parallaxX * 0.8) * 0.025 - this.t * 0.8 + row * 0.5) * (2 + shore * 3);
        const y = fy + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 12; i++) {
      const fx = (i / 12) * this.w + Math.sin(this.t * 1.5 + i) * 20;
      const fy = y0 + h * 0.92 + Math.sin(this.t * 2 + i * 0.8) * 3;
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(this.t * 2 + i) * 0.1})`;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 18 + i * 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _silhouette(ctx) {
    const y0 = this.horizonPx;
    const h = this.h - y0;
    ctx.save();
    ctx.fillStyle = "#020408";
    ctx.beginPath();
    ctx.moveTo(this.w * 0.55, this.h);
    const peaks = [0.55, 0.68, 0.5, 0.75, 0.58, 0.82, 0.52, 0.7, 0.6, 0.88, 0.55, 0.72, 1];
    peaks.forEach((p, i) => {
      ctx.lineTo(this.w * (0.55 + (i / (peaks.length - 1)) * 0.45), y0 + h * (1 - p * 0.55));
    });
    ctx.lineTo(this.w, this.h);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 22; i++) {
      const tx = this.w * (0.72 + (i / 22) * 0.23);
      const th = 12 + (i % 5) * 5;
      ctx.beginPath();
      ctx.moveTo(tx, this.h);
      ctx.lineTo(tx + 4, this.h - th);
      ctx.lineTo(tx + 8, this.h);
      ctx.fill();
    }
    ctx.restore();
  }

  _frame = (now) => {
    if (!this.running) return;
    requestAnimationFrame(this._frame);
    if (!this.visible) return;

    this.t = now * 0.001;
    this._updateParallax();
    const ctx = this.ctx;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    this._sky(ctx);
    this._rays(ctx);
    this._nebulae(ctx);
    this._galaxy(ctx);
    this._clouds(ctx);
    this._stars(ctx);
    this._motes(ctx);
    this._fog(ctx);
    this._shootingStars(ctx);
    this._ocean(ctx);
    this._silhouette(ctx);
  };

  _bind() {
    window.addEventListener("resize", () => this._resize(), { passive: true });
    document.addEventListener("visibilitychange", () => {
      this.visible = !document.hidden;
    });
    window.addEventListener(
      "mousemove",
      (e) => {
        if (!this.w) return;
        this.mouseX = (e.clientX / this.w - 0.5) * 2;
        this.mouseY = (e.clientY / this.h - 0.5) * 2;
      },
      { passive: true }
    );
  }

  _updateParallax() {
    const targetX = this.mouseX * 42;
    const targetY = this.mouseY * 28;
    this.parallaxX += (targetX - this.parallaxX) * 0.08;
    this.parallaxY += (targetY - this.parallaxY) * 0.08;
  }

  start() {
    if (this.running) return;
    this._resize();
    this.running = true;
    this.visible = !document.hidden;
    requestAnimationFrame(this._frame);
  }

  dispose() {
    this.running = false;
  }
}

export function initNexusCosmos() {
  if (!shouldInitCosmos()) return null;
  try {
    if (window.__nexusCosmos) return window.__nexusCosmos;
    return new NexusCosmosEngine();
  } catch (err) {
    console.error("[NexusCosmos] init failed:", err);
    window.__nexusCosmosError = err;
    return null;
  }
}

export const initGalaxyBackground = initNexusCosmos;
export { NexusCosmosEngine, NexusCosmosEngine as NexusGalaxyBackground };

if (typeof document !== "undefined" && shouldInitCosmos()) {
  const boot = () => initNexusCosmos();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}
