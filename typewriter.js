/* ═══════════════════════════════════════════════
   ACHYUTA PORTFOLIO — typewriter.js
   ═══════════════════════════════════════════════ */

/* ── Navbar hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}));

document.addEventListener('click', e => {
  if (!document.getElementById('navbar').contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

/* ── Scroll-spy: highlight nav link as section enters view ── */
(function () {
  const sections = document.querySelectorAll('[id]');
  const allLinks = document.querySelectorAll('[data-section]');
  const navH = 68;

  function setActive(id) {
    allLinks.forEach(a => {
      const match = a.dataset.section === id;
      a.classList.toggle('active', match);
    });
  }

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= navH + 60) current = sec.id;
    });
    if (current) setActive(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Scroll-reveal for content sections ── */
(function () {
  const targets = document.querySelectorAll(
    '.about-grid, .skills-grid, .timeline, .projects-grid, .awards-grid, .edu-list, .contact-grid, ' +
    '.section-title, .section-label, .section-sub'
  );

  // Wrap each in reveal class
  targets.forEach(el => el.classList.add('section-reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(t => io.observe(t));
})();

/* ── Typewriter ── */
var ROLES = ['Software Engineer', 'DevOps Engineer', 'Full-Stack Developer', 'Curious Learner', 'Problem Solver'];
var TYPE_SPD = 80;
var DEL_SPD = 45;
var PAUSE_FULL = 1800;
var PAUSE_NEXT = 400;
var ri = 0, ci = 0, deleting = false;
var el = document.getElementById('typedText');

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

/* ── EmailJS init ── */
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'nSCw20wsi12qEz1M6' });
} else {
  console.error('EmailJS failed to load.');
}

/* ── Contact form ── */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = document.getElementById('formBtn');
  const feedback = document.getElementById('formFeedback');

  // Grab values
  const params = {
    from_name: document.getElementById('from_name').value.trim(),
    from_email: document.getElementById('from_email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  // Sending state
  btn.textContent = 'Sending…';
  btn.disabled = true;
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  if (typeof emailjs === 'undefined') {
    feedback.className = 'form-feedback error';
    feedback.textContent = '✗ Email service unavailable. Please email directly.';
    btn.disabled = false;
    btn.textContent = 'Send Message ›';
    return;
  }

  emailjs.send('service_4q802w7', 'template_3u1ja5g', params)
    .then(function () {
      btn.textContent = 'Sent! ✓';
      btn.style.background = '#1affa0';
      feedback.className = 'form-feedback success';
      feedback.textContent = '✓ Message delivered — I\'ll get back to you soon!';
      document.getElementById('contactForm').reset();
      setTimeout(function () {
        btn.textContent = 'Send Message ›';
        btn.style.background = '';
        btn.disabled = false;
        feedback.textContent = '';
      }, 5000);
    })
    .catch(function (err) {
      btn.textContent = 'Send Message ›';
      btn.disabled = false;
      feedback.className = 'form-feedback error';
      feedback.textContent = '✗ Something went wrong. Please try emailing directly.';
      console.error('EmailJS error:', err);
    });
});

/* ── Background Canvas ── */
(function () {
  var canvas = document.getElementById('bg');
  var ctx = canvas.getContext('2d');
  var W, H;
  var STAR_N = 180, NODE_N = 55, CONN_DIST = 160;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var stars = [];
  for (var i = 0; i < STAR_N; i++) {
    stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, a: Math.random(), spd: 0.002 + Math.random() * 0.005 });
  }

  function Node() {
    this.x = Math.random() * (window.innerWidth || 1200);
    this.y = Math.random() * (window.innerHeight || 800);
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r = Math.random() * 2.2 + 1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  Node.prototype.update = function () {
    this.x += this.vx; this.y += this.vy; this.pulse += 0.025;
    if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
      this.x = Math.random() * W; this.y = Math.random() * H;
    }
  };

  var nodes = [];
  for (var n = 0; n < NODE_N; n++) nodes.push(new Node());

  function drawHex() {
    var size = 54;
    var cols = Math.ceil(W / (size * 1.75)) + 2;
    var rows = Math.ceil(H / (size * 1.5)) + 2;
    ctx.strokeStyle = 'rgba(0,255,136,0.028)'; ctx.lineWidth = 1;
    for (var r = -1; r < rows; r++) {
      for (var c = -1; c < cols; c++) {
        var cx = c * size * 1.732 + (r % 2 === 0 ? 0 : size * 0.866);
        var cy = r * size * 1.5;
        ctx.beginPath();
        for (var k = 0; k < 6; k++) {
          var a = (Math.PI / 180) * (60 * k - 30);
          var px = cx + size * Math.cos(a), py = cy + size * Math.sin(a);
          k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  }

  var scanY = 0;
  function drawScan(t) {
    scanY = (t * 0.04) % H;
    var g = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
    g.addColorStop(0, 'rgba(0,255,136,0)');
    g.addColorStop(0.5, 'rgba(0,255,136,0.03)');
    g.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = g; ctx.fillRect(0, scanY - 80, W, 160);
  }

  function drawAurora() {
    var g = ctx.createRadialGradient(W * .5, H * .85, 0, W * .5, H * .85, H * .75);
    g.addColorStop(0, 'rgba(0,255,136,0.055)');
    g.addColorStop(.4, 'rgba(0,180,90,0.025)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var g2 = ctx.createRadialGradient(W * .15, H * .45, 0, W * .15, H * .45, H * .5);
    g2.addColorStop(0, 'rgba(0,220,120,0.04)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  function drawStars(t) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.a = 0.35 + 0.35 * Math.sin(t * s.spd * 60 + s.x * 10);
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,255,220,' + s.a + ')';
      ctx.fill();
    }
  }

  function drawNetwork() {
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(0,255,136,' + (1 - d / CONN_DIST) * 0.22 + ')';
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      var p = 0.5 + 0.5 * Math.sin(nodes[i].pulse);
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,136,' + (0.35 + 0.4 * p) + ')';
      ctx.fill();
    }
  }

  var t0 = null;
  function frame(t) {
    if (!t0) t0 = t;
    var elapsed = t - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060d09'; ctx.fillRect(0, 0, W, H);
    drawHex(); drawAurora(); drawStars(elapsed); drawScan(elapsed);
    for (var i = 0; i < nodes.length; i++) nodes[i].update();
    drawNetwork();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ==========================================
   DROPDOWN FUNCTIONALITY
========================================== */

const dropdowns = document.querySelectorAll(".download-dropdown");

dropdowns.forEach(dropdown => {

  const button = dropdown.querySelector(".download-btn");

  button.addEventListener("click", (e) => {

    e.stopPropagation();

    // Close others
    dropdowns.forEach(item => {
      if (item !== dropdown) {
        item.classList.remove("active");
      }
    });

    // Toggle current
    dropdown.classList.toggle("active");
  });
});

/* CLOSE WHEN CLICKING OUTSIDE */
document.addEventListener("click", () => {

  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("active");
  });

});

/* PREVENT IMMEDIATE CLOSE */
document.querySelectorAll(".dropdown-menu").forEach(menu => {

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

});