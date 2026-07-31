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
  const data = localStorage.getItem(WEEKLY_WEIGHT_KEY);
  if (!data) {
    localStorage.setItem(WEEKLY_WEIGHT_KEY, JSON.stringify(SEED_WEEKLY_WEIGHTS));
    return SEED_WEEKLY_WEIGHTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_WEEKLY_WEIGHTS;
  }
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
  localStorage.setItem(WEEKLY_WEIGHT_KEY, JSON.stringify(updated));
  return updated;
};

export const getWorkoutLogs = () => {
  const data = localStorage.getItem(WORKOUT_KEY);
  let logs = {};
  if (data) {
    try { logs = JSON.parse(data); } catch (e) { logs = {}; }
  }

  // Auto-migration: Move errant 2026-07-31 workout log to 2026-07-30
  if (logs['2026-07-31'] && !logs['2026-07-30']) {
    logs['2026-07-30'] = { ...logs['2026-07-31'], date: '2026-07-30' };
    delete logs['2026-07-31'];
    localStorage.setItem(WORKOUT_KEY, JSON.stringify(logs));
  }

  return logs;
};

export const saveWorkoutLog = (date, workoutData) => {
  const logs = getWorkoutLogs();
  logs[date] = workoutData;
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(logs));
  
  if (workoutData.completed) {
    const completedDays = getCompletedCalendarDays();
    if (!completedDays.includes(date)) {
      completedDays.push(date);
      localStorage.setItem(CALENDAR_KEY, JSON.stringify(completedDays));
    }
  }
  return logs;
};

export const getAppleWatchLogs = () => {
  const data = localStorage.getItem(APPLE_WATCH_KEY);
  if (!data) {
    localStorage.setItem(APPLE_WATCH_KEY, JSON.stringify(SEED_APPLE_WATCH_LOGS));
    return SEED_APPLE_WATCH_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_APPLE_WATCH_LOGS;
  }
};

export const getAppleWatchLogForDate = (date) => {
  const logs = getAppleWatchLogs();
  const raw = logs[date] || {};
  return {
    totalCalories: raw.totalCalories || 2450,
    activeCalories: raw.activeCalories || raw.dailyActiveCalories || 720,
    workoutCalories: raw.workoutCalories || 450,
    workoutActiveCalories: raw.workoutActiveCalories || 390,
    restingHeartRate: raw.restingHeartRate || 62,
    workoutAvgHeartRate: raw.workoutAvgHeartRate || 138,
    stepCount: raw.stepCount || 8450,
    sleepHours: raw.sleepHours || 7.5
  };
};

export const saveAppleWatchLog = (date, watchData) => {
  const logs = getAppleWatchLogs();
  logs[date] = { ...logs[date], ...watchData };
  localStorage.setItem(APPLE_WATCH_KEY, JSON.stringify(logs));
  return logs;
};

export const getCompletedCalendarDays = () => {
  const data = localStorage.getItem(CALENDAR_KEY);
  if (!data) {
    const seedCompleted = [];
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(seedCompleted));
    return seedCompleted;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const toggleCalendarDayCompleted = (date) => {
  const days = getCompletedCalendarDays();
  let updated;
  if (days.includes(date)) {
    updated = days.filter(d => d !== date);
  } else {
    updated = [...days, date];
  }
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(updated));
  return updated;
};

const SLOT_SWAPS_KEY = 'transformation_slot_swaps_v1';

export const getMealChecks = () => {
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveMealCheck = (date, mealIdx, isChecked) => {
  const checks = getMealChecks();
  if (!checks[date]) checks[date] = {};
  checks[date][mealIdx] = isChecked;
  localStorage.setItem(MEALS_KEY, JSON.stringify(checks));
  return checks;
};

export const getSlotSwaps = () => {
  const data = localStorage.getItem(SLOT_SWAPS_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveSlotSwap = (date, slotIdx, mealObj) => {
  const swaps = getSlotSwaps();
  if (!swaps[date]) swaps[date] = {};
  swaps[date][slotIdx] = mealObj;
  localStorage.setItem(SLOT_SWAPS_KEY, JSON.stringify(swaps));
  return swaps;
};

export const getGroceryChecks = () => {
  const data = localStorage.getItem(GROCERY_KEY);
  return data ? JSON.parse(data) : {};
};

export const toggleGroceryItem = (itemText) => {
  const checks = getGroceryChecks();
  checks[itemText] = !checks[itemText];
  localStorage.setItem(GROCERY_KEY, JSON.stringify(checks));
  return checks;
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
  const data = localStorage.getItem(CHECKLIST_KEY);
  const all = data ? JSON.parse(data) : {};
  return all[date] || { creatine: false, b12: false, d3: false, omega3: false, waterLitres: 0 };
};

export const saveDailyChecklist = (date, checklist) => {
  const data = localStorage.getItem(CHECKLIST_KEY);
  const all = data ? JSON.parse(data) : {};
  all[date] = checklist;
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(all));
  return all;
};

export const exportUserData = () => {
  const exportObj = {
    weeklyWeights: getWeeklyWeightLogs(),
    workouts: getWorkoutLogs(),
    appleWatch: getAppleWatchLogs(),
    completedCalendar: getCompletedCalendarDays(),
    mealChecks: getMealChecks(),
    groceryChecks: getGroceryChecks(),
    rotation: getProteinRotation(),
    scenario: getMealScenario(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(exportObj, null, 2);
};

export const importUserData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.weeklyWeights) localStorage.setItem(WEEKLY_WEIGHT_KEY, JSON.stringify(data.weeklyWeights));
    if (data.workouts) localStorage.setItem(WORKOUT_KEY, JSON.stringify(data.workouts));
    if (data.appleWatch) localStorage.setItem(APPLE_WATCH_KEY, JSON.stringify(data.appleWatch));
    if (data.completedCalendar) localStorage.setItem(CALENDAR_KEY, JSON.stringify(data.completedCalendar));
    if (data.mealChecks) localStorage.setItem(MEALS_KEY, JSON.stringify(data.mealChecks));
    if (data.groceryChecks) localStorage.setItem(GROCERY_KEY, JSON.stringify(data.groceryChecks));
    if (data.rotation) localStorage.setItem(ROTATION_KEY, data.rotation);
    if (data.scenario) localStorage.setItem(SCENARIO_KEY, data.scenario);
    return true;
  } catch (e) {
    return false;
  }
};
