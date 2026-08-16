// Storage Utility with Weekly Weight, Apple Watch Telemetry, and Data Loss Prevention

const WEEKLY_WEIGHT_KEY = 'transformation_weekly_weight_logs_v2';
const WORKOUT_KEY = 'transformation_workout_logs_v1';
const CALENDAR_KEY = 'transformation_completed_calendar_v1';
const MEALS_KEY = 'transformation_meal_checks_v1';
const GROCERY_KEY = 'transformation_grocery_checks_v1';
const ROTATION_KEY = 'transformation_protein_rotation_v1';
const SCENARIO_KEY = 'transformation_meal_scenario_v1';
const CHECKLIST_KEY = 'transformation_daily_checklist_v1';
const APPLE_WATCH_KEY = 'transformation_apple_watch_v1';
const GROCERY_CUSTOM_KEY = 'transformation_grocery_custom_items_v1';

// Every read goes through this so a corrupt or partially written entry
// degrades to the fallback instead of throwing on render.
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Quota exceeded or storage disabled — keep the in-memory value usable.
  }
  return value;
};

// Seed weekly weigh-in entries (Week 1 starting July 30 / Aug 2)
const SEED_WEEKLY_WEIGHTS = [
  { weekNum: 1, date: '2026-08-02', weightKg: 59.3, waistInches: 29.1, note: 'Week 1 Baseline' },
  { weekNum: 2, date: '2026-08-09', weightKg: 59.6, waistInches: 29.1, note: '+300g target hit' },
];

export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Parsed at midday so a UTC offset can never shift the calendar day.
export const parseLocalDate = (dateStr) => new Date(`${dateStr}T12:00:00`);

export const getDayName = (dateStr) => DAY_NAMES[parseLocalDate(dateStr).getDay()];

export const isSunday = (dateStr) => parseLocalDate(dateStr).getDay() === 0;

const SEED_WORKOUT_LOGS = {};

const SEED_APPLE_WATCH_LOGS = {
  '2026-07-30': {
    totalCalories: 2550,
    activeCalories: 720,
    workoutCalories: 450,
    workoutActiveCalories: 390,
    restingHeartRate: 62,
    workoutAvgHeartRate: 138,
    stepCount: 8450,
    sleepHours: 7.5
  }
};

export const getWeeklyWeightLogs = () => {
  if (localStorage.getItem(WEEKLY_WEIGHT_KEY) === null) {
    return writeJSON(WEEKLY_WEIGHT_KEY, SEED_WEEKLY_WEIGHTS);
  }
  const logs = readJSON(WEEKLY_WEIGHT_KEY, SEED_WEEKLY_WEIGHTS);
  return Array.isArray(logs) ? logs : SEED_WEEKLY_WEIGHTS;
};

export const saveWeeklyWeightLog = (logEntry) => {
  const logs = getWeeklyWeightLogs();
  const existingIdx = logs.findIndex(l => l.weekNum === logEntry.weekNum || l.date === logEntry.date);
  let updated;
  if (existingIdx >= 0) {
    updated = [...logs];
    updated[existingIdx] = { ...updated[existingIdx], ...logEntry };
  } else {
    updated = [...logs, logEntry];
  }
  updated.sort((a, b) => a.weekNum - b.weekNum);
  return writeJSON(WEEKLY_WEIGHT_KEY, updated);
};

export const getWorkoutLogs = () => {
  const logs = readJSON(WORKOUT_KEY, {});

  // Auto-migration 1: Move errant 2026-07-31 workout log to 2026-07-30
  if (logs['2026-07-31'] && logs['2026-07-31'].routineName === 'Legs A' && !logs['2026-07-30']) {
    logs['2026-07-30'] = { ...logs['2026-07-31'], date: '2026-07-30' };
    delete logs['2026-07-31'];
    writeJSON(WORKOUT_KEY, logs);
  }

  // Auto-migration 2: Move errant 2026-08-01 Push workout log to 2026-07-31
  if (logs['2026-08-01'] && !logs['2026-07-31']) {
    logs['2026-07-31'] = { ...logs['2026-08-01'], date: '2026-07-31', routineName: 'Push B' };
    delete logs['2026-08-01'];
    writeJSON(WORKOUT_KEY, logs);
  }

  return logs;
};

