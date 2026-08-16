import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Circle, ChevronDown, ChevronUp, Trophy, Timer, Save } from 'lucide-react';
import { WORKOUT_ROUTINES } from '../utils/transformationData';
import { getWorkoutLogs, saveWorkoutLog, saveWorkoutDraft, getLocalDateString, getCompletedCalendarDays, toggleCalendarDayCompleted } from '../utils/storage';
import RestTimerModal, { parseRestToSeconds } from './RestTimerModal';
import confetti from 'canvas-confetti';

export default function WorkoutTracker({ selectedRoutine, setSelectedRoutine }) {
  const routine = WORKOUT_ROUTINES[selectedRoutine];
  const [workoutDate, setWorkoutDate] = useState(getLocalDateString);

  const initialLog = getWorkoutLogs()[workoutDate] || {};
  const [weightUnit, setWeightUnit] = useState(initialLog.unit || 'lbs');
  const [exerciseLogs, setExerciseLogs] = useState(initialLog.exercises || {});
  const [expandedExercise, setExpandedExercise] = useState(routine?.exercises?.[0]?.id || '');
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [completed, setCompleted] = useState(!!initialLog.completed);

  // Skips the persist on the very first render so simply opening the tab does
  // not write an empty draft over an existing log.
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    if (Object.keys(exerciseLogs).length === 0 && !completed) return;
    saveWorkoutDraft(workoutDate, { routineName: selectedRoutine, exercises: exerciseLogs, unit: weightUnit });
  }, [exerciseLogs, weightUnit, workoutDate, selectedRoutine, completed]);

  // Pull whatever is already stored whenever the target date or routine changes.
  const loadLogFor = (date, routineName) => {
    const stored = getWorkoutLogs()[date] || {};
    const matchesRoutine = !stored.routineName || stored.routineName === routineName;
    setExerciseLogs(matchesRoutine ? (stored.exercises || {}) : {});
    setCompleted(matchesRoutine ? !!stored.completed : false);
    if (stored.unit) setWeightUnit(stored.unit);
  };

  if (!routine) return (
    <div className="card !p-12 text-center">
      <Dumbbell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 font-medium font-display">Routine "{selectedRoutine}" not found.</p>
    </div>
  );

  const getSetLog = (exId, setIdx) => exerciseLogs[exId]?.[setIdx] || { weight: '', reps: '', done: false, unit: weightUnit };

  const updateSet = (exId, setIdx, field, value) => {
    setExerciseLogs(prev => ({
      ...prev,
      [exId]: {
        ...prev[exId],
        [setIdx]: {
          ...(prev[exId]?.[setIdx] || { weight: '', reps: '', done: false }),
          unit: weightUnit,
          [field]: value
        }
      }
    }));
  };

  const toggleSetDone = (exId, setIdx) => {
    const cur = getSetLog(exId, setIdx);
    updateSet(exId, setIdx, 'done', !cur.done);
    if (!cur.done) {
      setTimerSeconds(parseRestToSeconds(routine.exercises.find(e => e.id === exId)?.rest));
      setShowTimer(true);
    }
  };

  const handleFinish = () => {
    saveWorkoutLog(workoutDate, { date: workoutDate, routineName: selectedRoutine, completed: true, exercises: exerciseLogs, unit: weightUnit });
    const completedDays = getCompletedCalendarDays();
    if (!completedDays.includes(workoutDate)) {
      toggleCalendarDayCompleted(workoutDate);
    }
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Workout Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-emerald-600" />
            Every set saves as you type — leave and come back anytime
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Weight Unit Toggle */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setWeightUnit('lbs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                weightUnit === 'lbs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              lbs (Default)
            </button>
            <button
              onClick={() => setWeightUnit('kg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                weightUnit === 'kg' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              kg
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => {
              setWorkoutDate(e.target.value);
              loadLogFor(e.target.value, selectedRoutine);
            }}
            className="input-field !w-auto text-xs font-bold"
          />

          {/* Routine Selector */}
          <select
            value={selectedRoutine}
            onChange={(e) => {
              setSelectedRoutine(e.target.value);
              loadLogFor(workoutDate, e.target.value);
            }}
            className="input-field !w-auto text-xs font-bold"
          >
            {Object.keys(WORKOUT_ROUTINES).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Session Summary Card */}
      <div className="card !p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 font-display">{routine.name}</p>
              <p className="text-xs text-slate-400 font-medium">{routine.exercises.length} exercises &middot; {routine.note}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTimer(true)}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center transition-all cursor-pointer"
              title="Rest Timer"
            >
              <Timer className="w-5 h-5" />
            </button>
            <span className="pill pill-coral text-xs font-bold">{progress}% Done</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/5 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {routine.exercises.map((ex) => {
          const isOpen = expandedExercise === ex.id;
          const numSets = parseInt(ex.sets) || 3;
          let exDoneSets = 0;
          for (let i = 0; i < numSets; i++) { if (getSetLog(ex.id, i).done) exDoneSets++; }

          return (
            <div key={ex.id} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setExpandedExercise(isOpen ? '' : ex.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-900 font-display">{ex.name}</p>
                    {exDoneSets === numSets && (
                      <span className="pill pill-green text-[10px] !py-0.5 !px-2">All Sets Done</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ex.sets} sets &middot; {ex.reps} reps &middot; Rest {ex.rest} &middot; RPE {ex.targetRpe}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 tabular-nums">{exDoneSets}/{numSets} sets</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Expanded Set Rows */}
              {isOpen && (
                <div className="border-t border-slate-200/60 px-4 sm:px-5 pb-5 bg-slate-50/50">
                  {ex.notes && (
                    <div className="py-3 border-b border-slate-200/50">
                      <p className="text-xs text-slate-500 italic leading-relaxed">💡 {ex.notes}</p>
                    </div>
                  )}

                  {/* Column Headers */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Weight ({weightUnit})</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-2 text-center">Done</div>
                  </div>

                  {Array.from({ length: numSets }).map((_, si) => {
                    const log = getSetLog(ex.id, si);
                    return (
                      <div key={si} className={`grid grid-cols-12 gap-2 items-center py-2 border-t border-slate-200/40 transition-colors ${log.done ? 'bg-emerald-500/10' : ''}`}>
                        <div className="col-span-2">
                          <span className={`text-sm font-bold tabular-nums ${log.done ? 'text-emerald-700' : 'text-slate-500'}`}>{si + 1}</span>
                        </div>
                        <div className="col-span-4">
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              value={log.weight}
                              onChange={(e) => updateSet(ex.id, si, 'weight', e.target.value)}
                              placeholder={weightUnit}
                              className="input-field text-sm !py-2 !px-3 font-bold"
                            />
                            <span className="absolute right-2 text-[10px] font-bold text-slate-400 pointer-events-none">{weightUnit}</span>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={log.reps}
                            onChange={(e) => updateSet(ex.id, si, 'reps', e.target.value)}
                            placeholder="reps"
                            className="input-field text-sm !py-2 !px-3 font-bold"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleSetDone(ex.id, si)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              log.done
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                                : 'border-2 border-slate-300 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'
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
        <button onClick={handleFinish} className="btn-primary w-full !py-3.5 text-base animate-fade-in">
          <Trophy className="w-5 h-5" /><span>Finish Workout & Log Calendar</span>
        </button>
      ) : (
        <div className="card !p-8 text-center bg-emerald-50/80 border-emerald-200 animate-scale-in">
          <Trophy className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <p className="text-xl font-bold text-emerald-900 font-display">Workout Complete! 🎉</p>
          <p className="text-sm text-emerald-700 mt-2">{selectedRoutine} logged for {workoutDate}</p>
        </div>
      )}

      {showTimer && <RestTimerModal seconds={timerSeconds} onClose={() => setShowTimer(false)} />}
    </div>
  );
}
