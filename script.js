import { guardarPuntaje, obtenerRanking } from "./firebase-ranking.js";
import {
  STORAGE_KEY,
  lanes,
  FIXED_SPAWN_INTERVAL,
  HAZARD_SPAWN_INTERVAL,
  PICKUP_SPAWN_INTERVAL,
  PLAYER_DRAW_Z,
  BASE_WORLD_SPEED,
  LEVEL_TRAVEL_RATE,
  OBJECT_DESPAWN_Z,
  MIN_HAZARD_SPAWN_GAP_Z,
  SAFE_COLLISION_SCALE,
  levels,
  obstacleTypes,
  obstacleSpriteFiles,
  hazardVehicleVariants,
  obstacleSpriteRender,
  obstacleSprites,
  playerCarSprite,
  state
} from "./game-config.js";
import { pickQuestionForLevel, shuffleOptions } from "./question-bank.js";
import { createAudioController } from "./audio-controller.js";

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startGameBtn = document.getElementById("startGameBtn");
const toggleAudioBtn = document.getElementById("toggleAudioBtn");
const toggleInfoBtn = document.getElementById("toggleInfoBtn");
const dashboardInfoPanel = document.getElementById("dashboardInfoPanel");
const selectedPlayerName = document.getElementById("selectedPlayerName");
const introScreen = document.getElementById("introScreen");
const introLogo = document.getElementById("introLogo");
const introLogoFallback = document.getElementById("introLogoFallback");
const introProgressFill = document.getElementById("introProgressFill");
const introProgressValue = document.getElementById("introProgressValue");
const namePromptModal = document.getElementById("namePromptModal");
const preGamePlayerName = document.getElementById("preGamePlayerName");
const namePromptError = document.getElementById("namePromptError");
const confirmPlayerNameBtn = document.getElementById("confirmPlayerNameBtn");
const clearRankingBtn = document.getElementById("clearRankingBtn");
const leftControl = document.getElementById("leftControl");
const rightControl = document.getElementById("rightControl");
const turboControl = document.getElementById("turboControl");
const stopTurboControl = document.getElementById("stopTurboControl");
const countdownOverlay = document.getElementById("countdownOverlay");
const extraLifeOfferBtn = document.getElementById("extraLifeOfferBtn");
const extraLifeOfferText = document.getElementById("extraLifeOfferText");

const levelValue = document.getElementById("levelValue");
const mapValue = document.getElementById("mapValue");
const weatherValue = document.getElementById("weatherValue");
const scoreValue = document.getElementById("scoreValue");
const comboValue = document.getElementById("comboValue");
const coinsValue = document.getElementById("coinsValue");
const livesValue = document.getElementById("livesValue");
const timerValue = document.getElementById("timerValue");
const progressValue = document.getElementById("progressValue");
const levelProgressText = document.getElementById("levelProgressText");
const missionLabel = document.getElementById("missionLabel");
const statusLabel = document.getElementById("statusLabel");
const turboMeterFill = document.getElementById("turboMeterFill");
const levelProgressFill = document.getElementById("levelProgressFill");
const bossInfo = document.getElementById("bossInfo");
const rewardInfo = document.getElementById("rewardInfo");
const shieldInfo = document.getElementById("shieldInfo");
const worldMap = document.getElementById("worldMap");
const rankingPanel = document.getElementById("rankingPanel");
const rankingList = document.getElementById("rankingList");

const quizModal = document.getElementById("quizModal");
const quizTitle = document.getElementById("quizTitle");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");

const bossModal = document.getElementById("bossModal");
const bossTitle = document.getElementById("bossTitle");
const bossText = document.getElementById("bossText");
const bossAnswers = document.getElementById("bossAnswers");
const bossProgressText = document.getElementById("bossProgressText");

const levelTransitionModal = document.getElementById("levelTransitionModal");
const nextBiomeTitle = document.getElementById("nextBiomeTitle");
const nextBiomeText = document.getElementById("nextBiomeText");
const nextBiomeBtn = document.getElementById("nextBiomeBtn");

const gameOverModal = document.getElementById("gameOverModal");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");
const finalLevel = document.getElementById("finalLevel");
const playerName = document.getElementById("playerName");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const viewLiveRankingBtn = document.getElementById("viewLiveRankingBtn");
const startThemeAudio = document.getElementById("startThemeAudio");
const levelOneThemeAudio = document.getElementById("levelOneThemeAudio");
const levelTwoThemeAudio = document.getElementById("levelTwoThemeAudio");
const levelThreeThemeAudio = document.getElementById("levelThreeThemeAudio");
const levelFourThemeAudio = document.getElementById("levelFourThemeAudio");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true }) || canvas.getContext("2d");
const biomeBackgrounds = {};

let countdownInterval = null;
let timerInterval = null;
let lastHudUpdateAt = 0;
let lastPresentedFrameAt = 0;

const isLikelyMobileDevice =
  (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) ||
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
const deviceMemoryGb = Number(navigator.deviceMemory || 4);
const deviceCores = Number(navigator.hardwareConcurrency || 4);
const lowPerformanceDevice = isLikelyMobileDevice && (deviceMemoryGb <= 4 || deviceCores <= 6);
const PERF = {
  maxDpr: lowPerformanceDevice ? 1.5 : 2,
  frameIntervalMs: lowPerformanceDevice ? 1000 / 50 : 1000 / 60,
  hudIntervalMs: lowPerformanceDevice ? 120 : 70,
  weatherSpawnChance: lowPerformanceDevice ? 0.09 : 0.18,
  maxWeatherParticles: lowPerformanceDevice ? 80 : 150,
  maxParticles: lowPerformanceDevice ? 70 : 140,
  roadSegments: lowPerformanceDevice ? 26 : 36,
  enableExpensiveEffects: !lowPerformanceDevice
};

const audioController = createAudioController({
  state,
  startThemeAudio,
  levelOneThemeAudio,
  levelTwoThemeAudio,
  levelThreeThemeAudio,
  levelFourThemeAudio
});

const {
  configureMusic,
  stopTrack,
  syncExternalMusic,
  unlockAudioFromGesture,
  bindUnlockListeners,
  playCorrectSound,
  playCrashSound,
  playTurboSound,
  playCoinSound
} = audioController;

function preloadObstacleSprites() {
  Object.entries(obstacleSpriteFiles).forEach(([type, path]) => {
    const img = new Image();
    img.decoding = "async";
    img.src = path;
    obstacleSprites[type] = img;
  });
}

function preloadBiomeBackgrounds() {
  levels.forEach((level, index) => {
    if (!level.backgroundImage) {
      return;
    }
    const img = new Image();
    img.decoding = "async";
    img.src = level.backgroundImage;
    biomeBackgrounds[index] = img;
  });
}

function currentLevel() {
  return levels[state.levelIndex];
}

function currentBiomeBackground() {
  return biomeBackgrounds[state.levelIndex];
}

