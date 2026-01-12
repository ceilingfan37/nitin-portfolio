(() => {
  const html = document.documentElement;

  const entrance = document.getElementById("entrance");
  const site = document.getElementById("site");
  const enterBtn = document.getElementById("enterBtn");

  const themeBtn = document.getElementById("themeBtn");
  const entranceThemeBtn = document.getElementById("entranceThemeBtn");
  const mobileThemeBtn = document.getElementById("mobileThemeBtn");
  const themeLabel = document.getElementById("themeLabel");

  const entranceSoundBtn = document.getElementById("entranceSoundBtn");
  const entranceSoundText = document.getElementById("entranceSoundText");

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Music
  const bgAudio = document.getElementById("bgAudio");
  const musicToggle = document.getElementById("musicToggle");
  const musicStatus = document.getElementById("musicStatus");

  // Sticky player controls
  const player = document.getElementById("player");
  const playerInner = player?.querySelector(".player-inner");
  const playerPlay = document.getElementById("playerPlay");
  const playerPlayIcon = document.getElementById("playerPlayIcon");
  const playerMute = document.getElementById("playerMute");
  const playerMuteIcon = document.getElementById("playerMuteIcon");
  const playerSeek = document.getElementById("playerSeek");
  const playerCur = document.getElementById("playerCur");
  const playerDur = document.getElementById("playerDur");

  // Icons
  const icons = {
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    x: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,

    play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l12-7z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h5v14H6zM13 5h5v14h-5z"/></svg>`,
    volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a9 9 0 0 1 0 12"/></svg>`,
    mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6"/><path d="M17 9l6 6"/></svg>`
  };

  function paintIcons() {
    document.querySelectorAll('[data-icon="menu"]').forEach(el => (el.innerHTML = icons.menu));
    updateThemeIcons();
  }

  function isDark() {
    return html.classList.contains("theme-dark");
  }

  function updateThemeIcons() {
    const icon = isDark() ? icons.sun : icons.moon;
    document.querySelectorAll('[data-icon="theme"]').forEach(el => (el.innerHTML = icon));
    if (themeLabel) themeLabel.textContent = isDark() ? "Light Mode" : "Dark Mode";
  }

  function setTheme(dark) {
    html.classList.toggle("theme-dark", dark);
    html.classList.toggle("theme-light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    updateThemeIcons();
  }

  function toggleTheme() {
    setTheme(!isDark());
  }

  // init theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") setTheme(false);
  else setTheme(true);

  paintIcons();

  // Mobile menu
  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("hidden");
    const iconTarget = menuBtn?.querySelector('[data-icon="menu"]');
    if (iconTarget) iconTarget.innerHTML = icons.x;
    menuBtn?.setAttribute("aria-label", "Close menu");
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("hidden");
    const iconTarget = menuBtn?.querySelector('[data-icon="menu"]');
    if (iconTarget) iconTarget.innerHTML = icons.menu;
    menuBtn?.setAttribute("aria-label", "Open menu");
  }
  function toggleMobileMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains("hidden")) openMobileMenu();
    else closeMobileMenu();
  }
  menuBtn?.addEventListener("click", toggleMobileMenu);

  // Smooth scroll
  function scrollToSection(id, closeMenu = true) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (closeMenu) closeMobileMenu();
  }

  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll");
      scrollToSection(id);
    });
  });

  themeBtn?.addEventListener("click", toggleTheme);
  entranceThemeBtn?.addEventListener("click", toggleTheme);
  mobileThemeBtn?.addEventListener("click", () => {
    toggleTheme();
    closeMobileMenu();
  });

  // IntersectionObserver animations
  let observer;
  function setupObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.14 });

    document.querySelectorAll("[data-animate].anim").forEach(el => observer.observe(el));
  }

  // Active section highlighting (throttled)
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = ["home","about","education","projects","work","hobbies","contact"];

  function setActiveSection(id) {
    navLinks.forEach(b => b.classList.toggle("active", b.getAttribute("data-scroll") === id));
  }

  let rafActive = 0;
  function onScrollActive() {
    if (rafActive) return;
    rafActive = requestAnimationFrame(() => {
      rafActive = 0;

      // Pick the last section whose top has crossed the nav offset.
      // This fixes edge cases near the very bottom where "Contact" may never satisfy a mid-viewport band check.
      let currentId = null;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 140) currentId = section;
      }

      // If the user is at (or extremely near) the bottom, force Contact as active.
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) currentId = "contact";

      if (currentId) setActiveSection(currentId);
    });
  }
  window.addEventListener("scroll", onScrollActive, { passive: true });

  // ===== MUSIC =====
  function formatTime(t) {
    if (!Number.isFinite(t) || t < 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setPlayIcons(playing) {
    if (playerPlayIcon) playerPlayIcon.innerHTML = playing ? icons.pause : icons.play;
    if (musicToggle) musicToggle.textContent = playing ? "Pause" : "Play";
    if (musicStatus) musicStatus.textContent = playing ? "Playing" : "Paused";
  }

  function setMuteIcon(muted) {
    if (playerMuteIcon) playerMuteIcon.innerHTML = muted ? icons.mute : icons.volume;
  }

  function syncTimeUI() {
    if (!bgAudio) return;
    if (playerCur) playerCur.textContent = formatTime(bgAudio.currentTime);

    const d = bgAudio.duration;
    if (playerDur) playerDur.textContent = (Number.isFinite(d) && d > 0) ? formatTime(d) : "--:--";
  }

  function syncSeekUI() {
    if (!bgAudio || !playerSeek) return;
    const d = bgAudio.duration;
    if (!Number.isFinite(d) || d <= 0) {
      playerSeek.disabled = true;
      playerSeek.value = "0";
      return;
    }
    playerSeek.disabled = false;
    const max = Number(playerSeek.max || 1000);
    const v = Math.round((bgAudio.currentTime / d) * max);
    playerSeek.value = String(Math.max(0, Math.min(max, v)));
  }

  async function tryPlayMusic() {
    if (!bgAudio) return;
    try { await bgAudio.play(); } catch {}
  }

  function togglePlay() {
    if (!bgAudio) return;
    if (bgAudio.paused) tryPlayMusic();
    else bgAudio.pause();
  }

  function toggleMute() {
    if (!bgAudio) return;
    bgAudio.muted = !bgAudio.muted;
    localStorage.setItem("muted", bgAudio.muted ? "1" : "0");
    setMuteIcon(bgAudio.muted);
    setEntranceSoundUI(bgAudio.muted);
  }

  // ===== Entrance sound preference =====
  function setEntranceSoundUI(isMuted) {
    if (!entranceSoundBtn || !entranceSoundText) return;
    entranceSoundBtn.classList.toggle("is-off", isMuted);
    entranceSoundText.textContent = isMuted ? "Sound off" : "Sound on";
  }

  const savedMuted = localStorage.getItem("muted") === "1";
  if (bgAudio) bgAudio.muted = savedMuted;
  setMuteIcon(savedMuted);
  setEntranceSoundUI(savedMuted);

  entranceSoundBtn?.addEventListener("click", () => {
    const nowMuted = !(localStorage.getItem("muted") === "1");
    localStorage.setItem("muted", nowMuted ? "1" : "0");
    if (bgAudio) bgAudio.muted = nowMuted;
    setMuteIcon(nowMuted);
    setEntranceSoundUI(nowMuted);
  });

  // Events
  musicToggle?.addEventListener("click", togglePlay);
  playerPlay?.addEventListener("click", togglePlay);
  playerMute?.addEventListener("click", toggleMute);

  playerSeek?.addEventListener("input", (e) => {
    if (!bgAudio) return;
    const d = bgAudio.duration;
    if (!Number.isFinite(d) || d <= 0) return;

    const max = Number(playerSeek.max || 1000);
    const pct = Number(e.target.value) / max;
    bgAudio.currentTime = Math.max(0, Math.min(d, pct * d));
  });

  bgAudio?.addEventListener("play", () => setPlayIcons(true));
  bgAudio?.addEventListener("pause", () => setPlayIcons(false));
  bgAudio?.addEventListener("timeupdate", () => { syncTimeUI(); syncSeekUI(); });
  bgAudio?.addEventListener("loadedmetadata", () => { syncTimeUI(); syncSeekUI(); });
  bgAudio?.addEventListener("durationchange", () => { syncTimeUI(); syncSeekUI(); });

  // ===== PLAYER VISIBILITY: show while scrolling, auto-hide after stop =====
  let hideTimer = null;
  let hoveringPlayer = false;
  let userInteracting = false;

  function showPlayerTemporarily() {
    if (!player || site.classList.contains("hidden")) return;
    player.classList.add("show");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!hoveringPlayer && !userInteracting) player.classList.remove("show");
    }, 1100);
  }

  // Throttle scroll -> player show (RAF)
  let rafPlayer = 0;
  window.addEventListener("scroll", () => {
    if (rafPlayer) return;
    rafPlayer = requestAnimationFrame(() => {
      rafPlayer = 0;
      showPlayerTemporarily();
    });
  }, { passive: true });

  const setInteraction = (val) => {
    userInteracting = val;
    if (val) player?.classList.add("show");
    else showPlayerTemporarily();
  };

  playerInner?.addEventListener("mouseenter", () => {
    hoveringPlayer = true;
    player.classList.add("show");
    if (hideTimer) clearTimeout(hideTimer);
  });

  playerInner?.addEventListener("mouseleave", () => {
    hoveringPlayer = false;
    showPlayerTemporarily();
  });

  playerInner?.addEventListener("focusin", () => setInteraction(true));
  playerInner?.addEventListener("focusout", () => setInteraction(false));

  playerSeek?.addEventListener("pointerdown", () => setInteraction(true));
  window.addEventListener("pointerup", () => setInteraction(false));

  // ENTER => show site, autoplay (user gesture)
  enterBtn?.addEventListener("click", async () => {
    entrance.classList.add("hidden");
    site.classList.remove("hidden");

    setupObserver();
    setTimeout(() => scrollToSection("home", false), 50);
    onScrollActive();

    const mutedPref = localStorage.getItem("muted") === "1";
    if (bgAudio) {
      bgAudio.muted = mutedPref;
      bgAudio.volume = 0.9;
      setMuteIcon(mutedPref);
      setPlayIcons(!bgAudio.paused);
    }

    await tryPlayMusic();
    showPlayerTemporarily();
  });

  // Init
  if (!site.classList.contains("hidden")) {
    setupObserver();
    onScrollActive();
    syncTimeUI();
    syncSeekUI();
  } else {
    player?.classList.remove("show");
  }
})();


