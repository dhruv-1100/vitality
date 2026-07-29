import React, { useState } from 'react';
import { Watch, X, Check } from 'lucide-react';
import { getAppleWatchLogForDate, saveAppleWatchLog } from '../utils/storage';

export default function AppleWatchModal({ activeDate, onClose, onSaved }) {
  const current = getAppleWatchLogForDate(activeDate);
  const [form, setForm] = useState({
    workoutCalories: current.workoutCalories || 400,
    dailyActiveCalories: current.dailyActiveCalories || 650,
    restingHeartRate: current.restingHeartRate || 64,
    workoutAvgHeartRate: current.workoutAvgHeartRate || 135,
    stepCount: current.stepCount || 8000,
    sleepHours: current.sleepHours || 7.5,
  });
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = {
      workoutCalories: parseInt(form.workoutCalories) || 0,
      dailyActiveCalories: parseInt(form.dailyActiveCalories) || 0,
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
    { key: 'workoutCalories', label: 'Workout Burn', unit: 'kcal', emoji: '🔥' },
    { key: 'dailyActiveCalories', label: 'Daily Active', unit: 'kcal', emoji: '⚡' },
    { key: 'restingHeartRate', label: 'Resting HR', unit: 'bpm', emoji: '💚' },
    { key: 'workoutAvgHeartRate', label: 'Workout HR', unit: 'bpm', emoji: '❤️' },
    { key: 'stepCount', label: 'Steps', unit: 'steps', emoji: '👟' },
    { key: 'sleepHours', label: 'Sleep', unit: 'hrs', emoji: '😴' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/25 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full p-6 animate-scale-in" style={{ boxShadow: 'var(--shadow-modal)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Watch className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Apple Watch Stats</h3>
              <p className="text-xs text-gray-400">{activeDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={f.key === 'sleepHours' ? '0.1' : '1'}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="input-field pr-12 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                    {f.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-semibold animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Watch stats saved!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm font-medium text-gray-400 hover:text-gray-600 px-3 py-2">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check className="w-4 h-4" />
              <span>Save Stats</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
