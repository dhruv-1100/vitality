import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { COLORS } from '../utils/theme';

// Turns the routine's human-readable rest ("90 sec", "2-3 min", "3 min") into
// seconds. Range values resolve to the lower bound so the timer never overshoots.
export const parseRestToSeconds = (rest, fallback = 120) => {
  if (typeof rest === 'number' && Number.isFinite(rest)) return Math.max(1, Math.round(rest));
  if (typeof rest !== 'string') return fallback;

  const amount = parseFloat(rest);
  if (!Number.isFinite(amount) || amount <= 0) return fallback;

  const isMinutes = /min/i.test(rest);
  return Math.max(1, Math.round(isMinutes ? amount * 60 : amount));
};

// Short two-tone chime built with the Web Audio API — no asset to ship or fail to load.
const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.18;
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
    setTimeout(() => ctx.close(), 800);
  } catch (e) {
    // Audio is a nicety; a blocked or unsupported context must not break the timer.
  }
};

export default function RestTimerModal({ seconds = 120, onClose }) {
  const [duration, setDuration] = useState(seconds);
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const chimedRef = useRef(false);

  // Restart cleanly whenever the caller opens the timer for a different exercise.
  useEffect(() => {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(true);
    chimedRef.current = false;
  }, [seconds]);

  // One interval per run/pause transition — the tick reads the previous value,
  // so it never resubscribes each second or drifts.
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setRemaining(r => (r <= 0 ? 0 : r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining > 0 || chimedRef.current) return;
    chimedRef.current = true;
    setRunning(false);
    playChime();
  }, [remaining]);

  const restart = (newDuration = duration) => {
    setDuration(newDuration);
    setRemaining(newDuration);
    setRunning(true);
    chimedRef.current = false;
  };

  const addTime = (delta) => {
    setRemaining(r => Math.max(0, r + delta));
    setDuration(d => Math.max(d, remaining + delta));
    if (remaining + delta > 0) {
      chimedRef.current = false;
      setRunning(true);
    }
  };

  const done = remaining <= 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = duration > 0 ? ((duration - remaining) / duration) * 100 : 100;

  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, pct) / 100) * c;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-xs w-full !p-8 text-center animate-scale-in" style={{ boxShadow: 'var(--shadow-modal)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-900 font-display">Rest Timer</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r={r} fill="none" stroke={COLORS.hairline} strokeWidth="10" />
            <circle
              cx="64" cy="64" r={r} fill="none"
              stroke={done ? COLORS.clay : COLORS.dusk}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={offset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums font-display">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{done ? 'Done!' : 'remaining'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => (done ? restart() : setRunning(!running))}
            disabled={done}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default ${
              running ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20'
            }`}
            title={running ? 'Pause' : 'Resume'}
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => restart()}
            className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all cursor-pointer"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => addTime(30)}
            className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all cursor-pointer text-xs font-extrabold"
            title="Add 30 seconds"
          >
            +30s
          </button>
        </div>

        <button onClick={onClose} className="btn-primary w-full mt-6">
          {done ? 'Next Set' : 'Skip & Continue'}
        </button>
      </div>
    </div>
  );
}
