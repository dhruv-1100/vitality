import React from 'react';
import { Map, Target, Zap, Award, RotateCcw } from 'lucide-react';
import { PHASES } from '../utils/transformationData';

const PHASE_ICONS = [Zap, Target, Award, RotateCcw];

const PHASE_COLORS = [
  { tint: 'bg-emerald-500/10', border: 'border-emerald-500/25', accent: 'text-emerald-600', pill: 'pill-green', bar: 'bg-emerald-500' },
  { tint: 'bg-orange-500/10', border: 'border-orange-500/25', accent: 'text-orange-600', pill: 'pill-coral', bar: 'bg-orange-500' },
  { tint: 'bg-sky-500/10', border: 'border-sky-500/25', accent: 'text-sky-600', pill: 'pill-blue', bar: 'bg-sky-500' },
  { tint: 'bg-purple-500/10', border: 'border-purple-500/25', accent: 'text-purple-600', pill: 'pill-purple', bar: 'bg-purple-500' },
];

export default function RoadmapView() {
  const activeIndex = Math.max(0, PHASES.findIndex(p => p.status === 'active'));
  const activePhase = PHASES[activeIndex];

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Roadmap</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">August – December 2026 periodization plan</p>
      </div>

      {/* Overall Progress */}
      <div className="card !p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Map className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 font-display">Transformation Journey</p>
              <p className="text-xs text-slate-400 font-medium">59 kg → 66 kg · 21 weeks</p>
            </div>
          </div>
          <span className="pill pill-green text-xs font-bold">{activePhase?.name.split('—')[0].trim()} Active</span>
        </div>

        <div className="flex items-center gap-1.5">
          {PHASES.map((phase, i) => {
            const reached = i <= activeIndex;
            return (
              <div key={phase.id} className="flex-1 min-w-0">
                <div className={`h-2.5 rounded-full transition-colors ${reached ? PHASE_COLORS[i].bar : 'bg-black/8'}`} />
                <p className="text-[10px] text-slate-400 font-semibold mt-2 truncate">{phase.dates}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {PHASES.map((phase, i) => {
          const Icon = PHASE_ICONS[i] || Target;
          const colors = PHASE_COLORS[i] || PHASE_COLORS[0];
          const isActive = phase.status === 'active';
          const isDone = i < activeIndex;

          return (
            <div key={phase.id} className={`card !p-6 ${isActive ? `${colors.tint} ${colors.border}` : ''}`}>
              <div className="flex items-start gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center pt-0.5 shrink-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    isActive ? `${colors.tint} ${colors.border}` : 'bg-black/5 border-black/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? colors.accent : 'text-slate-400'}`} />
                  </div>
                  {i < PHASES.length - 1 && <div className="w-px flex-1 min-h-[32px] bg-slate-200 mt-2" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 font-display">{phase.name}</h3>
                    {isActive && <span className={`pill ${colors.pill} text-[10px] !py-0.5 !px-2`}>Current</span>}
                    {isDone && <span className="pill pill-gray text-[10px] !py-0.5 !px-2">Complete</span>}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mb-2">{phase.dates}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{phase.goal}</p>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200/60">
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Effort</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{phase.effort}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Target Weight</p>
                      <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{phase.targetWeightKg} kg</p>
                    </div>
                  </div>

                  {phase.focus && (
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/50">
                      📌 {phase.focus}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Target */}
      <div className="card card-hero-green !p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-4">
          <Award className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-extrabold text-white font-display">December 2026 Target</h3>
        <p className="text-5xl font-extrabold text-white mt-2 tabular-nums font-display">66.0 kg</p>
        <p className="text-sm text-emerald-50 mt-3 font-medium">Lean, strong, sustainable. You've got this. 💪</p>
      </div>
    </div>
  );
}
