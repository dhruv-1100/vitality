import React, { useState } from 'react';
import { Search, Plus, RotateCcw, Check, Sparkles, Utensils, Zap } from 'lucide-react';
import { FOOD_DATABASE, searchFoodDatabase } from '../utils/foodDatabase';

export default function MealSlotEditor({ meal, slotIdx, alternatives, hasCustomSwap, onSelectMeal, onResetMeal }) {
  const [activeSubTab, setActiveSubTab] = useState('suggested'); // 'suggested' | 'search' | 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [servingMultiplier, setServingMultiplier] = useState(1.0);

  const searchResults = searchFoodDatabase(searchQuery);

  const handleSelectSearchedFood = (foodItem) => {
    const calcCals = Math.round(foodItem.cals * servingMultiplier);
    const calcProtein = Math.round(foodItem.protein * servingMultiplier);
    const formattedItem = {
      name: foodItem.name,
      detail: `${servingMultiplier !== 1 ? `${servingMultiplier}x ` : ''}${foodItem.serving}`,
      cals: calcCals,
      protein: `${calcProtein}g`
    };
    onSelectMeal(formattedItem);
  };

  const handleAddCustomMeal = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const formattedItem = {
      name: customName.trim(),
      detail: 'Custom Logged Meal',
      cals: parseInt(customCals) || 0,
      protein: `${parseInt(customProtein) || 0}g`
    };
    onSelectMeal(formattedItem);
    setCustomName('');
    setCustomCals('');
    setCustomProtein('');
  };

  return (
    <div className="border-t border-slate-200/60 bg-slate-50/90 p-4 rounded-b-2xl space-y-4 animate-fade-in">
      {/* Sub-tab navigation header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setActiveSubTab('suggested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeSubTab === 'suggested'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Suggested Preps
          </button>
          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all ${
              activeSubTab === 'search'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-3 h-3" />
            Search Database
          </button>
          <button
            onClick={() => setActiveSubTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all ${
              activeSubTab === 'custom'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3 h-3" />
            Custom Input
          </button>
        </div>

        {hasCustomSwap && (
          <button
            onClick={onResetMeal}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Default
          </button>
        )}
      </div>

      {/* Mode 1: Suggested Preps */}
      {activeSubTab === 'suggested' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {alternatives.map((alt, ai) => (
            <div
              key={ai}
              onClick={() => onSelectMeal(alt)}
              className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500/60 hover:bg-emerald-50/50 cursor-pointer transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{alt.name}</p>
                <span className="text-xs font-bold text-emerald-600">{alt.protein} &middot; {alt.cals} kcal</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{alt.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mode 2: Search Food Database */}
      {activeSubTab === 'search' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search e.g. Paneer, Whey, Soya Chunks, Rice, Roti, Eggs..."
                className="input-field !pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shrink-0">
              <span className="text-[10px] font-bold text-slate-400">Qty:</span>
              <select
                value={servingMultiplier}
                onChange={(e) => setServingMultiplier(parseFloat(e.target.value))}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2.0x</option>
                <option value={3.0}>3.0x</option>
              </select>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No matching foods found. Try custom input tab!</p>
            ) : (
              searchResults.map(item => {
                const calcCals = Math.round(item.cals * servingMultiplier);
                const calcProt = Math.round(item.protein * servingMultiplier);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSearchedFood(item)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-emerald-500/60 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{item.name}</p>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-medium">{item.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{servingMultiplier !== 1 ? `${servingMultiplier}x ` : ''}{item.serving}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-600">{calcProt}g protein</p>
                        <p className="text-[10px] text-slate-400">{calcCals} kcal</p>
                      </div>
                      <button className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Custom Food Input */}
      {activeSubTab === 'custom' && (
        <form onSubmit={handleAddCustomMeal} className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Log Custom Food & Auto-Calculate Macros
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Meal Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Paneer Roll / Sprouts"
                className="input-field text-xs"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Calories (kcal)</label>
              <input
                type="number"
                value={customCals}
                onChange={(e) => setCustomCals(e.target.value)}
                placeholder="e.g. 450"
                className="input-field text-xs"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Protein (grams)</label>
              <input
                type="number"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                placeholder="e.g. 24"
                className="input-field text-xs"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary !py-2 !px-4 !text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Log & Calculate Macros
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
