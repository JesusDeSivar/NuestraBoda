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

// ---------- First Scroll Transition ----------
const coverPhoto = document.getElementById("coverSection");
const nextSection = document.getElementById("inviteSection");
coverPhoto.addEventListener("click", () => {
  nextSection.scrollIntoView({ behavior: "smooth" });
});
window.addEventListener("keydown", () => {
  nextSection.scrollIntoView({ behavior: "smooth" });
});

// ---------- Parallax (GSAP + Mouse + Scroll) ----------
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const layers = document.querySelectorAll(".layer");

  // Intro animation timeline
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

  // Mouse parallax
  const posterContainer = document.querySelector(".poster-container");
  posterContainer.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    layers.forEach((layer, i) => {
      const depth = parseFloat(layer.dataset.depth) || 0;
      gsap.to(layer, {
        x: x * depth * 50,
        y: y * depth * 50,
        duration: 0.5,
        overwrite: "auto"
      });
    });
  });

  // Scroll parallax
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
