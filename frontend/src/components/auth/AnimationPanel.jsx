import { memo, useEffect, useRef } from 'react';

function AnimationPanel() {
  const rootRef = useRef(null);
  const starsRef = useRef(null);
  const particlesRef = useRef(null);
  const sparkleWrapRef = useRef(null);
  const xpFillRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const starsEl = starsRef.current;
    const particlesEl = particlesRef.current;
    const sparkleWrap = sparkleWrapRef.current;
    const xpFill = xpFillRef.current;
    const canvas = canvasRef.current;
    if (!root || !starsEl || !particlesEl || !sparkleWrap || !xpFill || !canvas) return;

    // Clear (hot-reload guard)
    starsEl.innerHTML = '';
    particlesEl.innerHTML = '';
    sparkleWrap.innerHTML = '';

    // Respect reduced motion
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // ====== STARS ======
    if (!reduceMotion) {
      for (let i = 0; i < 65; i++) {
        const s = document.createElement('div');
        s.className = 'auth-lu__star';
        const sz = Math.random() * 2.5 + 0.5;
        s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random() * 95}%;left:${Math.random() * 100}%;--d:${2 + Math.random() * 4}s;--delay:-${Math.random() * 5}s;`;
        starsEl.appendChild(s);
      }
    }

    // ====== PARTICLES ======
    const pcols = ['#4f8ef7', '#a855f7', '#f472b6', '#fbbf24', '#7dd3fc'];
    if (!reduceMotion) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'auth-lu__particle';
        const sz = Math.random() * 5 + 2;
        const c = pcols[Math.floor(Math.random() * pcols.length)];
        p.style.cssText = `width:${sz}px;height:${sz}px;background:${c};bottom:${Math.random() * 55}px;left:${8 + Math.random() * 82}%;--d:${4 + Math.random() * 5}s;--delay:-${Math.random() * 9}s;box-shadow:0 0 6px ${c};`;
        particlesEl.appendChild(p);
      }
    }

    // ====== SPARKLES ======
    const scols = ['#fbbf24', '#f472b6', '#4f8ef7', '#a855f7', '#7dd3fc', '#fbbf24', '#f472b6', '#4f8ef7', '#a855f7', '#7dd3fc'];
    if (!reduceMotion) {
      for (let i = 0; i < 10; i++) {
        const sp = document.createElement('div');
        sp.className = 'auth-lu__sp';
        sp.style.cssText = `--a:${i * 36}deg;background:${scols[i]};animation-delay:${i * 0.03}s;`;
        sparkleWrap.appendChild(sp);
      }
    }

    // ====== CANVAS ANIMATION ======
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const RISER = 60;
    const TREAD = 100;
    const STEPS = 5;
    const GROUND_Y = H - 20;
    const BASE_X = 20;

    const steps = [];
    for (let i = 0; i <= STEPS; i++) {
      steps.push({
        x: BASE_X + i * TREAD,
        y: GROUND_Y - i * RISER,
        label: ['START', 'LVL 1', 'LVL 2', 'LVL 3', 'LVL 4', 'LVL 5 ★'][i],
      });
    }

    const stepTopColors = [
      ['#23235e', '#15153e'],
      ['#283279', '#1a2258'],
      ['#1d4786', '#122f68'],
      ['#175a92', '#0e4072'],
      ['#0f6ea0', '#08527c'],
      ['#0882b2', '#065f8c'],
    ];
    const edgeGlows = ['#3d5aff', '#4f72ff', '#5f8fff', '#70afff', '#80cfff', '#98e8ff'];

    const LL = { torso: 30, neck: 5, head: 13, thigh: 26, shin: 23, uArm: 19, fArm: 15, foot: 11 };

    const P = {
      idle: { tl: 0.06, tr: -0.06, sl: 0.1, sr: 0.08, al: -0.12, ar: 0.16, fl: 0.3, fr: 0.25, lean: 0.05, nod: 0 },
      walkA: { tl: 0.48, tr: -0.4, sl: 0.08, sr: 0.52, al: -0.38, ar: 0.42, fl: 0.18, fr: 0.28, lean: 0.13, nod: 0.05 },
      walkB: { tl: -0.4, tr: 0.48, sl: 0.52, sr: 0.08, al: 0.42, ar: -0.38, fl: 0.28, fr: 0.18, lean: 0.13, nod: -0.05 },
      climbReady: { tl: 0.1, tr: -0.12, sl: 0.18, sr: 0.14, al: -0.15, ar: 0.18, fl: 0.32, fr: 0.28, lean: 0.18, nod: 0.06 },
      climbLift: { tl: 0.78, tr: -0.22, sl: 0.06, sr: 0.28, al: -0.45, ar: 0.28, fl: 0.12, fr: 0.4, lean: 0.24, nod: 0.1 },
      climbReach: { tl: 0.52, tr: -0.18, sl: 0.12, sr: 0.2, al: -0.32, ar: 0.24, fl: 0.2, fr: 0.36, lean: 0.22, nod: 0.08 },
      climbPlant: { tl: 0.36, tr: 0.08, sl: 0.22, sr: 0.16, al: 0.18, ar: -0.22, fl: 0.36, fr: 0.22, lean: 0.2, nod: 0.06 },
      climbPush: { tl: 0.14, tr: -0.5, sl: 0.38, sr: 0.58, al: -0.28, ar: 0.46, fl: 0.22, fr: 0.14, lean: 0.26, nod: 0.08 },
      climbSettle: { tl: 0.08, tr: -0.08, sl: 0.14, sr: 0.12, al: -0.1, ar: 0.14, fl: 0.3, fr: 0.26, lean: 0.16, nod: 0.03 },
      celebA: { tl: 0.6, tr: -0.6, sl: 0.08, sr: 0.08, al: -0.9, ar: -0.9, fl: 0.08, fr: 0.08, lean: -0.04, nod: -0.18 },
      celebB: { tl: 0.1, tr: -0.1, sl: 0.1, sr: 0.1, al: -1.3, ar: -1.3, fl: 0.04, fr: 0.04, lean: 0.02, nod: -0.25 },
    };

    function stepHip(i) {
      return { x: steps[i].x + TREAD * 0.52, y: steps[i].y - 2 };
    }

    function buildClimb(from, to, t0, t1) {
      const d = t1 - t0;
      const fH = stepHip(from);
      const tH = stepHip(to);
      const lX = fH.x + 14;
      const lY = fH.y - 7;
      const mX = tH.x - TREAD * 0.22;
      const mY = fH.y - RISER * 0.42;
      const pX = tH.x - 8;
      const pY = tH.y + 3;
      return [
        { t: t0, hx: fH.x, hy: fH.y, p: P.climbReady },
        { t: t0 + d * 0.12, hx: lX, hy: lY, p: P.climbLift },
        { t: t0 + d * 0.28, hx: mX, hy: mY, p: P.climbReach },
        { t: t0 + d * 0.44, hx: pX, hy: pY, p: P.climbPlant },
        { t: t0 + d * 0.62, hx: tH.x - 6, hy: tH.y + 1, p: P.climbPush },
        { t: t0 + d * 0.82, hx: tH.x, hy: tH.y, p: P.climbSettle },
        { t: t1, hx: tH.x, hy: tH.y, p: P.climbSettle },
      ];
    }

    const TOTAL_MS = 14000;
    const KF = [
      { t: 0, hx: BASE_X + 18, hy: GROUND_Y - 2, p: P.idle },
      { t: 0.025, hx: BASE_X + 35, hy: GROUND_Y - 2, p: P.walkA },
      { t: 0.05, hx: stepHip(0).x - 10, hy: stepHip(0).y, p: P.walkB },
      { t: 0.065, hx: stepHip(0).x, hy: stepHip(0).y, p: P.climbReady },
      ...buildClimb(0, 1, 0.065, 0.21),
      ...buildClimb(1, 2, 0.21, 0.355),
      ...buildClimb(2, 3, 0.355, 0.5),
      ...buildClimb(3, 4, 0.5, 0.645),
      ...buildClimb(4, 5, 0.645, 0.79),
      { t: 0.8, hx: stepHip(5).x, hy: stepHip(5).y, p: P.climbSettle },
      { t: 0.82, hx: stepHip(5).x, hy: stepHip(5).y - 7, p: P.celebA },
      { t: 0.84, hx: stepHip(5).x, hy: stepHip(5).y, p: P.celebB },
      { t: 0.86, hx: stepHip(5).x, hy: stepHip(5).y - 8, p: P.celebA },
      { t: 0.878, hx: stepHip(5).x, hy: stepHip(5).y, p: P.celebB },
      { t: 0.9, hx: stepHip(5).x, hy: stepHip(5).y, p: P.climbSettle },
      { t: 0.95, hx: stepHip(5).x, hy: stepHip(5).y, p: P.climbSettle },
      { t: 0.96, hx: BASE_X + 18, hy: GROUND_Y - 2, p: P.idle },
      { t: 1.0, hx: BASE_X + 18, hy: GROUND_Y - 2, p: P.idle },
    ];

    function eio(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function getState(gt) {
      let i = 0;
      while (i < KF.length - 1 && KF[i + 1].t <= gt) i++;
      if (i >= KF.length - 1) return KF[KF.length - 1];
      const a = KF[i];
      const b = KF[i + 1];
      const segLen = b.t - a.t;
      if (segLen < 0.0001) return b;
      const lt = eio((gt - a.t) / segLen);
      const pose = {};
      for (const k of Object.keys(a.p)) pose[k] = lerp(a.p[k], b.p[k], lt);
      return { hx: lerp(a.hx, b.hx, lt), hy: lerp(a.hy, b.hy, lt), pose };
    }

    function limb(x1, y1, len, ang, thick, col) {
      const x2 = x1 + Math.sin(ang) * len;
      const y2 = y1 + Math.cos(ang) * len;
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = thick;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
      return { x: x2, y: y2 };
    }

    function circ(x, y, r, fill) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }

    function drawChar(hx, hy, pose) {
      ctx.save();
      ctx.translate(hx, hy);
      const lean = pose.lean;

      // Shadow
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.ellipse(3, 3, 15, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.restore();

      // BACK LEG
      {
        const thA = lean + pose.tr;
        const tj = limb(1, -3, LL.thigh, thA, 9, '#162d4a');
        const shA = thA - pose.sr;
        const sj = limb(tj.x, tj.y, LL.shin, shA, 8, '#162d4a');
        ctx.save();
        ctx.translate(sj.x, sj.y);
        ctx.rotate(shA + 0.08);
        ctx.beginPath();
        ctx.ellipse(LL.foot * 0.55, 0, LL.foot * 0.7, 4.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#090f1e';
        ctx.fill();
        ctx.restore();
      }

      // BACKPACK
      ctx.save();
      ctx.rotate(lean);
      ctx.beginPath();
      ctx.roundRect(-19, -LL.torso * 0.78, 12, 20, 3);
      ctx.fillStyle = '#1d4ed8';
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-18, -LL.torso * 0.7, 10, 14, 2);
      ctx.fillStyle = '#1a40bc';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-16, -LL.torso * 0.78);
      ctx.lineTo(-13, -LL.torso * 0.1);
      ctx.stroke();
      circ(-13, -LL.torso * 0.44, 1.8, '#60a5fa');
      ctx.restore();

      // BACK ARM
      {
        ctx.save();
        ctx.rotate(lean);
        const uAj = limb(1, -LL.torso * 0.82, LL.uArm, lean + pose.ar, 7, '#1a3d8a');
        const fAj = limb(uAj.x, uAj.y, LL.fArm, lean + pose.ar + pose.fr, 6, '#1a3d8a');
        circ(fAj.x, fAj.y, 4, '#e8c96a');
        ctx.restore();
      }

      // TORSO
      ctx.save();
      ctx.rotate(lean);
      ctx.beginPath();
      ctx.roundRect(-10, -LL.torso, 20, LL.torso, [4, 4, 2, 2]);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-1, -LL.torso + 3);
      ctx.lineTo(-1, -4);
      ctx.stroke();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, -LL.torso + 1);
      ctx.quadraticCurveTo(2, -LL.torso + 5, 8, -LL.torso + 1);
      ctx.stroke();
      ctx.restore();

      // HEAD & NECK
      ctx.save();
      ctx.rotate(lean + (pose.nod * 0.5));
      ctx.beginPath();
      ctx.roundRect(-3, -LL.torso - LL.neck, 6, LL.neck + 2, 2);
      ctx.fillStyle = '#e8c96a';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(3, -LL.torso - LL.neck - LL.head * 0.78, LL.head * 0.68, LL.head * 0.82, lean * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(3, -LL.torso - LL.neck - LL.head * 1.28, LL.head * 0.68, LL.head * 0.5, lean * 0.25, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(-4, -LL.torso - LL.neck - LL.head * 0.7, 3, 4.5, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#e8c060';
      ctx.fill();

      // Grad cap
      const capY = -LL.torso - LL.neck - LL.head * 1.58;
      ctx.save();
      ctx.translate(3, capY);
      ctx.rotate(lean * 0.3);
      ctx.beginPath();
      ctx.roundRect(-13, -3, 27, 5, 1);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-7, -7, 14, 5, 1);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(12, -3);
      ctx.lineTo(17, 5);
      ctx.stroke();
      circ(17, 6, 2.5, '#fbbf24');
      ctx.restore();

      const eX = 3 + LL.head * 0.44 * Math.cos(lean * 0.25);
      const eY = -LL.torso - LL.neck - LL.head * 0.95;
      circ(eX, eY, 2.2, '#1e293b');
      circ(eX + 0.6, eY - 0.5, 0.9, 'white');
      circ(eX + 5.5, eY + 4.5, 1.4, '#c8a050');
      ctx.restore();

      // FRONT LEG
      {
        const thA = lean + pose.tl;
        const tj = limb(1, -3, LL.thigh, thA, 10, '#274d7a');
        const shA = thA - pose.sl;
        const sj = limb(tj.x, tj.y, LL.shin, shA, 9, '#274d7a');
        ctx.save();
        ctx.translate(sj.x, sj.y);
        ctx.rotate(shA + 0.05);
        ctx.beginPath();
        ctx.ellipse(LL.foot * 0.62, 0, LL.foot * 0.82, 5.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2540';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(LL.foot * 0.7, -1.5, LL.foot * 0.4, 2.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.09)';
        ctx.fill();
        ctx.restore();
      }

      // FRONT ARM
      {
        ctx.save();
        ctx.rotate(lean);
        const uAj = limb(3, -LL.torso * 0.86, LL.uArm, lean + pose.al, 8, '#2d6adf');
        const fAj = limb(uAj.x, uAj.y, LL.fArm, lean + pose.al + pose.fl, 7, '#2d6adf');
        circ(fAj.x, fAj.y, 4.8, '#fde68a');
        ctx.save();
        ctx.translate(fAj.x + 2, fAj.y - 1);
        ctx.rotate(lean + pose.al + pose.fl - 0.55);
        ctx.beginPath();
        ctx.roundRect(-4, -10, 10, 15, 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.25)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(1, -8);
        ctx.lineTo(1, 4);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-2, -5);
        ctx.lineTo(5, -5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, -2);
        ctx.lineTo(5, -2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, 1);
        ctx.lineTo(3, 1);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      }

      ctx.restore();
    }

    function drawStairs(glowPhase) {
      for (let i = 0; i <= STEPS; i++) {
        const s = steps[i];
        const sw = W - s.x + 8;
        const grd = ctx.createLinearGradient(s.x, s.y, s.x, s.y + RISER);
        grd.addColorStop(0, stepTopColors[i][0]);
        grd.addColorStop(1, stepTopColors[i][1]);
        ctx.beginPath();
        ctx.roundRect(s.x, s.y, sw, H - s.y + 10, [3, 3, 0, 0]);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(s.x, s.y, sw, RISER * 0.15, [3, 3, 0, 0]);
        ctx.fillStyle = 'rgba(255,255,255,.035)';
        ctx.fill();
        const ga = 0.3 + 0.4 * Math.sin(glowPhase + i * 0.85);
        ctx.beginPath();
        ctx.moveTo(s.x + 4, s.y + 1.5);
        ctx.lineTo(s.x + sw - 4, s.y + 1.5);
        ctx.strokeStyle = edgeGlows[i];
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = ga;
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(s.x + 1, s.y);
          ctx.lineTo(s.x + 1, s.y + RISER);
          ctx.strokeStyle = edgeGlows[i];
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = ga * 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        ctx.fillStyle = `rgba(255,255,255,${(0.28 + i * 0.04).toFixed(2)})`;
        ctx.textAlign = 'left';
        ctx.fillText(s.label, s.x + 8, s.y + RISER - 7);
      }
    }

    let footGlows = [];
    function addFootGlow(x, y, col) {
      footGlows.push({ x, y, alpha: 0.85, col });
    }
    function drawFootGlows() {
      footGlows = footGlows.filter((g) => g.alpha > 0.01);
      for (const g of footGlows) {
        ctx.beginPath();
        ctx.ellipse(g.x, g.y, 14, 4.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = g.col;
        ctx.globalAlpha = g.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        g.alpha *= 0.91;
      }
    }

    let startTime = null;
    let prevStepIdx = 0;
    let glowPhase = 0;
    let raf = 0;

    function getStepIdx(hx) {
      for (let i = STEPS; i >= 0; i--) if (hx >= steps[i].x - 5) return i;
      return 0;
    }

    function loop(ts) {
      if (reduceMotion) return;
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) % TOTAL_MS;
      const gt = elapsed / TOTAL_MS;
      glowPhase += 0.025;

      ctx.clearRect(0, 0, W, H);
      drawStairs(glowPhase);
      drawFootGlows();

      const st = getState(gt);
      const hx = st.hx;
      const hy = st.hy;

      const ci = getStepIdx(hx);
      if (ci !== prevStepIdx) {
        addFootGlow(hx + 12, steps[ci].y + 3, edgeGlows[ci]);
        prevStepIdx = ci;
      }

      let ca = 1;
      if (gt > 0.955) ca = 1 - (gt - 0.955) / 0.045;
      else if (gt < 0.025) ca = gt / 0.025;

      ctx.globalAlpha = ca;
      const bob = Math.sin(ts / 190) * 1.4;
      drawChar(hx, hy + bob * 0.4, st.pose);
      ctx.globalAlpha = 1;

      const xp = Math.min(gt / 0.86, 1) * 100;
      xpFill.style.width = `${gt < 0.96 ? xp : 0}%`;

      raf = requestAnimationFrame(loop);
    }

    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="auth-animation" ref={rootRef}>
      <div className="auth-lu__scene">
        <div className="auth-lu__stars" ref={starsRef} />
        <div className="auth-lu__particles" ref={particlesRef} />

        <div className="auth-lu__title">
          <div className="auth-lu__h1">Level Up</div>
          <div className="auth-lu__p">Every step is a new skill unlocked</div>
        </div>

        <div className="auth-lu__ground" />
        <canvas ref={canvasRef} className="auth-lu__canvas" width="700" height="440" />

        <div className="auth-lu__badge" style={{ left: 68, bottom: 162, borderColor: '#4f8ef7', boxShadow: '0 0 12px #4f8ef7', animationDelay: '0s' }}>📖 Basics</div>
        <div className="auth-lu__badge" style={{ left: 160, bottom: 222, borderColor: '#4f8ef7', boxShadow: '0 0 12px #4f8ef7', animationDelay: '2.4s' }}>💡 Problem Solving</div>
        <div className="auth-lu__badge" style={{ left: 252, bottom: 282, borderColor: '#a855f7', boxShadow: '0 0 12px #a855f7', animationDelay: '4.8s' }}>⚙️ Building Projects</div>
        <div className="auth-lu__badge" style={{ left: 344, bottom: 342, borderColor: '#a855f7', boxShadow: '0 0 12px #a855f7', animationDelay: '7.2s' }}>🚀 Advanced Skills</div>
        <div className="auth-lu__badge" style={{ left: 435, bottom: 402, borderColor: '#f472b6', boxShadow: '0 0 12px #f472b6', animationDelay: '9.6s' }}>🏆 Mastery</div>

        <div className="auth-lu__sparkle" style={{ left: 610, bottom: 468 }} ref={sparkleWrapRef} />

        <div className="auth-lu__chip" style={{ right: 45, bottom: 138, borderColor: '#4f8ef7', color: '#4f8ef7', '--d': '12s', '--delay': '1s' }}>HTML / CSS</div>
        <div className="auth-lu__chip" style={{ right: 45, bottom: 204, borderColor: '#a855f7', color: '#a855f7', '--d': '12s', '--delay': '3.5s' }}>JavaScript</div>
        <div className="auth-lu__chip" style={{ right: 45, bottom: 270, borderColor: '#f472b6', color: '#f472b6', '--d': '12s', '--delay': '6s' }}>React ⚛</div>
        <div className="auth-lu__chip" style={{ right: 45, bottom: 336, borderColor: '#fbbf24', color: '#fbbf24', '--d': '12s', '--delay': '8.5s' }}>Full Stack 🚀</div>

        <div className="auth-lu__xp">
          <div className="auth-lu__xpLabel">XP PROGRESS ▸▸▸</div>
          <div className="auth-lu__xpTrack">
            <div className="auth-lu__xpFill" ref={xpFillRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AnimationPanel);

