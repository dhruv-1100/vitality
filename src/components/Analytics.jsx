import React from 'react';
import { TrendingUp, Target, AlertCircle, Scale, Ruler } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { getWeeklyWeightLogs } from '../utils/storage';
import { WEIGHT_CHECKPOINTS } from '../utils/transformationData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function Analytics() {
  const logs = getWeeklyWeightLogs();
  const labels = logs.map(l => `Wk ${l.weekNum}`);
  const weights = logs.map(l => l.weightKg);
  const waists = logs.map(l => l.waistInches);

  // Calculate weekly deltas
  const deltas = weights.map((w, i) => i === 0 ? 0 : +(w - weights[i - 1]).toFixed(2));
  const avgGain = weights.length > 1 ? +((weights[weights.length - 1] - weights[0]) / (weights.length - 1)).toFixed(2) : 0;

  const weightChartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
    ],
  };

  const waistChartData = {
    labels,
    datasets: [
      {
        label: 'Waist (inches)',
        data: waists,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#38bdf8',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
    ],
  };

  const chartOptions = (unit) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1c1c',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11, weight: '500' }, color: '#9ca3af' } },
      y: { grid: { color: '#f5f5f5' }, ticks: { font: { family: 'Inter', size: 11, weight: '500' }, color: '#9ca3af' } },
    },
  });

  const gainStatus = avgGain >= 0.15 && avgGain <= 0.30 ? 'on-track' : avgGain < 0.15 ? 'slow' : 'fast';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Weekly progress tracking & gain velocity</p>
      </div>

      {/* Gain Velocity Status */}
      <div className={`card p-5 border-l-4 ${
        gainStatus === 'on-track' ? 'border-l-green-500 bg-green-50/30' :
        gainStatus === 'slow' ? 'border-l-amber-500 bg-amber-50/30' :
        'border-l-red-500 bg-red-50/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            gainStatus === 'on-track' ? 'bg-green-100' : gainStatus === 'slow' ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            {gainStatus === 'on-track' ? <Target className="w-5 h-5 text-green-600" /> :
             <AlertCircle className="w-5 h-5 text-amber-600" />}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              {gainStatus === 'on-track' ? 'On Track — Gaining at healthy rate' :
               gainStatus === 'slow' ? 'Gaining slowly — Consider adding 100-200 kcal' :
               'Gaining fast — May be adding excess fat'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Avg weekly gain: <span className="font-bold">{avgGain > 0 ? '+' : ''}{avgGain} kg/week</span> · Target: +0.15 to +0.30 kg/week
            </p>
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-green-500" />
            Weight Progress
          </p>
          <span className="pill pill-green text-xs">
            {weights.length > 0 ? `${weights[weights.length - 1]} kg` : '—'}
          </span>
        </div>
        <div className="h-64">
          <Line data={weightChartData} options={chartOptions('kg')} />
        </div>
      </div>

      {/* Waist Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-500" />
            Waist Measurement
          </p>
          <span className="pill pill-blue text-xs">
            {waists.length > 0 ? `${waists[waists.length - 1]}"` : '—'}
          </span>
        </div>
        <div className="h-64">
          <Line data={waistChartData} options={chartOptions('in')} />
        </div>
      </div>

      {/* Weight Checkpoints */}
      <div className="card p-5">
        <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          Target Checkpoints
        </p>
        <div className="space-y-3">
          {WEIGHT_CHECKPOINTS.map((cp, i) => {
            const current = weights.length > 0 ? weights[weights.length - 1] : 59;
            const hit = current >= cp.targetKg;
            return (
              <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl ${hit ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${hit ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {hit ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{cp.week} — {cp.month}</p>
                  <p className="text-xs text-gray-500">{cp.note}</p>
                </div>
                <span className={`text-sm font-bold ${hit ? 'text-green-600' : 'text-gray-400'}`}>{cp.targetKg} kg</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
