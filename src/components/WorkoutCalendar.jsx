import React, { useState } from 'react';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { AUGUST_CALENDAR } from '../utils/transformationData';
import { getCompletedCalendarDays, toggleCalendarDayCompleted, getLocalDateString } from '../utils/storage';

const SESSION_STYLES = {
  Push: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  Pull: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  Legs: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  Rest: 'bg-slate-100 text-slate-500 border-slate-200',
};

const getSessionStyle = (session) => {
  const key = ['Push', 'Pull', 'Legs'].find(k => session.includes(k)) || 'Rest';
  return SESSION_STYLES[key];
};

export default function WorkoutCalendar({ setActiveTab, setSelectedRoutine }) {
  const [weekFilter, setWeekFilter] = useState(0);
  const [completedDays, setCompletedDays] = useState(getCompletedCalendarDays);

  const today = getLocalDateString();
  const weeks = [0, 1, 2, 3, 4, 5];
  const filtered = weekFilter === 0 ? AUGUST_CALENDAR : AUGUST_CALENDAR.filter(d => d.weekNum === weekFilter);

  const trainingDays = filtered.filter(d => d.session !== 'Rest');
  const doneCount = trainingDays.filter(d => completedDays.includes(d.date)).length;

  const handleToggle = (date) => setCompletedDays(toggleCalendarDayCompleted(date));

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Training Schedule</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">August 2026 — Phase 1: Foundation</p>
        </div>
        <span className="pill pill-green text-xs font-bold">
          {doneCount} / {trainingDays.length} sessions complete
        </span>
      </div>

      {/* Week Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {weeks.map(w => (
          <button key={w} onClick={() => setWeekFilter(w)} className={`tab-pill ${weekFilter === w ? 'active' : ''}`}>
            {w === 0 ? 'All Weeks' : `Week ${w}`}
          </button>
        ))}
      </div>

      {/* Calendar List */}
      <div className="card !p-0 overflow-hidden">
        {filtered.map((day, idx) => {
          const isDone = completedDays.includes(day.date);
          const isRest = day.session === 'Rest';
          const isToday = day.date === today;

          return (
            <div
              key={day.date}
              className={`flex items-center gap-4 p-4 transition-colors ${idx > 0 ? 'border-t border-slate-200' : ''} ${
                isDone ? 'bg-emerald-500/10' : isToday ? 'bg-sky-500/5' : ''
              }`}
            >
              {/* Check */}
              <button
                onClick={() => handleToggle(day.date)}
                className={`check-circle ${isDone ? 'checked' : ''}`}
                title={isDone ? 'Mark as not done' : 'Mark as done'}
              >
                {isDone && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Date */}
              <div className="w-12 text-center shrink-0">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? 'text-sky-600' : 'text-slate-400'}`}>
                  {day.dayName}
                </p>
                <p className="text-lg font-extrabold text-slate-900 tabular-nums leading-tight">{day.date.split('-')[2]}</p>
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getSessionStyle(day.session)}`}>
                    {day.session}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">Week {day.weekNum}</span>
                  {isToday && <span className="pill pill-blue text-[10px] !py-0.5 !px-2">Today</span>}
                </div>
                <p className="text-xs text-slate-500 truncate">{day.notes}</p>
              </div>

              {/* RPE + Launch */}
              <div className="flex items-center gap-2 shrink-0">
                {day.rpe !== '-' && (
                  <span className="hidden sm:inline text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {day.rpe}
                  </span>
                )}
                {!isRest && (
                  <button
                    onClick={() => { setSelectedRoutine(day.session); setActiveTab('workout'); }}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-orange-500/15 hover:text-orange-600 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                    title={`Open ${day.session}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No sessions scheduled for this week.</p>
          </div>
        )}
      </div>
    </div>
  );
}
