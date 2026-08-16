import React, { useState } from 'react';
import { ArrowRight, Dumbbell, Utensils, Scale, Watch, ShieldCheck, Zap, Calendar } from 'lucide-react';
import { AUGUST_CALENDAR } from '../utils/transformationData';
import { getLocalDateString, parseLocalDate, getDayName, isSunday as isSundayDate } from '../utils/storage';

export default function NextStepsView({ setActiveTab, setSelectedRoutine }) {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString);
  const [completedSteps, setCompletedSteps] = useState({});

  // Dates outside the scripted August block still get a coherent plan derived
  // from the real weekday rather than a fixed Thursday placeholder.
  const dayName = getDayName(selectedDate);
  const dayCalendar = AUGUST_CALENDAR.find(c => c.date === selectedDate) || {
    date: selectedDate,
    dayName,
    session: isSundayDate(selectedDate) ? 'Rest' : 'Push A',
    weekNum: 1,
    rpe: 'RPE 6-7',
    notes: 'Outside the scripted August block — execute the session with high technical quality.'
  };

  const isRest = dayCalendar.session === 'Rest';
  const isSunday = isSundayDate(selectedDate);
  const dateLabel = parseLocalDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isToday = selectedDate === getLocalDateString();

  const toggleStep = (id) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate dynamic date-specific action items
  const dynamicActionItems = [
    {
      id: `${selectedDate}-act1`,
      category: 'Workout',
      icon: Dumbbell,
      title: isRest ? `Rest & Active Recovery` : `Execute ${dayCalendar.session} Workout`,
      desc: isRest
        ? `No heavy lifting today. Focus on light walking, hydration (3.5L), and 7.5h+ sleep.`
        : `Gym window: 8:10 AM – 9:40 AM. Target RPE: ${dayCalendar.rpe}. Note: ${dayCalendar.notes}`,
      actionText: isRest ? null : `Start ${dayCalendar.session}`,
      // "Rest" is not a routine — offering Start would land on a "not found" screen.
      actionRoutine: isRest ? null : dayCalendar.session
    },
    {
      id: `${selectedDate}-act2`,
      category: 'Nutrition',
      icon: Utensils,
      title: `Hit 150g Protein & 2,800 kcal`,
      desc: `Log meals for ${dayCalendar.dayName}. Post-workout whey shake (10:20 AM), high-protein lunch (1:00 PM), and dinner (8:20 PM).`
    },
    {
      id: `${selectedDate}-act3`,
      category: 'Apple Watch',
      icon: Watch,
      title: `Log Apple Watch Telemetry`,
      desc: `Track active calories, workout calories, resting HR (${dayCalendar.date}), steps, and sleep.`
    },
    {
      id: `${selectedDate}-act4`,
      category: 'Supplements',
      icon: Zap,
      title: isSunday ? `Daily Creatine 5g + 1 B12 Gummy + Weekly D3 (60k IU)` : `Daily Creatine 5g + 1 B12 Gummy`,
      desc: isSunday
        ? `Take 5g Creatine Monohydrate + 1 B12 Gummy + 1 Vitamin D3 60,000 IU tablet (with breakfast fat).`
        : `Take 5g Creatine Monohydrate + 1 B12 Gummy daily with breakfast/meal. (D3 60k IU tablet on Sunday only).`
    }
  ];

  if (isSunday) {
    dynamicActionItems.unshift({
      id: `${selectedDate}-act-sun`,
      category: 'Weigh-In & Meal Prep',
      icon: Scale,
      title: `Fasted Weigh-In & Sunday Batch Cook`,
      desc: `Weigh yourself Sunday morning immediately after bathroom before eating. Batch cook rice, soy curry, and dal for next week.`
    });
  }

  const dailyHabits = [
    { time: '7:30 AM', title: 'Pre-Workout Fuel', detail: '1 banana + black coffee + 500ml water (7:30 AM).' },
    { time: '8:10 AM', title: isRest ? 'Active Recovery Walk' : `Gym Training Window (${dayCalendar.session})`, detail: isRest ? '20-min light walk & stretching.' : 'Execute planned workout. Drink 1L water during session.' },
    { time: '10:20 AM', title: 'Post-Workout Fuel', detail: 'Whey Shake (32g protein) + Poha / Besan Chilla.' },
    { time: '1:00 PM', title: 'High-Protein Lunch', detail: 'Reheated Rice + Soy Chunk Curry / Tofu / Dal (40g protein).' },
    { time: '5:00 PM', title: 'Afternoon Fuel', detail: 'Whey shake or Hummus + Whole Wheat Pita (20g protein).' },
    { time: '8:20 PM', title: 'Dinner', detail: 'Reheated Rice / Pasta + Paneer / Tofu Stir-Fry (35g protein).' },
    { time: '11:15 PM', title: 'Bedtime & Telemetry', detail: 'Warm milk + almonds. Check off remaining meals & Apple Watch stats.' }
  ];

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Header with Dynamic Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="pill pill-green text-xs font-bold uppercase tracking-wider">Dynamic Daily Playbook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">What To Do Next</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Exact step-by-step action plan tailored for {dateLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Select Date:</span>
          </label>
          {!isToday && (
            <button onClick={() => setSelectedDate(getLocalDateString())} className="btn-secondary !py-2 !px-3 !text-xs">
              Today
            </button>
          )}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field !w-auto text-xs font-bold"
          />
        </div>
      </div>

      {/* Hero Card: Dynamic Action Plan for Selected Date */}
      <div className="card card-hero-green !p-7">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-100">{dateLabel}</p>
              <h2 className="text-2xl font-extrabold text-white font-display">
                {isRest ? 'Rest & Recovery Day' : `${dayCalendar.session} Training Day`}
              </h2>
            </div>
          </div>
          <span className="pill bg-white/20 text-white border border-white/30 text-xs font-bold">
            Week {dayCalendar.weekNum} &middot; {dayCalendar.dayName}
          </span>
        </div>

        <p className="text-sm text-emerald-50 leading-relaxed mb-6 font-medium">
          {isRest
            ? `Recovery priority. Hydrate with 3.5L water, get 7.5h+ sleep, and prep your meals.`
            : `Target Workout: ${dayCalendar.session}. RPE: ${dayCalendar.rpe}. Focus on high technical precision and leaving 2-3 reps in reserve.`}
        </p>

        {/* Action Checkpoints */}
        <div className="space-y-3">
          {dynamicActionItems.map((item) => {
            const done = !!completedSteps[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl transition-all border ${
                  done
                    ? 'bg-slate-900/20 border-white/10 text-emerald-100/60'
                    : 'bg-white/15 border-white/25 hover:bg-white/20 text-white shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => toggleStep(item.id)}>
                    <div className={`check-circle ${done ? 'checked' : ''}`} style={done ? { background: '#ffffff', borderColor: '#ffffff' } : { borderColor: 'rgba(255,255,255,0.6)' }}>
                      {done && <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-emerald-100">{item.category}</span>
                        <p className={`text-sm font-bold ${done ? 'line-through text-emerald-200/70' : 'text-white'}`}>{item.title}</p>
                      </div>
                      <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {item.actionRoutine && !done && (
                    <button
                      onClick={() => { setSelectedRoutine(item.actionRoutine); setActiveTab('workout'); }}
                      className="px-3.5 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-all shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <span>Start</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Schedule Step */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scheduled Workout for {selectedDate}</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {isRest ? 'Rest & Recovery Day' : dayCalendar.session}
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            {dayCalendar.rpe && dayCalendar.rpe !== '-' ? (
              <span className="pill pill-coral text-xs font-bold">{dayCalendar.rpe}</span>
            ) : (
              <span className="pill pill-gray text-xs font-bold">Recovery</span>
            )}
            <span className="text-xs font-bold text-slate-400">Week {dayCalendar.weekNum}</span>
          </div>
          <p className="text-sm font-bold text-slate-800 pt-1">{dayCalendar.notes}</p>
          {!isRest && (
            <button
              onClick={() => { setSelectedRoutine(dayCalendar.session); setActiveTab('workout'); }}
              className="btn-coral text-xs !py-2.5 !px-4 mt-3"
            >
              <span>Go to {dayCalendar.session} Routine</span> <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Daily Blueprint */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Daily Blueprint for {dayCalendar.dayName}</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">Hour-by-Hour Execution</h3>
          </div>
        </div>

        <div className="space-y-2">
          {dailyHabits.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-500/30 hover:bg-white transition-all">
              <span className="text-xs font-bold text-sky-600 w-16 shrink-0 tracking-wide">{h.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{h.title}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Negotiable Rules */}
      <div className="card !p-7 bg-emerald-500/10 border-emerald-500/30">
        <p className="text-base font-bold text-emerald-950 mb-3 flex items-center gap-2 font-display">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          The 3 Non-Negotiable Rules
        </p>
        <ul className="space-y-2.5 text-xs text-emerald-900">
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">1. Hit 150g Protein Daily:</span> Whey shake after workout, soy/tofu/paneer at lunch and dinner.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">2. Log Weekly (Not Daily) Weight:</span> Sunday mornings only, after bathroom, before eating.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">3. Re-acclimation First:</span> Keep Week 1 RPE at 6–7. Protect joints and tendons before pushing max loads in Phase 2.
          </li>
        </ul>
      </div>
    </div>
  );
}
