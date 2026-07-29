import React, { useState } from 'react';
import { Scale, Dumbbell, Utensils, Droplets, Pill, Flame, ArrowRight, Heart, Footprints, Moon, Watch, Plus, Info, Activity, Sparkles } from 'lucide-react';
import { AUGUST_CALENDAR, MEAL_TIMETABLE_SCENARIO_A, MEAL_TIMETABLE_SCENARIO_B } from '../utils/transformationData';
import { getWeeklyWeightLogs, saveWeeklyWeightLog, getMealChecks, saveMealCheck, getDailyChecklist, saveDailyChecklist, getAppleWatchLogForDate } from '../utils/storage';
import AppleWatchModal from './AppleWatchModal';

export default function Dashboard({ setActiveTab, setSelectedRoutine, activeScenario, setActiveScenario }) {
  const [selectedDate, setSelectedDate] = useState('2026-07-29');
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [weightInput, setWeightInput] = useState('59.3');
  const [waistInput, setWaistInput] = useState('29.1');
  const [weightNote, setWeightNote] = useState('');
  const [saveMsg, setSaveMsg] = useState(false);
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [_, forceUpdate] = useState(0);

  const weeklyLogs = getWeeklyWeightLogs();
  const mealChecks = getMealChecks();
  const dailyChecklist = getDailyChecklist(selectedDate);
  const watchData = getAppleWatchLogForDate(selectedDate);
  const todayCalendar = AUGUST_CALENDAR.find(c => c.date === selectedDate) || { session: 'Rest', weekNum: 1, rpe: '-', notes: 'Recovery day' };
  const timetable = activeScenario === 'Scenario A' ? MEAL_TIMETABLE_SCENARIO_A : MEAL_TIMETABLE_SCENARIO_B;
  const currentMealChecks = mealChecks[selectedDate] || {};

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

  const toggleSupp = (key) => {
    saveDailyChecklist(selectedDate, { ...dailyChecklist, [key]: !dailyChecklist[key] });
    forceUpdate(x => x + 1);
  };

  const addWater = (d) => {
    saveDailyChecklist(selectedDate, { ...dailyChecklist, waterLitres: Math.max(0, parseFloat(((dailyChecklist.waterLitres || 0) + d).toFixed(1))) });
    forceUpdate(x => x + 1);
  };

  const Ring = ({ pct, color, trackColor = 'rgba(255,255,255,0.08)', size = 100, stroke = 12, children }) => {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
            {greeting} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
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
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Watch className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight font-display">Apple Watch</p>
            <p className="text-[11px] text-slate-400">Today's biometrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="pill pill-coral"><Flame className="w-3.5 h-3.5" />{watchData.workoutCalories} kcal</span>
          <span className="pill pill-green"><Activity className="w-3.5 h-3.5" />{watchData.dailyActiveCalories} active</span>
          <span className="pill pill-rose" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' }}><Heart className="w-3.5 h-3.5" />{watchData.restingHeartRate} bpm</span>
          <span className="pill pill-blue"><Footprints className="w-3.5 h-3.5" />{watchData.stepCount.toLocaleString()} steps</span>
          <span className="pill pill-purple"><Moon className="w-3.5 h-3.5" />{watchData.sleepHours}h sleep</span>
          <button onClick={() => setShowWatchModal(true)} className="pill pill-gray hover:bg-white/10 cursor-pointer transition-colors">
            <Plus className="w-3.5 h-3.5" />Edit
          </button>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
        {/* Calories Ring */}
        <div className="card flex items-center gap-6 !p-6">
          <Ring pct={calPct} color="#10b981" size={100} stroke={12}>
            <span className="text-xl font-extrabold text-white tabular-nums">{checkedCals}</span>
            <span className="text-[10px] text-slate-400 font-semibold -mt-0.5">/ 2800</span>
          </Ring>
          <div className="flex-1">
            <p className="text-base font-bold text-white font-display">Calories</p>
            <p className="text-sm text-slate-400 mt-0.5">{2800 - checkedCals} kcal left</p>
            <p className="text-xs text-emerald-400 font-semibold mt-2">{Math.round(calPct)}% of daily goal</p>
          </div>
        </div>

        {/* Protein Ring */}
        <div className="card flex items-center gap-6 !p-6">
          <Ring pct={protPct} color="#f97316" size={100} stroke={12}>
            <span className="text-xl font-extrabold text-white tabular-nums">{checkedProtein}g</span>
            <span className="text-[10px] text-slate-400 font-semibold -mt-0.5">/ 150g</span>
          </Ring>
          <div className="flex-1">
            <p className="text-base font-bold text-white font-display">Protein</p>
            <p className="text-sm text-slate-400 mt-0.5">{150 - checkedProtein}g left</p>
            <p className="text-xs text-orange-400 font-semibold mt-2">{Math.round(protPct)}% of daily goal</p>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="card !p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-base font-bold text-white font-display">{todayCalendar.session === 'Rest' ? 'Rest Day' : todayCalendar.session}</p>
                <p className="text-xs text-slate-400">{todayCalendar.rpe}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{todayCalendar.notes}</p>
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
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-base font-bold text-white font-display">Weight</p>
            </div>
            <span className={`pill text-xs font-bold ${parseFloat(delta) >= 0 ? 'pill-green' : 'pill-coral'}`}>
              {delta > 0 ? '+' : ''}{delta} kg/wk
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-extrabold text-white tabular-nums tracking-tight font-display">{latestLog.weightKg}</span>
            <span className="text-lg text-slate-400 font-semibold">kg</span>
          </div>
          <p className="text-sm text-slate-400 mb-5">Target: <span className="font-bold text-emerald-400">66.0 kg</span> by December</p>

          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(3, weightPct)}%`,
                background: 'linear-gradient(90deg, #34d399, #10b981)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
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
          <p className="text-base font-bold text-white mb-4 flex items-center gap-2 font-display">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Log Weekly Weigh-In
          </p>
          <form onSubmit={handleSaveWeight} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Week</label>
                <select value={selectedWeekNum} onChange={(e) => setSelectedWeekNum(parseInt(e.target.value))} className="input-field text-sm">
                  {Array.from({ length: 21 }, (_, i) => i + 1).map(w => <option key={w} value={w}>Week {w}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Weight (kg)</label>
                <input type="number" step="0.1" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="input-field text-sm" placeholder="59.3" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Waist (in)</label>
                <input type="number" step="0.1" value={waistInput} onChange={(e) => setWaistInput(e.target.value)} className="input-field text-sm" placeholder="29.1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Note</label>
                <input type="text" value={weightNote} onChange={(e) => setWeightNote(e.target.value)} placeholder="Optional note" className="input-field text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Sunday morning, before eating</p>
              <button type="submit" className="btn-primary">Save Weigh-In</button>
            </div>
          </form>
          {saveMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/60 text-emerald-300 text-sm font-semibold text-center border border-emerald-500/30 animate-fade-in">
              ✓ Week {selectedWeekNum} weigh-in saved!
            </div>
          )}
        </div>
      </div>

      {/* Meals + Supplements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
        {/* Meal Checklist */}
        <div className="card !p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-bold text-white font-display">Daily Meals</p>
                <p className="text-xs text-slate-400">{mealsChecked}/{timetable.length} meals logged &middot; {checkedCals} kcal</p>
              </div>
            </div>
            <div className="flex bg-slate-900/80 p-1 rounded-full border border-white/5">
              {['Scenario A', 'Scenario B'].map(s => (
                <button key={s} onClick={() => setActiveScenario(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${activeScenario === s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}>
                  {s === 'Scenario A' ? 'MW' : 'TR'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {timetable.map((meal, idx) => {
              const checked = !!currentMealChecks[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleMeal(idx)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                    checked
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-white'
                  }`}
                >
                  <div className={`check-circle ${checked ? 'checked' : ''}`}>
                    {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{meal.time}</span>
                      <span className={`text-sm font-bold ${checked ? 'text-emerald-400' : 'text-white'}`}>{meal.meal}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{meal.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-400">{meal.protein}</p>
                    <p className="text-[10px] text-slate-400">{meal.cals} kcal</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supplements + Water */}
        <div className="space-y-5">
          {/* Supplements */}
          <div className="card !p-6">
            <p className="text-base font-bold text-white mb-4 flex items-center gap-2 font-display">
              <Pill className="w-4 h-4 text-sky-400" />
              Supplements
            </p>
            <div className="space-y-2.5">
              {[
                { key: 'creatine', label: 'Creatine 5g', sub: 'Monohydrate — daily', emoji: '💪' },
                { key: 'b12', label: 'Vitamin B12', sub: '500–1000mcg', emoji: '🔴' },
                { key: 'd3', label: 'Vitamin D3', sub: '1000–2000 IU', emoji: '☀️' },
                { key: 'omega3', label: 'Omega-3 (Algae)', sub: 'EPA/DHA', emoji: '🐟' },
              ].map(s => {
                const on = !!dailyChecklist[s.key];
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleSupp(s.key)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all border ${
                      on
                        ? 'bg-sky-950/40 border-sky-500/30'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${on ? 'text-sky-300' : 'text-white'}`}>{s.label}</p>
                      <p className="text-[11px] text-slate-400">{s.sub}</p>
                    </div>
                    <div className={`check-circle ${on ? 'checked' : ''}`} style={on ? { background: '#38bdf8', borderColor: '#38bdf8', boxShadow: '0 0 10px rgba(56,189,248,0.5)' } : {}}>
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
              <p className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Droplets className="w-4 h-4 text-sky-400" />
                Water
              </p>
              <span className="text-xs text-slate-400 font-medium">Goal: 3.5L</span>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-4xl font-extrabold text-white tabular-nums font-display">{dailyChecklist.waterLitres || 0}</span>
                <span className="text-base text-slate-400 font-medium ml-1">/ 3.5 L</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addWater(-0.5)} className="btn-secondary !text-xs !px-3 !py-2">−0.5L</button>
                <button onClick={() => addWater(0.5)} className="!text-xs !px-3.5 !py-2 rounded-xl bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 hover:bg-sky-500/30 transition-all cursor-pointer">+0.5L</button>
              </div>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((dailyChecklist.waterLitres || 0) / 3.5) * 100)}%`,
                  background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
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
