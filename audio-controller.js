export function createAudioController({
  state,
  startThemeAudio,
  levelOneThemeAudio,
  levelTwoThemeAudio,
  levelThreeThemeAudio,
  levelFourThemeAudio
}) {
  let audioContext = null;

  const levelTracks = [levelOneThemeAudio, levelTwoThemeAudio, levelThreeThemeAudio, levelFourThemeAudio];

  function configureMusic() {
    if (startThemeAudio) {
      startThemeAudio.volume = 0.45;
    }
    levelTracks.forEach((track) => {
      if (track) {
        track.volume = 0.5;
      }
    });
  }

  function stopTrack(track, reset = false) {
    if (!track) {
      return;
    }
    track.pause();
    if (reset) {
      track.currentTime = 0;
    }
  }

  function playTrack(track) {
    if (!track || !state.soundOn) {
      return;
    }

    const playPromise = track.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay is blocked, retry on the next user gesture.
      });
    }
  }

  function syncExternalMusic() {
    if (!state.soundOn) {
      stopTrack(startThemeAudio);
      levelTracks.forEach((track) => stopTrack(track));
      return;
    }

    if (state.screen === "start") {
      levelTracks.forEach((track) => stopTrack(track));
      playTrack(startThemeAudio);
      return;
    }

    stopTrack(startThemeAudio);
    const canPlayLevelTrack = state.running && !state.pausedForQuiz && !state.pausedForBoss && !state.inCountdown;
    const activeTrack = levelTracks[state.levelIndex] || null;

    levelTracks.forEach((track) => {
      if (track && track !== activeTrack) {
        stopTrack(track);
      }
    });

    if (canPlayLevelTrack && activeTrack) {
      playTrack(activeTrack);
      return;
    }

    if (activeTrack) {
      stopTrack(activeTrack);
    }
  }

  function ensureAudio() {
    if (!state.soundOn) {
      return null;
    }
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      try {
        audioContext = new AudioContextClass();
      } catch (_error) {
        return null;
      }
    }
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().catch(() => {
        // Ignore resume failures silently.
      });
    }
    return audioContext || null;
  }

  function unlockAudioFromGesture() {
    if (startThemeAudio) {
      startThemeAudio.muted = false;
      if (state.screen === "start" && startThemeAudio.paused) {
        startThemeAudio.play().catch(() => {
          // Browser may still block audio.
        });
      }
    }
    levelTracks.forEach((track) => {
      if (track) {
        track.muted = false;
      }
    });

    ensureAudio();
    syncExternalMusic();
  }

  function bindUnlockListeners() {
    ["click", "touchstart", "keydown", "mousemove", "mousedown", "scroll", "touchmove"].forEach((eventName) => {
      document.addEventListener(eventName, unlockAudioFromGesture, { once: true, passive: true });
    });
    window.addEventListener("pointerdown", unlockAudioFromGesture, { once: true, passive: true });
  }

  function playTone(frequency, duration, type, volume, endFrequency = null, delay = 0) {
    const ac = ensureAudio();
    if (!ac) {
      return;
    }
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const start = ac.currentTime + delay;
    const end = start + duration;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, end);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(start);
    osc.stop(end);
  }

  function playCorrectSound() {
    playTone(520, 0.16, "triangle", 0.05, 760);
    playTone(760, 0.18, "triangle", 0.04, 980, 0.05);
  }

  function playCrashSound() {
    playTone(130, 0.35, "sawtooth", 0.08, 45);
    playTone(90, 0.32, "square", 0.04, 40, 0.03);
  }

  function playTurboSound() {
    playTone(260, 0.28, "square", 0.05, 900);
  }

  function playCoinSound() {
    playTone(720, 0.12, "sine", 0.04, 880);
  }

  return {
    configureMusic,
    stopTrack,
    syncExternalMusic,
    unlockAudioFromGesture,
    bindUnlockListeners,
    playCorrectSound,
    playCrashSound,
    playTurboSound,
    playCoinSound
  };
}
