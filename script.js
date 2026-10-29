/**
 * ============================================================================
 * SWEET APOLOGY WEBSITE - INTERACTIVE LOGIC
 * Optimized for: Desktop, Tablet, and Mobile Smartphone Displays (iOS & Android)
 * ============================================================================
 * 
 * Instructions for Personalization:
 * You can customize the names, messages, or custom music file right below
 * in the CONFIG object.
 */

const CONFIG = {
  // REPLACE: Put her name or your favorite pet name for her here
  herName: "Chathrin",
  
  // REPLACE: Put your name or signature here
  hisName: "Always Yours",
  
  // Optional: If you have a custom MP3 audio file (e.g., "our-song.mp3"), put the URL or filename here.
  // Leave empty ("") to use the built-in soothing Web Audio piano/harp ambient synthesizer!
  customMusicUrl: "", 

  // Heartfelt messages that appear when she hovers/clicks "I still need time"
  needTimeMessages: [
    "Take all the time you need, no pressure at all🕊️",
    "I understand completely. No rush at all✨",
    "I'm right here, and I'm not going anywhere🤍",
    "How you feel is what matters most🌸",
    "Whenever you are ready, I will be waiting🧸",
    "You are worth waiting for, every single second💫"
  ]
};

// State Variables
let currentNeedTimeIndex = 0;
let isMusicPlaying = false;
let audioContext = null;
let synthInterval = null;
let customAudioElement = null;

// ============================================================================
// 1. INITIALIZATION & LUCIDE ICONS
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Inject configured names if placeholder spans exist
  applyConfigNames();

  // Initialize Canvas Floating Hearts
  initFloatingHearts();

  // Setup "Reasons Things I Truly Appreciate About You" cards
  setupReasonCards();

  // Setup the Forgiveness Decision Buttons
  setupForgivenessSection();

  // Setup Audio Player
  setupAudioPlayer();

  // Setup Virtual Hug interaction
  setupVirtualHug();
});

function applyConfigNames() {
  document.querySelectorAll(".config-her-name").forEach((el) => {
    el.textContent = CONFIG.herName;
  });
  document.querySelectorAll(".config-his-name").forEach((el) => {
    el.textContent = CONFIG.hisName;
  });
}

// ============================================================================
// 2. FLOATING HEARTS & PARTICLES CANVAS (Mobile & Retina Optimized)
// ============================================================================
function initFloatingHearts() {
  const canvas = document.getElementById("hearts-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100);
  });

  const hearts = [];
  // Use fewer particles on mobile devices for smooth 60fps and low battery usage
  const maxHearts = window.innerWidth < 640 ? 16 : 32;
  const colors = [
    "rgba(251, 113, 133, 0.45)",  // rose-400
    "rgba(244, 63, 94, 0.38)",   // rose-500
    "rgba(254, 205, 211, 0.5)",  // rose-200
    "rgba(243, 232, 255, 0.4)",  // purple-100
    "rgba(255, 228, 230, 0.5)"   // rose-100
  ];

  class HeartParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Start anywhere initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 40;
      this.size = Math.random() * 10 + 8; // 8 to 18px (better proportioned on smartphones)
      this.speedY = Math.random() * 0.7 + 0.35;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.wobble = 0;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.y -= this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.6 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.beginPath();

      // Draw Heart Shape using smooth bezier curves
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(
        -this.size / 2,
        (this.size + topCurveHeight) / 2,
        0,
        this.size,
        0,
        this.size
      );
      ctx.bezierCurveTo(
        0,
        this.size,
        this.size / 2,
        (this.size + topCurveHeight) / 2,
        this.size / 2,
        topCurveHeight
      );
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxHearts; i++) {
    hearts.push(new HeartParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach((heart) => {
      heart.update();
      heart.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================================
// 3. REASON CARDS INTERACTIVE ACCORDION (Touch & Click Friendly)
// ============================================================================
function setupReasonCards() {
  const cards = document.querySelectorAll(".reason-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const content = card.querySelector(".reason-card-body");
      const chevron = card.querySelector(".reason-chevron");
      const isExpanded = content.classList.contains("card-content-visible");

      // Close all other cards first for clean accordion UX
      cards.forEach((otherCard) => {
        const otherContent = otherCard.querySelector(".reason-card-body");
        const otherChevron = otherCard.querySelector(".reason-chevron");
        if (otherContent && otherContent !== content) {
          otherContent.classList.remove("card-content-visible");
          otherContent.classList.add("card-content-hidden");
          if (otherChevron) otherChevron.style.transform = "rotate(0deg)";
        }
      });

      // Toggle clicked card
      if (isExpanded) {
        content.classList.remove("card-content-visible");
        content.classList.add("card-content-hidden");
        if (chevron) chevron.style.transform = "rotate(0deg)";
      } else {
        content.classList.remove("card-content-hidden");
        content.classList.add("card-content-visible");
        if (chevron) chevron.style.transform = "rotate(180deg)";
        spawnSparklesAtElement(card);
      }
    });
  });
}

function spawnSparklesAtElement(element) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  if (window.confetti) {
    confetti({
      particleCount: 15,
      startVelocity: 15,
      spread: 60,
      origin: { x, y },
      colors: ["#fda4af", "#f43f5e", "#fef08a", "#fbcfe8"],
      disableForReducedMotion: true
    });
  }
}