export const saveWorkoutLog = (date, workoutData) => {
  const logs = getWorkoutLogs();
  logs[date] = workoutData;
  writeJSON(WORKOUT_KEY, logs);

  if (workoutData.completed) {
    const completedDays = getCompletedCalendarDays();
    if (!completedDays.includes(date)) {
      writeJSON(CALENDAR_KEY, [...completedDays, date]);
    }
  }
  return logs;
};

// Persists in-progress sets without marking the session complete, so leaving
// the tab mid-workout no longer discards everything typed so far.
export const saveWorkoutDraft = (date, draft) => {
  const logs = getWorkoutLogs();
  const existing = logs[date] || {};
  logs[date] = { ...existing, ...draft, date };
  return writeJSON(WORKOUT_KEY, logs);
};

export const getAppleWatchLogs = () => {
  if (localStorage.getItem(APPLE_WATCH_KEY) === null) {
    return writeJSON(APPLE_WATCH_KEY, SEED_APPLE_WATCH_LOGS);
  }
  return readJSON(APPLE_WATCH_KEY, SEED_APPLE_WATCH_LOGS);
};

// Values used to prefill the telemetry form for a day that has no entry yet.
// They are suggestions for the input, never displayed as if they were measured.
export const APPLE_WATCH_PLACEHOLDERS = {
  totalCalories: 2450,
  activeCalories: 720,
  workoutCalories: 450,
  workoutActiveCalories: 390,
  restingHeartRate: 62,
  workoutAvgHeartRate: 138,
  stepCount: 8450,
  sleepHours: 7.5
};

const WATCH_METRICS = Object.keys(APPLE_WATCH_PLACEHOLDERS);

export const getAppleWatchLogForDate = (date) => {
  const raw = getAppleWatchLogs()[date];
  if (!raw) return { logged: false };

  const entry = { logged: true };
  WATCH_METRICS.forEach(key => {
    const value = key === 'activeCalories' ? (raw.activeCalories ?? raw.dailyActiveCalories) : raw[key];
    entry[key] = typeof value === 'number' ? value : null;
  });
  return entry;
};

export const saveAppleWatchLog = (date, watchData) => {
  const logs = getAppleWatchLogs();
  logs[date] = { ...logs[date], ...watchData };
  return writeJSON(APPLE_WATCH_KEY, logs);
};

export const getCompletedCalendarDays = () => {
  let days = readJSON(CALENDAR_KEY, []);
  if (!Array.isArray(days)) days = [];

  // Migration: Ensure 2026-07-30 and 2026-07-31 are completed if workout logs exist, and clean up errant 2026-08-01 completion
  const MIGRATION_KEY = 'transformation_aug01_migration_v3';
  if (!localStorage.getItem(MIGRATION_KEY)) {
    days = days.filter(d => d !== '2026-08-01');
    if (!days.includes('2026-07-31')) days.push('2026-07-31');
    if (!days.includes('2026-07-30')) days.push('2026-07-30');
    writeJSON(CALENDAR_KEY, days);
    localStorage.setItem(MIGRATION_KEY, 'done');
  }

  return days;
};

export const toggleCalendarDayCompleted = (date) => {
  const days = getCompletedCalendarDays();
  const updated = days.includes(date) ? days.filter(d => d !== date) : [...days, date];
  return writeJSON(CALENDAR_KEY, updated);
};

const SLOT_SWAPS_KEY = 'transformation_slot_swaps_v1';

export const getMealChecks = () => readJSON(MEALS_KEY, {});

export const saveMealCheck = (date, mealIdx, isChecked) => {
  const checks = getMealChecks();
  if (!checks[date]) checks[date] = {};
  checks[date][mealIdx] = isChecked;
  return writeJSON(MEALS_KEY, checks);
};

export const getSlotSwaps = () => readJSON(SLOT_SWAPS_KEY, {});

