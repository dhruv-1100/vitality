import React, { useState } from 'react';
import { Watch, X, Check } from 'lucide-react';
import { getAppleWatchLogForDate, saveAppleWatchLog, APPLE_WATCH_PLACEHOLDERS } from '../utils/storage';

export default function AppleWatchModal({ activeDate, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    const current = getAppleWatchLogForDate(activeDate);
    // A day with no entry starts from typical values as a starting point to edit;
    // an existing entry is shown exactly as it was saved.
    return Object.fromEntries(
      Object.keys(APPLE_WATCH_PLACEHOLDERS).map(key => [
        key,
        current.logged && typeof current[key] === 'number' ? current[key] : APPLE_WATCH_PLACEHOLDERS[key]
      ])
    );
  });
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = {
      totalCalories: parseInt(form.totalCalories) || 0,
      activeCalories: parseInt(form.activeCalories) || 0,
      workoutCalories: parseInt(form.workoutCalories) || 0,
      workoutActiveCalories: parseInt(form.workoutActiveCalories) || 0,
      restingHeartRate: parseInt(form.restingHeartRate) || 0,
      workoutAvgHeartRate: parseInt(form.workoutAvgHeartRate) || 0,
      stepCount: parseInt(form.stepCount) || 0,
      sleepHours: parseFloat(form.sleepHours) || 0,
    };
    saveAppleWatchLog(activeDate, parsed);
    setSaved(true);
    if (onSaved) onSaved(parsed);
    setTimeout(onClose, 600);
  };

  const fields = [
    { key: 'totalCalories', label: 'Total Calories', unit: 'kcal', emoji: '🔥' },
    { key: 'activeCalories', label: 'Active Calories', unit: 'kcal', emoji: '⚡' },
    { key: 'workoutCalories', label: 'Workout Calories', unit: 'kcal', emoji: '🏋️' },
    { key: 'workoutActiveCalories', label: 'Workout Active Cals', unit: 'kcal', emoji: '💪' },
    { key: 'restingHeartRate', label: 'Resting HR', unit: 'bpm', emoji: '💚' },
    { key: 'workoutAvgHeartRate', label: 'Workout Avg HR', unit: 'bpm', emoji: '❤️' },
    { key: 'stepCount', label: 'Steps', unit: 'steps', emoji: '👟' },
    { key: 'sleepHours', label: 'Sleep', unit: 'hrs', emoji: '😴' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/25 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-lg w-full p-6 animate-scale-in" style={{ boxShadow: 'var(--shadow-modal)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Watch className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Apple Watch Telemetry</h3>
              <p className="text-xs text-slate-400 font-medium">Date: {activeDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={f.key === 'sleepHours' ? '0.1' : '1'}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="input-field pr-12 text-sm font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    {f.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Apple Watch telemetry updated!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm font-medium text-slate-400 hover:text-slate-600 px-3 py-2">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check className="w-4 h-4" />
              <span>Save Telemetry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
