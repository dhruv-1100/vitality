import React, { useState } from 'react';
import { Utensils, Clock, ChefHat, ChevronDown, ChevronUp, AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import { MEAL_TIMETABLE_SCENARIO_A, MEAL_TIMETABLE_SCENARIO_B, BATCH_COOKING_SESSIONS, PROTEIN_ROTATIONS, EMERGENCY_MEALS, PRE_WORKOUT_CARBS } from '../utils/transformationData';
import { getProteinRotation, setProteinRotation } from '../utils/storage';

export default function DietHub({ activeScenario, setActiveScenario }) {
  const [activeSection, setActiveSection] = useState('schedule');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [currentRotation, setCurrentRotation] = useState(getProteinRotation());

  const timetable = activeScenario === 'Scenario A' ? MEAL_TIMETABLE_SCENARIO_A : MEAL_TIMETABLE_SCENARIO_B;

  const sections = [
    { id: 'schedule', label: 'Meal Schedule' },
    { id: 'batch', label: 'Batch Prep' },
    { id: 'rotation', label: 'Protein Rotation' },
    { id: 'emergency', label: 'Quick Meals' },
  ];

  const handleRotationChange = (r) => {
    setProteinRotation(r);
    setCurrentRotation(r);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nutrition</h1>
        <p className="text-sm text-gray-400 mt-0.5">2,800 kcal · 150g protein · Lacto-vegetarian</p>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Daily Timetable</p>
            <div className="flex bg-gray-100 p-1 rounded-full">
              <button onClick={() => setActiveScenario('Scenario A')} className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${activeScenario === 'Scenario A' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}>
                MW Class
              </button>
              <button onClick={() => setActiveScenario('Scenario B')} className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${activeScenario === 'Scenario B' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}>
                TR Class
              </button>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            {timetable.map((meal, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 ${idx > 0 ? 'border-t border-gray-50' : ''}`}>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{meal.time}</span>
                    <span className="text-sm font-semibold text-gray-800">{meal.meal}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{meal.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-green-600">{meal.protein}</p>
                  <p className="text-[10px] text-gray-400">{meal.cals} kcal</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-workout Carbs */}
          <div className="card p-5">
            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Pre-Workout Fuel Options
            </p>
            <div className="space-y-2">
              {PRE_WORKOUT_CARBS.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="text-sm">⚡</span>
                  <span className="text-sm text-gray-700">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batch Prep */}
      {activeSection === 'batch' && (
        <div className="space-y-4">
          {BATCH_COOKING_SESSIONS.map(session => (
            <div key={session.id} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <ChefHat className="w-[18px] h-[18px] text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{session.title}</p>
                  <p className="text-xs text-gray-400">~{session.timeEst} total</p>
                </div>
              </div>

              <div className="space-y-2">
                {session.recipes.map((recipe, ri) => {
                  const isOpen = expandedRecipe === `${session.id}-${ri}`;
                  return (
                    <div key={ri} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedRecipe(isOpen ? null : `${session.id}-${ri}`)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{recipe.name}</p>
                          <p className="text-xs text-gray-400">Active: {recipe.activeTime} · Total: {recipe.totalTime}</p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-0">
                          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">{recipe.ingredients}</p>
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
          <p className="text-sm text-gray-500">Rotate protein sources every week to prevent flavor fatigue and ensure micronutrient variety.</p>
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
            <div key={r.weekLabel} className="card p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sunday Prep (Mon–Wed)</p>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-xl border border-green-100">{r.session1}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Thursday Prep (Thu–Sun)</p>
                <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-xl border border-orange-100">{r.session2}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Meals */}
      {activeSection === 'emergency' && (
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Emergency Fallback Meals
            </p>
            <p className="text-xs text-gray-400 mb-4">When life gets busy. Zero prep, high protein options.</p>
            <div className="space-y-2">
              {EMERGENCY_MEALS.map((meal, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <p className="text-sm font-semibold text-gray-800">{meal.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{meal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
