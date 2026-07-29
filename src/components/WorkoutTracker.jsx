import React, { useState } from 'react';
import { Dumbbell, CheckCircle2, Circle, ChevronDown, ChevronUp, Trophy, Timer } from 'lucide-react';
import { WORKOUT_ROUTINES } from '../utils/transformationData';
import { getWorkoutLogs, saveWorkoutLog } from '../utils/storage';
import RestTimerModal from './RestTimerModal';
import confetti from 'canvas-confetti';

export default function WorkoutTracker({ selectedRoutine, setSelectedRoutine }) {
  const routine = WORKOUT_ROUTINES[selectedRoutine];
  const today = new Date().toISOString().split('T')[0];
  const existingLog = getWorkoutLogs()[today] || {};

  const [exerciseLogs, setExerciseLogs] = useState(existingLog.exercises || {});
  const [expandedExercise, setExpandedExercise] = useState(routine?.exercises?.[0]?.id || '');
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [completed, setCompleted] = useState(false);

  if (!routine) return (
    <div className="card !p-12 text-center">
      <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">Routine "{selectedRoutine}" not found.</p>
    </div>
  );

  const getSetLog = (exId, setIdx) => exerciseLogs[exId]?.[setIdx] || { weight: '', reps: '', done: false };

  const updateSet = (exId, setIdx, field, value) => {
    setExerciseLogs(prev => {
      const updated = { ...prev };
      if (!updated[exId]) updated[exId] = {};
      if (!updated[exId][setIdx]) updated[exId][setIdx] = { weight: '', reps: '', done: false };
      updated[exId][setIdx] = { ...updated[exId][setIdx], [field]: value };
      return updated;
    });
  };

  const toggleSetDone = (exId, setIdx) => {
    const cur = getSetLog(exId, setIdx);
    updateSet(exId, setIdx, 'done', !cur.done);
    if (!cur.done) {
      setTimerSeconds(parseInt(routine.exercises.find(e => e.id === exId)?.rest) || 120);
      setShowTimer(true);
    }
  };

  const handleFinish = () => {
    saveWorkoutLog(today, { date: today, routineName: selectedRoutine, completed: true, exercises: exerciseLogs });
    setCompleted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const totalSets = routine.exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 3), 0);
  let doneSets = 0;
  routine.exercises.forEach(ex => {
    const n = parseInt(ex.sets) || 3;
    for (let i = 0; i < n; i++) { if (getSetLog(ex.id, i).done) doneSets++; }
  });
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Workout</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Log sets, track progress, get stronger</p>
        </div>
        <select
          value={selectedRoutine}
          onChange={(e) => { setSelectedRoutine(e.target.value); setExerciseLogs({}); setCompleted(false); }}
          className="input-field !w-auto text-sm font-semibold"
        >
          {Object.keys(WORKOUT_ROUTINES).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Session Summary Card */}
      <div className="card !p-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{routine.name}</p>
              <p className="text-sm text-gray-400">{routine.exercises.length} exercises · {routine.note}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTimer(true)}
              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center transition-all"
              title="Rest Timer"
            >
              <Timer className="w-5 h-5" />
            </button>
            <span className="pill pill-coral text-sm">{progress}%</span>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #fb923c, #f97316)' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2.5 font-medium">{doneSets} of {totalSets} sets completed</p>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {routine.exercises.map((ex, exIdx) => {
          const numSets = parseInt(ex.sets) || 3;
          const isOpen = expandedExercise === ex.id;
          let exDone = 0;
          for (let i = 0; i < numSets; i++) { if (getSetLog(ex.id, i).done) exDone++; }
          const allDone = exDone === numSets;

          return (
            <div key={ex.id} className={`card !p-0 overflow-hidden transition-all ${allDone ? '!border-emerald-200 !bg-emerald-50/30' : ''}`}>
              {/* Exercise Header */}
              <button
                onClick={() => setExpandedExercise(isOpen ? '' : ex.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${allDone ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {allDone ? <CheckCircle2 className="w-5 h-5" /> : exIdx + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${allDone ? 'text-emerald-700' : 'text-gray-900'}`}>{ex.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ex.sets} sets × {ex.reps} · Rest {ex.rest}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  {exDone > 0 && !allDone && <span className="pill pill-coral text-[11px]">{exDone}/{numSets}</span>}
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">RPE {ex.targetRpe}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {/* Expanded Set Rows */}
              {isOpen && (
                <div className="border-t border-gray-100 px-4 sm:px-5 pb-5">
                  {ex.notes && (
                    <div className="py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-500 italic leading-relaxed">💡 {ex.notes}</p>
                    </div>
                  )}

                  {/* Column Headers */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Weight (kg)</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-2 text-center">✓</div>
                  </div>

                  {Array.from({ length: numSets }).map((_, si) => {
                    const log = getSetLog(ex.id, si);
                    return (
                      <div key={si} className={`grid grid-cols-12 gap-2 items-center py-2.5 border-t border-gray-50 transition-colors ${log.done ? 'bg-emerald-50/40' : ''}`}>
                        <div className="col-span-2">
                          <span className={`text-sm font-bold tabular-nums ${log.done ? 'text-emerald-600' : 'text-gray-500'}`}>{si + 1}</span>
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={log.weight}
                            onChange={(e) => updateSet(ex.id, si, 'weight', e.target.value)}
                            placeholder="—"
                            className="input-field text-sm !py-2 !px-3"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={log.reps}
                            onChange={(e) => updateSet(ex.id, si, 'reps', e.target.value)}
                            placeholder="—"
                            className="input-field text-sm !py-2 !px-3"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleSetDone(ex.id, si)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              log.done
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                                : 'border-2 border-gray-200 text-gray-300 hover:border-emerald-300 hover:text-emerald-400'
                            }`}
                          >
                            {log.done
                              ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              : <Circle className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finish */}
      {!completed ? (
        <button onClick={handleFinish} className="btn-primary w-full !py-3.5 text-base animate-fade-in" style={{ animationDelay: '150ms' }}>
          <Trophy className="w-5 h-5" /><span>Finish Workout</span>
        </button>
      ) : (
        <div className="card !p-8 text-center !bg-emerald-50/80 !border-emerald-200 animate-scale-in">
          <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-xl font-bold text-emerald-800">Workout Complete! 🎉</p>
          <p className="text-sm text-emerald-600 mt-2">{selectedRoutine} logged for {today}</p>
        </div>
      )}

      {showTimer && <RestTimerModal seconds={timerSeconds} onClose={() => setShowTimer(false)} />}
    </div>
  );
}
