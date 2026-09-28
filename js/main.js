/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'eb-estetica-benessere-giambellino',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si prenota su Treatwell o si chiama (02 4771 9196)
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): martedì–venerdì 9–20, sabato 9–19; domenica e lunedì chiuso (Treatwell prenota 8–21: da chiedere) */
    hours: {
      0: [],
      1: [],
      2: [['09:00', '20:00']],
      3: [['09:00', '20:00']],
      4: [['09:00', '20:00']],
      5: [['09:00', '20:00']],
      6: [['09:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "E & B Estetica e Benessere, back to the top",
      "m.nav": "The hours of the day",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.cera": "Waxing",
      "n.mani": "Hands and feet",
      "n.viso": "Face and body",
      "n.laser": "Laser",
      "n.dicono": "Reviews",
      "n.centro": "The salon",
      "n.orari": "Hours",
      "t.prenota": "Book",
      "t.chiama": "Call",
      "h.sopra": "Estetica & Benessere",
      "h.dove": "· Via Giambellino 41, since 2000",
      "h.titolo": "Time for a little pampering?",
      "h.testo": "Waxing and Brazilian waxing, hands and feet, face, body, massages and laser: the beauty salon on Via Giambellino since December 2000. Every treatment has its own time, and you book it.",
      "h.ng": "4.7",
      "h.vg": "117 reviews on Google",
      "h.nt": "4.9",
      "h.vt": "1,061 verified reviews on Treatwell",
      "h.prenota": "Book online",
      "ag.nota": "A day in the appointment book: the treatments and the durations are theirs, the appointments are an example.",
      "ag.fonte": "Alice Kirin, on Google (“it’s best to book at least a couple of weeks ahead”)",
      "ag.giorno": "A day",
      "ag.c1": "Waxing",
      "ag.c2": "Hands and feet",
      "ag.c3": "Face and body",
      "ag.aria": "A day in the appointment book, from 9 am to 8 pm: thirty-one appointments for waxing, hands and feet, face and body",
      "ce.titolo": "Waxing",
      "ce.sotto": "Hair removal is their speciality, with traditional wax and with Brazilian wax: from the eyebrows to the full leg.",
      "ce.t1": "Wax",
      "ce.t2": "Brazilian wax",
      "ce.t3": "Eyebrows",
      "ce.labbro": "Upper lip",
      "ce.sopracciglia": "Eyebrows",
      "ce.ascelle": "Underarms",
      "ce.braccio": "Full arm",
      "ce.inguine": "Bikini line",
      "ce.inguineTot": "Full bikini",
      "ce.glutei": "Buttocks",
      "ce.coscia": "Thigh",
      "ce.mezza": "Half leg",
      "ce.schiena": "Back",
      "ce.petto": "Chest",
      "ce.gamba": "Full leg",
      "ce.labiale": "Lip",
      "ce.braccia": "Arms",
      "ce.gambaInf": "Lower leg",
      "ce.sgambato": "High-cut bikini",
      "ce.gluteo": "Buttocks",
      "ce.gambaIntera": "Full leg",
      "ce.sop1": "Eyebrow waxing",
      "ce.sop2": "Eyebrow shaping and waxing",
      "ce.legenda": "= a quarter of an hour",
      "a.cabinaBianca": "A white treatment room: the bed, the magnifying lamp, the lit shelves with the bottles.",
      "c.cabinaBianca": "One of the treatment rooms.",
      "ma.titolo": "Hands and feet",
      "ma.sotto": "Classic manicure and semi-permanent polish, also French; pedicure; the wall of nail polishes next to the chair.",
      "ma.t1": "Hands",
      "ma.t2": "Feet",
      "ma.cambio": "Polish change",
      "ma.taglio": "Nail cut and filing",
      "ma.semi": "Semi-permanent polish",
      "ma.rimozione": "Semi-permanent removal",
      "ma.manicure": "Manicure",
      "ma.french": "Semi-permanent French",
      "ma.ritocco": "Semi-permanent refill",
      "ma.calli": "Callus removal",
      "ma.pedEst": "Cosmetic pedicure",
      "ma.pedCompl": "Full pedicure",
      "a.smalto": "Red polish being applied to the nails.",
      "a.pedicure": "The pedicure chair and the wall of nail polishes.",
      "a.manicure": "The manicure: gloved hands apply a pale polish.",
      "ma.ig": "From their Instagram",
      "a.igMagenta": "Hands with magenta semi-permanent polish, and the handwritten words Semi Gelish gossip girl.",
      "a.igArancio": "Hands and feet with orange polish.",
      "a.igBordeaux": "Hands with burgundy polish, and the handwritten words ci prepariamo all’autunno? (ready for autumn?)",
      "a.igGiallo": "Hands with yellow semi-permanent polish, and the words Yellow Gelish.",
      "a.igGrigio": "Hands with grey polish, and the words Buon Ferragosto (happy mid-August holiday).",
      "a.igSabbia": "Feet on the sand with pale polish, and the words All American Beauty.",
      "vi.titolo": "The face",
      "vi.sotto": "Facial cleansing and treatments, tailored to each skin.",
      "vi.glicolico": "Glycolic acid peel",
      "vi.pulizia": "Facial cleansing",
      "vi.igiene": "Deep facial cleansing",
      "vi.vitC": "Vitamin C treatment",
      "vi.antiage": "Anti-age treatment",
      "vi.shape": "4Shape face",
      "vi.lifting": "Lifting treatment",
      "co.titolo": "Body and massages",
      "co.sotto": "Slimming, toning, anti-cellulite: the body treatments, with their machines, in the ochre rooms.",
      "co.t1": "Body",
      "co.t2": "Massages",
      "co.pulizia": "Body cleansing",
      "co.presso": "Pressotherapy",
      "co.anticell": "Anti-cellulite treatment",
      "co.shape": "4Shape body",
      "co.endo": "Endodermic treatment",
      "co.schiena": "Back treatment",
      "co.drenante": "Draining massage",
      "a.cabinaOcra": "An ochre room with the clock on the wall, the bed with a brown towel, the machine on its trolley.",
      "c.cabinaOcra": "The ochre room, with the clock.",
      "a.macchinari": "The machines room: the bed, the stool, the wax trolley.",
      "c.macchinari": "The machines.",
      "la.titolo": "The laser",
      "la.sotto": "For permanent hair removal, the diode laser.",
      "la.diodo": "Diode laser",
      "r.titolo": "Reviews",
      "r.vg": "on Google, 117 reviews",
      "r.vt": "on Treatwell, 1,061 verified reviews",
      "r.google5": "Google, 5 stars out of 5",
      "r.treatwell": "Treatwell, verified review",
      "r.a7": "7 years ago",
      "r.g7": "7 days ago",
      "r.a6": "6 years ago",
      "r.m2": "about 2 months ago",
      "r.a3": "3 years ago",
      "r.a8": "8 years ago",
      "r.nota": "From the reviews on Google and on Treatwell, as they were written (in Italian); cuts are marked […].",
      "r.tutte": "All the reviews on Treatwell",
      "ct.titolo": "The salon",
      "a.facciata": "The front: the italic steel letters, Estetica and Benessere, on the glossy brown tiles.",
      "c.facciata": "Via Giambellino 41: the steel letters on the front.",
      "ct.p1": "The salon was opened <b>in December 2000</b> by its owner, <b>Maria Corsaro</b>, who still runs it. It is on the corner of Via Giambellino and Via Tito Vignoli, with the white reception, the white treatment rooms and the ochre ones.",
      "ct.p2": "They describe it like this: «moderno e impeccabile» (modern and impeccable). They specialise in hair removal and in manicure, classic and semi-permanent, and in treatments for slimming, toning and cellulite.",
      "ct.p3": "The products: <b>Bioline</b>, <b>Histomer</b>, <b>Mavala</b>, <b>Diva</b> and <b>B-Trend</b>.",
      "a.corridoio": "The white corridor with the doors of the treatment rooms.",
      "c.corridoio": "The corridor of the treatment rooms.",
      "a.attestati": "The other ochre room, with the certificates on the wall, the clock and the lamp on.",
      "c.attestati": "The certificates, in the ochre room.",
      "o.titolo": "Hours and where",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.prenota": "You can book <b>online on Treatwell</b> or <b>by phone</b>: a customer recommends doing it in good time, the salon is often full.",
      "o.dove": "Via Giambellino 41, on the corner of Via Tito Vignoli, 20146 Milan. <b>Tram 14</b> stops right outside (Via Giambellino – Via Vignoli); the <b>M4 Tolstoj</b> metro station is about 370 metres away, <b>Frattini</b> 500.",
      "o.mappa": "Map: E & B Estetica e Benessere, Via Giambellino 41, Milan",
      "q.titolo": "Questions",
      "q.1": "How do I book?",
      "q.1r": "Online on Treatwell, or by phone on +39 02 4771 9196.",
      "q.2": "When are you open?",
      "q.2r": "From Tuesday to Friday from 9 am to 8 pm, on Saturday from 9 am to 7 pm. On Sundays and Mondays we are closed.",
      "q.3": "How long does a treatment take?",
      "q.3r": "It depends on the treatment: 15 minutes for underarm or eyebrow waxing, 45 minutes for a manicure, an hour for a pedicure, an hour and a quarter for a facial cleansing, an hour and three quarters for the endodermic treatment. In the price list every treatment has its duration.",
      "q.4": "What wax do you use?",
      "q.4r": "Traditional wax and Brazilian wax, for every area: from the eyebrows to the legs. For permanent hair removal there is the diode laser.",
      "q.5": "What products do you use?",
      "q.5r": "Bioline, Histomer, Mavala, Diva and B-Trend.",
      "q.6": "How do I get there?",
      "q.6r": "The salon is at Via Giambellino 41, on the corner of Via Tito Vignoli. Tram 14 stops right outside (Via Giambellino – Via Vignoli); the M4 Tolstoj station is about 370 metres away.",
      "z.frase": "See you tomorrow.",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos of the salon from its Treatwell page and its Instagram, the front from the Google listing; price list, durations and reviews from Treatwell and Google (September 2026). The appointment book at the top is drawn.",
      "z.su": "Back to the top ↑",
      "ag.ascelle": "underarms",
      "ag.gambaIntera": "full leg",
      "ag.inguine": "bikini",
      "ag.braccio": "arm",
      "ag.coscia": "thigh",
      "ag.mezzaGamba": "half leg",
      "ag.schiena": "back",
      "ag.braccia": "arms",
      "ag.labbro": "upper lip",
      "ag.gambaCompleta": "full leg",
      "ag.laser": "laser",
      "ag.inguineTotale": "full bikini",
      "ag.manicure": "manicure",
      "ag.pedicure": "pedicure",
      "ag.smalto": "polish",
      "ag.french": "french",
      "ag.calli": "calluses",
      "ag.ritocco": "refill",
      "ag.pressoterapia": "pressotherapy",
      "ag.puliziaViso": "facial",
      "ag.drenante": "draining",
      "ag.anticellulite": "anti-cellulite",
      "ag.glicolico": "glycolic peel",
      "ag.endodermico": "endodermic",
      "ag.lifting": "lifting",
      "du.15": "15 min",
      "du.30": "30 min",
      "du.45": "45 min",
      "du.60": "1 hr",
      "du.75": "1 hr 15",
      "du.90": "1 hr 30",
      "du.105": "1 hr 45"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ E & B ESTETICA E BENESSERE — «Ci coccoliamo un po'?» ══════════
     La pagina è la loro agenda: ogni sezione è un appuntamento della giornata, con l'ora sul margine.
     la FIRMA — l'agenda di oggi: la pagina vuota (le ore, le righe dei quarti d'ora, tre colonne); gli appuntamenti si
     scrivono uno alla volta nell'ordine in cui si prenota (l'evidenziatore alto quanto la durata, poi il nome a mano, poi
     la durata stampata); alla fine la linea rossa di adesso all'ora vera, o il timbro «Chiuso · apre…».
     Stato finale = l'HTML (gli appuntamenti scritti). Senza JS: lo stato finale, senza linea né timbro. Con reduced-motion:
     lo stato finale con la linea (o il timbro) subito. L'attesa è la classe firma-attesa dell'head (la pagina vuota, via
     CSS, solo dentro .agenda__griglia), tolta dall'head dopo 2,5 s se il codice non arriva.
     Un rAF a tempo: la firma non dipende da GSAP. I dati vengono da _ebe_agenda.mjs. */
  var DATI = {"inizio":540,"fine":1200,"ordine":[23,3,16,29,19,1,9,11,20,22,27,28,5,18,14,10,13,21,4,17,0,30,25,2,6,26,8,24,7,15,12],"tempi":{"inizio":250,"passo":190,"evid":260,"scrive":420,"ritardoScrive":110,"durata":220,"ritardoDurata":330,"ultimo":6500,"adesso":[6680,7280],"fine":7400},"n":31};
  var figuraA = document.getElementById('agenda');
  var grigliaA = document.getElementById('agendaGriglia');
  var appEl = grigliaA ? [].slice.call(grigliaA.querySelectorAll('.appunt')) : [];
  /* lo stile scritto nell'HTML (il posto nella griglia): alla chiusura si rimette identico (toccando opacity il browser
     lo riscriverebbe come grid-area) */
  var stileHtml = appEl.map(function (el) { return el.getAttribute('style'); });
  var evidEl = appEl.map(function (el) { return el.querySelector('.appunt__evid'); });
  var nomeEl = appEl.map(function (el) { return el.querySelector('.appunt__nome'); });
  var durEl = appEl.map(function (el) { return el.querySelector('.appunt__durata'); });
  var adessoEl = document.getElementById('agendaAdesso'), adessoOraEl = document.getElementById('agendaAdessoOra');
  var timbroEl = document.getElementById('agendaTimbro'), giornoEl = document.getElementById('agendaGiorno');
  var TA = DATI.tempi, ORD = DATI.ordine;
  var faseA = 'fatta', rafA = 0, guardiaA = 0, larghezzaAvvioA = 0, corseA = 0, statoA = null;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  /* ── l'ora vera: aperto adesso (la linea) o chiuso (il timbro), e il giorno dell'agenda ── */
  var aMin = function (hm) { var p = hm.split(':'); return +p[0] * 60 + +p[1]; };
  function calcolaStato(ora) {
    var d = ora.getDay(), min = ora.getHours() * 60 + ora.getMinutes();
    var fasce = SITE.hours[d] || [];
    for (var i = 0; i < fasce.length; i++) {
      if (min >= aMin(fasce[i][0]) && min < aMin(fasce[i][1])) return { aperto: true, min: min, giorno: 0 };
    }
    /* chiuso: il prossimo giorno d'apertura (oggi più tardi, o i giorni dopo) */
    for (var k = 0; k < 8; k++) {
      var f = SITE.hours[(d + k) % 7] || [];
      for (var j = 0; j < f.length; j++) if (k > 0 || aMin(f[j][0]) > min) return { aperto: false, giorno: k };
    }
    return { aperto: false, giorno: 0 };
  }
  var PAROLE = { it: { oggi: 'Oggi', domani: 'Domani', adesso: 'adesso' }, en: { oggi: 'Today', domani: 'Tomorrow', adesso: 'now' } };
  function lingua() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  function scriviGiorno(st, ora) {
    if (!giornoEl) return;
    var l = lingua(), g = new Date(ora.getTime());
    g.setDate(g.getDate() + st.giorno);
    var data = '';
    try { data = new Intl.DateTimeFormat(l === 'en' ? 'en-GB' : 'it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).format(g); } catch (e) { data = ''; }
    var pre = st.giorno === 0 ? PAROLE[l].oggi : st.giorno === 1 ? PAROLE[l].domani : '';
    giornoEl.textContent = pre ? pre + (data ? ', ' + data : '') : data.charAt(0).toUpperCase() + data.slice(1);
  }
  var due = function (n) { return (n < 10 ? '0' : '') + n; };
  /* mette la linea (o il timbro) all'ora vera; p = quanto è comparsa (1 = del tutto) */
  function mostraAdesso(p) {
    if (!adessoEl || !timbroEl) return;
    var ora = new Date();
    statoA = calcolaStato(ora);
    scriviGiorno(statoA, ora);
    if (statoA.aperto) {
      timbroEl.hidden = true;
      var pct = (statoA.min - DATI.inizio) / (DATI.fine - DATI.inizio) * 100;
      adessoEl.style.top = r3(Math.max(0, Math.min(100, pct))) + '%';
      adessoOraEl.textContent = PAROLE[lingua()].adesso + ' ' + ora.getHours() + ':' + due(ora.getMinutes());
      adessoEl.hidden = false;
      if (p < 1) { adessoEl.style.transform = 'scaleX(' + r3(esce(p)) + ')'; adessoOraEl.style.opacity = r3(c01(p * 2 - 1)); }
      else { adessoEl.style.removeProperty('transform'); adessoOraEl.style.removeProperty('opacity'); }
    } else {
      adessoEl.hidden = true;
      var st = document.getElementById(SITE.hoursStatusId);
      timbroEl.textContent = st ? st.textContent : '';
      timbroEl.hidden = !timbroEl.textContent;
      if (p < 1) { timbroEl.style.opacity = r3(p); timbroEl.style.transform = 'rotate(-7deg) scale(' + r3(1.25 - 0.25 * esce(p)) + ')'; }
      else { timbroEl.style.removeProperty('opacity'); timbroEl.style.removeProperty('transform'); }
    }
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la pagina va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorvegliaA() { clearTimeout(guardiaA); guardiaA = setTimeout(chiudiAgenda, 1500); }
  function pulisci(el) { if (!el) return; el.style.removeProperty('opacity'); el.style.removeProperty('transform'); el.style.removeProperty('clip-path'); if (!el.getAttribute('style')) el.removeAttribute('style'); }
  function chiudiAgenda() {
    cancelAnimationFrame(rafA); rafA = 0;
    clearTimeout(guardiaA);
    appEl.forEach(function (el, i) { el.setAttribute('style', stileHtml[i]); el.__v = null; });
    evidEl.forEach(pulisci); nomeEl.forEach(pulisci); durEl.forEach(pulisci);
    figuraA.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseA = 'fatta';
    mostraAdesso(1);
  }
  function fotogrammaA(t) {
    for (var k = 0; k < ORD.length; k++) {
      var i = ORD[k], t0 = TA.inizio + k * TA.passo, el = appEl[i];
      if (t < t0) { if (el.__v !== 0) { el.style.opacity = '0'; el.__v = 0; } continue; }
      if (el.__v !== 1) { el.style.opacity = '1'; el.__v = 1; }
      var pe = c01((t - t0) / TA.evid);
      if (pe < 1) evidEl[i].style.transform = 'scaleX(' + r3(esce(pe)) + ')'; else evidEl[i].style.removeProperty('transform');
      var ps = c01((t - t0 - TA.ritardoScrive) / TA.scrive);
      /* la scrittura: il nome si scopre da sinistra (il ritaglio lascia fuori i tratti alti e bassi della scrittura) */
      if (ps < 1) nomeEl[i].style.clipPath = 'inset(-12px ' + r3((1 - ps) * 100) + '% -12px 0)'; else nomeEl[i].style.removeProperty('clip-path');
      if (durEl[i]) { var pd = c01((t - t0 - TA.ritardoDurata) / TA.durata); if (pd < 1) durEl[i].style.opacity = r3(pd); else durEl[i].style.removeProperty('opacity'); }
    }
    if (t >= TA.adesso[0]) mostraAdesso(c01((t - TA.adesso[0]) / (TA.adesso[1] - TA.adesso[0])));
  }
  function avviaAgenda() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: la pagina vuota */
    appEl.forEach(function (el, i) { el.style.opacity = '0'; el.__v = 0; evidEl[i].style.transform = 'scaleX(0)'; nomeEl[i].style.clipPath = 'inset(-12px 100% -12px 0)'; if (durEl[i]) durEl[i].style.opacity = '0'; });
    adessoEl.hidden = true; timbroEl.hidden = true;
    root.classList.remove('firma-attesa');
    faseA = 'corre'; figuraA.setAttribute('data-firma', 'corre');
    larghezzaAvvioA = window.innerWidth;
    var t0 = null, corsa = ++corseA;
    function fotogramma(ts) {
      rafA = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseA !== 'corre' || corsa !== corseA) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaA(t);
      if (t >= TA.fine) { chiudiAgenda(); return; }
      sorvegliaA();
      rafA = requestAnimationFrame(fotogramma);
    }
    sorvegliaA();
    rafA = requestAnimationFrame(fotogramma);
  }
  /* l'agenda è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra);
     l'altezza è quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaA() {
    if (!grigliaA) return false;
    var r = grigliaA.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche nella sezione degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);

  if (figuraA && grigliaA && appEl.length === DATI.n && adessoEl && timbroEl) {
    try { clearTimeout(window.__attesaAgenda); } catch (e) {}
    window.__agenda = {
      stato: function () { return { fase: faseA, corse: corseA, adesso: statoA }; },
      tempi: TA,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaA();
    /* perché la firma è partita o no (lo legge il check) */
    window.__agenda.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: grigliaA.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiAgenda();
    else if (inVista) avviaAgenda();
    else if ('IntersectionObserver' in window) {
      /* l'agenda sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora è la pagina vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioA = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioA.disconnect();
        if (faseA === 'fatta' && root.classList.contains('firma-attesa')) avviaAgenda();
      }, { threshold: soglie });
      ioA.observe(grigliaA);
      window.__agenda.avvio.aspetta = true;
    } else chiudiAgenda();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseA !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioA) <= 1) return;
      chiudiAgenda();
    });
    /* la linea di adesso cammina col tempo; la lingua cambia le parole del giorno e dell'ora */
    setInterval(function () { if (faseA === 'fatta' && !root.classList.contains('firma-attesa')) mostraAdesso(1); }, 60000);
    new MutationObserver(function () { copiaStato(); if (faseA === 'fatta' && !root.classList.contains('firma-attesa')) mostraAdesso(1); }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }
})();
