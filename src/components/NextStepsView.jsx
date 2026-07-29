import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, Dumbbell, Utensils, Scale, Watch, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function NextStepsView({ setActiveTab, setSelectedRoutine }) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const todayActionItems = [
    { id: 't1', title: 'Rest & Hydrate Today (Wed 29 July)', desc: 'Aim for 3.5L water and get 7.5+ hours of sleep tonight.' },
    { id: 't2', title: 'Review Grocery Checklist', desc: 'Ensure rice, soy chunks, tofu, paneer, whey, and bananas are stocked.' },
    { id: 't3', title: 'Log Today\'s Apple Watch Stats', desc: 'Click "Edit" on the Apple Watch bar on Dashboard to log active calories, resting HR, and sleep.' },
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">What To Do Next</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Your exact daily playbook for a seamless transformation</p>
      </div>

      {/* Hero Card: Today's Action */}
      <div className="card card-hero-green !p-7">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-100">Today (Wed 29 July)</p>
              <h2 className="text-2xl font-extrabold text-white font-display">Setup & Kitchen Prep Day</h2>
            </div>
          </div>
          <span className="pill bg-white/20 text-white border border-white/30 text-xs font-bold">Setup Only</span>
        </div>

        <p className="text-sm text-emerald-50 leading-relaxed mb-5 font-medium">
          Today is your zero-stress setup day. Prep your kitchen, check groceries, hydrate (3.5L), get a great night's sleep (7.5h+), and prepare for Day 1 logging starting tomorrow (Thu 30 July)!
        </p>

        <div className="space-y-2.5">
          {todayActionItems.map(item => {
            const done = !!completedSteps[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleStep(item.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  done
                    ? 'bg-black/20 border-white/10 text-emerald-100/60 line-through'
                    : 'bg-white/15 border-white/25 hover:bg-white/20 text-white shadow-sm'
                }`}
              >
                <div className={`check-circle ${done ? 'checked' : ''}`} style={done ? { background: '#ffffff', borderColor: '#ffffff' } : { borderColor: 'rgba(255,255,255,0.6)' }}>
                  {done && <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-emerald-100/90 truncate">{item.desc}</p>
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
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 2 — Tomorrow (Thu 30 July)</p>
              <h3 className="text-xl font-bold text-slate-900 font-display">First Gym Workout: Push A</h3>
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
            <div key={item.id} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-orange-500/30 transition-all">
              <div className="w-7 h-7 rounded-xl bg-orange-500/15 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/25">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Daily Habit Blueprint */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 3 — Daily Routine</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">Your Daily Blueprint</h3>
          </div>
        </div>

        <div className="space-y-2">
          {dailyHabits.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/50 border border-slate-200/50 hover:border-sky-500/30 hover:bg-white/80 transition-all">
              <span className="text-xs font-bold text-sky-600 w-16 shrink-0 tracking-wide">{h.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{h.title}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4: Weekly Protocol */}
      <div className="card !p-7">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Scale className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 4 — Weekly Routine</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">Weigh-In & Meal Prep</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklySchedule.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 space-y-1.5 hover:border-purple-500/30 transition-all">
              <span className="pill pill-purple text-[10px]">{s.day}</span>
              <p className="text-sm font-bold text-slate-900 pt-1">{s.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Rules */}
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
