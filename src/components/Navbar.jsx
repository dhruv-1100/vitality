import React, { useState } from 'react';
import { LayoutDashboard, Dumbbell, Utensils, Calendar, ShoppingCart, TrendingUp, Map, Compass, Download, Upload, X, Check, Database } from 'lucide-react';
import { exportUserData, importUserData } from '../utils/storage';

export default function Navbar({ activeTab, setActiveTab }) {
  const [showBackup, setShowBackup] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'next', label: 'Next Steps', icon: Compass },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'diet', label: 'Nutrition', icon: Utensils },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
  ];

  const handleExport = () => {
    const jsonStr = exportUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitality_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    const ok = importUserData(importText);
    if (ok) {
      setImportStatus({ ok: true, msg: 'Restored! Reloading...' });
      setTimeout(() => window.location.reload(), 700);
    } else {
      setImportStatus({ ok: false, msg: 'Invalid JSON.' });
    }
  };

  return (
    <>
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.03)'
        }}
        className="sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo */}
            <button className="flex items-center gap-3 group" onClick={() => setActiveTab('dashboard')}>
              <img
                src="./vitality_logo.jpg"
                alt="Vitality Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-md transition-transform duration-300 group-hover:scale-105 border border-emerald-500/30"
              />
              <div className="text-left">
                <h1 className="text-base font-extrabold text-slate-900 leading-none tracking-tight font-display group-hover:text-green-600 transition-colors">Vitality</h1>
                <p className="text-[10px] text-slate-400 font-bold leading-none mt-1 uppercase tracking-wider">Lean Bulk OS</p>
              </div>
            </button>

            {/* Desktop Segmented Control Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-black/5 p-1.5 rounded-full border border-black/5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Backup */}
            <button
              onClick={() => setShowBackup(true)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black/5 text-slate-500 hover:text-slate-900 hover:bg-black/10 transition-all border border-black/5"
              title="Backup & Restore"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-3 -mx-1 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Backup Modal */}
      {showBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/30 backdrop-blur-md animate-fade-in">
          <div className="card max-w-md w-full !p-6 animate-scale-in" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Backup & Restore</h3>
                  <p className="text-xs text-slate-400">Data lives in your browser's local storage</p>
                </div>
              </div>
              <button onClick={() => setShowBackup(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <button onClick={handleExport} className="btn-primary w-full mb-5">
              <Download className="w-4 h-4" /><span>Download Backup (JSON)</span>
            </button>

            <div className="divider my-4" />

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Restore from backup</label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your backup JSON here..."
                className="input-field !h-24 text-sm resize-none"
              />
              {importStatus && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${
                  importStatus.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {importStatus.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{importStatus.msg}</span>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowBackup(false)} className="text-sm font-medium text-slate-400 hover:text-slate-600 px-3 py-2">Cancel</button>
                <button onClick={handleImport} disabled={!importText.trim()} className="btn-secondary disabled:opacity-40">
                  <Upload className="w-4 h-4" /><span>Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
