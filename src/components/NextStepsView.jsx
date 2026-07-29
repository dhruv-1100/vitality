import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, Calendar, Dumbbell, Utensils, Scale, Watch, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function NextStepsView({ setActiveTab, setSelectedRoutine }) {
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const todayActionItems = [
    { id: 't1', title: 'Rest & Hydrate Today (Wed 29 July)', desc: 'Hydrate well, aim for 3.5L water, and get 7.5+ hours of sleep tonight.', tag: 'Today' },
    { id: 't2', title: 'Review Grocery Checklist', desc: 'Ensure you have rice, soy chunks, tofu, paneer, whey, and bananas stocked for the week.', tag: 'Nutrition' },
    { id: 't3', title: 'Log Today\'s Apple Watch Stats', desc: 'Click "Update" on the Apple Watch bar on the Dashboard to record active calories, resting HR, and sleep.', tag: 'Biometrics' },
  ];

  const tomorrowWorkoutItems = [
    { id: 'w1', title: 'Gym Time Window: 8:10 AM – 9:40 AM', desc: 'Pre-workout fuel: 1 banana + black coffee at 7:30 AM.' },
    { id: 'w2', title: 'Push A (Chest, Shoulders, Triceps)', desc: 'Re-acclimation session. RPE 6–7. Leave 3–4 reps in reserve on all sets.' },
    { id: 'w3', title: 'Use the Workout Logger', desc: 'Open the "Workout" tab, select Push A, enter weight & reps for each set, and tap the checkmark.' },
  ];

  const dailyHabits = [
    { time: '7:30 AM', title: 'Pre-Workout Fuel', detail: '1 large banana + black coffee + 500ml water.' },
    { time: '8:10 AM', title: 'Gym Training', detail: 'Execute workout session. Drink 1L water during workout.' },
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
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="pill pill-green text-xs font-bold">Step-by-Step Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">What To Do Next</h1>
        <p className="text-sm text-gray-500 mt-1">Your exact daily playbook for a seamless transformation</p>
      </div>

      {/* Hero Card: Today's Action */}
      <div className="card !p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white border-none shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-emerald-100">Step 1 — Today (Wed 29 July)</p>
            <h2 className="text-xl font-extrabold text-white">Rest & Reacclimate</h2>
          </div>
        </div>
        <p className="text-sm text-emerald-50/90 leading-relaxed mb-4">
          Today is officially set as a Rest Day. Focus on proper hydration (3.5L), getting solid sleep tonight, and reviewing your grocery supplies for tomorrow.
        </p>

        <div className="space-y-2">
          {todayActionItems.map(item => {
            const done = !!completedSteps[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleStep(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  done ? 'bg-white/20 text-white/70 line-through' : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  done ? 'bg-white text-emerald-600 border-white' : 'border-white/60'
                }`}>
                  {done && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-emerald-100/80 truncate">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Tomorrow's Workout */}
      <div className="card !p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Step 2 — Tomorrow (Thu 30 July)</p>
              <h3 className="text-base font-bold text-gray-900">First Gym Workout: Push A</h3>
            </div>
          </div>
          <button
            onClick={() => { setSelectedRoutine('Push A'); setActiveTab('workout'); }}
            className="btn-coral text-xs !py-2 !px-3"
          >
            Go to Workout <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {tomorrowWorkoutItems.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Daily Habit Blueprint */}
      <div className="card !p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Step 3 — Daily Routine</p>
            <h3 className="text-base font-bold text-gray-900">Your Perfect Daily Schedule</h3>
          </div>
        </div>

        <div className="space-y-2">
          {dailyHabits.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">{h.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{h.title}</p>
                <p className="text-xs text-gray-500 truncate">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4: Weekly Protocol */}
      <div className="card !p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Scale className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Step 4 — Weekly Protocol</p>
            <h3 className="text-base font-bold text-gray-900">Weekly Weigh-In & Batch Prep</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weeklySchedule.map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="pill pill-purple text-[10px]">{s.day}</span>
              <p className="text-sm font-bold text-gray-900 pt-1">{s.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Rules */}
      <div className="card !p-6 bg-emerald-50/50 border-emerald-100">
        <p className="text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          The 3 Non-Negotiable Rules
        </p>
        <ul className="space-y-2 text-xs text-emerald-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1. Hit 150g Protein Daily:</span> Whey shake after workout, soy/tofu/paneer at lunch and dinner.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2. Log Weekly (Not Daily) Weight:</span> Sunday mornings only, after bathroom, before eating.
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3. Re-acclimation First:</span> Keep Week 1 RPE at 6–7. Protect joints and tendons before pushing max loads in Phase 2.
          </li>
        </ul>
      </div>
    </div>
  );
}
