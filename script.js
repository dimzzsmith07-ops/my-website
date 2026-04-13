/* ============================================
   BIRTHDAY WEBSITE — script.js
   ============================================ */

/* ============================================
   1. TYPEWRITER EFFECT
   ============================================ */
const messages = [
  "Semoga hari ini menjadi yang paling indah sepanjang hidupmu... 🌸",
  "Kamu adalah hadiah terindah yang pernah diberikan semesta... ✨",
  "Setiap doaku selalu menyertakan namamu... 💕",
  "Terima kasih sudah ada di sini, di hidupku... 🌷",
];

let msgIndex   = 0;
let charIndex  = 0;
let isDeleting = false;
const typeEl   = document.getElementById('typewriterText');
const SPEED_TYPE   = 55;
const SPEED_DELETE = 30;
const PAUSE_END    = 2200;
const PAUSE_START  = 500;

function typewriter() {
  const current = messages[msgIndex];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      msgIndex   = (msgIndex + 1) % messages.length;
      setTimeout(typewriter, PAUSE_START);
      return;
    }
    setTimeout(typewriter, SPEED_DELETE);
  } else {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typewriter, PAUSE_END);
      return;
    }
    setTimeout(typewriter, SPEED_TYPE);
  }
}
setTimeout(typewriter, 2000); // start after landing animations

/* ============================================
   2. SCROLL TO SECTION
   ============================================ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ============================================
   3. MUSIC CONTROL
   ============================================ */
const audio     = document.getElementById('bgMusic');
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let   isPlaying = false;

audio.volume = 0.25; // volume lembut & romantis

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    musicIcon.textContent = '▶';
    isPlaying = false;
  } else {
    audio.play().catch(() => {});
    musicIcon.textContent = '⏸';
    isPlaying = true;
  }
});

// Auto-play on first user interaction
document.addEventListener('click', function tryAutoPlay() {
  if (!isPlaying) {
    audio.play().then(() => {
      musicIcon.textContent = '⏸';
      isPlaying = true;
    }).catch(() => {});
  }
  document.removeEventListener('click', tryAutoPlay);
}, { once: true });

/* ============================================
   4. FLOATING HEARTS
   ============================================ */
const container = document.getElementById('heartsContainer');
const heartEmojis = ['💕', '💖', '💗', '💓', '🌸', '✨'];

function spawnHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

  const left     = Math.random() * 100;
  const duration = 7 + Math.random() * 8;
  const delay    = Math.random() * 4;
  const size     = 0.9 + Math.random() * 0.9;

  heart.style.cssText = `
    left: ${left}%;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    font-size: ${size}rem;
  `;

  container.appendChild(heart);
  setTimeout(() => heart.remove(), (duration + delay) * 1000);
}

// Spawn hearts periodically
setInterval(spawnHeart, 900);
// Initial burst
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 200);

/* ============================================
   5. CONFETTI BURST
   ============================================ */
const canvas = document.getElementById('confettiCanvas');
const ctx    = canvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;
let animFrameId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CONFETTI_COLORS = [
  '#f7b8c8', '#e8748a', '#fcd5b5', '#d4b8f0',
  '#b98fd6', '#ffcce0', '#ffd6b0', '#c8a8f0',
  '#ff9eb5', '#ffc6a0'
];

function createConfettiPiece(x, y) {
  return {
    x, y,
    vx: (Math.random() - 0.5) * 8,
    vy: -6 - Math.random() * 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    size: 5 + Math.random() * 8,
    gravity: 0.25 + Math.random() * 0.1,
    alpha: 1
  };
}

function launchConfetti(x, y, count = 60) {
  for (let i = 0; i < count; i++) {
    confettiPieces.push(createConfettiPiece(x, y));
  }
  if (!confettiActive) {
    confettiActive = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces = confettiPieces.filter(p => p.alpha > 0.01);

  confettiPieces.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    if (p.y > canvas.height * 0.6) p.alpha -= 0.018;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    animFrameId = requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Initial confetti burst on load
window.addEventListener('load', () => {
  setTimeout(() => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 3;
    launchConfetti(cx, cy, 80);
  }, 1000);
});

/* ============================================
   6. SURPRISE MODAL
   ============================================ */
const modal = document.getElementById('surpriseModal');

function showSurprise() {
  modal.classList.add('active');
  // confetti burst from center
  launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
  // extra burst after short delay
  setTimeout(() => {
    launchConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 60);
    launchConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 60);
  }, 300);
}

function closeSurprise() {
  modal.classList.remove('active');
}

// Close on overlay click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeSurprise();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSurprise();
});

/* ============================================
   7. SCROLL REVEAL
   ============================================ */
const revealEls = document.querySelectorAll(
  '#message .message-card, .section-header, .surprise-wrap, footer'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ============================================
   8. PHOTO CARD CLICK → confetti burst
   ============================================ */
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    launchConfetti(cx, cy, 35);
  });
});

/* ============================================
   9. SURPRISE BUTTON SPARKLE CURSOR TRAIL
   ============================================ */
const surpriseBtn = document.getElementById('surpriseBtn');
surpriseBtn.addEventListener('mousemove', (e) => {
  const spark = document.createElement('div');
  spark.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    font-size:${0.8 + Math.random() * 0.8}rem;
    pointer-events:none;
    z-index:600;
    animation: sparkFade 0.8s ease forwards;
  `;
  spark.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 800);
});

// Inject sparkFade keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkFade {
    0%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%,-120%) scale(0.3); }
  }
`;
document.head.appendChild(style);