function hasBiomeBackground() {
  const image = currentBiomeBackground();
  return Boolean(image && image.complete && image.naturalWidth > 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function setupIntroLogo() {
  if (!introLogo || !introLogoFallback) {
    return;
  }
  const customLogo = (introLogo.dataset.logoSrc || "").trim();
  if (!customLogo) {
    introLogo.classList.add("hidden");
    introLogoFallback.classList.remove("hidden");
    return;
  }

  introLogo.src = customLogo;
  introLogo.classList.remove("hidden");
  introLogoFallback.classList.add("hidden");
  introLogo.addEventListener(
    "error",
    () => {
      introLogo.classList.add("hidden");
      introLogoFallback.classList.remove("hidden");
    },
    { once: true }
  );
}

function playIntroSequence() {
  return new Promise((resolve) => {
    if (!introScreen || !introProgressFill || !introProgressValue) {
      resolve();
      return;
    }

    setupIntroLogo();
    let progress = 0;

    const updateProgress = () => {
      introProgressFill.style.width = `${progress}%`;
      introProgressValue.textContent = `${progress}%`;
    };

    const completeIntro = () => {
      window.setTimeout(() => {
        introScreen.classList.add("is-fading");
        window.setTimeout(() => {
          introScreen.classList.add("hidden");
          resolve();
        }, 900);
      }, 360);
    };

    const step = () => {
      const increment = Math.floor(randomBetween(4, 14));
      progress = clamp(progress + increment, 0, 100);
      updateProgress();

      if (progress >= 100) {
        completeIntro();
        return;
      }

      window.setTimeout(step, Math.floor(randomBetween(120, 240)));
    };

    updateProgress();
    window.setTimeout(step, 260);
  });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, PERF.maxDpr);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function showModal(modal) {
  modal.classList.remove("hidden");
}

function hideModal(modal) {
  modal.classList.add("hidden");
}

function normalizePlayerName(value) {
  return (value || "").trim().slice(0, 14);
}

function updateSelectedPlayerLabel() {
  if (!selectedPlayerName) {
    return;
  }
  selectedPlayerName.textContent = state.playerDisplayName
    ? `Jugador: ${state.playerDisplayName}`
    : "Jugador: sin registrar";
}

function savePlayerDisplayName(name) {
  const normalized = normalizePlayerName(name);
  if (!normalized) {
    return false;
  }
  state.playerDisplayName = normalized;
  playerName.value = normalized;
  updateSelectedPlayerLabel();
  return true;
}

function openNamePrompt() {
  if (!namePromptModal) {
    return;
  }
  namePromptError.classList.add("hidden");
  preGamePlayerName.value = state.playerDisplayName || "";
  showModal(namePromptModal);
  setTimeout(() => preGamePlayerName.focus(), 20);
}

function closeNamePrompt() {
  if (!namePromptModal) {
    return;
  }
  hideModal(namePromptModal);
}

function confirmPlayerNameAndContinue() {
  if (!savePlayerDisplayName(preGamePlayerName.value)) {
    namePromptError.classList.remove("hidden");
    preGamePlayerName.focus();
    return false;
  }
  closeNamePrompt();
  return true;
}

function resetState() {
  state.running = false;
  state.pausedForQuiz = false;
  state.pausedForBoss = false;
  state.pausedForTransition = false;
  state.inCountdown = false;
  state.levelIndex = 0;
  state.score = 0;
  state.levelScoreStart = 0;
  state.combo = 0;
  state.comboMultiplier = 1;
  state.coins = 0;
  state.lives = 3;
  state.timer = levels[0].timeLimit;
  state.playerX = lanes[1];
  state.playerLane = 1;
  state.steering = 0;
  state.worldSpeed = BASE_WORLD_SPEED;
  state.curvePhase = 0;
  state.objects = [];
  state.particles = [];
  state.weatherParticles = [];
  state.spawnCooldown = FIXED_SPAWN_INTERVAL;
  state.hazardSpawnCooldown = HAZARD_SPAWN_INTERVAL;
  state.pickupSpawnCooldown = PICKUP_SPAWN_INTERVAL;
  state.lastFrame = 0;
  state.turbo = 0;
  state.turboActiveUntil = 0;
  state.nextExtraLifeOfferCoins = state.extraLifeOfferStep;
  state.extraLifeOffers = 0;
  state.extraLifeEarnedThisBiome = 0;
  state.missionCompleted = false;
  state.missionProgress = 0;
  state.streakCorrect = 0;
  state.turbosUsedLevel = 0;
  state.levelBossStarted = false;
  state.bossReady = false;
  state.bossRound = 0;
  state.levelDistance = 0;
  state.rankingSaved = false;
  state.pendingCollisionReason = null;
  state.usedQuestionIdsByLevel = {};
  state.usedBossQuestionIdsByLevel = {};
  stopTrack(levelOneThemeAudio, true);
  stopTrack(levelTwoThemeAudio, true);
  stopTrack(levelThreeThemeAudio, true);
  stopTrack(levelFourThemeAudio, true);
  playerName.value = state.playerDisplayName || "";
  saveScoreBtn.textContent = "Guardar ranking";
  hideModal(quizModal);
  hideModal(bossModal);
  hideModal(levelTransitionModal);
  hideModal(gameOverModal);
  renderWorldMap();
  updateHud();
}

function startGameFlow() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  state.screen = "game";
  stopTrack(startThemeAudio, true);
  resetState();
  resizeCanvas();
  syncExternalMusic();
  startCountdown();
}

function startCountdown() {
  state.inCountdown = true;
  const steps = ["3", "2", "1", "GO"];
  countdownOverlay.classList.remove("hidden");
  countdownOverlay.textContent = steps[0];
  let index = 0;
  clearInterval(countdownInterval);
  countdownInterval = window.setInterval(() => {
    index += 1;
    if (index >= steps.length) {
      clearInterval(countdownInterval);
      countdownOverlay.classList.add("hidden");
      state.inCountdown = false;
      state.running = true;
      statusLabel.textContent = "Carrera iniciada";
      syncExternalMusic();
      startTimer();
      return;
    }
    countdownOverlay.textContent = steps[index];
  }, 700);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = window.setInterval(() => {
    if (!state.running || state.pausedForQuiz || state.pausedForBoss || state.pausedForTransition || state.inCountdown) {
      return;
    }
    state.timer -= 1;
    if (state.timer <= 0) {
      state.timer = 0;
      endGame(false, "Se acabo el tiempo del circuito.");
    }
    updateHud();
  }, 1000);
}

function updateHud(force = false) {
  const now = performance.now();
  if (!force && now - lastHudUpdateAt < PERF.hudIntervalMs) {
    return;
  }
  lastHudUpdateAt = now;
  const level = currentLevel();
  const levelProgress = clamp((state.levelDistance / level.trackLength) * 100, 0, 100);
  levelValue.textContent = state.levelIndex + 1;
  mapValue.textContent = level.map;
  weatherValue.textContent = level.weather;
  scoreValue.textContent = state.score;
  comboValue.textContent = `x${state.comboMultiplier.toFixed(1)}`;
  coinsValue.textContent = state.coins;
  livesValue.textContent = state.lives;
  timerValue.textContent = state.timer;
  progressValue.textContent = `${Math.round(levelProgress)}%`;
  levelProgressText.textContent = `${Math.floor(state.levelDistance)} / ${level.trackLength}`;
  levelProgressFill.style.width = `${levelProgress}%`;
  levelProgressFill.style.height = `${levelProgress}%`;
  missionLabel.textContent = `Mision: ${level.mission}`;
  turboMeterFill.style.width = `${clamp(state.turbo, 0, 100)}%`;
  turboMeterFill.style.height = `${clamp(state.turbo, 0, 100)}%`;
  bossInfo.textContent = state.bossReady
    ? `Jefe listo: ${level.bossRounds} preguntas para cerrar ${level.map}`
    : `Jefe al llegar al 100% del recorrido`;
  rewardInfo.textContent = `Cada ${state.extraLifeOfferStep} monedas activas una vida manual, maximo ${state.extraLifeMaxPerBiome} por bioma`;
  shieldInfo.textContent = state.extraLifeOffers > 0
    ? `Tienes ${state.extraLifeOffers} vida${state.extraLifeOffers > 1 ? "s" : ""} extra listas para reclamar`
    : `Vidas extra del bioma: ${state.extraLifeEarnedThisBiome}/${state.extraLifeMaxPerBiome}`;
  if (extraLifeOfferBtn && extraLifeOfferText) {
    extraLifeOfferBtn.classList.toggle("hidden", state.extraLifeOffers <= 0 || state.screen !== "game");
    extraLifeOfferText.textContent = state.extraLifeOffers > 1
      ? `Toca aqui para reclamar ${state.extraLifeOffers} vidas`
      : "Toca aqui para +1 vida";
  }
}

function renderWorldMap() {
  worldMap.innerHTML = "";
  levels.forEach((level, index) => {
    const node = document.createElement("div");
    node.className = "world-node";
    if (index < state.levelIndex) {
      node.classList.add("completed");
    } else if (index === state.levelIndex) {
      node.classList.add("active");
    }
    node.innerHTML = `
      <strong>Nivel ${index + 1}: ${level.name}</strong>
      <span>${level.map} | ${level.weather} | ${level.timeOfDay} | Recorrido ${level.trackLength}</span>
    `;
    worldMap.appendChild(node);
  });
}

function getRanking() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveRanking(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderRanking() {
  const ranking = getRanking();
  rankingList.innerHTML = "";
  if (!ranking.length) {
    const item = document.createElement("li");
    item.textContent = "Todavia no hay pilotos guardados.";
    rankingList.appendChild(item);
    return;
  }
  ranking.forEach((entry, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>#${index + 1} ${entry.name}</strong>
      <span>${entry.score} pts | ${entry.coins} monedas | Nivel ${entry.level}</span>
    `;
    rankingList.appendChild(item);
  });
}

function saveCurrentScore() {
  if (state.rankingSaved) {
    return;
  }
  const inputName = normalizePlayerName(playerName.value);
  const name = inputName || state.playerDisplayName || "Piloto";
  state.playerDisplayName = name;
  playerName.value = name;
  updateSelectedPlayerLabel();
  const ranking = getRanking();
  ranking.push({
    name,
    score: state.score,
    coins: state.coins,
    level: state.levelIndex + 1
  });
  ranking.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.coins - a.coins;
  });
  saveRanking(ranking.slice(0, 8));
  state.rankingSaved = true;
  saveScoreBtn.textContent = "Ranking guardado";
  renderRanking();
}

function goToLiveRanking() {
  saveCurrentScore();
  hideModal(gameOverModal);
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderRanking();
  statusLabel.textContent = "Ranking en directo";

  if (rankingPanel) {
    rankingPanel.classList.add("ranking-live-focus");
    rankingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      rankingPanel.classList.remove("ranking-live-focus");
    }, 1800);
  }
}

function updateMission() {
  const mission = currentLevel().mission;
  if (mission.includes("bien")) {
    const streakTarget = Number(mission.match(/(\d+)/)?.[1] || 0);
    state.missionProgress = clamp(state.streakCorrect, 0, streakTarget);
    if (streakTarget > 0 && state.streakCorrect >= streakTarget) {
      completeMission();
    }
  } else if (mission.includes("monedas")) {
    const coinTarget = Number(mission.match(/(\d+)/)?.[1] || 0);
    state.missionProgress = clamp(state.coins - state.levelScoreStart, 0, coinTarget);
    if (coinTarget > 0 && state.missionProgress >= coinTarget) {
      completeMission();
    }
  } else if (mission.includes("turbos")) {
    const turboTarget = Number(mission.match(/(\d+)/)?.[1] || 0);
    state.missionProgress = clamp(state.turbosUsedLevel, 0, turboTarget);
    if (turboTarget > 0 && state.turbosUsedLevel >= turboTarget) {
      completeMission();
    }
  }
}

function completeMission() {
  if (state.missionCompleted) {
    return;
  }
  state.missionCompleted = true;
  state.score += 18;
  state.turbo = clamp(state.turbo + 35, 0, 100);
  statusLabel.textContent = "Mision cumplida: turbo y puntos extra";
  spawnBurst(canvas.clientWidth * 0.5, canvas.clientHeight - 40, "#77ff99", 24);
  updateHud();
}

function triggerCollisionQuestion(reason) {
  if (state.pausedForQuiz || state.pausedForBoss || state.inCountdown || state.pendingCollisionReason) {
    return;
  }
  state.pendingCollisionReason = reason;
  showQuiz();
}

function isBlockingType(type) {
  const config = obstacleTypes[type];
  if (!config) {
    return false;
  }
  return config.kind === "hazard" || config.kind === "quiz";
}

function getBlockedLanesInWindow(minZ = 0.03, maxZ = 0.44) {
  const blocked = new Set();
  state.objects.forEach((object) => {
    if (object.z >= minZ && object.z <= maxZ && object.kind === "hazard") {
      blocked.add(object.laneIndex);
    }
  });
  return blocked;
}

function hasHazardTooCloseInLane(laneIndex, minGapZ = MIN_HAZARD_SPAWN_GAP_Z) {
  return state.objects.some(
    (object) =>
      object.laneIndex === laneIndex &&
      object.kind === "hazard" &&
      Math.abs(object.z - 0.05) < minGapZ
  );
}

function createObject(selected, laneIndex) {
  const config = obstacleTypes[selected];
  if (!config) {
    return;
  }

  state.objects.push({
    type: selected,
    kind: config.kind,
    color: config.color,
    width: config.width,
    height: config.height,
    vehicleVariant: config.kind === "hazard" ? randomItem(hazardVehicleVariants) : null,
    spriteFlip: config.kind === "hazard" ? Math.random() > 0.5 : false,
    laneIndex,
    x: lanes[laneIndex],
    z: 0.05,
    wobble: Math.random() * Math.PI * 2
  });
}

function getObjectCountByKind(kind) {
  return state.objects.filter((object) => object.kind === kind).length;
}

function getPickupLanePool() {
  const blockedLanes = getBlockedLanesInWindow(0.06, 0.62);
  const preferred = [0, 1, 2].filter((lane) => !blockedLanes.has(lane));
  return preferred.length ? preferred : [0, 1, 2];
}

function spawnHazard() {
  const blockedLanes = getBlockedLanesInWindow();
  if (blockedLanes.size >= lanes.length - 1) {
    return false;
  }

  let lanePool = [0, 1, 2].filter((lane) => !blockedLanes.has(lane));
  lanePool = lanePool.filter((lane) => !hasHazardTooCloseInLane(lane));
  if (!lanePool.length) {
    return false;
  }

  const hazardChoices = ["cone", "oil", "hole", "truck", "cone", "oil", "truck"];
  createObject(randomItem(hazardChoices), randomItem(lanePool));
  return true;
}

function spawnPickup() {
  const pickupChoices = ["coin", "coin", "coin", "coin", "coin", "turbo"];
  const lanePool = getPickupLanePool();
  createObject(randomItem(pickupChoices), randomItem(lanePool));
  return true;
}

function spawnObject(type = null) {
  if (type && obstacleTypes[type]) {
    const lanePool = isBlockingType(type)
      ? [0, 1, 2].filter((lane) => !getBlockedLanesInWindow().has(lane) && !hasHazardTooCloseInLane(lane))
      : getPickupLanePool();
    const fallbackLanes = lanePool.length ? lanePool : [0, 1, 2];
    createObject(type, randomItem(fallbackLanes));
    return;
  }

  if (Math.random() < 0.65) {
    if (!spawnHazard()) {
      spawnPickup();
    }
    return;
  }

  if (!spawnPickup()) {
    spawnHazard();
  }
}

function generateFallbackMathQuestion(kind = "normal") {
  const operations = ["+", "-", "*", "/"];
  const op = kind === "boss" ? randomItem(operations) : randomItem(operations.slice(0, state.levelIndex + 1));
  let a;
  let b;
  let correct;

  if (op === "+") {
    a = Math.floor(Math.random() * 30) + 5;
    b = Math.floor(Math.random() * 30) + 4;
    correct = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 35) + 20;
    b = Math.floor(Math.random() * 15) + 3;
    correct = a - b;
  } else if (op === "*") {
    a = Math.floor(Math.random() * 10) + 2;
    b = Math.floor(Math.random() * 10) + 2;
    correct = a * b;
  } else {
    b = Math.floor(Math.random() * 8) + 2;
    correct = Math.floor(Math.random() * 9) + 2;
    a = b * correct;
  }

  const options = new Set([correct]);
  while (options.size < 4) {
    const candidate = correct + (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
    if (candidate >= 0) {
      options.add(candidate);
    }
  }

  return {
    text: `${a} ${op} ${b} = ?`,
    correct,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
}

function getUsedQuestionIdSet(kind, level) {
  const bucket = kind === "boss" ? state.usedBossQuestionIdsByLevel : state.usedQuestionIdsByLevel;
  if (!bucket[level]) {
    bucket[level] = [];
  }
  return new Set(bucket[level]);
}

function rememberQuestionId(kind, level, id) {
  const bucket = kind === "boss" ? state.usedBossQuestionIdsByLevel : state.usedQuestionIdsByLevel;
  if (!bucket[level]) {
    bucket[level] = [];
  }
  bucket[level].push(id);
}

function generateQuestion(kind = "normal") {
  const level = state.levelIndex + 1;
  const usedIds = getUsedQuestionIdSet(kind, level);
  const selected = pickQuestionForLevel(level, kind, usedIds);

  if (!selected) {
    return generateFallbackMathQuestion(kind);
  }

  rememberQuestionId(kind, level, selected.id);

  return {
    text: selected.question,
    correct: selected.options[selected.correctIndex],
    options: shuffleOptions(selected.options),
    id: selected.id
  };
}

function showQuiz() {
  if (state.pausedForQuiz || state.pausedForBoss) {
    return;
  }
  state.pausedForQuiz = true;
  state.running = false;
  syncExternalMusic();
  const q = generateQuestion("normal");
  quizTitle.textContent = state.pendingCollisionReason ? "Choque: responde para salvarte" : "Pregunta rapida";
  questionText.textContent = q.text;
  answers.innerHTML = "";
  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(option === q.correct));
    answers.appendChild(button);
  });
  showModal(quizModal);
}

function clearRoadAfterAnswer() {
  // Vacia objetos activos para que el jugador retome con la pista limpia.
  state.objects = [];
  state.spawnCooldown = FIXED_SPAWN_INTERVAL;
  state.hazardSpawnCooldown = HAZARD_SPAWN_INTERVAL * 0.9;
  state.pickupSpawnCooldown = PICKUP_SPAWN_INTERVAL * 0.75;
}

function answerQuiz(correct) {
  hideModal(quizModal);
  state.pausedForQuiz = false;
  state.running = true;
  syncExternalMusic();
  if (correct) {
    state.streakCorrect += 1;
    state.combo += 1;
    state.comboMultiplier = 1 + Math.min(2.5, state.combo * 0.2);
    const gained = state.pendingCollisionReason ? 0 : Math.round(6 * state.comboMultiplier);
    state.score += gained;
    state.turbo = clamp(state.turbo + 22, 0, 100);
    statusLabel.textContent = state.pendingCollisionReason ? "Te salvaste del choque" : `Correcta: +${gained} puntos`;
    playCorrectSound();
    spawnBurst(canvas.clientWidth / 2, canvas.clientHeight * 0.7, "#45d6ff", 18);
  } else {
    state.streakCorrect = 0;
    state.combo = 0;
    state.comboMultiplier = 1;
    loseLife(state.pendingCollisionReason || "Fallaste la pregunta");
  }
  state.pendingCollisionReason = null;
  clearRoadAfterAnswer();
  updateMission();
  updateHud();
}

function showBossBattle() {
  state.pausedForBoss = true;
  state.pausedForTransition = false;
  state.running = false;
  state.bossReady = true;
  syncExternalMusic();
  state.levelBossStarted = true;
  state.bossRound = 0;
  bossTitle.textContent = `Jefe de ${currentLevel().name}`;
  nextBossQuestion();
  showModal(bossModal);
}

function nextBossQuestion() {
  if (state.bossRound >= currentLevel().bossRounds) {
    finishBossBattle();
    return;
  }

  const q = generateQuestion("boss");
  bossText.textContent = q.text;
  bossProgressText.textContent = `Pregunta ${state.bossRound + 1} de ${currentLevel().bossRounds}`;
  bossAnswers.innerHTML = "";
  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerBoss(option === q.correct));
    bossAnswers.appendChild(button);
  });
}

function answerBoss(correct) {
  if (correct) {
    state.score += 12;
    state.turbo = clamp(state.turbo + 18, 0, 100);
    playCorrectSound();
  } else {
    loseLife("El jefe te golpeo con una pregunta");
  }
  clearRoadAfterAnswer();
  state.bossRound += 1;
  if (state.lives <= 0) {
    hideModal(bossModal);
    return;
  }
  nextBossQuestion();
  updateHud();
}

function prepareNextLevel() {
  state.levelIndex += 1;
  state.levelScoreStart = state.coins;
  state.timer = currentLevel().timeLimit;
  state.levelDistance = 0;
  state.nextExtraLifeOfferCoins = state.coins + state.extraLifeOfferStep;
  state.extraLifeOffers = 0;
  state.extraLifeEarnedThisBiome = 0;
  state.missionCompleted = false;
  state.missionProgress = 0;
  state.streakCorrect = 0;
  state.turbosUsedLevel = 0;
  state.combo = 0;
  state.comboMultiplier = 1;
  renderWorldMap();
  updateHud();
}

function showLevelTransition() {
  const nextLevel = currentLevel();
  const nextLevelNumber = state.levelIndex + 1;
  state.running = false;
  state.pausedForTransition = true;

  if (nextLevelNumber === 3) {
    nextBiomeTitle.textContent = "Vas muy bien, ya casi lo logras";
    nextBiomeText.textContent = `Llegaste a ${nextLevel.name}. Sigue asi: ya estas entrando al bioma ${nextLevel.map}.`;
  } else if (nextLevelNumber === 4) {
    nextBiomeTitle.textContent = "Estas en la recta final, ultimo nivel";
    nextBiomeText.textContent = `Entraras a ${nextLevel.name}. Dale con todo, es la ultima etapa en ${nextLevel.map}.`;
  } else {
    nextBiomeTitle.textContent = "Lo estas haciendo bien";
    nextBiomeText.textContent = `Te teletransportaremos ahora a ${nextLevel.name}. Preparate para el bioma ${nextLevel.map}.`;
  }

  showModal(levelTransitionModal);
  syncExternalMusic();
}

function goToNextBiome() {
  hideModal(levelTransitionModal);
  state.pausedForTransition = false;
  statusLabel.textContent = `Entrando a ${currentLevel().name}`;
  syncExternalMusic();
  startCountdown();
}

function finishBossBattle() {
  hideModal(bossModal);
  state.pausedForBoss = false;
  state.running = true;
  state.levelBossStarted = false;
  state.bossReady = false;
  state.score += 20;
  state.turbo = clamp(state.turbo + 30, 0, 100);
  statusLabel.textContent = `Jefe derrotado en ${currentLevel().name}`;
  spawnBurst(canvas.clientWidth / 2, canvas.clientHeight * 0.6, "#ff9f1c", 30);
  clearRoadAfterAnswer();

  if (state.levelIndex === levels.length - 1) {
    endGame(true, "Derrotaste todos los jefes y completaste MATECARRERAS 3D.");
    return;
  }

  prepareNextLevel();
  showLevelTransition();
}

function useTurbo() {
  if (!state.running || state.pausedForQuiz || state.pausedForBoss || state.turbo < 40) {
    return;
  }
  state.turbo -= 40;
  state.turboActiveUntil = performance.now() + 3200;
  state.turbosUsedLevel += 1;
  statusLabel.textContent = "Turbo activado";
  playTurboSound();
  spawnBurst(canvas.clientWidth / 2, canvas.clientHeight * 0.84, "#ff9f1c", 22);
  updateMission();
  updateHud();
}

function stopTurbo() {
  if (state.turboActiveUntil <= performance.now()) {
    return;
  }
  state.turboActiveUntil = 0;
  statusLabel.textContent = "Turbo detenido";
  updateHud();
}

function loseLife(reason) {
  state.lives -= 1;
  state.combo = 0;
  state.comboMultiplier = 1;
  statusLabel.textContent = reason;
  playCrashSound();
  spawnExplosion(canvas.clientWidth / 2, canvas.clientHeight * 0.78);
  if (state.lives <= 0) {
    endGame(false, "Perdiste todas las vidas.");
  }
  updateHud();
}

function registerExtraLifeOffer() {
  if (state.extraLifeEarnedThisBiome >= state.extraLifeMaxPerBiome) {
    return false;
  }
  state.extraLifeOffers += 1;
  state.extraLifeEarnedThisBiome += 1;
  if (state.extraLifeOffers === 1) {
    statusLabel.textContent = `Recolectaste ${state.nextExtraLifeOfferCoins} monedas: toca el aviso para tu vida extra`;
  }
  return true;
}

function gainCoins(amount) {
  state.coins += amount;
  while (
    state.coins >= state.nextExtraLifeOfferCoins &&
    state.extraLifeEarnedThisBiome < state.extraLifeMaxPerBiome
  ) {
    registerExtraLifeOffer();
    state.nextExtraLifeOfferCoins += state.extraLifeOfferStep;
  }
  updateMission();
  updateHud();
}

function claimExtraLifeOffer() {
  if (state.extraLifeOffers <= 0) {
    return;
  }
  state.extraLifeOffers -= 1;
  state.lives += 1;
  statusLabel.textContent = "Vida extra reclamada";
  spawnBurst(canvas.clientWidth * 0.74, canvas.clientHeight * 0.18, "#ffd166", 18);
  updateHud();
}

function handlePickup(object) {
  if (object.kind === "coin") {
    gainCoins(5);
    state.score += Math.round(4 * state.comboMultiplier);
    playCoinSound();
    spawnBurst(projectX(object.x, object.z), projectY(object.z), "#ffd166", 12);
  } else if (object.kind === "turbo") {
    state.turbo = clamp(state.turbo + 28, 0, 100);
    statusLabel.textContent = "Carga turbo recogida";
    spawnBurst(projectX(object.x, object.z), projectY(object.z), "#ff9f1c", 14);
  }
  updateMission();
  updateHud();
}

function handleHazard(object) {
  if (object.type === "oil") {
    state.playerX += randomBetween(-0.35, 0.35);
    triggerCollisionQuestion("Derrapaste en aceite");
  } else if (object.type === "cone") {
    triggerCollisionQuestion("Golpeaste un cono");
  } else if (object.type === "hole") {
    triggerCollisionQuestion("Caiste en un hueco");
  } else if (object.type === "truck") {
    triggerCollisionQuestion("Choque contra un camion");
  }
}

function projectScale(z) {
  return clamp(z, 0.12, 1.2);
}

function projectX(x, z) {
  const width = canvas.clientWidth;
  // Misma geometria horizontal que drawRoad para mantener carriles centrados visualmente.
  const roadHalfWidth = (width * (0.1 + z * 0.52)) * 0.56;
  const roadCenter = width / 2;
  return roadCenter + x * roadHalfWidth;
}

function projectY(z) {
  const height = canvas.clientHeight;
  const horizon = height * 0.24;
  return horizon + Math.pow(z, 1.5) * height * 0.72;
}

function getCarY() {
  return canvas.clientHeight * 0.78;
}

function spawnBurst(x, y, color, count) {
  if (state.particles.length >= PERF.maxParticles) {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    if (state.particles.length >= PERF.maxParticles) {
      break;
    }
    state.particles.push({
      x,
      y,
      vx: randomBetween(-2.8, 2.8),
      vy: randomBetween(-2.6, 1),
      life: randomBetween(0.4, 0.9),
      color,
      size: randomBetween(2, 6)
    });
  }
}

function spawnExplosion(x, y) {
  spawnBurst(x, y, "#ffb347", 26);
  spawnBurst(x, y, "#ff5d73", 18);
}

function updateParticles(dt) {
  const nextParticles = [];
  for (let i = 0; i < state.particles.length; i += 1) {
    const particle = state.particles[i];
    particle.x += particle.vx * 70 * dt;
    particle.y += particle.vy * 70 * dt;
    particle.vy += 5 * dt;
    particle.life -= dt;
    if (particle.life > 0) {
      nextParticles.push(particle);
    }
  }
  state.particles = nextParticles;
}

function createWeatherParticle() {
  const level = currentLevel();
  if (level.weather === "Lluvia" || level.weather === "Tormenta") {
    return {
      x: randomBetween(0, canvas.clientWidth),
      y: randomBetween(-40, 0),
      vx: level.weather === "Tormenta" ? -120 : -50,
      vy: level.weather === "Tormenta" ? 520 : 420,
      life: 1.2,
      color: "rgba(180,220,255,0.7)",
      size: 2
    };
  }
  if (level.weather === "Neblina") {
    return {
      x: randomBetween(0, canvas.clientWidth),
      y: randomBetween(80, canvas.clientHeight * 0.75),
      vx: randomBetween(-20, 20),
      vy: randomBetween(-4, 4),
      life: randomBetween(1.5, 2.8),
      color: "rgba(240,248,255,0.08)",
      size: randomBetween(40, 90)
    };
  }
  return {
    x: randomBetween(0, canvas.clientWidth),
    y: randomBetween(-40, 0),
    vx: randomBetween(-30, 30),
    vy: 220,
    life: 0.8,
    color: "rgba(255,255,255,0.45)",
    size: 1.5
  };
}

function updateWorld(dt, now) {
  if (!state.running || state.pausedForQuiz || state.pausedForBoss || state.pausedForTransition || state.inCountdown) {
    return;
  }

  const turboBoost = now < state.turboActiveUntil ? 1.85 : 1;
  const activeHazards = getObjectCountByKind("hazard");
  const activePickups = getObjectCountByKind("coin") + getObjectCountByKind("turbo");
  const hazardInterval = clamp(
    HAZARD_SPAWN_INTERVAL - Math.min(0.14, state.levelIndex * 0.03) - (turboBoost > 1 ? 0.05 : 0),
    0.28,
    0.5
  );
  const pickupInterval = clamp(
    PICKUP_SPAWN_INTERVAL - Math.min(0.12, state.levelIndex * 0.025),
    0.56,
    0.82
  );
  state.curvePhase = 0;
  state.playerX = lanes[state.playerLane];
  state.spawnCooldown -= dt;
  state.hazardSpawnCooldown -= dt;
  state.pickupSpawnCooldown -= dt;
  if (!state.levelBossStarted) {
    state.levelDistance = clamp(
      state.levelDistance + dt * LEVEL_TRAVEL_RATE * turboBoost,
      0,
      currentLevel().trackLength
    );
  }

  if (state.spawnCooldown <= 0) {
    state.spawnCooldown = FIXED_SPAWN_INTERVAL;
  }

  if (state.hazardSpawnCooldown <= 0) {
    if (activeHazards < 3 && spawnHazard()) {
      state.hazardSpawnCooldown = hazardInterval;
    } else {
      state.hazardSpawnCooldown = Math.max(0.16, hazardInterval * 0.45);
    }
  }

  if (state.pickupSpawnCooldown <= 0) {
    if (activePickups < 2 && spawnPickup()) {
      state.pickupSpawnCooldown = pickupInterval;
    } else {
      state.pickupSpawnCooldown = Math.max(0.24, pickupInterval * 0.5);
    }
  }

  state.objects.forEach((object) => {
    object.z += dt * state.worldSpeed * turboBoost;
    object.wobble += dt * 2;
  });

  state.objects = state.objects.filter((object) => {
    const y = projectY(object.z);
    const carY = getCarY();
    if (y >= carY - 34 && y <= carY + 24) {
      if (state.pendingCollisionReason) {
        return false;
      }

      // Colision profesional: chequeo X y Y para permitir esquive arriba/abajo/lados.
      const objectScreenX = projectX(object.x, object.z);
      const carScreenX = projectX(state.playerX, object.z);
      const objectWidth = canvas.clientWidth * object.width * projectScale(object.z) * 0.75;
      const objectHeight = canvas.clientHeight * object.height * projectScale(object.z) * 0.75;
      const carWidth = 88;
      const carHeight = 84;
      const dx = Math.abs(objectScreenX - carScreenX);
      const dy = Math.abs((y - objectHeight * 0.3) - (carY - carHeight * 0.2));
      const hitX = dx < (objectWidth + carWidth) * 0.5 * SAFE_COLLISION_SCALE;
      const hitY = dy < (objectHeight + carHeight) * 0.46 * SAFE_COLLISION_SCALE;
      const hit = hitX && hitY;
      
      if (hit) {
        if (object.kind === "hazard") {
          handleHazard(object);
        } else {
          handlePickup(object);
        }
        return false;
      }
    }
    return object.z < OBJECT_DESPAWN_Z && y < carY + 34;
  });

  if (state.weatherParticles.length < PERF.maxWeatherParticles && Math.random() < PERF.weatherSpawnChance) {
    state.weatherParticles.push(createWeatherParticle());
  }

  const nextWeatherParticles = [];
  for (let i = 0; i < state.weatherParticles.length; i += 1) {
    const particle = state.weatherParticles[i];
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    if (particle.life > 0 && particle.y < canvas.clientHeight + 30) {
      nextWeatherParticles.push(particle);
    }
  }
  state.weatherParticles = nextWeatherParticles;

  if (
    !state.levelBossStarted &&
    !state.pausedForQuiz &&
    !state.pendingCollisionReason &&
    state.levelDistance >= currentLevel().trackLength
  ) {
    showBossBattle();
  }

  updateParticles(dt);
  updateHud();
}

function drawBackground() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const level = currentLevel();
  const backgroundImage = currentBiomeBackground();

  if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth > 0) {
    const zoom = Number(level.backgroundZoom) > 0 ? Number(level.backgroundZoom) : 1;
    const focusX = typeof level.backgroundFocusX === "number" ? clamp(level.backgroundFocusX, 0, 1) : 0.5;
    const focusY = typeof level.backgroundFocusY === "number" ? clamp(level.backgroundFocusY, 0, 1) : 0.42;
    const topLightStrength = typeof level.backgroundTopLight === "number" ? clamp(level.backgroundTopLight, 0, 0.2) : 0.05;
    const depthStart = typeof level.backgroundDepthStart === "number" ? clamp(level.backgroundDepthStart, 0, 0.4) : 0.08;
    const depthMid = typeof level.backgroundDepthMid === "number" ? clamp(level.backgroundDepthMid, 0, 0.5) : 0.16;
    const depthEnd = typeof level.backgroundDepthEnd === "number" ? clamp(level.backgroundDepthEnd, 0, 0.7) : 0.34;
    const vignetteStrength = typeof level.backgroundVignette === "number" ? clamp(level.backgroundVignette, 0, 0.7) : 0.3;
    const baseScale = Math.max(width / backgroundImage.naturalWidth, height / backgroundImage.naturalHeight);
    const scale = baseScale * zoom;
    const drawWidth = backgroundImage.naturalWidth * scale;
    const drawHeight = backgroundImage.naturalHeight * scale;
    const minOffsetX = width - drawWidth;
    const minOffsetY = height - drawHeight;
    const offsetX = minOffsetX * focusX;
    const offsetY = minOffsetY * focusY;
    ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

    if (!PERF.enableExpensiveEffects) {
      return;
    }

    // Capa cinematografica: ayuda a integrar UI/pista y dar profundidad.
    const topLight = ctx.createLinearGradient(0, 0, 0, height * 0.55);
    topLight.addColorStop(0, `rgba(255, 255, 255, ${topLightStrength})`);
    topLight.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = topLight;
    ctx.fillRect(0, 0, width, height);

    const depthOverlay = ctx.createLinearGradient(0, 0, 0, height);
    depthOverlay.addColorStop(0, `rgba(0, 0, 0, ${depthStart})`);
    depthOverlay.addColorStop(0.55, `rgba(0, 0, 0, ${depthMid})`);
    depthOverlay.addColorStop(1, `rgba(0, 0, 0, ${depthEnd})`);
    ctx.fillStyle = depthOverlay;
    ctx.fillRect(0, 0, width, height);

    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.48,
      width * 0.12,
      width * 0.5,
      height * 0.6,
      width * 0.72
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, `rgba(0, 0, 0, ${vignetteStrength})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    return;
  }

  if (level.timeOfDay === "Noche") {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    sky.addColorStop(0, "#07111d");
    sky.addColorStop(1, "#16243f");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    drawMoon(width * 0.78, 90);
  } else if (level.timeOfDay === "Dia") {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.55);
    sky.addColorStop(0, "#79c9ff");
    sky.addColorStop(1, "#f3d5a2");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    drawSun(width * 0.78, 84, "#ffd166");
  } else {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.55);
    sky.addColorStop(0, "#ffb070");
    sky.addColorStop(1, "#7859a6");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    drawSun(width * 0.78, 84, "#ffefad");
  }

  drawScenery(level.scenery);
}

function drawSun(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(x, y) {
  ctx.fillStyle = "#eef6ff";
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#10203e";
  ctx.beginPath();
  ctx.arc(x + 10, y - 4, 22, 0, Math.PI * 2);
  ctx.fill();
}

function drawScenery(type) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const horizon = height * 0.24;

  if (type === "city") {
    for (let i = 0; i < 9; i += 1) {
      const x = i * 120 - 20;
      const buildingHeight = 70 + (i % 3) * 28;
      ctx.fillStyle = i % 2 ? "#1d3557" : "#24456d";
      ctx.fillRect(x, horizon - buildingHeight, 74, buildingHeight);
      ctx.fillStyle = "rgba(255, 230, 120, 0.45)";
      for (let y = horizon - buildingHeight + 12; y < horizon - 12; y += 16) {
        ctx.fillRect(x + 12, y, 8, 8);
        ctx.fillRect(x + 34, y, 8, 8);
      }
    }
  } else if (type === "desert") {
    ctx.fillStyle = "#c88a42";
    ctx.beginPath();
    ctx.moveTo(0, horizon + 20);
    ctx.quadraticCurveTo(width * 0.2, horizon - 10, width * 0.38, horizon + 25);
    ctx.quadraticCurveTo(width * 0.65, horizon + 60, width, horizon + 10);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  } else if (type === "snow") {
    // Fondo Winterfell: montañas nevadas épicas
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, horizon, width, height - horizon);
    
    // Montañas oscuras al fondo
    ctx.fillStyle = "#4a5f8f";
    ctx.beginPath();
    ctx.moveTo(0, horizon + 40);
    ctx.quadraticCurveTo(width * 0.15, horizon - 80, width * 0.3, horizon + 60);
    ctx.quadraticCurveTo(width * 0.5, horizon - 120, width * 0.7, horizon + 50);
    ctx.quadraticCurveTo(width * 0.85, horizon - 90, width, horizon + 40);
    ctx.lineTo(width, horizon);
    ctx.lineTo(0, horizon);
    ctx.closePath();
    ctx.fill();
    
    // Picos nevados
    ctx.fillStyle = "#e0f0ff";
    ctx.beginPath();
    ctx.moveTo(width * 0.3, horizon + 60);
    ctx.lineTo(width * 0.25, horizon - 20);
    ctx.lineTo(width * 0.35, horizon + 60);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.7, horizon + 50);
    ctx.lineTo(width * 0.65, horizon - 50);
    ctx.lineTo(width * 0.75, horizon + 50);
    ctx.closePath();
    ctx.fill();
    
    // Sombras en montañas
    ctx.fillStyle = "rgba(74, 95, 143, 0.4)";
    ctx.beginPath();
    ctx.moveTo(width * 0.3, horizon + 60);
    ctx.lineTo(width * 0.28, horizon - 15);
    ctx.lineTo(width * 0.32, horizon + 60);
    ctx.closePath();
    ctx.fill();
  } else if (type === "jungle") {
    for (let i = 0; i < 10; i += 1) {
      const x = i * 110;
      ctx.fillStyle = "#1d5a35";
      ctx.beginPath();
      ctx.arc(x, horizon + 30, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#503d24";
      ctx.fillRect(x - 6, horizon + 50, 12, 58);
    }
  }
}

