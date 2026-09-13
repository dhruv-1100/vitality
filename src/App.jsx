import React, { useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NextStepsView from './components/NextStepsView';
import WorkoutTracker from './components/WorkoutTracker';
import WorkoutCalendar from './components/WorkoutCalendar';
import DietHub from './components/DietHub';
import GroceryList from './components/GroceryList';
// Chart.js is ~40% of the bundle and is only needed on this tab, so it is
// split out and fetched on first visit rather than on initial page load.
const Analytics = lazy(() => import('./components/Analytics'));
import RoadmapView from './components/RoadmapView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoutine, setSelectedRoutine] = useState('Push A');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedRoutine={setSelectedRoutine}
          />
        )}
        {activeTab === 'next' && (
          <NextStepsView
            setActiveTab={setActiveTab}
            setSelectedRoutine={setSelectedRoutine}
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutTracker
            selectedRoutine={selectedRoutine}
            setSelectedRoutine={setSelectedRoutine}
          />
        )}
        {activeTab === 'calendar' && (
          <WorkoutCalendar
            setActiveTab={setActiveTab}
            setSelectedRoutine={setSelectedRoutine}
          />
        )}
        {activeTab === 'diet' && <DietHub />}
        {activeTab === 'grocery' && <GroceryList />}
        {activeTab === 'analytics' && (
          <Suspense fallback={
            <div className="card !p-12 text-center text-sm font-medium text-slate-500">
              Loading charts…
            </div>
          }>
            <Analytics />
          </Suspense>
        )}
        {activeTab === 'roadmap' && <RoadmapView />}
      </main>

      <footer className="border-t border-black/5 py-5 text-center">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-400 font-medium">Vitality — Scientific Lean Bulk Tracker</span>
          <span className="text-xs font-bold text-slate-500">2,800 kcal · 150g Protein · 5× PPL</span>
        </div>
      </footer>
    </div>
  );
}
