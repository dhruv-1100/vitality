import React, { useState } from 'react';
import { Scale, Dumbbell, Utensils, Droplets, Pill, Flame, ArrowRight, Heart, Footprints, Moon, Watch, Plus, Info, Activity, Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { AUGUST_CALENDAR, MEAL_TIMETABLE_SCENARIO_A, MEAL_TIMETABLE_SCENARIO_B, MEAL_TIMETABLE_WEEKEND, MEAL_TIMETABLES_MAP, TIME_SLOT_ALTERNATIVES } from '../utils/transformationData';
import { getWeeklyWeightLogs, saveWeeklyWeightLog, getMealChecks, saveMealCheck, getDailyChecklist, saveDailyChecklist, getAppleWatchLogForDate, getSlotSwaps, saveSlotSwap } from '../utils/storage';
import AppleWatchModal from './AppleWatchModal';
import MealSlotEditor from './MealSlotEditor';

const WEEKDAYS = [
  { day: 'Mon', fullName: 'Monday', defaultPlan: 'Scenario A (Mon/Wed Class)' },
  { day: 'Tue', fullName: 'Tuesday', defaultPlan: 'Scenario B (Tue/Thu Class)' },
  { day: 'Wed', fullName: 'Wednesday', defaultPlan: 'Scenario A (Mon/Wed Class)' },
  { day: 'Thu', fullName: 'Thursday', defaultPlan: 'Scenario B (Tue/Thu Class)' },
  { day: 'Fri', fullName: 'Friday', defaultPlan: 'Weekend / Non-Class Prep' },
  { day: 'Sat', fullName: 'Saturday', defaultPlan: 'Weekend / Non-Class Prep' },
  { day: 'Sun', fullName: 'Sunday', defaultPlan: 'Weekend / Non-Class Prep' },
];

export default function Dashboard({ setActiveTab, setSelectedRoutine }) {
  const [selectedDate, setSelectedDate] = useState('2026-07-30');
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [weightInput, setWeightInput] = useState('59.3');
  const [waistInput, setWaistInput] = useState('29.1');
  const [weightNote, setWeightNote] = useState('');
  const [saveMsg, setSaveMsg] = useState(false);
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [selectedDayName, setSelectedDayName] = useState('Thu');
  const [openSwapIdx, setOpenSwapIdx] = useState(null);
  const [_, forceUpdate] = useState(0);

  const weeklyLogs = getWeeklyWeightLogs();
  const mealChecks = getMealChecks();
  const slotSwaps = getSlotSwaps();
  const dailyChecklist = getDailyChecklist(selectedDate);
  const watchData = getAppleWatchLogForDate(selectedDate);
  const todayCalendar = AUGUST_CALENDAR.find(c => c.date === selectedDate) || { session: 'Rest', weekNum: 1, rpe: '-', notes: 'Recovery day' };
  
  const currentDayConfig = WEEKDAYS.find(w => w.day === selectedDayName) || WEEKDAYS[2];
  const activePlanName = currentDayConfig.defaultPlan;
  const baseTimetable = MEAL_TIMETABLES_MAP[activePlanName] || MEAL_TIMETABLE_SCENARIO_A;
  const currentMealChecks = mealChecks[selectedDate] || {};
  const currentDateSwaps = slotSwaps[selectedDate] || {};

  // Build active timetable taking per-slot swaps into account
  const timetable = baseTimetable.map((baseMeal, idx) => {
    const swap = currentDateSwaps[idx];
    if (swap) {
      return {
        ...baseMeal,
        detail: `${swap.name} — ${swap.detail}`,
        protein: swap.protein,
        cals: swap.cals,
        isCustom: true
      };
    }
    return baseMeal;
  });

  let checkedProtein = 0, checkedCals = 0, mealsChecked = 0;
  timetable.forEach((meal, idx) => {
    if (currentMealChecks[idx]) {
      checkedProtein += parseInt(meal.protein) || 0;
      checkedCals += parseInt(meal.cals) || 0;
      mealsChecked++;
    }
  });

  const latestLog = weeklyLogs[weeklyLogs.length - 1] || { weightKg: 59.3 };
  const prevLog = weeklyLogs.length > 1 ? weeklyLogs[weeklyLogs.length - 2] : { weightKg: 59.0 };
  const delta = (latestLog.weightKg - prevLog.weightKg).toFixed(1);

  const calPct = Math.min(100, (checkedCals / 2800) * 100);
  const protPct = Math.min(100, (checkedProtein / 150) * 100);
  const weightPct = Math.min(100, ((latestLog.weightKg - 59) / (66 - 59)) * 100);

  const handleSaveWeight = (e) => {
    e.preventDefault();
    const kg = parseFloat(weightInput);
    if (kg > 0) {
      saveWeeklyWeightLog({ weekNum: selectedWeekNum, date: selectedDate, weightKg: kg, waistInches: parseFloat(waistInput) || 0, note: weightNote });
      setSaveMsg(true);
      setTimeout(() => setSaveMsg(false), 2500);
    }
  };

  const toggleMeal = (idx) => {
    saveMealCheck(selectedDate, idx, !currentMealChecks[idx]);
    forceUpdate(x => x + 1);
  };

  const handleSwapChoice = (idx, altOption) => {
    saveSlotSwap(selectedDate, idx, altOption);
    setOpenSwapIdx(null);
    forceUpdate(x => x + 1);
  };

  const resetSlotSwap = (idx, e) => {
    e.stopPropagation();
    saveSlotSwap(selectedDate, idx, null);
    forceUpdate(x => x + 1);
  };

  const toggleSupp = (key) => {
    saveDailyChecklist(selectedDate, { ...dailyChecklist, [key]: !dailyChecklist[key] });
    forceUpdate(x => x + 1);
  };

  const addWater = (d) => {
    saveDailyChecklist(selectedDate, { ...dailyChecklist, waterLitres: Math.max(0, parseFloat(((dailyChecklist.waterLitres || 0) + d).toFixed(1))) });
    forceUpdate(x => x + 1);
  };

  const getAlternativesForSlot = (mealName) => {
    const key = Object.keys(TIME_SLOT_ALTERNATIVES).find(k => mealName.toLowerCase().includes(k.toLowerCase())) || "Lunch";
    return TIME_SLOT_ALTERNATIVES[key] || TIME_SLOT_ALTERNATIVES["Lunch"];
  };

  const Ring = ({ pct, color, trackColor = 'rgba(0,0,0,0.06)', size = 100, stroke = 12, children }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (Math.min(100, pct) / 100) * c;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset} className="progress-ring-fill" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-7 pb-16">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            {greeting} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {dateLabel} &middot; Week {todayCalendar.weekNum} &middot; Phase 1: Foundation
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); forceUpdate(x => x + 1); }}
          className="input-field !w-auto text-sm"
        />
      </div>

      {/* Apple Watch Biometrics Strip */}
      <div className="card !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Watch className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight font-display">Apple Watch</p>
            <p className="text-[11px] text-slate-400 font-medium">Today's biometrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="pill pill-coral" title="Total Calories"><Flame className="w-3.5 h-3.5" />Total: {watchData.totalCalories} kcal</span>
          <span className="pill pill-green" title="Active Calories"><Activity className="w-3.5 h-3.5" />Active: {watchData.activeCalories} kcal</span>
          <span className="pill pill-amber" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.25)' }} title="Workout Calories"><Flame className="w-3.5 h-3.5" />Workout: {watchData.workoutCalories} kcal</span>
          <span className="pill pill-orange text-orange-700" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#c2410c', border: '1px solid rgba(234, 88, 12, 0.25)' }} title="Workout Active Calories"><Activity className="w-3.5 h-3.5" />Wk Active: {watchData.workoutActiveCalories} kcal</span>
          <span className="pill pill-rose" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#e11d48', border: '1px solid rgba(244, 63, 94, 0.25)' }} title="Resting Heart Rate"><Heart className="w-3.5 h-3.5" />Rest HR: {watchData.restingHeartRate} bpm</span>
          <span className="pill pill-pink" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#db2777', border: '1px solid rgba(236, 72, 153, 0.25)' }} title="Workout Average Heart Rate"><Heart className="w-3.5 h-3.5" />Wk Avg HR: {watchData.workoutAvgHeartRate} bpm</span>
          <span className="pill pill-blue" title="Daily Steps"><Footprints className="w-3.5 h-3.5" />{watchData.stepCount.toLocaleString()} steps</span>
          <span className="pill pill-purple" title="Sleep Duration"><Moon className="w-3.5 h-3.5" />{watchData.sleepHours}h sleep</span>
          <button onClick={() => setShowWatchModal(true)} className="pill pill-gray hover:bg-black/10 cursor-pointer transition-colors">
            <Plus className="w-3.5 h-3.5" />Edit Stats
          </button>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
        {/* Calories Ring */}
        <div className="card flex items-center gap-6 !p-6">
          <Ring pct={calPct} color="#22c55e" size={100} stroke={12}>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">{checkedCals}</span>
            <span className="text-[10px] text-slate-400 font-semibold -mt-0.5">/ 2800</span>
          </Ring>
          <div className="flex-1">
            <p className="text-base font-bold text-slate-900 font-display">Calories</p>
            <p className="text-sm text-slate-500 mt-0.5">{2800 - checkedCals} kcal left</p>
            <p className="text-xs text-emerald-600 font-bold mt-2">{Math.round(calPct)}% of daily goal</p>
          </div>
        </div>

        {/* Protein Ring */}
        <div className="card flex items-center gap-6 !p-6">
          <Ring pct={protPct} color="#fb923c" size={100} stroke={12}>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">{checkedProtein}g</span>
            <span className="text-[10px] text-slate-400 font-semibold -mt-0.5">/ 150g</span>
          </Ring>
          <div className="flex-1">
            <p className="text-base font-bold text-slate-900 font-display">Protein</p>
            <p className="text-sm text-slate-500 mt-0.5">{150 - checkedProtein}g left</p>
            <p className="text-xs text-orange-600 font-bold mt-2">{Math.round(protPct)}% of daily goal</p>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="card !p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">{todayCalendar.session === 'Rest' ? 'Rest Day' : todayCalendar.session}</p>
                <p className="text-xs text-slate-400">{todayCalendar.rpe}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{todayCalendar.notes}</p>
          </div>
          <button
            onClick={() => { setSelectedRoutine(todayCalendar.session === 'Rest' ? 'Push B' : todayCalendar.session); setActiveTab('workout'); }}
            className="btn-coral w-full mt-5 !py-3"
          >
            <Dumbbell className="w-4 h-4" />
            <span>{todayCalendar.session === 'Rest' ? 'Start Next Workout' : 'Start Workout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-in">
        {/* Weight Display */}
        <div className="card !p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-base font-bold text-slate-900 font-display">Weight</p>
            </div>
            <span className={`pill text-xs font-bold ${parseFloat(delta) >= 0 ? 'pill-green' : 'pill-coral'}`}>
              {delta > 0 ? '+' : ''}{delta} kg/wk
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-extrabold text-slate-900 tabular-nums tracking-tight font-display">{latestLog.weightKg}</span>
            <span className="text-lg text-slate-400 font-semibold">kg</span>
          </div>
          <p className="text-sm text-slate-500 mb-5">Target: <span className="font-bold text-emerald-600">66.0 kg</span> by December</p>

          <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden border border-black/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(3, weightPct)}%`,
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)'
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-slate-400 font-medium">59.0 kg start</span>
            <span className="text-[11px] text-slate-400 font-medium">66.0 kg goal</span>
          </div>
        </div>

        {/* Log Weight Form */}
        <div className="card !p-6 lg:col-span-3">
          <p className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Log Weekly Weigh-In
          </p>
          <form onSubmit={handleSaveWeight} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Week</label>
                <select value={selectedWeekNum} onChange={(e) => setSelectedWeekNum(parseInt(e.target.value))} className="input-field text-sm">
                  {Array.from({ length: 21 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Week {w}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Weight (kg)</label>
                <input type="number" step="0.1" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="input-field text-sm" placeholder="59.3" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Waist (in)</label>
                <input type="number" step="0.1" value={waistInput} onChange={(e) => setWaistInput(e.target.value)} className="input-field text-sm" placeholder="29.1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Note</label>
                <input type="text" value={weightNote} onChange={(e) => setWeightNote(e.target.value)} placeholder="Optional note" className="input-field text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Sunday morning, before eating</p>
              <button type="submit" className="btn-primary">Save Weigh-In</button>
            </div>
          </form>
          {saveMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold text-center border border-emerald-200 animate-fade-in">
              ✓ Week {selectedWeekNum} weigh-in saved!
            </div>
          )}
        </div>
      </div>

      {/* Meals + Supplements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
        {/* Per-Slot Alternative Meal Logging */}
        <div className="card !p-6 lg:col-span-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">Per-Slot Meal Logging</p>
                <p className="text-xs text-slate-400">{mealsChecked}/{timetable.length} logged &middot; {checkedCals} kcal &middot; {checkedProtein}g protein</p>
              </div>
            </div>
            <span className="pill pill-green text-xs font-bold">Slot Swapping Active</span>
          </div>

          {/* Full Week Day Selector Pills */}
          <div className="flex items-center gap-1.5 mb-5 overflow-x-auto scrollbar-none pb-1">
            {WEEKDAYS.map(w => {
              const active = selectedDayName === w.day;
              return (
                <button
                  key={w.day}
                  onClick={() => setSelectedDayName(w.day)}
                  className={`flex-1 min-w-[48px] py-2 px-3 rounded-2xl text-xs font-extrabold transition-all border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/15 scale-[1.03]'
                      : 'bg-white/60 text-slate-500 border-slate-200/60 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {w.day}
                </button>
              );
            })}
          </div>

          {/* Per-Slot Meal List */}
          <div className="space-y-3">
            {timetable.map((meal, idx) => {
              const checked = !!currentMealChecks[idx];
              const isSwapOpen = openSwapIdx === idx;
              const alternatives = getAlternativesForSlot(meal.meal);
              const hasCustomSwap = currentDateSwaps[idx];

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    checked
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-700'
                      : 'bg-white/60 border-slate-200/60 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  {/* Slot Main Row */}
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => toggleMeal(idx)}>
                    <div className={`check-circle ${checked ? 'checked' : ''}`}>
                      {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{meal.time}</span>
                        <span className={`text-sm font-bold ${checked ? 'text-emerald-700' : 'text-slate-900'}`}>{meal.meal}</span>
                        {hasCustomSwap && (
                          <span className="pill pill-coral text-[10px] !py-0.5 !px-2">Swapped</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{meal.detail}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{meal.protein}</p>
                        <p className="text-[10px] text-slate-400">{meal.cals} kcal</p>
                      </div>

                      {/* Slot Swap Expand Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenSwapIdx(isSwapOpen ? null : idx); }}
                        className="p-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="Swap meal choice for this slot"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {isSwapOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Slot Alternatives & Search / Custom Food Editor */}
                  {isSwapOpen && (
                    <MealSlotEditor
                      meal={meal}
                      slotIdx={idx}
                      alternatives={alternatives}
                      hasCustomSwap={hasCustomSwap}
                      onSelectMeal={(alt) => handleSwapChoice(idx, alt)}
                      onResetMeal={(e) => resetSlotSwap(idx, e)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Supplements + Water */}
        <div className="space-y-5">
          {/* Supplements */}
          <div className="card !p-6">
            <p className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
              <Pill className="w-4 h-4 text-sky-500" />
              Supplements
            </p>
            <div className="space-y-2.5">
              {[
                { key: 'creatine', label: 'Creatine 5g', sub: 'Monohydrate — Daily non-negotiable', emoji: '💪' },
                { key: 'b12', label: 'Vitamin B12 (1 Gummy Daily)', sub: '1 gummy daily with meal', emoji: '🍬' },
                ...(selectedDayName === 'Sun' || new Date(selectedDate + 'T12:00:00').getDay() === 0 ? [
                  { key: 'd3', label: 'Vitamin D3 (60,000 IU Tablet)', sub: '1 tablet ONCE a week (Sunday with fat)', emoji: '☀️' }
                ] : [])
              ].map(s => {
                const on = !!dailyChecklist[s.key];
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleSupp(s.key)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all border ${
                      on
                        ? 'bg-sky-500/10 border-sky-500/25'
                        : 'bg-white/60 border-slate-200/60 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${on ? 'text-sky-800' : 'text-slate-900'}`}>{s.label}</p>
                      <p className="text-[11px] text-slate-400">{s.sub}</p>
                    </div>
                    <div className={`check-circle ${on ? 'checked' : ''}`} style={on ? { background: '#38bdf8', borderColor: '#38bdf8', boxShadow: '0 0 10px rgba(56,189,248,0.4)' } : {}}>
                      {on && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Water */}
          <div className="card !p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
                <Droplets className="w-4 h-4 text-sky-500" />
                Water
              </p>
              <span className="text-xs text-slate-400 font-medium">Goal: 3.5L</span>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums font-display">{dailyChecklist.waterLitres || 0}</span>
                <span className="text-base text-slate-400 font-medium ml-1">/ 3.5 L</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addWater(-0.5)} className="btn-secondary !text-xs !px-3 !py-2">−0.5L</button>
                <button onClick={() => addWater(0.5)} className="!text-xs !px-3.5 !py-2 rounded-xl bg-sky-500/15 text-sky-700 font-bold border border-sky-500/25 hover:bg-sky-500/25 transition-all cursor-pointer">+0.5L</button>
              </div>
            </div>
            <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden border border-black/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((dailyChecklist.waterLitres || 0) / 3.5) * 100)}%`,
                  background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showWatchModal && (
        <AppleWatchModal
          activeDate={selectedDate}
          onClose={() => setShowWatchModal(false)}
          onSaved={() => forceUpdate(x => x + 1)}
        />
      )}
    </div>
  );
}
