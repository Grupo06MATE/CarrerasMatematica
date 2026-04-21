export const STORAGE_KEY = "matecarreras-3d-ranking";
export const lanes = [-0.66, 0, 0.66];
export const FIXED_SPAWN_INTERVAL = 0.38;
export const HAZARD_SPAWN_INTERVAL = 0.4;
export const PICKUP_SPAWN_INTERVAL = 0.72;
export const PLAYER_DRAW_Z = 0.82;
export const BASE_WORLD_SPEED = 0.58;
export const LEVEL_TRAVEL_RATE = 1.42;
export const OBJECT_DESPAWN_Z = 0.98;
export const MIN_HAZARD_SPAWN_GAP_Z = 0.26;
export const SAFE_COLLISION_SCALE = 0.84;

export const levels = [
  {
    name: "Ciudad Neon",
    map: "Ciudad",
    weather: "Lluvia",
    timeOfDay: "Noche",
    mission: "Responde 5 bien seguidas",
    trackLength: 86,
    timeLimit: 75,
    bossRounds: 3,
    roadColor: "#2e3446",
    sideA: "#334155",
    sideB: "#253149",
    scenery: "city",
    backgroundImage: "assets/biomes/ciudad.png",
    backgroundZoom: 1.16,
    backgroundFocusX: 0.5,
    backgroundFocusY: 0.34,
    backgroundTopLight: 0.045,
    backgroundDepthStart: 0.1,
    backgroundDepthMid: 0.2,
    backgroundDepthEnd: 0.42,
    backgroundVignette: 0.34,
    roadOpacityWithImage: 0.78
  },
  {
    name: "Desierto Turbo",
    map: "Desierto",
    weather: "Tormenta",
    timeOfDay: "Dia",
    mission: "Recoge 18 monedas",
    trackLength: 92,
    timeLimit: 72,
    bossRounds: 3,
    roadColor: "#4b3e30",
    sideA: "#b97332",
    sideB: "#d4a15d",
    scenery: "desert",
    backgroundImage: "assets/biomes/desierto.png",
    backgroundZoom: 1.14,
    backgroundFocusX: 0.5,
    backgroundFocusY: 0.34,
    backgroundTopLight: 0.035,
    backgroundDepthStart: 0.08,
    backgroundDepthMid: 0.17,
    backgroundDepthEnd: 0.36,
    backgroundVignette: 0.28,
    roadOpacityWithImage: 0.8
  },
  {
    name: "Glaciar Vector",
    map: "Nieve",
    weather: "Neblina",
    timeOfDay: "Atardecer",
    mission: "Activa 2 turbos",
    trackLength: 97,
    timeLimit: 70,
    bossRounds: 4,
    roadColor: "#5f6d88",
    sideA: "#d9ebff",
    sideB: "#bed4ea",
    scenery: "snow",
    backgroundImage: "assets/biomes/nieve.png",
    backgroundZoom: 1.11,
    backgroundFocusX: 0.5,
    backgroundFocusY: 0.36,
    backgroundTopLight: 0.05,
    backgroundDepthStart: 0.09,
    backgroundDepthMid: 0.18,
    backgroundDepthEnd: 0.34,
    backgroundVignette: 0.26,
    roadOpacityWithImage: 0.82
  },
  {
    name: "Selva Quantum",
    map: "Selva",
    weather: "Tormenta",
    timeOfDay: "Noche",
    mission: "Consigue 2 escudos",
    trackLength: 104,
    timeLimit: 68,
    bossRounds: 4,
    roadColor: "#254035",
    sideA: "#29543f",
    sideB: "#1a3329",
    scenery: "jungle",
    backgroundImage: "assets/biomes/selva.png",
    backgroundZoom: 1.17,
    backgroundFocusX: 0.52,
    backgroundFocusY: 0.35,
    backgroundTopLight: 0.03,
    backgroundDepthStart: 0.11,
    backgroundDepthMid: 0.22,
    backgroundDepthEnd: 0.44,
    backgroundVignette: 0.36,
    roadOpacityWithImage: 0.76
  }
];

export const obstacleTypes = {
  cone: { kind: "hazard", color: "#ff7b00", width: 0.11, height: 0.14 },
  oil: { kind: "hazard", color: "#111111", width: 0.1, height: 0.13 },
  hole: { kind: "hazard", color: "#090909", width: 0.11, height: 0.14 },
  truck: { kind: "hazard", color: "#5cc8ff", width: 0.15, height: 0.18 },
  coin: { kind: "coin", color: "#ffd166", width: 0.082, height: 0.13 },
  shield: { kind: "shield", color: "#77ff99", width: 0.07, height: 0.1 },
  turbo: { kind: "turbo", color: "#ff8c42", width: 0.07, height: 0.1 }
};

export const obstacleSpriteFiles = {
  bus: "assets/obstacles/bus.png",
  lambo: "assets/obstacles/lambo.png",
  tundra: "assets/obstacles/tundra.png",
  hilux: "assets/obstacles/hilux.png",
  bomberos: "assets/obstacles/bomberos.png"
};

export const hazardVehicleVariants = ["lambo", "tundra", "hilux", "bomberos", "bus"];

export const obstacleSpriteRender = {
  bus: { laneFootprint: 0.82, widthBoost: 1.22, yLift: 0.006, groundBias: 0.28 },
  lambo: { laneFootprint: 0.72, widthBoost: 1.12, yLift: 0.012, groundBias: 0.23 },
  tundra: { laneFootprint: 0.72, widthBoost: 1.1, yLift: 0.01, groundBias: 0.22 },
  hilux: { laneFootprint: 0.74, widthBoost: 1.14, yLift: 0.012, groundBias: 0.24 },
  bomberos: { laneFootprint: 0.78, widthBoost: 1.16, yLift: 0.01, groundBias: 0.25 }
};

export const obstacleSprites = {};

export const playerCarSprite = new Image();
playerCarSprite.src = "assets/convertible.png";

export const state = {
  screen: "start",
  running: false,
  pausedForQuiz: false,
  pausedForBoss: false,
  pausedForTransition: false,
  inCountdown: false,
  soundOn: true,
  levelIndex: 0,
  score: 0,
  levelScoreStart: 0,
  combo: 0,
  comboMultiplier: 1,
  coins: 0,
  lives: 3,
  shields: 0,
  timer: levels[0].timeLimit,
  playerX: lanes[1],
  playerLane: 1,
  steering: 0,
  worldSpeed: BASE_WORLD_SPEED,
  curvePhase: 0,
  objects: [],
  particles: [],
  weatherParticles: [],
  spawnCooldown: FIXED_SPAWN_INTERVAL,
  hazardSpawnCooldown: HAZARD_SPAWN_INTERVAL,
  pickupSpawnCooldown: PICKUP_SPAWN_INTERVAL,
  lastFrame: 0,
  turbo: 0,
  turboActiveUntil: 0,
  extraLifeOfferStep: 6,
  nextExtraLifeOfferCoins: 6,
  extraLifeEarnedThisBiome: 0,
  extraLifeMaxPerBiome: 2,
  extraLifeAlertUntil: 0,
  missionCompleted: false,
  missionProgress: 0,
  streakCorrect: 0,
  turbosUsedLevel: 0,
  shieldsCollectedLevel: 0,
  shieldMaxPerBiome: 2,
  levelBossStarted: false,
  bossReady: false,
  bossRound: 0,
  levelDistance: 0,
  playerDisplayName: "",
  rankingSaved: false,
  pendingCollisionReason: null,
  usedQuestionIdsByLevel: {},
  usedBossQuestionIdsByLevel: {}
};
