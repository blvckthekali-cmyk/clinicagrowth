/* =====================================================================
   ClinicAI Growth — Chat DEMO interactivo (nativo, sin dependencias)
   Simula al asistente de una clínica: responde SOLO temas de clínica
   (citas, precios, horarios, tratamientos, urgencias, ubicación) con
   respuestas instantáneas guionizadas. Expone window.DemoChat.
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------- Guiones por idioma ------------------------- */
  var DATA = {
    es: {
      greeting: "¡Hola! 👋 Soy el asistente IA de la clínica. Respondo al instante, a cualquier hora. ¿En qué te ayudo?",
      chips: [
        { l: "Pedir cita", i: "cita" },
        { l: "Ver precios", i: "precios" },
        { l: "Horarios", i: "horarios" },
        { l: "Tratamientos", i: "servicios" },
        { l: "Tengo dolor", i: "urgencia" }
      ],
      fallback: "Soy el asistente de la clínica y solo puedo ayudarte con temas de la clínica: citas, precios, horarios, tratamientos o urgencias 😊 ¿Por dónde empezamos?",
      intents: [
        {
          id: "urgencia",
          kw: ["dolor", "duele", "urgen", "emergencia", "roto", "rota", "muela", "sangra", "inflam"],
          reply: "Vaya, siento que tengas molestias 😟 Las urgencias las atendemos <strong>el mismo día</strong>. Tengo un hueco hoy a las <strong>18:15</strong>. ¿Te lo reservo?",
          options: [{ l: "Sí, resérvalo", i: "slot_urgente" }, { l: "No, gracias", i: "gracias" }]
        },
        {
          id: "cita",
          kw: ["cita", "reserv", "agend", "hueco", "disponib", "visita", "pedir hora", "quiero ir"],
          reply: "¡Genial! 🙌 Tengo estos huecos libres esta semana. ¿Cuál te viene mejor?",
          options: [{ l: "Jueves 10:30", i: "slot_jueves" }, { l: "Viernes 17:00", i: "slot_viernes" }, { l: "Otro día", i: "otro_dia" }]
        },
        {
          id: "precios",
          kw: ["precio", "cuesta", "cuanto", "tarifa", "coste", "vale", "presupuesto"],
          reply: "Estos son nuestros precios más habituales:<br>• Primera visita + diagnóstico: <strong>gratis</strong><br>• Limpieza dental: <strong>45 €</strong><br>• Blanqueamiento: <strong>150 €</strong><br>• Ortodoncia invisible: <strong>desde 1.900 €</strong><br><br>¿Quieres que te reserve la primera visita gratuita?",
          options: [{ l: "Sí, pedir cita", i: "cita" }, { l: "Ver horarios", i: "horarios" }]
        },
        {
          id: "horarios",
          kw: ["horario", "abris", "abren", "abierto", "cerrais", "cierran", "que hora"],
          reply: "Nuestro horario:<br>• Lunes a viernes: <strong>9:00–20:00</strong><br>• Sábados: <strong>10:00–14:00</strong><br><br>¿Te reservo una cita?",
          options: [{ l: "Sí, pedir cita", i: "cita" }, { l: "Dónde estáis", i: "ubicacion" }]
        },
        {
          id: "ubicacion",
          kw: ["donde", "ubicac", "direccion", "llegar", "mapa", "calle", "estais"],
          reply: "Estamos en <strong>Viladecans (Barcelona)</strong>, a 2 minutos de la estación, con parking gratuito para pacientes 🚗<br><br>¿Quieres venir a conocernos? Te reservo una primera visita gratis.",
          options: [{ l: "Sí, pedir cita", i: "cita" }, { l: "Ver horarios", i: "horarios" }]
        },
        {
          id: "servicios",
          kw: ["tratamiento", "servicio", "haceis", "ofrec", "implante", "ortodoncia", "blanque", "limpieza", "invisalign", "carilla", "empaste"],
          reply: "Ofrecemos:<br>• Limpiezas y revisiones<br>• Blanqueamiento dental<br>• Ortodoncia invisible<br>• Implantes<br>• Estética dental<br><br>¿Te reservo una valoración gratuita?",
          options: [{ l: "Sí, pedir cita", i: "cita" }, { l: "Ver precios", i: "precios" }]
        },
        {
          id: "gracias",
          kw: ["gracias", "perfecto", "genial", "adios", "hasta luego", "chao"],
          reply: "¡A ti! 😊 Aquí estoy 24/7 para lo que necesites. ¡Hasta pronto!",
          options: "main"
        },
        {
          id: "hola",
          kw: ["hola", "buenas", "buenos dias", "hey"],
          reply: "¡Hola! 😊 Encantado de saludarte. Puedo reservarte cita, darte precios, horarios o resolver dudas sobre tratamientos. ¿Qué necesitas?",
          options: "main"
        },
        /* --- Solo accesibles por botón (confirmaciones) --- */
        {
          id: "slot_jueves", kw: [],
          reply: "¡Reservado! ✅ Cita confirmada para el <strong>jueves a las 10:30</strong>. Te enviaré un recordatorio por WhatsApp el día antes. ¿Necesitas algo más?",
          options: "main"
        },
        {
          id: "slot_viernes", kw: [],
          reply: "¡Reservado! ✅ Cita confirmada para el <strong>viernes a las 17:00</strong>. Te enviaré un recordatorio por WhatsApp el día antes. ¿Necesitas algo más?",
          options: "main"
        },
        {
          id: "slot_urgente", kw: [],
          reply: "¡Hecho! ✅ Te espero <strong>hoy a las 18:15</strong>. Trae tu DNI y, si tienes, radiografías previas. ¡Que te mejores! 💙",
          options: "main"
        },
        {
          id: "otro_dia", kw: [],
          reply: "Claro 😊 También tengo hueco el <strong>lunes a las 9:00</strong> o el <strong>martes a las 16:30</strong>. ¿Te va bien alguno?",
          options: [{ l: "Lunes 9:00", i: "slot_lunes" }, { l: "Martes 16:30", i: "slot_martes" }]
        },
        {
          id: "slot_lunes", kw: [],
          reply: "¡Reservado! ✅ Cita confirmada para el <strong>lunes a las 9:00</strong>. Te enviaré un recordatorio por WhatsApp el día antes. ¿Necesitas algo más?",
          options: "main"
        },
        {
          id: "slot_martes", kw: [],
          reply: "¡Reservado! ✅ Cita confirmada para el <strong>martes a las 16:30</strong>. Te enviaré un recordatorio por WhatsApp el día antes. ¿Necesitas algo más?",
          options: "main"
        }
      ]
    },

    en: {
      greeting: "Hi! 👋 I'm the clinic's AI assistant. I reply instantly, any time of day. How can I help?",
      chips: [
        { l: "Book appointment", i: "cita" },
        { l: "See prices", i: "precios" },
        { l: "Opening hours", i: "horarios" },
        { l: "Treatments", i: "servicios" },
        { l: "I'm in pain", i: "urgencia" }
      ],
      fallback: "I'm the clinic's assistant, so I can only help with clinic topics: appointments, prices, opening hours, treatments or emergencies 😊 Where shall we start?",
      intents: [
        {
          id: "urgencia",
          kw: ["pain", "hurt", "urgent", "emergency", "broken", "tooth", "ache", "swollen", "bleed"],
          reply: "I'm sorry you're in pain 😟 We handle emergencies <strong>same day</strong>. I have a slot today at <strong>18:15</strong>. Shall I book it for you?",
          options: [{ l: "Yes, book it", i: "slot_urgente" }, { l: "No, thanks", i: "gracias" }]
        },
        {
          id: "cita",
          kw: ["appointment", "book", "schedule", "slot", "availab", "visit", "see you"],
          reply: "Great! 🙌 I have these slots free this week. Which works best for you?",
          options: [{ l: "Thursday 10:30", i: "slot_jueves" }, { l: "Friday 17:00", i: "slot_viernes" }, { l: "Another day", i: "otro_dia" }]
        },
        {
          id: "precios",
          kw: ["price", "cost", "how much", "fee", "quote", "expensive"],
          reply: "These are our most common prices:<br>• First visit + diagnosis: <strong>free</strong><br>• Dental cleaning: <strong>€45</strong><br>• Whitening: <strong>€150</strong><br>• Invisible orthodontics: <strong>from €1,900</strong><br><br>Shall I book your free first visit?",
          options: [{ l: "Yes, book me in", i: "cita" }, { l: "Opening hours", i: "horarios" }]
        },
        {
          id: "horarios",
          kw: ["hours", "open", "close", "when", "schedule"],
          reply: "Our opening hours:<br>• Monday to Friday: <strong>9:00–20:00</strong><br>• Saturdays: <strong>10:00–14:00</strong><br><br>Shall I book you an appointment?",
          options: [{ l: "Yes, book me in", i: "cita" }, { l: "Where are you?", i: "ubicacion" }]
        },
        {
          id: "ubicacion",
          kw: ["where", "location", "address", "directions", "map", "find you"],
          reply: "We're in <strong>Viladecans (Barcelona)</strong>, 2 minutes from the station, with free patient parking 🚗<br><br>Want to come meet us? I can book you a free first visit.",
          options: [{ l: "Yes, book me in", i: "cita" }, { l: "Opening hours", i: "horarios" }]
        },
        {
          id: "servicios",
          kw: ["treatment", "service", "offer", "implant", "orthodont", "whiten", "cleaning", "invisalign", "veneer", "filling"],
          reply: "We offer:<br>• Cleanings and check-ups<br>• Teeth whitening<br>• Invisible orthodontics<br>• Implants<br>• Cosmetic dentistry<br><br>Shall I book you a free assessment?",
          options: [{ l: "Yes, book me in", i: "cita" }, { l: "See prices", i: "precios" }]
        },
        {
          id: "gracias",
          kw: ["thank", "perfect", "great", "bye", "goodbye"],
          reply: "You're welcome! 😊 I'm here 24/7 whenever you need me. See you soon!",
          options: "main"
        },
        {
          id: "hola",
          kw: ["hello", "hi", "hey", "good morning"],
          reply: "Hello! 😊 Nice to meet you. I can book appointments, share prices and opening hours, or answer questions about treatments. What do you need?",
          options: "main"
        },
        {
          id: "slot_jueves", kw: [],
          reply: "Booked! ✅ Appointment confirmed for <strong>Thursday at 10:30</strong>. I'll send you a WhatsApp reminder the day before. Anything else?",
          options: "main"
        },
        {
          id: "slot_viernes", kw: [],
          reply: "Booked! ✅ Appointment confirmed for <strong>Friday at 17:00</strong>. I'll send you a WhatsApp reminder the day before. Anything else?",
          options: "main"
        },
        {
          id: "slot_urgente", kw: [],
          reply: "Done! ✅ See you <strong>today at 18:15</strong>. Bring your ID and any previous X-rays if you have them. Get well soon! 💙",
          options: "main"
        },
        {
          id: "otro_dia", kw: [],
          reply: "Of course 😊 I also have <strong>Monday at 9:00</strong> or <strong>Tuesday at 16:30</strong> free. Do either of those work?",
          options: [{ l: "Monday 9:00", i: "slot_lunes" }, { l: "Tuesday 16:30", i: "slot_martes" }]
        },
        {
          id: "slot_lunes", kw: [],
          reply: "Booked! ✅ Appointment confirmed for <strong>Monday at 9:00</strong>. I'll send you a WhatsApp reminder the day before. Anything else?",
          options: "main"
        },
        {
          id: "slot_martes", kw: [],
          reply: "Booked! ✅ Appointment confirmed for <strong>Tuesday at 16:30</strong>. I'll send you a WhatsApp reminder the day before. Anything else?",
          options: "main"
        }
      ]
    },

    ca: {
      greeting: "Hola! 👋 Soc l'assistent IA de la clínica. Responc a l'instant, a qualsevol hora. En què et puc ajudar?",
      chips: [
        { l: "Demanar cita", i: "cita" },
        { l: "Veure preus", i: "precios" },
        { l: "Horaris", i: "horarios" },
        { l: "Tractaments", i: "servicios" },
        { l: "Tinc dolor", i: "urgencia" }
      ],
      fallback: "Soc l'assistent de la clínica i només et puc ajudar amb temes de la clínica: cites, preus, horaris, tractaments o urgències 😊 Per on comencem?",
      intents: [
        {
          id: "urgencia",
          kw: ["dolor", "fa mal", "urgen", "emergencia", "trencat", "trencada", "queixal", "sagna", "inflam"],
          reply: "Vaja, em sap greu que tinguis molèsties 😟 Les urgències les atenem <strong>el mateix dia</strong>. Tinc un forat avui a les <strong>18:15</strong>. T'ho reservo?",
          options: [{ l: "Sí, reserva-ho", i: "slot_urgente" }, { l: "No, gràcies", i: "gracias" }]
        },
        {
          id: "cita",
          kw: ["cita", "reserv", "agend", "forat", "disponib", "visita", "demanar hora"],
          reply: "Genial! 🙌 Tinc aquests forats lliures aquesta setmana. Quin et va millor?",
          options: [{ l: "Dijous 10:30", i: "slot_jueves" }, { l: "Divendres 17:00", i: "slot_viernes" }, { l: "Un altre dia", i: "otro_dia" }]
        },
        {
          id: "precios",
          kw: ["preu", "costa", "quant", "tarifa", "cost", "val", "pressupost"],
          reply: "Aquests són els nostres preus més habituals:<br>• Primera visita + diagnòstic: <strong>gratis</strong><br>• Neteja dental: <strong>45 €</strong><br>• Blanquejament: <strong>150 €</strong><br>• Ortodòncia invisible: <strong>des de 1.900 €</strong><br><br>Vols que et reservi la primera visita gratuïta?",
          options: [{ l: "Sí, demanar cita", i: "cita" }, { l: "Veure horaris", i: "horarios" }]
        },
        {
          id: "horarios",
          kw: ["horari", "obriu", "obren", "obert", "tanqueu", "tanquen", "quina hora"],
          reply: "El nostre horari:<br>• Dilluns a divendres: <strong>9:00–20:00</strong><br>• Dissabtes: <strong>10:00–14:00</strong><br><br>Et reservo una cita?",
          options: [{ l: "Sí, demanar cita", i: "cita" }, { l: "On sou?", i: "ubicacion" }]
        },
        {
          id: "ubicacion",
          kw: ["on sou", "on esteu", "ubicac", "adreça", "arribar", "mapa", "carrer"],
          reply: "Som a <strong>Viladecans (Barcelona)</strong>, a 2 minuts de l'estació, amb pàrquing gratuït per a pacients 🚗<br><br>Vols venir a conèixer-nos? Et reservo una primera visita gratis.",
          options: [{ l: "Sí, demanar cita", i: "cita" }, { l: "Veure horaris", i: "horarios" }]
        },
        {
          id: "servicios",
          kw: ["tractament", "servei", "feu", "oferiu", "implant", "ortodoncia", "blanque", "neteja", "invisalign", "carilla", "empastament"],
          reply: "Oferim:<br>• Neteges i revisions<br>• Blanquejament dental<br>• Ortodòncia invisible<br>• Implants<br>• Estètica dental<br><br>Et reservo una valoració gratuïta?",
          options: [{ l: "Sí, demanar cita", i: "cita" }, { l: "Veure preus", i: "precios" }]
        },
        {
          id: "gracias",
          kw: ["gracies", "perfecte", "genial", "adeu", "fins aviat"],
          reply: "A tu! 😊 Soc aquí 24/7 per al que necessitis. Fins aviat!",
          options: "main"
        },
        {
          id: "hola",
          kw: ["hola", "bones", "bon dia", "ei"],
          reply: "Hola! 😊 Encantat de saludar-te. Puc reservar-te cita, donar-te preus, horaris o resoldre dubtes sobre tractaments. Què necessites?",
          options: "main"
        },
        {
          id: "slot_jueves", kw: [],
          reply: "Reservat! ✅ Cita confirmada per al <strong>dijous a les 10:30</strong>. T'enviaré un recordatori per WhatsApp el dia abans. Necessites res més?",
          options: "main"
        },
        {
          id: "slot_viernes", kw: [],
          reply: "Reservat! ✅ Cita confirmada per al <strong>divendres a les 17:00</strong>. T'enviaré un recordatori per WhatsApp el dia abans. Necessites res més?",
          options: "main"
        },
        {
          id: "slot_urgente", kw: [],
          reply: "Fet! ✅ T'espero <strong>avui a les 18:15</strong>. Porta el DNI i, si en tens, radiografies prèvies. Que et milloris! 💙",
          options: "main"
        },
        {
          id: "otro_dia", kw: [],
          reply: "És clar 😊 També tinc forat el <strong>dilluns a les 9:00</strong> o el <strong>dimarts a les 16:30</strong>. Et va bé algun?",
          options: [{ l: "Dilluns 9:00", i: "slot_lunes" }, { l: "Dimarts 16:30", i: "slot_martes" }]
        },
        {
          id: "slot_lunes", kw: [],
          reply: "Reservat! ✅ Cita confirmada per al <strong>dilluns a les 9:00</strong>. T'enviaré un recordatori per WhatsApp el dia abans. Necessites res més?",
          options: "main"
        },
        {
          id: "slot_martes", kw: [],
          reply: "Reservat! ✅ Cita confirmada per al <strong>dimarts a les 16:30</strong>. T'enviaré un recordatori per WhatsApp el dia abans. Necessites res més?",
          options: "main"
        }
      ]
    }
  };

  /* --------------------------- Motor del chat --------------------------- */
  var lang = 'es';
  var ready = false;
  var msgBox, chipBox, formEl, inputEl;
  var busy = false;

  function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function dict() { return DATA[lang] || DATA.es; }

  function findIntentById(id) {
    var list = dict().intents;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function matchIntent(text) {
    var n = normalize(text);
    var list = dict().intents;
    for (var i = 0; i < list.length; i++) {
      var kws = list[i].kw;
      for (var j = 0; j < kws.length; j++) {
        if (kws[j] && n.indexOf(normalize(kws[j])) !== -1) return list[i];
      }
    }
    return null;
  }

  function scrollToBottom() {
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function addUserMsg(text) {
    var el = document.createElement('div');
    el.className = 'dc-msg dc-out';
    el.textContent = text; // texto plano: nunca HTML del usuario
    msgBox.appendChild(el);
    scrollToBottom();
  }

  function addBotMsg(html, seconds) {
    var el = document.createElement('div');
    el.className = 'dc-msg dc-in';
    el.innerHTML = html; // contenido propio del guion (seguro)
    msgBox.appendChild(el);
    if (seconds) {
      var meta = document.createElement('span');
      meta.className = 'dc-meta';
      meta.innerHTML = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> ' + seconds;
      msgBox.appendChild(meta);
    }
    scrollToBottom();
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'typing dc-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgBox.appendChild(el);
    scrollToBottom();
    return el;
  }

  function renderChips(options) {
    chipBox.innerHTML = '';
    var list = (options === 'main' || !options) ? dict().chips : options;
    list.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dc-chip';
      btn.textContent = opt.l;
      btn.addEventListener('click', function () {
        if (busy) return;
        handleIntent(findIntentById(opt.i), opt.l);
      });
      chipBox.appendChild(btn);
    });
  }

  function respond(intent) {
    busy = true;
    chipBox.innerHTML = '';
    var typing = showTyping();
    // Retardo proporcional a la longitud de la respuesta: se percibe como
    // "escribiendo" en vez de instantáneo-robótico. Corto ~1,2 s, largo ~2,6 s.
    var plain = (intent ? intent.reply : dict().fallback).replace(/<[^>]*>/g, '');
    var delay = Math.min(2600, 750 + plain.length * 9 + Math.random() * 350);
    setTimeout(function () {
      typing.remove();
      var secs = (delay / 1000).toFixed(1);
      if (lang !== 'en') secs = secs.replace('.', ',');
      var d = dict();
      var reply = intent ? intent.reply : d.fallback;
      var options = intent ? intent.options : 'main';
      addBotMsg(reply, secs + ' s');
      renderChips(options);
      busy = false;
    }, delay);
  }

  function handleIntent(intent, userLabel) {
    if (userLabel) addUserMsg(userLabel);
    respond(intent);
  }

  function handleFreeText(text) {
    addUserMsg(text);
    respond(matchIntent(text));
  }

  function startConversation() {
    msgBox.innerHTML = '';
    chipBox.innerHTML = '';
    busy = true;
    var typing = showTyping();
    setTimeout(function () {
      typing.remove();
      addBotMsg(dict().greeting, null);
      renderChips('main');
      busy = false;
    }, 900);
  }

  window.DemoChat = {
    init: function (initialLang) {
      msgBox = document.getElementById('demo-chat-messages');
      chipBox = document.getElementById('demo-chat-chips');
      formEl = document.getElementById('demo-chat-form');
      inputEl = document.getElementById('demo-chat-input');
      if (!msgBox || !chipBox || !formEl || !inputEl) return;

      if (initialLang && DATA[initialLang]) lang = initialLang;

      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = inputEl.value.trim();
        if (!text || busy) return;
        inputEl.value = '';
        handleFreeText(text);
      });

      ready = true;
      startConversation();
    },
    setLang: function (newLang) {
      if (!ready || !DATA[newLang] || newLang === lang) return;
      lang = newLang;
      startConversation();
    }
  };
})();
