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

/* ── Background: grid with data packets, scrolling with the page ──
   The grid moves at PARALLAX × scroll speed, packets ride its lines, and
   scrolling gives them a short speed boost. Falls back to the static CSS grid
   (body::before) if canvas is unavailable. */
(function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;
  canvas.id = 'bgfx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  document.documentElement.classList.add('has-bgfx');

  var GAP = 56;
  var PARALLAX = REDUCED_MOTION ? 0 : 0.35;
  var ACCENT = '52, 211, 153';
  var BLUE = '96, 165, 250';
  var W = 0, H = 0, DPR = 1, offset = 0, boost = 0, lastScroll = window.scrollY;
  var packets = [];

  function count() { return W < 700 ? 8 : 16; }

  function spawn() {
    var horiz = Math.random() > 0.5;
    var rows = Math.ceil(H / GAP) + 2;
    var line = horiz
      ? (Math.floor(offset / GAP) + Math.floor(Math.random() * rows)) * GAP
      : Math.floor(Math.random() * Math.ceil(W / GAP)) * GAP;
    return {
      horiz: horiz,
      line: line,                                                   // world y (horiz) or x (vert)
      pos: horiz ? Math.random() * W : offset + Math.random() * H,  // world x (horiz) or y (vert)
      speed: 0.5 + Math.random() * 1.4,
      dir: Math.random() > 0.5 ? 1 : -1,
      len: 40 + Math.random() * 80,
      color: Math.random() > 0.75 ? BLUE : ACCENT,
    };
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    packets = [];
    for (var i = 0; i < count(); i++) packets.push(spawn());
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0.5; x < W; x += GAP) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (var y = 0.5 - (offset % GAP); y < H; y += GAP) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
  }

  function drawPacket(p) {
    var x1, y1, x0, y0;
    if (p.horiz) {
      y1 = y0 = p.line - offset;
      x1 = p.pos; x0 = p.pos - p.len * p.dir;
    } else {
      x1 = x0 = p.line;
      y1 = p.pos - offset; y0 = y1 - p.len * p.dir;
    }
    var grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, 'rgba(' + p.color + ', 0)');
    grad.addColorStop(1, 'rgba(' + p.color + ', 0.55)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0 + .5, y0 + .5); ctx.lineTo(x1 + .5, y1 + .5); ctx.stroke();
    ctx.fillStyle = 'rgba(' + p.color + ', 0.9)';
    ctx.fillRect(x1 - 1, y1 - 1, 3, 3);
  }

  function offScreen(p) {
    if (p.horiz) {
      var y = p.line - offset;
      return y < -GAP || y > H + GAP || p.pos < -p.len || p.pos > W + p.len;
    }
    var vy = p.pos - offset;
    return vy < -p.len - GAP || vy > H + p.len + GAP;
  }

  function step() {
    offset = window.scrollY * PARALLAX;
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];
      p.pos += (p.speed + boost) * p.dir;
      if (offScreen(p)) packets[i] = p = spawn();
      drawPacket(p);
    }
    boost *= 0.92;
  }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    boost = Math.min(boost + Math.abs(y - lastScroll) * 0.08, 7);
    lastScroll = y;
    if (REDUCED_MOTION) step();
  }, { passive: true });

  window.addEventListener('resize', function () { resize(); step(); });
  resize();
  step();
  if (REDUCED_MOTION) return;

  (function loop() {
    if (!document.hidden) step();
    requestAnimationFrame(loop);
  })();
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

/* ── Skeleton loading: drop placeholders once fonts and images are ready ── */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('is-loading')) return;

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    root.classList.remove('is-loading');
  }

  var pageLoaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(function (res) { window.addEventListener('load', res, { once: true }); });
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

  Promise.all([pageLoaded, fontsReady]).then(finish, finish);
  setTimeout(finish, 2500); // never hold content back on a slow connection
})();

/* ── Hero photo: fade in when loaded, fall back to initials on error ── */
(function () {
  var img = document.getElementById('heroPhoto');
  if (!img) return;
  var frame = img.closest('.photo-frame');
  function loaded() { frame.classList.add('loaded'); }
  function fail() {
    frame.classList.add('loaded');
    img.closest('.hero-photo-card').classList.add('no-img');
  }
  if (img.complete) {
    img.naturalWidth === 0 ? fail() : loaded();
  } else {
    img.addEventListener('load', loaded);
    img.addEventListener('error', fail);
  }
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
