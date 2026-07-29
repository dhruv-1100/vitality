import React, { useState } from 'react';
import { Calendar, Dumbbell, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { AUGUST_CALENDAR } from '../utils/transformationData';
import { getCompletedCalendarDays, toggleCalendarDayCompleted } from '../utils/storage';

export default function WorkoutCalendar({ setActiveTab, setSelectedRoutine }) {
  const [weekFilter, setWeekFilter] = useState(0);
  const completedDays = getCompletedCalendarDays();

  const weeks = [0, 1, 2, 3, 4, 5];
  const filtered = weekFilter === 0 ? AUGUST_CALENDAR : AUGUST_CALENDAR.filter(d => d.weekNum === weekFilter);

  const getSessionColor = (session) => {
    if (session.includes('Push')) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
    if (session.includes('Pull')) return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
    if (session.includes('Legs')) return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' };
    return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100' };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Training Schedule</h1>
        <p className="text-sm text-gray-400 mt-0.5">August 2026 — Phase 1: Foundation</p>
      </div>

      {/* Week Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => setWeekFilter(w)}
            className={`tab-pill ${weekFilter === w ? 'active' : ''}`}
          >
            {w === 0 ? 'All Weeks' : `Week ${w}`}
          </button>
        ))}
      </div>

      {/* Calendar List */}
      <div className="card p-0 overflow-hidden">
        {filtered.map((day, idx) => {
          const isDone = completedDays.includes(day.date);
          const isRest = day.session === 'Rest';
          const colors = getSessionColor(day.session);

          return (
            <div key={day.date} className={`flex items-center gap-4 p-4 ${idx > 0 ? 'border-t border-gray-50' : ''} ${isDone ? 'bg-green-50/40' : ''}`}>
              {/* Check */}
              <button
                onClick={() => toggleCalendarDayCompleted(day.date)}
                className="shrink-0"
              >
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-200" />
                )}
              </button>

              {/* Date */}
              <div className="w-12 text-center shrink-0">
                <p className="text-xs font-medium text-gray-400">{day.dayName}</p>
                <p className="text-lg font-bold text-gray-800">{day.date.split('-')[2]}</p>
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {day.session}
                  </span>
                  <span className="text-xs text-gray-400">Week {day.weekNum}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{day.notes}</p>
              </div>

              {/* RPE + Launch */}
              <div className="flex items-center gap-2 shrink-0">
                {day.rpe !== '-' && (
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{day.rpe}</span>
                )}
                {!isRest && (
                  <button
                    onClick={() => { setSelectedRoutine(day.session); setActiveTab('workout'); }}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-50 hover:text-orange-500 text-gray-400 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