// ============================================================================
// 4. THE FORGIVENESS COMPONENT (Smartphone & Desktop Optimized)
// ============================================================================
function setupForgivenessSection() {
  const forgiveBtn = document.getElementById("forgive-yes-btn");
  const needTimeBtn = document.getElementById("need-time-btn");
  const questionCard = document.getElementById("forgiveness-card");
  const forgivenCard = document.getElementById("forgiveness-success-card");

  if (!forgiveBtn || !needTimeBtn || !questionCard || !forgivenCard) return;

  // --- Button 1: "Yes, I forgive you" ---
  forgiveBtn.addEventListener("click", () => {
    // 1. Play sweet chime sound
    playRomanticChime();

    // 2. Trigger celebratory heart confetti
    triggerHeartConfetti();

    // 3. Smooth card swap animation
    questionCard.style.opacity = "0";
    questionCard.style.transform = "scale(0.96)";
    questionCard.style.transition = "all 0.35s ease-out";

    setTimeout(() => {
      questionCard.classList.add("hidden");
      forgivenCard.classList.remove("hidden");
      forgivenCard.style.opacity = "0";
      forgivenCard.style.transform = "scale(0.96)";

      // Trigger reflow
      void forgivenCard.offsetWidth;

      forgivenCard.style.transition = "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
      forgivenCard.style.opacity = "1";
      forgivenCard.style.transform = "scale(1)";

      // Refresh icons if needed
      if (window.lucide) lucide.createIcons();

      // Show toast
      showToast("Thank you for your warm heart and grace🤍");
    }, 380);
  });

  // --- Button 2: "I still need time🥺" ---
  // Mobile-aware dodge and gentle reassuring message cycle
  function handleNeedTimeAction() {
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // On mobile smartphones: play a gentle comforting shake without pushing button off-screen
      needTimeBtn.classList.remove("animate-soft-wiggle");
      void needTimeBtn.offsetWidth; // force reflow
      needTimeBtn.classList.add("animate-soft-wiggle");
      needTimeBtn.style.transform = "translate(0, 0)";
    } else {
      // Desktop: playful slight dodge within safe limits
      const randomX = (Math.random() - 0.5) * 50; // -25px to +25px
      const randomY = (Math.random() - 0.5) * 24; // -12px to +12px
      needTimeBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    // Cycle reassuring message
    const msg = CONFIG.needTimeMessages[currentNeedTimeIndex];
    needTimeBtn.innerHTML = `<span>${msg}</span>`;

    // Show gentle toast
    showToast(msg);

    currentNeedTimeIndex = (currentNeedTimeIndex + 1) % CONFIG.needTimeMessages.length;
  }

  // Hover on desktop
  needTimeBtn.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      handleNeedTimeAction();
    }
  });

  // Tap / click on touch devices and desktop
  needTimeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleNeedTimeAction();
  });

  // "Send another hug" button on success screen
  const celebrateMoreBtn = document.getElementById("celebrate-more-btn");
  if (celebrateMoreBtn) {
    celebrateMoreBtn.addEventListener("click", () => {
      triggerHeartConfetti();
      playRomanticChime();
      showToast("Another big, warm hug sent your way!🤗");
    });
  }
}

// Celebration Confetti
function triggerHeartConfetti() {
  if (!window.confetti) return;

  const count = window.innerWidth < 640 ? 120 : 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Multi-tier burst with warm rose, pink, cream, and gold
  fire(0.25, {
    spread: 35,
    startVelocity: 45,
    colors: ["#e11d48", "#f43f5e", "#fda4af"]
  });
  fire(0.2, {
    spread: 60,
    colors: ["#ffe4e6", "#fbcfe8", "#ffffff"]
  });
  fire(0.35, {
    spread: 90,
    decay: 0.91,
    scalar: 1.1,
    colors: ["#f43f5e", "#fb7185", "#fde047"]
  });
  fire(0.1, {
    spread: 110,
    startVelocity: 25,
    decay: 0.92,
    colors: ["#e11d48", "#f472b6"]
  });
  fire(0.1, {
    spread: 110,
    startVelocity: 35,
    colors: ["#ffe4e6", "#fda4af"]
  });
}

