// WOW Wedding Invitation Script ✨

// Smooth section fade-in on scroll
const sections = document.querySelectorAll("section");
const revealOnScroll = () => {
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      sec.classList.add("visible");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Countdown
const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2025-11-16T15:00:00").getTime();

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
    <span class="flip">${days}d</span> • 
    <span class="flip">${hours}h</span> • 
    <span class="flip">${minutes}m</span> • 
    <span class="flip">${seconds}s</span>
  `;

  countdownEl.querySelectorAll(".flip").forEach(flip => {
    flip.classList.remove("animate");
    void flip.offsetWidth;
    flip.classList.add("animate");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Music toggle
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;

function startMusic() {
  if (!isPlaying) {
    bgMusic.play().catch(() => {});
    musicToggle.innerHTML = "⏸";
    isPlaying = true;
  }
}

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.innerHTML = "▶";
  } else {
    bgMusic.play();
    musicToggle.innerHTML = "⏸";
  }
  isPlaying = !isPlaying;
});

// Enable autoplay after user gesture
window.addEventListener("click", startMusic, { once: true });
window.addEventListener("keydown", startMusic, { once: true });

// First scroll transition (click/keydown from portada)
let hasTransitioned = false;
const coverPhoto = document.getElementById("coverSection");
const nextSection = document.getElementById("inviteSection");

function triggerFirstScroll() {
  if (!hasTransitioned) {
    hasTransitioned = true;
    nextSection.scrollIntoView({ behavior: "smooth" });
  }
}
coverPhoto.addEventListener("click", triggerFirstScroll);
window.addEventListener("keydown", triggerFirstScroll);

// GSAP Poster Scroll Animation (defensive)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".poster",
    { y: -260, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 1,
      scrollTrigger: {
        trigger: ".poster-container",
        start: "top 85%",   // when poster container enters lower part of viewport
        end: "center 40%",  // when it should be "landed"
        scrub: 0.8,         // smooth link to scroll
        // markers: true,   // <-- uncomment this line while debugging to see start/end
      }
    }
  );
} else {
  console.warn("GSAP or ScrollTrigger not loaded. Make sure the GSAP scripts are above script.js");
}
