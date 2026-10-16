/* ═══════════════════════════════════════════════
   ACHYUTA PORTFOLIO — typewriter.js
   Shared by every page; each block checks that its
   elements exist before running.
   ═══════════════════════════════════════════════ */

var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Navbar hamburger ── */
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function setOpen(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  }

  hamburger.addEventListener('click', function () {
    setOpen(!hamburger.classList.contains('open'));
  });

  document.addEventListener('click', function (e) {
    if (!document.getElementById('navbar').contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();

/* ── Footer year ── */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ── Scroll-reveal ── */
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(function (t) { io.observe(t); });
})();

/* ── Typewriter (home) ── */
(function () {
  var el = document.getElementById('typedText');
  if (!el) return;

  var ROLES = ['Software Engineer', 'Full-Stack Developer', 'Cybersecurity Enthusiast', 'Problem Solver'];
  var TYPE_SPD = 80;
  var DEL_SPD = 45;
  var PAUSE_FULL = 1800;
  var PAUSE_NEXT = 400;
  var ri = 0, ci = 0, deleting = false;

  if (REDUCED_MOTION) {
    el.textContent = ROLES[0];
    return;
  }

  function typeStep() {
    var word = ROLES[ri];
    if (!deleting) {
      ci += 1;
      el.textContent = word.substring(0, ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(typeStep, PAUSE_FULL);
      } else {
        setTimeout(typeStep, TYPE_SPD + Math.floor(Math.random() * 40));
      }
    } else {
      ci -= 1;
      el.textContent = word.substring(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % ROLES.length;
        setTimeout(typeStep, PAUSE_NEXT);
      } else {
        setTimeout(typeStep, DEL_SPD);
      }
    }
  }

  typeStep();
})();

/* ── Home terminal: types the command, then reveals its output ── */
(function () {
  var term = document.getElementById('bootTerm');
  if (!term) return;

  var cmdEl = term.querySelector('[data-type]');
  var steps = term.querySelectorAll('[data-step]');
  var text = cmdEl.getAttribute('data-type');

  function showAll() {
    cmdEl.textContent = text;
    steps.forEach(function (s) { s.hidden = false; });
  }

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  steps.forEach(function (s) { s.hidden = true; });

  function run() {
    var i = 0;
    (function type() {
      cmdEl.textContent = text.substring(0, ++i);
      if (i < text.length) return setTimeout(type, 55);
      var n = 0;
      (function reveal() {
        if (n >= steps.length) return;
        steps[n++].hidden = false;
        setTimeout(reveal, 140);
      })();
    })();
  }

  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      io.disconnect();
      setTimeout(run, 300);
    }
  }, { threshold: 0.3 });
  io.observe(term);
})();

/* ── Hero photo fallback to initials ── */
(function () {
  var img = document.getElementById('heroPhoto');
  if (!img) return;
  function fail() { img.closest('.hero-photo-card').classList.add('no-img'); }
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener('error', fail);
})();

/* ── CV download dropdown ── */
(function () {
  var dropdowns = document.querySelectorAll('.download-dropdown');
  if (!dropdowns.length) return;

  function closeAll() {
    dropdowns.forEach(function (d) {
      d.classList.remove('active');
      d.querySelector('.download-btn').setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(function (d) {
    var btn = d.querySelector('.download-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('active');
      closeAll();
      d.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', open);
    });
  });

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();

/* ── Contact form (EmailJS) ── */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: 'nSCw20wsi12qEz1M6' });
  } else {
    console.error('EmailJS failed to load.');
  }

  var btn = document.getElementById('formBtn');
  var feedback = document.getElementById('formFeedback');
  var BTN_LABEL = btn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var params = {
      from_name: document.getElementById('from_name').value.trim(),
      from_email: document.getElementById('from_email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    btn.textContent = 'Sending…';
    btn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    if (typeof emailjs === 'undefined') {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Email service unavailable. Please email directly.';
      btn.disabled = false;
      btn.textContent = BTN_LABEL;
      return;
    }

    emailjs.send('service_4q802w7', 'template_3u1ja5g', params)
      .then(function () {
        btn.textContent = 'Sent ✓';
        feedback.className = 'form-feedback success';
        feedback.textContent = 'Message sent. I\'ll get back to you soon!';
        form.reset();
        setTimeout(function () {
          btn.textContent = BTN_LABEL;
          btn.disabled = false;
          feedback.textContent = '';
        }, 5000);
      })
      .catch(function (err) {
        btn.textContent = BTN_LABEL;
        btn.disabled = false;
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Something went wrong. Please try emailing directly.';
        console.error('EmailJS error:', err);
      });
  });
})();
