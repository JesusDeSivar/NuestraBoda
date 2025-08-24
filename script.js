// Scripts for "NuestraBoda"

// Slide transition (click/keydown to skip portada)
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

// Countdown for wedding
const countdownEl = document.getElementById("countdown");
const weddingDate = new Date("2025-11-16T16:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
    countdownEl.innerHTML = "¡Hoy es el gran día!";
    return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.innerHTML = `${days} días • ${hours} hrs • ${minutes} min`;
}

updateCountdown();
setInterval(updateCountdown, 60000); // actualizar cada minuto

// Music
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

    // Wait until first user interaction to autoplay music (required for mobile/Chrome autoplay)
function startMusic() {
    if (!isPlaying) {
    bgMusic.play().catch(() => {}); // Ignore autoplay block
    musicToggle.innerText = 'Pausar';
    isPlaying = true;
    }
}

    // Toggle button
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
    bgMusic.pause();
    musicToggle.innerText = 'Play Music';
    } else {
    bgMusic.play();
    musicToggle.innerText = 'Pause Music';
    }
    isPlaying = !isPlaying;
});

    // Optional: trigger music on any page click/keydown to satisfy autoplay rules
window.addEventListener('click', startMusic, { once: true });
window.addEventListener('keydown', startMusic, { once: true });