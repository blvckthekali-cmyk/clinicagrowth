/* =====================================================================
   ClinicAI Growth — escena "El coste de no responder"
   Línea de tiempo de ~14 s en dos actos (sin sistema / con sistema).
   Se reproduce sola al entrar en pantalla, en bucle, con botón de
   pausa y barra de progreso. Con prefers-reduced-motion (o sin JS)
   se muestra la escena completa, estática.
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene = document.getElementById('story-scene');
  var toggleBtn = document.getElementById('story-toggle');
  var progressBar = document.getElementById('story-progress');
  if (!scene) return;

  // Sin animación: la escena queda visible al completo tal cual está en el HTML.
  if (reduced) {
    var controls = document.querySelector('.story-controls');
    if (controls) controls.remove();
    scene.classList.add('st-swap');
    return;
  }

  var STEPS = [
    { t: 400,   cls: 'st-m1' },     // paciente escribe
    { t: 2100,  cls: 'st-seen' },   // visto · hace horas
    { t: 3900,  cls: 'st-m2' },     // se va a otra clínica
    { t: 5400,  cls: 'st-lost' },   // sello: paciente perdido
    { t: 7000,  cls: 'st-swap' },   // foco al acto 2
    { t: 7800,  cls: 'st-m3' },     // mismo mensaje
    { t: 9000,  cls: 'st-r1' },     // respuesta al instante
    { t: 9800,  cls: 'st-r1meta' }, // "respondido en 9 s"
    { t: 11100, cls: 'st-m4' },     // perfecto, reservado
    { t: 12300, cls: 'st-won' }     // sello: cita confirmada
  ];
  var DURATION = 14500;

  var timers = [];
  var playing = false;
  var startAt = 0;
  var progRaf = null;

  scene.classList.add('st-armed'); // a partir de aquí los pasos parten ocultos

  function resetSteps() {
    STEPS.forEach(function (s) { scene.classList.remove(s.cls); });
  }
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (progRaf) cancelAnimationFrame(progRaf);
  }
  function tickProgress() {
    if (!playing) return;
    var p = Math.min(1, (performance.now() - startAt) / DURATION);
    if (progressBar) progressBar.style.width = (p * 100).toFixed(2) + '%';
    progRaf = requestAnimationFrame(tickProgress);
  }

  function play() {
    clearTimers();
    resetSteps();
    playing = true;
    scene.classList.add('st-playing');
    startAt = performance.now();
    STEPS.forEach(function (s) {
      timers.push(setTimeout(function () { scene.classList.add(s.cls); }, s.t));
    });
    timers.push(setTimeout(function () { if (playing) play(); }, DURATION)); // bucle
    tickProgress();
  }

  function pause() {
    playing = false;
    clearTimers();
    scene.classList.remove('st-playing');
  }

  // Auto-reproducción al entrar en pantalla; pausa al salir.
  // Si el usuario pausa a mano, no se reanuda sola hasta que pulse play.
  var userPaused = false;
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (playing) { pause(); userPaused = true; }
      else { userPaused = false; play(); }
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!playing && !userPaused) play();
      } else if (playing) {
        pause();
        userPaused = false; // al volver a entrar se reanuda sola
      }
    }, { threshold: 0.35 }).observe(scene);
  } else {
    play();
  }
})();
