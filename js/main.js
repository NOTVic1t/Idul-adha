/* ══════════════════════════════════
   ATI-COMPUTER · IDUL ADHA 1447 H
   main.js
══════════════════════════════════ */

// ── ELEMENTS ──
const opening   = document.getElementById('opening');
const btnOpen   = document.getElementById('btnOpen');
const mainCont  = document.getElementById('main-content');
const musicBtn  = document.getElementById('music-btn');
const bgMusic   = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

// ── OPENING → MAIN ──
btnOpen.addEventListener('click', () => {
  // Play music
  bgMusic.volume = 0.6;
  bgMusic.play().catch(() => {});

  // Fade out opening
  opening.classList.add('out');
  setTimeout(() => { opening.style.display = 'none'; }, 1400);

  // Show main + music btn
  mainCont.classList.add('visible');
  musicBtn.classList.add('show');

  // Start all canvas effects
  startStars();
  startOrnaments();
  startSparkles();
});

// ── MUSIC TOGGLE ──
let playing = true;
musicBtn.addEventListener('click', () => {
  if (playing) {
    bgMusic.pause();
    musicIcon.textContent = '♩';
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '♫';
  }
  playing = !playing;
});

// ════════════════════════════════════
// CANVAS 1 — STAR FIELD
// ════════════════════════════════════
const cStars = document.getElementById('c-stars');
const xStars = cStars.getContext('2d');
let stars = [];
let starsRunning = false;

function resizeStars() {
  cStars.width  = window.innerWidth;
  cStars.height = window.innerHeight;
}
window.addEventListener('resize', resizeStars);
resizeStars();

function mkStar() {
  return {
    x:     Math.random() * cStars.width,
    y:     Math.random() * cStars.height,
    r:     0.4 + Math.random() * 1.6,
    op:    Math.random(),
    phase: Math.random() * Math.PI * 2,
    spd:   0.008 + Math.random() * 0.018,
    driftX: (Math.random() - 0.5) * 0.08,
    driftY: (Math.random() - 0.5) * 0.04,
  };
}

function animStars() {
  if (!starsRunning) return;
  xStars.clearRect(0, 0, cStars.width, cStars.height);

  stars.forEach(s => {
    s.phase += s.spd;
    s.op = (Math.sin(s.phase) + 1) / 2;
    s.x += s.driftX;
    s.y += s.driftY;
    if (s.x < 0) s.x = cStars.width;
    if (s.x > cStars.width) s.x = 0;
    if (s.y < 0) s.y = cStars.height;
    if (s.y > cStars.height) s.y = 0;

    xStars.save();
    xStars.globalAlpha = s.op * 0.85;
    xStars.fillStyle = Math.random() > 0.3 ? '#E8CC6A' : '#A8D5B5';
    xStars.beginPath();
    xStars.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    xStars.fill();
    xStars.restore();
  });

  requestAnimationFrame(animStars);
}

function startStars() {
  if (starsRunning) return;
  starsRunning = true;
  // Create 200 stars
  for (let i = 0; i < 200; i++) stars.push(mkStar());
  animStars();
}

// ════════════════════════════════════
// CANVAS 2 — FALLING ORNAMENTS
// ════════════════════════════════════
const cOrn = document.getElementById('c-ornaments');
const xOrn = cOrn.getContext('2d');
let ornaments = [];
let ornRunning = false;

function resizeOrn() {
  cOrn.width  = window.innerWidth;
  cOrn.height = window.innerHeight;
}
window.addEventListener('resize', resizeOrn);
resizeOrn();

const ORNAMENT_CHARS = ['◆', '✦', '☽', '✧', '◇', '❖'];
const ORNAMENT_COLORS = [
  'rgba(232,204,106,',
  'rgba(201,164,42,',
  'rgba(168,213,181,',
  'rgba(76,175,114,',
];

function mkOrnament() {
  return {
    x:      Math.random() * cOrn.width,
    y:      -30,
    char:   ORNAMENT_CHARS[Math.floor(Math.random() * ORNAMENT_CHARS.length)],
    size:   10 + Math.random() * 16,
    speedY: 0.5 + Math.random() * 0.8,
    speedX: (Math.random() - 0.5) * 0.4,
    rot:    Math.random() * 360,
    rotSpd: (Math.random() - 0.5) * 1.2,
    op:     0.3 + Math.random() * 0.5,
    col:    ORNAMENT_COLORS[Math.floor(Math.random() * ORNAMENT_COLORS.length)],
  };
}

function animOrnaments() {
  if (!ornRunning) return;
  xOrn.clearRect(0, 0, cOrn.width, cOrn.height);

  if (ornaments.length < 20 && Math.random() < 0.04) {
    ornaments.push(mkOrnament());
  }
  ornaments = ornaments.filter(o => o.y < cOrn.height + 40);

  ornaments.forEach(o => {
    o.y   += o.speedY;
    o.x   += o.speedX + Math.sin(o.y * 0.015) * 0.4;
    o.rot += o.rotSpd;

    xOrn.save();
    xOrn.translate(o.x, o.y);
    xOrn.rotate(o.rot * Math.PI / 180);
    xOrn.globalAlpha = o.op;
    xOrn.font = `${o.size}px serif`;
    xOrn.fillStyle = o.col + o.op + ')';
    xOrn.textAlign = 'center';
    xOrn.textBaseline = 'middle';
    xOrn.fillText(o.char, 0, 0);
    xOrn.restore();
  });

  requestAnimationFrame(animOrnaments);
}

function startOrnaments() {
  if (ornRunning) return;
  ornRunning = true;
  animOrnaments();
}

// ════════════════════════════════════
// CANVAS 3 — SPARKLES / GLINTS
// ════════════════════════════════════
const cSpark = document.getElementById('c-sparkles');
const xSpark = cSpark.getContext('2d');
let sparkles = [];
let sparkRunning = false;

function resizeSpark() {
  cSpark.width  = window.innerWidth;
  cSpark.height = window.innerHeight;
}
window.addEventListener('resize', resizeSpark);
resizeSpark();

function mkSparkle() {
  return {
    x:     Math.random() * cSpark.width,
    y:     Math.random() * cSpark.height,
    size:  1 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
    spd:   0.02 + Math.random() * 0.03,
    maxOp: 0.3 + Math.random() * 0.5,
  };
}

function animSparkles() {
  if (!sparkRunning) return;
  xSpark.clearRect(0, 0, cSpark.width, cSpark.height);

  while (sparkles.length < 30) sparkles.push(mkSparkle());

  sparkles.forEach(s => {
    s.phase += s.spd;
    const op = (Math.sin(s.phase) + 1) / 2 * s.maxOp;

    xSpark.save();
    xSpark.globalAlpha = op;

    // Core dot
    xSpark.fillStyle = '#E8CC6A';
    xSpark.beginPath();
    xSpark.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    xSpark.fill();

    // Cross glint
    const r = s.size * 3;
    xSpark.fillStyle = 'rgba(255, 248, 200, 0.8)';
    xSpark.fillRect(s.x - r, s.y - 0.5, r * 2, 1);
    xSpark.fillRect(s.x - 0.5, s.y - r, 1, r * 2);

    xSpark.restore();
  });

  requestAnimationFrame(animSparkles);
}

function startSparkles() {
  if (sparkRunning) return;
  sparkRunning = true;
  animSparkles();
}

// ════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));
