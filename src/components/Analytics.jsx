import React, { useState } from 'react';
import { TrendingUp, Target, AlertCircle, Scale, Ruler, Flame, Heart, Activity, Footprints, Moon, Dumbbell, Zap, Award, CheckCircle2, BarChart2 } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { getWeeklyWeightLogs, getWorkoutLogs, getCompletedCalendarDays, getAppleWatchLogs } from '../utils/storage';
import { WEIGHT_CHECKPOINTS, PHASES, AUGUST_CALENDAR } from '../utils/transformationData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

export default function Analytics() {
  const logs = getWeeklyWeightLogs();
  const workoutLogs = getWorkoutLogs();
  const completedCalendar = getCompletedCalendarDays();
  const watchLogs = getAppleWatchLogs();

  const labels = logs.map(l => `Wk ${l.weekNum}`);
  const weights = logs.map(l => l.weightKg);
  const waists = logs.map(l => l.waistInches);

  // Velocity calculations
  const deltas = weights.map((w, i) => i === 0 ? 0 : +(w - weights[i - 1]).toFixed(2));
  const avgGain = weights.length > 1 ? +((weights[weights.length - 1] - weights[0]) / (weights.length - 1)).toFixed(2) : 0;
  const latestWeight = weights.length > 0 ? weights[weights.length - 1] : 59.3;
  const latestWaist = waists.length > 0 ? waists[waists.length - 1] : 29.1;

  // Waist-to-height ratio (Height = 175 cm = 68.9 inches)
  const whtr = +(latestWaist / 68.9).toFixed(2);

  // Gym Completion Rate (Unique workout dates excluding Rest days)
  const completedWorkoutDates = new Set([
    ...Object.keys(workoutLogs).filter(k => workoutLogs[k]?.completed),
    ...completedCalendar.filter(d => {
      const calItem = AUGUST_CALENDAR.find(c => c.date === d);
      return calItem ? calItem.session !== 'Rest' : false;
    })
  ]);
  const totalCompletedSessions = completedWorkoutDates.size;
  const adherenceRate = Math.min(100, Math.round((totalCompletedSessions / 5) * 100)); // Target ~5 sessions/week

  const gainStatus = avgGain >= 0.15 && avgGain <= 0.35 ? 'on-track' : avgGain < 0.15 ? 'slow' : 'fast';

  // 1. Weight Chart Data
  const weightChartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  // 2. Waist Chart Data
  const waistChartData = {
    labels,
    datasets: [
      {
        label: 'Waist (inches)',
        data: waists,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#38bdf8',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  // 3. Apple Watch Telemetry Bar Chart
  const watchDates = Object.keys(watchLogs).slice(-7);
  const watchBarData = {
    labels: watchDates.length > 0 ? watchDates.map(d => d.split('-').slice(1).join('/')) : ['Thu 7/30'],
    datasets: [
      {
        label: 'Active Cals (kcal)',
        data: watchDates.length > 0 ? watchDates.map(d => watchLogs[d]?.activeCalories || watchLogs[d]?.dailyActiveCalories || 720) : [720],
        backgroundColor: '#22c55e',
        borderRadius: 8,
      },
      {
        label: 'Workout Burn (kcal)',
        data: watchDates.length > 0 ? watchDates.map(d => watchLogs[d]?.workoutCalories || 450) : [450],
        backgroundColor: '#f97316',
        borderRadius: 8,
      }
    ]
  };

  // 4. Macro Ratio Doughnut Chart
  const macroDoughnutData = {
    labels: ['Protein (150g)', 'Carbs (350g)', 'Fats (85g)'],
    datasets: [
      {
        data: [600, 1400, 765], // 600 kcal from P, 1400 from C, 765 from F = ~2765 kcal
        backgroundColor: ['#fb923c', '#38bdf8', '#34d399'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = (unit) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11, weight: '600' }, color: '#64748b' } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter', size: 11, weight: '600' }, color: '#64748b' } },
    },
  });

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Analytics & Insights</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Biometric trends, gain velocity, and training volume</p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card !p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Weight</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">{latestWeight}</span>
            <span className="text-sm font-bold text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">Goal: 66.0 kg by Dec</p>
        </div>

        <div className="card !p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waist Line</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">{latestWaist}"</span>
            <span className="text-xs text-sky-600 font-bold">({whtr} WHtR)</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Optimal lean bulk ratio: &lt; 0.46</p>
        </div>

        <div className="card !p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">{totalCompletedSessions}</span>
            <span className="text-sm font-bold text-slate-400">workouts</span>
          </div>
          <p className="text-[11px] text-orange-600 font-bold mt-1">{adherenceRate}% Weekly Goal</p>
        </div>

        <div className="card !p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gain Rate</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">+{avgGain}</span>
            <span className="text-sm font-bold text-slate-400">kg/wk</span>
          </div>
          <p className="text-[11px] text-purple-600 font-bold mt-1">Target: +0.25 kg/wk</p>
        </div>
      </div>

      {/* Gain Velocity Status Banner */}
      <div className={`card !p-5 border-l-4 ${
        gainStatus === 'on-track' ? 'border-l-emerald-500 bg-emerald-500/10' :
        gainStatus === 'slow' ? 'border-l-amber-500 bg-amber-500/10' :
        'border-l-rose-500 bg-rose-500/10'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            gainStatus === 'on-track' ? 'bg-emerald-500/20 text-emerald-600' :
            gainStatus === 'slow' ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
          }`}>
            {gainStatus === 'on-track' ? <Target className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 font-display">
              {gainStatus === 'on-track' ? 'Lean Bulk Velocity: Optimal (+0.25 kg/wk)' :
               gainStatus === 'slow' ? 'Velocity: Slight Slow Gain (Consider +150 kcal)' :
               'Velocity: High Surplus (Monitor waist measurement)'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Average rate: <span className="font-bold text-slate-900">+{avgGain} kg/week</span> &middot; Target range: <span className="font-bold text-emerald-600">+0.20 to +0.35 kg/week</span> for clean muscle growth.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weight Progress Chart */}
        <div className="card !p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">Weight Curve (kg)</p>
                <p className="text-xs text-slate-400">Baseline 59.0 kg &rarr; Goal 66.0 kg</p>
              </div>
            </div>
            <span className="pill pill-green text-xs font-bold">{latestWeight} kg</span>
          </div>
          <div className="h-64">
            <Line data={weightChartData} options={chartOptions('kg')} />
          </div>
        </div>

        {/* Waist Measurement Chart */}
        <div className="card !p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">Waist Tightness (inches)</p>
                <p className="text-xs text-slate-400">Maintains waist stability during surplus</p>
              </div>
            </div>
            <span className="pill pill-blue text-xs font-bold">{latestWaist}"</span>
          </div>
          <div className="h-64">
            <Line data={waistChartData} options={chartOptions('in')} />
          </div>
        </div>
      </div>

      {/* Apple Watch Telemetry & Macro Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Apple Watch Telemetry Bar Chart */}
        <div className="card !p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">Apple Watch Active & Workout Burn</p>
                <p className="text-xs text-slate-400">Daily Active Calories vs Workout Active Burn</p>
              </div>
            </div>
          </div>
          <div className="h-60">
            <Bar
              data={watchBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'top', labels: { font: { family: 'Inter', size: 11, weight: '600' } } } },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: 'rgba(0,0,0,0.04)' } }
                }
              }}
            />
          </div>
        </div>

        {/* Macro Energy Breakdown */}
        <div className="card !p-6 flex flex-col justify-between">
          <div>
            <p className="text-base font-bold text-slate-900 mb-1 font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Macro Calorie Ratio
            </p>
            <p className="text-xs text-slate-400 mb-4">2,800 kcal &middot; 150g protein goal</p>
            <div className="h-44 flex items-center justify-center">
              <Doughnut
                data={macroDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> Protein</span>
              <span>150g (600 kcal) &middot; 22%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Carbs</span>
              <span>350g (1400 kcal) &middot; 50%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Healthy Fats</span>
              <span>85g (765 kcal) &middot; 28%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Checkpoints */}
      <div className="card !p-6">
        <p className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Lean Bulk Weight Checkpoints
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEIGHT_CHECKPOINTS.map((cp, i) => {
            const hit = latestWeight >= cp.targetKg;
            return (
              <div key={i} className={`p-4 rounded-2xl border transition-all ${hit ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/60 border-slate-200/60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${hit ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {hit ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-extrabold ${hit ? 'text-emerald-600' : 'text-slate-900'}`}>{cp.targetKg} kg</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{cp.week} &middot; {cp.month}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{cp.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
