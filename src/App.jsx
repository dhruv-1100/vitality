import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NextStepsView from './components/NextStepsView';
import WorkoutTracker from './components/WorkoutTracker';
import WorkoutCalendar from './components/WorkoutCalendar';
import DietHub from './components/DietHub';
import GroceryList from './components/GroceryList';
import Analytics from './components/Analytics';
import RoadmapView from './components/RoadmapView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoutine, setSelectedRoutine] = useState('Push A');
  const [activeScenario, setActiveScenario] = useState('Scenario A');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedRoutine={setSelectedRoutine}
            activeScenario={activeScenario}
            setActiveScenario={setActiveScenario}
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
        {activeTab === 'diet' && (
          <DietHub
            activeScenario={activeScenario}
            setActiveScenario={setActiveScenario}
          />
        )}
        {activeTab === 'grocery' && <GroceryList />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'roadmap' && <RoadmapView />}
      </main>

      <footer className="border-t border-gray-100 py-5 text-center">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-gray-400">Vitality — Scientific Lean Bulk Tracker</span>
          <span className="text-xs font-semibold text-gray-500">2,800 kcal · 150g Protein · 5× PPL</span>
        </div>
      </footer>
    </div>
  );
}
