import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

export default function RestTimerModal({ seconds = 120, onClose }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => setRemaining(r => r - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining <= 0) {
      clearInterval(intervalRef.current);
      try { new Audio('data:audio/wav;base64,UklGRl9vT19teleW...').play(); } catch (e) {}
    }
  }, [remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100;

  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/25 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-xs w-full p-8 text-center animate-scale-in" style={{ boxShadow: 'var(--shadow-modal)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-gray-900">Rest Timer</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r={r} fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <circle cx="64" cy="64" r={r} fill="none" stroke={remaining <= 0 ? '#22c55e' : '#38bdf8'} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400">{remaining <= 0 ? 'Done!' : 'remaining'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning(!running)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              running ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { setRemaining(seconds); setRunning(true); }}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <button onClick={onClose} className="btn-primary w-full mt-6">
          Skip & Continue
        </button>
      </div>
    </div>
  );
}
