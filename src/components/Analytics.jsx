import React, { useState } from 'react';
import { TrendingUp, Target, AlertCircle, Scale, Ruler, Flame, Dumbbell, Zap, Watch } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { getWeeklyWeightLogs, getWorkoutLogs, getCompletedCalendarDays, getAppleWatchLogs, getLocalDateString, parseLocalDate } from '../utils/storage';
import { COLORS } from '../utils/theme';
import { WEIGHT_CHECKPOINTS, AUGUST_CALENDAR } from '../utils/transformationData';

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

  // Adherence compares completed sessions against the sessions actually
  // scheduled up to today — dividing the running total by one week's target
  // let the figure climb past 100% and pin itself there.
  const todayStr = getLocalDateString();
  const scheduledToDate = AUGUST_CALENDAR.filter(c => c.session !== 'Rest' && c.date <= todayStr).length;
  const adherenceRate = scheduledToDate > 0
    ? Math.min(100, Math.round((totalCompletedSessions / scheduledToDate) * 100))
    : 0;

  const gainStatus = avgGain >= 0.15 && avgGain <= 0.35 ? 'on-track' : avgGain < 0.15 ? 'slow' : 'fast';
  const signed = (n) => `${n > 0 ? '+' : ''}${n}`;

  // 1. Weight Chart Data
  const weightChartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        borderColor: COLORS.clay,
        backgroundColor: COLORS.clayWash,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.clay,
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
        borderColor: COLORS.dusk,
        backgroundColor: COLORS.duskWash,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.dusk,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  // 3. Apple Watch Telemetry Bar Chart — sorted chronologically, since object
  // key order is not guaranteed to be the order entries were logged in.
  const watchDates = Object.keys(watchLogs).sort().slice(-7);
  const hasWatchData = watchDates.length > 0;
  const watchBarData = {
    labels: watchDates.map(d => parseLocalDate(d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })),
    datasets: [
      {
        label: 'Active Cals (kcal)',
        // null leaves a gap in the bar chart rather than inventing a number.
        data: watchDates.map(d => watchLogs[d]?.activeCalories ?? watchLogs[d]?.dailyActiveCalories ?? null),
        backgroundColor: COLORS.clay,
        borderRadius: 6,
      },
      {
        label: 'Workout Burn (kcal)',
        data: watchDates.map(d => watchLogs[d]?.workoutCalories ?? null),
        backgroundColor: COLORS.dusk,
        borderRadius: 6,
      }
    ]
  };

  // 4. Macro Ratio Doughnut Chart
  const macroDoughnutData = {
    labels: ['Protein (150g)', 'Carbs (350g)', 'Fats (85g)'],
    datasets: [
      {
        data: [600, 1400, 765], // 600 kcal from P, 1400 from C, 765 from F = ~2765 kcal
        backgroundColor: [COLORS.clay, COLORS.dusk, COLORS.ochre],
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
        backgroundColor: COLORS.ink,
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
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11, weight: '600' }, color: COLORS.stone } },
      y: { grid: { color: COLORS.hairline }, ticks: { font: { family: 'Inter', size: 11, weight: '600' }, color: COLORS.stone } },
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
          <p className="text-[11px] text-orange-600 font-bold mt-1">
            {adherenceRate}% of {scheduledToDate} scheduled to date
          </p>
        </div>

        <div className="card !p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gain Rate</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">{signed(avgGain)}</span>
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
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
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
              Average rate: <span className="font-bold text-slate-900">{signed(avgGain)} kg/week</span> &middot; Target range: <span className="font-bold text-emerald-600">+0.20 to +0.35 kg/week</span> for clean muscle growth.
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
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
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
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
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
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 font-display">Apple Watch Active & Workout Burn</p>
                <p className="text-xs text-slate-400">Daily Active Calories vs Workout Active Burn</p>
              </div>
            </div>
          </div>
          <div className="h-60">
            {hasWatchData ? (
              <Bar
                data={watchBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: true, position: 'top', labels: { font: { family: 'Inter', size: 11, weight: '600' } } } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: COLORS.hairline } }
                  }
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Watch className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-500">No watch telemetry logged yet</p>
                <p className="text-xs text-slate-400 mt-1">Log stats from the Dashboard to populate this chart.</p>
              </div>
            )}
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
              <div key={i} className={`p-4 rounded-xl border transition-all ${hit ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-50 border-slate-200'}`}>
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
