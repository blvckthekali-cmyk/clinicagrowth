/* =====================================================================
   ClinicAI Growth — red neuronal del hero (canvas)
   Nodos que derivan lentamente, se conectan con líneas finas cuando se
   acercan y por las conexiones viajan impulsos "eléctricos" (azul, y
   dorado de vez en cuando).
   Minimalista: opacidades bajas, pocos nodos, pausa fuera de pantalla.
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('neural-canvas');
  var hero = document.getElementById('hero');
  if (!canvas || !hero) return;
  if (reduced) { canvas.remove(); return; }

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var nodes = [], pulses = [];
  var LINK = 150;                 // distancia máxima de conexión (px)
  var running = false, rafId = null;

  function resize() {
    var r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.round(Math.min(55, Math.max(20, (W * H) / 26000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 1.5
      });
    }
    pulses = [];
  }

  function spawnPulse() {
    for (var tries = 0; tries < 12; tries++) {
      var a = nodes[(Math.random() * nodes.length) | 0];
      var b = nodes[(Math.random() * nodes.length) | 0];
      if (a === b) continue;
      var dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy < LINK * LINK) {
        pulses.push({
          a: a, b: b, t: 0,
          speed: 0.012 + Math.random() * 0.018,
          gold: Math.random() < 0.18
        });
        return;
      }
    }
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    var i, j, n, m, dx, dy, d2;

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j];
        dx = n.x - m.x; dy = n.y - m.y; d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          var alpha = (1 - Math.sqrt(d2) / LINK) * 0.14;
          ctx.strokeStyle = 'rgba(30,107,230,' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(30,107,230,0.45)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
    }

    // Impulsos eléctricos recorriendo conexiones
    if (Math.random() < 0.04 && pulses.length < 5) spawnPulse();
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }
      var px = p.a.x + (p.b.x - p.a.x) * p.t;
      var py = p.a.y + (p.b.y - p.a.y) * p.t;
      var col = p.gold ? '200,169,110' : '30,107,230';
      var g = ctx.createRadialGradient(px, py, 0, px, py, 9);
      g.addColorStop(0, 'rgba(' + col + ',0.8)');
      g.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(' + col + ',0.95)';
      ctx.beginPath(); ctx.arc(px, py, 1.6, 0, 6.2832); ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { start(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(hero);
  } else {
    start();
  }

  resize();
})();