export const saveSlotSwap = (date, slotIdx, mealObj) => {
  const swaps = getSlotSwaps();
  if (!swaps[date]) swaps[date] = {};
  swaps[date][slotIdx] = mealObj;
  return writeJSON(SLOT_SWAPS_KEY, swaps);
};

export const getGroceryChecks = () => readJSON(GROCERY_KEY, {});

export const toggleGroceryItem = (itemText) => {
  const checks = getGroceryChecks();
  checks[itemText] = !checks[itemText];
  return writeJSON(GROCERY_KEY, checks);
};

export const getCustomGroceryItems = () => {
  const items = readJSON(GROCERY_CUSTOM_KEY, []);
  return Array.isArray(items) ? items : [];
};

export const addCustomGroceryItem = (itemText) => {
  const items = getCustomGroceryItems();
  const trimmed = itemText.trim();
  if (!trimmed || items.includes(trimmed)) return items;
  return writeJSON(GROCERY_CUSTOM_KEY, [...items, trimmed]);
};

export const removeCustomGroceryItem = (itemText) => {
  const remaining = getCustomGroceryItems().filter(i => i !== itemText);
  writeJSON(GROCERY_CUSTOM_KEY, remaining);

  // Drop the orphaned check so a re-added item does not come back pre-ticked.
  const checks = getGroceryChecks();
  if (itemText in checks) {
    delete checks[itemText];
    writeJSON(GROCERY_KEY, checks);
  }
  return remaining;
};

export const getProteinRotation = () => {
  return localStorage.getItem(ROTATION_KEY) || 'Week A';
};

export const setProteinRotation = (rotation) => {
  localStorage.setItem(ROTATION_KEY, rotation);
  return rotation;
};

export const getMealScenario = () => {
  return localStorage.getItem(SCENARIO_KEY) || 'Scenario A';
};

export const setMealScenario = (scenario) => {
  localStorage.setItem(SCENARIO_KEY, scenario);
  return scenario;
};

export const getDailyChecklist = (date) => {
  const all = readJSON(CHECKLIST_KEY, {});
  return all[date] || { creatine: false, b12: false, d3: false, waterLitres: 0 };
};

export const saveDailyChecklist = (date, checklist) => {
  const all = readJSON(CHECKLIST_KEY, {});
  all[date] = checklist;
  return writeJSON(CHECKLIST_KEY, all);
};

export const exportUserData = () => {
  const exportObj = {
    weeklyWeights: getWeeklyWeightLogs(),
    workouts: getWorkoutLogs(),
    appleWatch: getAppleWatchLogs(),
    completedCalendar: getCompletedCalendarDays(),
    mealChecks: getMealChecks(),
    slotSwaps: getSlotSwaps(),
    dailyChecklists: readJSON(CHECKLIST_KEY, {}),
    groceryChecks: getGroceryChecks(),
    groceryCustomItems: getCustomGroceryItems(),
    rotation: getProteinRotation(),
    scenario: getMealScenario(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(exportObj, null, 2);
};

export const importUserData = (jsonString) => {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
  if (!data || typeof data !== 'object') return false;

  const restore = (value, key) => {
    if (value !== undefined && value !== null) writeJSON(key, value);
  };

  restore(data.weeklyWeights, WEEKLY_WEIGHT_KEY);
  restore(data.workouts, WORKOUT_KEY);
  restore(data.appleWatch, APPLE_WATCH_KEY);
  restore(data.completedCalendar, CALENDAR_KEY);
  restore(data.mealChecks, MEALS_KEY);
  restore(data.slotSwaps, SLOT_SWAPS_KEY);
  restore(data.dailyChecklists, CHECKLIST_KEY);
  restore(data.groceryChecks, GROCERY_KEY);
  restore(data.groceryCustomItems, GROCERY_CUSTOM_KEY);
  if (data.rotation) localStorage.setItem(ROTATION_KEY, data.rotation);
  if (data.scenario) localStorage.setItem(SCENARIO_KEY, data.scenario);
  return true;
};
