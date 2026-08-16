import React, { useState } from 'react';
import { Clock, ChefHat, ChevronDown, ChevronUp, AlertTriangle, Zap, RefreshCw, CalendarDays } from 'lucide-react';
import { MEAL_TIMETABLE_SCENARIO_A, MEAL_TIMETABLES_MAP, BATCH_COOKING_SESSIONS, PROTEIN_ROTATIONS, EMERGENCY_MEALS, PRE_WORKOUT_CARBS, WEEKDAYS } from '../utils/transformationData';
import { getProteinRotation, setProteinRotation, getLocalDateString, getDayName } from '../utils/storage';
import GroceryList from './GroceryList';

export default function DietHub() {
  const [activeSection, setActiveSection] = useState('schedule');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [currentRotation, setCurrentRotation] = useState(getProteinRotation);
  const [selectedDayName, setSelectedDayName] = useState(() => getDayName(getLocalDateString()));
  const [customDayPlans, setCustomDayPlans] = useState({});

  const currentDayConfig = WEEKDAYS.find(w => w.day === selectedDayName) || WEEKDAYS[3];
  const activePlanName = customDayPlans[selectedDayName] || currentDayConfig.defaultPlan;
  const timetable = MEAL_TIMETABLES_MAP[activePlanName] || MEAL_TIMETABLE_SCENARIO_A;

  const dayTotals = timetable.reduce(
    (acc, meal) => ({
      cals: acc.cals + (parseInt(meal.cals) || 0),
      protein: acc.protein + (parseInt(meal.protein) || 0)
    }),
    { cals: 0, protein: 0 }
  );

  const sections = [
    { id: 'schedule', label: 'Meal Schedule' },
    { id: 'grocery', label: 'Grocery Checklist' },
    { id: 'batch', label: 'Batch Prep' },
    { id: 'rotation', label: 'Protein Rotation' },
    { id: 'emergency', label: 'Quick Meals' },
  ];

  const handleRotationChange = (r) => {
    setProteinRotation(r);
    setCurrentRotation(r);
  };

  const handlePlanChange = (newPlan) => {
    setCustomDayPlans(prev => ({ ...prev, [selectedDayName]: newPlan }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Nutrition</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">2,800 kcal &middot; 150g protein &middot; Lacto-vegetarian</p>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`tab-pill ${activeSection === s.id ? 'active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Meal Schedule */}
      {activeSection === 'schedule' && (
        <div className="space-y-5">
          {/* Header & Controls */}
          <div className="card !p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 font-display">Weekly Timetable</p>
                  <p className="text-xs text-slate-400">Select day of week & swap batch prep options</p>
                </div>
              </div>

              {/* Plan Swap Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Plan:</span>
                <select
                  value={activePlanName}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="input-field !w-auto text-xs font-bold !py-2 !px-3"
                >
                  {Object.keys(MEAL_TIMETABLES_MAP).map(planKey => (
                    <option key={planKey} value={planKey}>{planKey}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {WEEKDAYS.map(w => {
                const active = selectedDayName === w.day;
                return (
                  <button
                    key={w.day}
                    onClick={() => setSelectedDayName(w.day)}
                    className={`flex-1 min-w-[52px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                      active
                        ? 'bg-slate-900 text-slate-50 border-slate-900'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {w.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timetable List */}
          <div className="card !p-0 overflow-hidden">
            {timetable.map((meal, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 ${idx > 0 ? 'border-t border-slate-200' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{meal.time}</span>
                    <span className="text-sm font-bold text-slate-900">{meal.meal}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{meal.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-emerald-600">{meal.protein}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{meal.cals} kcal</p>
                </div>
              </div>
            ))}

            {/* Plan totals — makes it obvious whether the day's plan reaches the targets */}
            <div className="flex items-center gap-4 p-4 border-t border-slate-200 bg-slate-50">
              <div className="w-10 shrink-0" />
              <p className="flex-1 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Plan Total</p>
              <div className="text-right shrink-0">
                <p className={`text-sm font-extrabold ${dayTotals.protein >= 150 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {dayTotals.protein}g / 150g
                </p>
                <p className="text-[10px] text-slate-400 font-medium">{dayTotals.cals.toLocaleString()} / 2,800 kcal</p>
              </div>
            </div>
          </div>

          {/* Pre-workout Carbs */}
          <div className="card !p-6">
            <p className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2 font-display">
              <Zap className="w-4 h-4 text-amber-500" />
              Pre-Workout Carb Options
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRE_WORKOUT_CARBS.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-base">⚡</span>
                  <span className="text-xs font-semibold text-amber-900">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grocery Checklist Section */}
      {activeSection === 'grocery' && (
        <GroceryList />
      )}

      {/* Batch Prep */}
      {activeSection === 'batch' && (
        <div className="space-y-4">
          {BATCH_COOKING_SESSIONS.map(session => (
            <div key={session.id} className="card !p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 font-display">{session.title}</p>
                  <p className="text-xs text-slate-400">~{session.timeEst} total</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {session.recipes.map((recipe, ri) => {
                  const isOpen = expandedRecipe === `${session.id}-${ri}`;
                  return (
                    <div key={ri} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setExpandedRecipe(isOpen ? null : `${session.id}-${ri}`)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{recipe.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Active: {recipe.activeTime} &middot; Total: {recipe.totalTime}</p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0">
                          <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl leading-relaxed border border-slate-200">{recipe.ingredients}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Protein Rotation */}
      {activeSection === 'rotation' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Rotate protein sources every week to prevent flavor fatigue and ensure micronutrient variety.</p>
          <div className="flex gap-2 mb-4">
            {PROTEIN_ROTATIONS.map(r => (
              <button
                key={r.weekLabel}
                onClick={() => handleRotationChange(r.weekLabel)}
                className={`tab-pill ${currentRotation === r.weekLabel ? 'active' : ''}`}
              >
                <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                {r.weekLabel}
              </button>
            ))}
          </div>

          {PROTEIN_ROTATIONS.filter(r => r.weekLabel === currentRotation).map(r => (
            <div key={r.weekLabel} className="card !p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sunday Prep (Mon–Wed)</p>
                <p className="text-sm font-medium text-emerald-900 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">{r.session1}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thursday Prep (Thu–Sun)</p>
                <p className="text-sm font-medium text-orange-900 bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">{r.session2}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Meals */}
      {activeSection === 'emergency' && (
        <div className="space-y-4">
          <div className="card !p-6">
            <p className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 font-display">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Emergency Fallback Meals
            </p>
            <p className="text-xs text-slate-400 mb-4">When life gets busy. Zero prep, high protein options.</p>
            <div className="space-y-2.5">
              {EMERGENCY_MEALS.map((meal, i) => (
                <div key={i} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm font-bold text-amber-950">{meal.title}</p>
                  <p className="text-xs text-amber-800 mt-0.5">{meal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
