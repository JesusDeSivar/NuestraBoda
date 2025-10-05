// ===============================
// WOW Wedding Invitation Script ✨
// ===============================

// ---------- Section Fade-In ----------
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach(section => observer.observe(section));

// ---------- Countdown ----------
const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2025-11-16T15:00:00").getTime();

function formatTime(num) {
  return num.toString().padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    countdownEl.innerHTML = "¡Hoy es el gran día!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.innerHTML = `
    <span class="flip">${formatTime(days)}d</span> • 
    <span class="flip">${formatTime(hours)}h</span> • 
    <span class="flip">${formatTime(minutes)}m</span> • 
    <span class="flip">${formatTime(seconds)}s</span>
  `;

  countdownEl.querySelectorAll(".flip").forEach(flip => {
    flip.classList.remove("animate");
    void flip.offsetWidth;
    flip.classList.add("animate");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Background Music Toggle ----------
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.textContent = "▶";
  } else {
    bgMusic.play().catch(() => {}); // ignore play promise errors
    musicToggle.textContent = "⏸";
  }
  isPlaying = !isPlaying;
}

musicToggle.addEventListener("click", toggleMusic);

// Enable autoplay after first gesture
function enableAutoplay() {
  if (!isPlaying) {
    bgMusic.play().catch(() => {});
    musicToggle.textContent = "⏸";
    isPlaying = true;
  }
}
window.addEventListener("click", enableAutoplay, { once: true });
window.addEventListener("keydown", enableAutoplay, { once: true });

// -----------------------------
// NOTE: I REMOVED the cover click/key listeners that forced a scroll.
// If you still want the "click cover to jump to invite" behavior,
// it's safer to keep that behaviour on the specific button only:
// <button onclick="document.getElementById('inviteSection').scrollIntoView({behavior:'smooth'})">...</button>
// -----------------------------

// ---------- Parallax (GSAP + Mouse + Scroll) ----------
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const layers = document.querySelectorAll(".layer");
  const posterContainer = document.querySelector(".poster-container");

  // Intro animation timeline (runs when poster is scrolled into view)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".poster-container",
      start: "top 85%",
      end: "center 40%",
      scrub: false,
      once: true
    }
  });

  layers.forEach(layer => {
    tl.fromTo(
      layer,
      { y: -150, opacity: 0, scale: 1.2 },
      { y: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 0.8 }
    );
  });

  // Mouse parallax handler (uses container-relative coords)
  function onParallax(e) {
    if (!posterContainer) return;
    const rect = posterContainer.getBoundingClientRect();
    // ignore if mouse is outside container (safety)
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0;
      gsap.to(layer, {
        x: x * depth * 40, // reduced multiplier for less aggressive movement
        y: y * depth * 40,
        duration: 0.4,
        overwrite: "auto"
      });
    });
  }

  // Scroll parallax (keeps this as-is)
  layers.forEach((layer, i) => {
    const depth = parseFloat(layer.dataset.depth) || 0;
    gsap.to(layer, {
      yPercent: depth * 5,
      ease: "none",
      scrollTrigger: {
        trigger: ".poster-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}