// ============================================================================
// 5. TOAST NOTIFICATION UTILITY (Smartphone Friendly)
// ============================================================================
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById("warm-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "warm-toast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="shrink-0"></span> <span class="leading-tight text-center">${message}</span>`;
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3600);
}

// ============================================================================
// 6. ROMANTIC AUDIO SYNTHESIZER & AMBIENCE PLAYER (Mobile Touch Aware)
// ============================================================================
function setupAudioPlayer() {
  const toggleBtn = document.getElementById("audio-toggle-btn");
  const playerWidget = document.getElementById("floating-audio-widget");
  const statusText = document.getElementById("audio-status-text");

  if (!playerWidget) return;

  // Check if custom audio URL is set
  if (CONFIG.customMusicUrl) {
    customAudioElement = new Audio(CONFIG.customMusicUrl);
    customAudioElement.loop = true;
  }

  function toggleAudioPlayback(e) {
    if (e) e.stopPropagation();

    if (!isMusicPlaying) {
      startMusic();
      if (playerWidget) playerWidget.classList.add("playing");
      if (statusText) statusText.textContent = "Playing Melody";
      if (toggleBtn) {
        toggleBtn.innerHTML = `<i data-lucide="pause" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 fill-rose-600"></i>`;
      }
      showToast("Playing gentle soothing ambient melody 🎵");
    } else {
      pauseMusic();
      if (playerWidget) playerWidget.classList.remove("playing");
      if (statusText) statusText.textContent = "Soft Melody";
      if (toggleBtn) {
        toggleBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 fill-rose-600 ml-0.5"></i>`;
      }
    }
    isMusicPlaying = !isMusicPlaying;
    if (window.lucide) lucide.createIcons();
  }

  // Allow clicking anywhere on the widget on mobile for easy finger tap
  playerWidget.addEventListener("click", toggleAudioPlayback);
}

function startMusic() {
  if (customAudioElement) {
    customAudioElement.play().catch((err) => console.log("Audio play blocked:", err));
    return;
  }

  // Web Audio API romantic generative chords
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  playNextSynthChord();
  if (synthInterval) clearInterval(synthInterval);
  synthInterval = setInterval(playNextSynthChord, 3800);
}

function pauseMusic() {
  if (customAudioElement) {
    customAudioElement.pause();
    return;
  }
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

// Gentle, romantic Rhodes / music-box style chord progression:
// Cmaj9 -> Am9 -> Fmaj7 -> G6 / Gsus4
const chordNotesProgression = [
  [261.63, 329.63, 392.00, 493.88, 587.33], // C4, E4, G4, B4, D5 (Cmaj9)
  [220.00, 261.63, 329.63, 392.00, 493.88], // A3, C4, E4, G4, B4 (Am9)
  [174.61, 261.63, 329.63, 349.23, 440.00], // F3, C4, E4, F4, A4 (Fmaj7)
  [196.00, 293.66, 392.00, 440.00, 523.25]  // G3, D4, G4, A4, C5 (G6/add9)
];
let chordIndex = 0;

function playNextSynthChord() {
  if (!audioContext) return;

  const notes = chordNotesProgression[chordIndex];
  chordIndex = (chordIndex + 1) % chordNotesProgression.length;

  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 3.4, 0.08 / (i + 1));
    }, i * 90);
  });
}

function playTone(freq, duration = 2.5, volume = 0.05) {
  if (!audioContext) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    // Soft low-pass filter for cozy warmth
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, audioContext.currentTime);

    // Gentle ADSR Envelope
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (err) {
    // Graceful fallback if audio is restricted
  }
}

// Celebratory Chime when she clicks "Yes, I forgive you"
function playRomanticChime() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // Joyful ascending arpeggio (C5 -> E5 -> G5 -> B5 -> C6)
  const chimeNotes = [523.25, 659.25, 783.99, 987.77, 1046.50];
  chimeNotes.forEach((freq, index) => {
    setTimeout(() => {
      playTone(freq, 1.8, 0.08);
    }, index * 110);
  });
}

// ============================================================================
// 7. VIRTUAL HUG INTERACTION (Touch and Click)
// ============================================================================
function setupVirtualHug() {
  const hugBtn = document.getElementById("send-hug-btn");
  if (!hugBtn) return;

  function handleHug(e) {
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if (e.clientX && e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    createFloatingParticle(clientX, clientY);

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    playTone(587.33, 1.2, 0.06);

    showToast("Virtual hug delivered straight to you!🤗");
  }

  hugBtn.addEventListener("click", handleHug);
}

function createFloatingParticle(x, y) {
  const particle = document.createElement("div");
  particle.className = "floating-hug-particle";
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.innerHTML = `<span style="font-size: 2rem; filter: drop-shadow(0 4px 8px rgba(225,29,72,0.3));">💖</span>`;
  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 2200);
}
