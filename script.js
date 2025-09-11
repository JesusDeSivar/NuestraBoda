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

// Parallalax
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const layers = document.querySelectorAll(".layer");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".poster-container",
      start: "top 85%",
      end: "center 40%",
      scrub: false,   // not scrubbed, plays once
      once: true,     // play only once
      // markers: true
    },
    onComplete: enableParallax // call this when finished
  });

  layers.forEach(layer => {
    tl.fromTo(layer,
      { y: -150, opacity: 0, scale: 1.2 },
      { y: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 0.8 }
    );
  });

  function enableParallax() {
    // Mouse parallax
    document.querySelector(".poster-container").addEventListener("mousemove", e => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 25;
      const y = (e.clientY - innerHeight / 2) / 25;

      layers.forEach((layer, i) => {
        gsap.to(layer, {
          x: x * (i * 0.6),
          y: y * (i * 0.6),
          duration: 0.5,
          overwrite: "auto"
        });
      });
    });

    // Scroll parallax
    gsap.to(layers, {
      yPercent: (i) => i * 5, // deeper layers move more
      ease: "none",
      scrollTrigger: {
        trigger: ".poster-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
}

// Dual Parallax Effect (mouse + scroll)
const layers = document.querySelectorAll(".layer");

function updateParallax(mouseX = 0, mouseY = 0) {
  const scrollTop = window.scrollY;

  layers.forEach(layer => {
    const depth = parseFloat(layer.dataset.depth);

    // Mouse movement effect
    const moveX = -mouseX * depth * 50;
    const moveY = -mouseY * depth * 50;

    // Scroll effect
    const scrollY = scrollTop * depth * 0.3;

    layer.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY + scrollY}px)`;
  });
}

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  updateParallax(x, y);
});

window.addEventListener("scroll", () => updateParallax());