function drawRoad() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const horizon = height * 0.24;
  const level = currentLevel();
  const segmentCount = PERF.roadSegments;
  const roadOpacity = hasBiomeBackground()
    ? clamp(
      typeof level.roadOpacityWithImage === "number" ? level.roadOpacityWithImage : 0.86,
      0.65,
      1
    )
    : 1;

  ctx.save();
  ctx.globalAlpha = roadOpacity;

  for (let i = 0; i < segmentCount; i += 1) {
    const z0 = i / segmentCount;
    const z1 = (i + 1) / segmentCount;
    const y0 = projectY(z0);
    const y1 = projectY(z1);
    const c0 = width / 2;
    const c1 = width / 2;
    const w0 = width * 0.1 + z0 * width * 0.52;
    const w1 = width * 0.1 + z1 * width * 0.52;

    ctx.fillStyle = i % 2 === 0 ? level.sideA : level.sideB;
    ctx.beginPath();
    ctx.moveTo(c0 - w0 * 0.82, y0);
    ctx.lineTo(c0 + w0 * 0.82, y0);
    ctx.lineTo(c1 + w1 * 0.82, y1);
    ctx.lineTo(c1 - w1 * 0.82, y1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = level.roadColor;
    ctx.beginPath();
    ctx.moveTo(c0 - w0 * 0.56, y0);
    ctx.lineTo(c0 + w0 * 0.56, y0);
    ctx.lineTo(c1 + w1 * 0.56, y1);
    ctx.lineTo(c1 - w1 * 0.56, y1);
    ctx.closePath();
    ctx.fill();

    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      const laneWidth0 = (w0 * 1.12) / 4;
      const laneWidth1 = (w1 * 1.12) / 4;
      for (let lane = -1; lane <= 1; lane += 2) {
        ctx.beginPath();
        ctx.moveTo(c0 + lane * laneWidth0 * 0.5 - 4, y0);
        ctx.lineTo(c0 + lane * laneWidth0 * 0.5 + 4, y0);
        ctx.lineTo(c1 + lane * laneWidth1 * 0.5 + 4, y1);
        ctx.lineTo(c1 + lane * laneWidth1 * 0.5 - 4, y1);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, horizon - 2, width, 4);
  ctx.restore();
}

function drawWeather() {
  const level = currentLevel();
  if (level.weather === "Neblina") {
    state.weatherParticles.forEach((particle) => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    return;
  }

  if (level.weather === "Lluvia" || level.weather === "Tormenta") {
    state.weatherParticles.forEach((particle) => {
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = particle.size;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x + particle.vx * 0.03, particle.y + particle.vy * 0.03);
      ctx.stroke();
    });

    if (level.weather === "Tormenta" && Math.random() < 0.01) {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
  }
}

function drawObjects() {
  const sorted = [...state.objects].sort((a, b) => a.z - b.z);
  sorted.forEach((object) => {
    const x = projectX(object.x, object.z);
    const y = projectY(object.z);
    const scale = projectScale(object.z);
    const width = canvas.clientWidth * object.width * scale * 0.75;
    const height = canvas.clientHeight * object.height * scale * 0.75;

    if (object.kind === "hazard") {
      const spriteKey = object.vehicleVariant || "lambo";
      const sprite = obstacleSprites[spriteKey];
      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        const renderCfg = obstacleSpriteRender[spriteKey] || {
          laneFootprint: 0.75,
          widthBoost: 1.15,
          yLift: 0.03,
          groundBias: 0.2
        };
        const roadHalfWidth = (canvas.clientWidth * (0.1 + object.z * 0.52)) * 0.56;
        const laneWidthPx = (roadHalfWidth * 2) / 3;
        const maxWidthByLane = laneWidthPx * renderCfg.laneFootprint;
        const targetHeight = clamp(height * 1.35, laneWidthPx * 0.54, laneWidthPx * 0.82);
        const aspect = sprite.naturalWidth / Math.max(1, sprite.naturalHeight);
        let spriteWidth = targetHeight * aspect;
        spriteWidth = clamp(spriteWidth, laneWidthPx * 0.5, maxWidthByLane);
        const spriteHeight = spriteWidth / aspect;
        const spriteY = y - spriteHeight + spriteHeight * renderCfg.groundBias + height * renderCfg.yLift;

        // Sombra para integrarlo mejor al piso y dar profundidad.
        ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
        ctx.beginPath();
        ctx.ellipse(x, y - height * 0.04, spriteWidth * 0.36, spriteHeight * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.imageSmoothingEnabled = true;
        if (object.spriteFlip) {
          ctx.save();
          ctx.translate(x, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, -spriteWidth / 2, spriteY, spriteWidth, spriteHeight);
          ctx.restore();
        } else {
          ctx.drawImage(sprite, x - spriteWidth / 2, spriteY, spriteWidth, spriteHeight);
        }
        return;
      }
    }

    if (object.type === "coin") {
      const coinRadius = width * 0.72;
      const coinY = y - height * 0.78;
      const shine = ctx.createRadialGradient(
        x - coinRadius * 0.2,
        coinY - coinRadius * 0.2,
        coinRadius * 0.15,
        x,
        coinY,
        coinRadius
      );
      shine.addColorStop(0, "#fff7b3");
      shine.addColorStop(0.45, "#ffd166");
      shine.addColorStop(1, "#b8740f");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.arc(x, coinY, coinRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 246, 201, 0.95)";
      ctx.lineWidth = Math.max(2, width * 0.08);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = Math.max(1, width * 0.045);
      ctx.beginPath();
      ctx.arc(x, coinY, coinRadius * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#7a4a00";
      ctx.font = `900 ${Math.max(14, width * 0.56)}px Segoe UI`;
      ctx.textAlign = "center";
      ctx.fillText("$", x, y - height * 0.62);
    } else if (object.type === "turbo") {
      ctx.fillStyle = object.color;
      ctx.beginPath();
      ctx.moveTo(x, y - height * 1.5);
      ctx.lineTo(x + width * 0.55, y - height * 0.8);
      ctx.lineTo(x + width * 0.15, y - height * 0.8);
      ctx.lineTo(x + width * 0.55, y);
      ctx.lineTo(x - width * 0.25, y - height * 0.7);
      ctx.lineTo(x + width * 0.1, y - height * 0.7);
      ctx.closePath();
      ctx.fill();
    } else if (object.type === "truck") {
      ctx.fillStyle = object.color;
      ctx.fillRect(x - width * 0.6, y - height * 1.2, width * 1.2, height * 1.2);
      ctx.fillStyle = "#17324d";
      ctx.fillRect(x - width * 0.34, y - height * 1.05, width * 0.68, height * 0.36);
      ctx.fillStyle = "#0b0f14";
      ctx.fillRect(x - width * 0.5, y - height * 0.22, width * 0.24, height * 0.22);
      ctx.fillRect(x + width * 0.26, y - height * 0.22, width * 0.24, height * 0.22);
    } else if (object.type === "oil") {
      ctx.fillStyle = object.color;
      ctx.beginPath();
      ctx.ellipse(x, y - height * 0.2, width * 0.8, height * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `${Math.max(10, width * 0.4)}px Segoe UI`;
      ctx.textAlign = "center";
      ctx.fillText("!", x, y - height * 0.2);
    } else if (object.type === "hole") {
      ctx.fillStyle = object.color;
      ctx.beginPath();
      ctx.ellipse(x, y - height * 0.15, width * 0.95, height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#594334";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = object.color;
      ctx.beginPath();
      ctx.moveTo(x, y - height * 1.5);
      ctx.lineTo(x + width * 0.7, y);
      ctx.lineTo(x - width * 0.7, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - width * 0.12, y - height * 0.55, width * 0.24, height * 0.22);
      ctx.fillStyle = "#3b1f00";
      ctx.font = `${Math.max(10, width * 0.35)}px Segoe UI`;
      ctx.textAlign = "center";
      ctx.fillText("!", x, y - height * 0.9);
    }
  });
}

function drawPlayerCar() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const x = projectX(state.playerX, PLAYER_DRAW_Z);
  const y = getCarY();

  // Efecto turbo: llama atrás
  if (performance.now() < state.turboActiveUntil) {
    ctx.fillStyle = "rgba(255, 140, 66, 0.7)";
    ctx.beginPath();
    ctx.moveTo(x - 16, y + 40);
    ctx.lineTo(x, y + 92);
    ctx.lineTo(x + 16, y + 40);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "rgba(255, 99, 71, 0.5)";
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 45);
    ctx.lineTo(x, y + 80);
    ctx.lineTo(x + 10, y + 45);
    ctx.closePath();
    ctx.fill();
  }

  // Si hay sprite del jugador disponible, usarlo en lugar del dibujo vectorial.
  if (playerCarSprite.complete && playerCarSprite.naturalWidth > 0) {
    const carWidth = Math.max(78, width * 0.098);
    const aspect = playerCarSprite.naturalWidth / Math.max(1, playerCarSprite.naturalHeight);
    const carHeight = carWidth / aspect;
    const carY = y - carHeight * 0.88;

    ctx.save();
    ctx.imageSmoothingEnabled = true;

    const shadowGradient = ctx.createRadialGradient(x, y + 18, 4, x, y + 18, carWidth * 0.82);
    shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.5)");
    shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(x, y + 18, carWidth * 0.42, carHeight * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(8, 12, 18, 0.3)";
    ctx.beginPath();
    ctx.moveTo(x - carWidth * 0.48, carY + carHeight * 0.24);
    ctx.lineTo(x + carWidth * 0.48, carY + carHeight * 0.24);
    ctx.lineTo(x + carWidth * 0.34, carY + carHeight * 1.02);
    ctx.lineTo(x - carWidth * 0.34, carY + carHeight * 1.02);
    ctx.closePath();
    ctx.fill();

    if (PERF.enableExpensiveEffects) {
      ctx.filter = "drop-shadow(0 8px 10px rgba(0, 0, 0, 0.32)) drop-shadow(0 0 8px rgba(255, 84, 77, 0.12))";
    }
    ctx.drawImage(playerCarSprite, x - carWidth / 2, carY, carWidth, carHeight);
    ctx.filter = "none";

    if (currentLevel().timeOfDay === "Noche") {
      ctx.fillStyle = "rgba(255, 246, 170, 0.35)";
      ctx.beginPath();
      ctx.moveTo(x - 12, carY + 6);
      ctx.lineTo(x - 44, carY - 86);
      ctx.lineTo(x - 2, carY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 12, carY + 6);
      ctx.lineTo(x + 44, carY - 86);
      ctx.lineTo(x + 2, carY + 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // Cuerpo principal del tundra (aerodinámico en rojo)
  ctx.fillStyle = "#d12f45";
  ctx.beginPath();
  ctx.moveTo(x - 42, y + 28);
  ctx.lineTo(x - 28, y - 18);
  ctx.lineTo(x - 18, y - 54);
  ctx.lineTo(x + 18, y - 54);
  ctx.lineTo(x + 28, y - 18);
  ctx.lineTo(x + 42, y + 28);
  ctx.closePath();
  ctx.fill();

  // Borde/stroke para más definición
  ctx.strokeStyle = "#ffb11c";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Parabrisas delantero superior (degradado cyan)
  ctx.fillStyle = "#45d6ff";
  ctx.globalAlpha = 0.75;
  ctx.fillRect(x - 14, y - 36, 28, 14);
  ctx.globalAlpha = 1;

  // Ventana principal (azul más oscuro)
  ctx.fillStyle = "#0b78d1";
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 20);
  ctx.lineTo(x + 20, y - 20);
  ctx.lineTo(x + 22, y + 8);
  ctx.lineTo(x - 22, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Llantas delanteras (negro con brillo)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(x - 38, y - 32, 14, 20);
  ctx.fillRect(x + 24, y - 32, 14, 20);
  
  // Brillo en llantas
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(x - 36, y - 30, 10, 4);
  ctx.fillRect(x + 26, y - 30, 10, 4);

  // Llantas traseras (más grandes)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(x - 40, y + 10, 16, 22);
  ctx.fillRect(x + 24, y + 10, 16, 22);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(x - 38, y + 12, 12, 4);
  ctx.fillRect(x + 26, y + 12, 12, 4);

  // Luces traseras (rojo brillante)
  ctx.fillStyle = "#ff544d";
  ctx.shadowColor = "rgba(255, 84, 77, 0.8)";
  ctx.shadowBlur = 8;
  ctx.fillRect(x - 42, y + 12, 8, 12);
  ctx.fillRect(x + 34, y + 12, 8, 12);
  ctx.shadowColor = "transparent";

  // Línea central futurista (turbo visual)
  ctx.strokeStyle = "#45d6ff";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x, y - 50);
  ctx.lineTo(x, y + 25);
  ctx.stroke();
  ctx.setLineDash([]);

  // Faros delanteros (amarillo/blanco)
  ctx.fillStyle = "#ffb11c";
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(x - 12, y - 56, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 12, y - 56, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Detalle: franja degradada en el centro
  ctx.fillStyle = "#ffb11c";
  ctx.globalAlpha = 0.4;
  ctx.fillRect(x - 4, y - 54, 8, 82);
  ctx.globalAlpha = 1;

  if (currentLevel().timeOfDay === "Noche") {
    ctx.fillStyle = "rgba(255, 246, 170, 0.35)";
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 56);
    ctx.lineTo(x - 48, y - 150);
    ctx.lineTo(x - 2, y - 56);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 56);
    ctx.lineTo(x + 48, y - 150);
    ctx.lineTo(x + 2, y - 56);
    ctx.closePath();
    ctx.fill();
  }
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawUiHints() {
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "600 16px Segoe UI";
  if (state.extraLifeOffers > 0) {
    ctx.fillText(`Vida lista: ${state.extraLifeOffers}`, 22, canvas.clientHeight - 24);
  }
  if (currentLevel().weather === "Neblina") {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(0, canvas.clientHeight * 0.2, canvas.clientWidth, canvas.clientHeight * 0.45);
  }
}

function renderFrame() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawBackground();
  drawRoad();
  drawObjects();
  drawPlayerCar();
  drawParticles();
  drawWeather();
  drawUiHints();
}

function endGame(victory, message) {
  state.running = false;
  state.pausedForQuiz = false;
  state.pausedForBoss = false;
  state.pausedForTransition = false;
  state.levelBossStarted = false;
  state.bossReady = false;
  state.pendingCollisionReason = null;
  stopTrack(levelOneThemeAudio);
  stopTrack(levelTwoThemeAudio);
  stopTrack(levelThreeThemeAudio);
  stopTrack(levelFourThemeAudio);
  clearInterval(timerInterval);
  hideModal(quizModal);
  hideModal(bossModal);
  hideModal(levelTransitionModal);
  resultTitle.textContent = victory ? "Victoria total" : "Fin de carrera";
  resultText.textContent = message;
  finalScore.textContent = state.score;
  finalCoins.textContent = state.coins;
  finalLevel.textContent = state.levelIndex + 1;
  showModal(gameOverModal);

   guardarPuntaje(state.playerDisplayName, state.score)
    .then(() => mostrarRanking());
}

async function mostrarRanking() {
  const lista = document.getElementById("ranking-list");
  if (!lista) return;

  const ranking = await obtenerRanking();

  lista.innerHTML = "";

  ranking.forEach((jugador, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${jugador.nombre} - ${jugador.puntaje}`;
    lista.appendChild(li);
  });
}

function animate(timestamp) {
  if (lastPresentedFrameAt && timestamp - lastPresentedFrameAt < PERF.frameIntervalMs) {
    requestAnimationFrame(animate);
    return;
  }
  lastPresentedFrameAt = timestamp;

  if (!state.lastFrame) {
    state.lastFrame = timestamp;
  }
  const dt = Math.min(0.033, (timestamp - state.lastFrame) / 1000);
  state.lastFrame = timestamp;
  updateWorld(dt, timestamp);
  renderFrame();
  requestAnimationFrame(animate);
}

function setPlayerLane(nextLane) {
  const clamped = clamp(nextLane, 0, lanes.length - 1);
  state.playerLane = clamped;
  state.playerX = lanes[clamped];
}

function bindLaneButton(button, direction) {
  button.addEventListener("pointerdown", () => {
    unlockAudioFromGesture();
    setPlayerLane(state.playerLane + direction);
  });
}

bindLaneButton(leftControl, -1);
bindLaneButton(rightControl, 1);

turboControl.addEventListener("click", () => {
  unlockAudioFromGesture();
  useTurbo();
});

stopTurboControl.addEventListener("click", () => {
  unlockAudioFromGesture();
  stopTurbo();
});

if (extraLifeOfferBtn) {
  extraLifeOfferBtn.addEventListener("click", () => {
    unlockAudioFromGesture();
    claimExtraLifeOffer();
  });
}

startGameBtn.addEventListener("click", () => {
  unlockAudioFromGesture();
  if (!state.playerDisplayName) {
    openNamePrompt();
    return;
  }
  startGameFlow();
});

confirmPlayerNameBtn.addEventListener("click", () => {
  if (confirmPlayerNameAndContinue()) {
    unlockAudioFromGesture();
  }
});

preGamePlayerName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmPlayerNameBtn.click();
  }
});

toggleAudioBtn.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  toggleAudioBtn.textContent = `Sonido: ${state.soundOn ? "ON" : "OFF"}`;
  syncExternalMusic();
});

if (toggleInfoBtn && dashboardInfoPanel) {
  toggleInfoBtn.addEventListener("click", () => {
    const isHidden = dashboardInfoPanel.classList.contains("hidden");
    dashboardInfoPanel.classList.toggle("hidden", !isHidden);
    toggleInfoBtn.textContent = isHidden ? "- Ocultar info" : "+ Info";
    toggleInfoBtn.setAttribute("aria-expanded", String(isHidden));
  });
}

clearRankingBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderRanking();
});

saveScoreBtn.addEventListener("click", saveCurrentScore);
viewLiveRankingBtn.addEventListener("click", goToLiveRanking);
nextBiomeBtn.addEventListener("click", () => {
  unlockAudioFromGesture();
  goToNextBiome();
});

document.addEventListener("keydown", (event) => {
  unlockAudioFromGesture();
  if (event.key === "ArrowLeft") {
    setPlayerLane(state.playerLane - 1);
  } else if (event.key === "ArrowRight") {
    setPlayerLane(state.playerLane + 1);
  } else if (event.key.toLowerCase() === "t" || event.key === " ") {
    event.preventDefault();
    useTurbo();
  }
});

window.addEventListener("resize", resizeCanvas);

renderRanking();
renderWorldMap();
updateSelectedPlayerLabel();
updateHud(true);
resizeCanvas();
preloadObstacleSprites();
preloadBiomeBackgrounds();
configureMusic();

// Asegurar que los audios están listos
if (startThemeAudio) {
  startThemeAudio.volume = 0.45;
  // Muted permite autoplay sin interacción
  startThemeAudio.muted = true;
  
  // Intentar reproducir el audio mutizado
  const playPromise = startThemeAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // El navegador puede bloquear autoplay hasta un gesto real.
    });
  }
}

bindUnlockListeners();

// Fallback: desmutear sin esperar interacción (algunos navegadores lo permiten en ciertos contextos)
setTimeout(() => {
  if (startThemeAudio && startThemeAudio.muted && state.soundOn) {
    startThemeAudio.muted = false;
  }
}, 500);

syncExternalMusic();
playIntroSequence().then(() => {
  syncExternalMusic();
  if (!state.playerDisplayName) {
    openNamePrompt();
  }
});

requestAnimationFrame(animate);
