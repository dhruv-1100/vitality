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
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
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
      <header style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-40 border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <button className="flex items-center gap-2.5 group" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #34d399, #22c55e)' }}>
                <span className="text-white font-extrabold text-[15px]">V</span>
              </div>
              <div className="text-left">
                <h1 className="text-[15px] font-extrabold text-gray-900 leading-none tracking-tight group-hover:text-green-700 transition-colors">Vitality</h1>
                <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Lean Bulk Tracker</p>
              </div>
            </button>

            {/* Desktop Tabs */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-[13px] font-semibold transition-all ${
                      active
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/80'
                    }`}
                  >
                    <Icon className="w-[15px] h-[15px]" strokeWidth={active ? 2.5 : 2} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Backup */}
            <button
              onClick={() => setShowBackup(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Database className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2.5 -mx-1 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full !p-6 animate-scale-in" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Backup & Restore</h3>
                  <p className="text-xs text-gray-400">Data lives in your browser's local storage</p>
                </div>
              </div>
              <button onClick={() => setShowBackup(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <button onClick={handleExport} className="btn-primary w-full mb-5">
              <Download className="w-4 h-4" /><span>Download Backup (JSON)</span>
            </button>

            <div className="divider" />

            <div className="mt-5 space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Restore from backup</label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your backup JSON here..."
                className="input-field !h-24 text-sm resize-none"
              />
              {importStatus && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${
                  importStatus.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}>
                  {importStatus.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{importStatus.msg}</span>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowBackup(false)} className="text-sm font-medium text-gray-400 hover:text-gray-600 px-3 py-2">Cancel</button>
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
