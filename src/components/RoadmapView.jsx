import React from 'react';
import { Map, Target, ArrowRight, Zap, Award, RotateCcw } from 'lucide-react';
import { PHASES, WEIGHT_CHECKPOINTS } from '../utils/transformationData';

export default function RoadmapView() {
  const phaseIcons = [Zap, Target, Award, RotateCcw];
  const phaseColors = [
    { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600', pill: 'pill-green', dot: 'bg-green-500' },
    { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'text-orange-600', pill: 'pill-coral', dot: 'bg-orange-500' },
    { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', pill: 'pill-blue', dot: 'bg-blue-500' },
    { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600', pill: 'pill-purple', dot: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Roadmap</h1>
        <p className="text-sm text-gray-400 mt-0.5">August – December 2026 periodization plan</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <Map className="w-[18px] h-[18px] text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Transformation Journey</p>
              <p className="text-xs text-gray-400">59 kg → 66 kg · 21 weeks</p>
            </div>
          </div>
          <span className="pill pill-green text-xs">Phase 1 Active</span>
        </div>

        <div className="flex items-center gap-1 mt-4">
          {PHASES.map((phase, i) => (
            <div key={i} className="flex-1 relative">
              <div className={`h-2.5 rounded-full ${phase.status === 'active' ? 'bg-green-400' : 'bg-gray-100'}`} />
              <p className="text-[10px] text-gray-400 mt-1.5 truncate">{phase.dates}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {PHASES.map((phase, i) => {
          const Icon = phaseIcons[i];
          const colors = phaseColors[i];
          const isActive = phase.status === 'active';

          return (
            <div key={phase.id} className={`card p-5 ${isActive ? `${colors.bg} ${colors.border} border` : ''}`}>
              <div className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? colors.bg : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? colors.accent : 'text-gray-400'}`} />
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900">{phase.name}</h3>
                    {isActive && <span className={`pill ${colors.pill} text-xs`}>Current</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{phase.dates}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{phase.goal}</p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Effort</p>
                      <p className="text-sm font-semibold text-gray-800">{phase.effort}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Target Weight</p>
                      <p className="text-sm font-bold text-green-600">{phase.targetWeightKg} kg</p>
                    </div>
                  </div>

                  {phase.focus && (
                    <p className="text-xs text-gray-400 mt-3 italic">📌 {phase.focus}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Target */}
      <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Award className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">December 2026 Target</h3>
        <p className="text-4xl font-bold text-green-600 mt-2">66.0 kg</p>
        <p className="text-sm text-gray-500 mt-2">Lean, strong, sustainable. You've got this. 💪</p>
      </div>
    </div>
  );
}
