import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, Dumbbell, Utensils, Scale, Watch, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function NextStepsView({ setActiveTab, setSelectedRoutine }) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const todayActionItems = [
    { id: 't1', title: 'Rest & Hydrate Today (Wed 29 July)', desc: 'Aim for 3.5L water and get 7.5+ hours of sleep tonight.', tag: 'Today' },
    { id: 't2', title: 'Review Grocery Checklist', desc: 'Ensure rice, soy chunks, tofu, paneer, whey, and bananas are stocked.', tag: 'Nutrition' },
    { id: 't3', title: 'Log Today\'s Apple Watch Stats', desc: 'Click "Edit" on the Apple Watch bar on Dashboard to log active calories, resting HR, and sleep.', tag: 'Biometrics' },
  ];

  const tomorrowWorkoutItems = [
    { id: 'w1', title: 'Gym Time Window: 8:10 AM – 9:40 AM', desc: 'Pre-workout fuel: 1 banana + black coffee at 7:30 AM.' },
    { id: 'w2', title: 'Push A (Chest, Shoulders, Triceps)', desc: 'Re-acclimation session. RPE 6–7. Leave 3–4 reps in reserve on all sets.' },
    { id: 'w3', title: 'Log Your Sets Live', desc: 'Open Workout tab, select Push A, enter weight & reps for each set, and tap checkmark.' },
  ];

  const dailyHabits = [
    { time: '7:30 AM', title: 'Pre-Workout Fuel', detail: '1 large banana + black coffee + 500ml water.' },
    { time: '8:10 AM', title: 'Gym Training Window', detail: 'Execute workout session. Drink 1L water during workout.' },
    { time: '10:20 AM', title: 'Post-Workout Breakfast', detail: 'Whey Shake (32g protein) + Poha or Besan Chilla.' },
    { time: '1:00 PM', title: 'High-Protein Lunch', detail: 'Reheated Rice + Soy Chunk Curry / Tofu / Dal (40g protein).' },
    { time: '5:00 PM', title: 'Afternoon Snack', detail: 'Whey shake or Hummus + Pita (20g protein).' },
    { time: '8:20 PM', title: 'Dinner', detail: 'Reheated Rice + Paneer / Tofu Stir-Fry (35g protein).' },
    { time: '11:15 PM', title: 'Bedtime Routine', detail: 'Warm milk + almonds/walnuts. Log remaining meals & supplements.' }
  ];

  const weeklySchedule = [
    { day: 'Sunday Morning', title: 'Fasted Weigh-In', detail: 'Weigh yourself immediately after bathroom, before eating or drinking water. Log in Dashboard.' },
    { day: 'Sunday 6:00 PM', title: 'Batch Prep Session 1', detail: 'Cook Instant Pot Rice (5 servings), Soy Curry, and Moong Dal for Mon–Wed.' },
    { day: 'Thursday 6:00 PM', title: 'Batch Prep Session 2', detail: 'Cook Pasta, Paneer Bhurji, or Rajma for Thu–Sun.' }
  ];

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="pill pill-green text-xs font-bold uppercase tracking-wider">Step-by-Step Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">What To Do Next</h1>
        <p className="text-sm text-slate-400 mt-1">Your exact daily playbook for a seamless transformation</p>
      </div>

      {/* Hero Card: Today's Action */}
      <div className="card card-hero-emerald !p-7">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-300">Step 1 — Today (Wed 29 July)</p>
              <h2 className="text-2xl font-extrabold text-white font-display">Rest & Reacclimate</h2>
            </div>
          </div>
          <span className="pill pill-green text-xs">Today's Priority</span>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed mb-5 font-medium">
          Today is officially set as a Rest Day. Focus on proper hydration (3.5L), getting solid sleep tonight, and reviewing your grocery supplies for tomorrow.
        </p>

        <div className="space-y-2.5">
          {todayActionItems.map(item => {
            const done = !!completedSteps[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleStep(item.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                  done
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-400 line-through'
                    : 'bg-slate-900/60 border-slate-700/50 hover:border-emerald-400/50 text-white'
                }`}
              >
                <div className={`check-circle ${done ? 'checked' : ''}`}>
                  {done && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-300/90 truncate">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Tomorrow's Workout */}
      <div className="card !p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 2 — Tomorrow (Thu 30 July)</p>
              <h3 className="text-xl font-bold text-white font-display">First Gym Workout: Push A</h3>
            </div>
          </div>
          <button
            onClick={() => { setSelectedRoutine('Push A'); setActiveTab('workout'); }}
            className="btn-coral text-xs !py-2.5 !px-4"
          >
            <span>Go to Workout</span> <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {tomorrowWorkoutItems.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Daily Habit Blueprint */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 3 — Daily Routine</p>
            <h3 className="text-xl font-bold text-white font-display">Your Daily Blueprint</h3>
          </div>
        </div>

        <div className="space-y-2">
          {dailyHabits.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-sky-500/30 hover:bg-slate-900/70 transition-all">
              <span className="text-xs font-bold text-sky-400 w-16 shrink-0 tracking-wide">{h.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200">{h.title}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4: Weekly Protocol */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
            <Scale className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 4 — Weekly Routine</p>
            <h3 className="text-xl font-bold text-white font-display">Weigh-In & Meal Prep</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklySchedule.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 hover:border-purple-500/30 transition-all">
              <span className="pill pill-purple text-[10px]">{s.day}</span>
              <p className="text-sm font-bold text-slate-100 pt-1">{s.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Rules */}
      <div className="card !p-7 bg-emerald-950/40 border-emerald-500/30">
        <p className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2 font-display">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          The 3 Non-Negotiable Rules
        </p>
        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-400">1. Hit 150g Protein Daily:</span> Whey shake after workout, soy/tofu/paneer at lunch and dinner.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-400">2. Log Weekly (Not Daily) Weight:</span> Sunday mornings only, after bathroom, before eating.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-400">3. Re-acclimation First:</span> Keep Week 1 RPE at 6–7. Protect joints and tendons before pushing max loads in Phase 2.
          </li>
        </ul>
      </div>
    </div>
  );
}
