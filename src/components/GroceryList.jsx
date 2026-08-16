import React, { useState } from 'react';
import { ShoppingCart, Plus, Package, Trash2 } from 'lucide-react';
import { GROCERY_LIST } from '../utils/transformationData';
import {
  getGroceryChecks,
  toggleGroceryItem,
  getCustomGroceryItems,
  addCustomGroceryItem,
  removeCustomGroceryItem
} from '../utils/storage';

const CATEGORY_ICONS = {
  'Batch Cooking Staples': '🍚',
  'No-Cook Staples (Always Stocked)': '🥛',
  'Frozen Veggie Hacks (Zero Prep)': '🥦',
  'Spices & Pantry Restock': '🌶️',
};

export default function GroceryList() {
  const [checks, setChecks] = useState(getGroceryChecks);
  const [customItems, setCustomItems] = useState(getCustomGroceryItems);
  const [newItem, setNewItem] = useState('');

  const handleToggle = (item) => setChecks(toggleGroceryItem(item));

  const handleAddCustomItem = () => {
    if (!newItem.trim()) return;
    setCustomItems(addCustomGroceryItem(newItem));
    setNewItem('');
  };

  const handleRemoveCustomItem = (item) => {
    setCustomItems(removeCustomGroceryItem(item));
    setChecks(getGroceryChecks());
  };

  const allItems = [...GROCERY_LIST.flatMap(c => c.items), ...customItems];
  const totalChecked = allItems.filter(i => checks[i]).length;

  const ItemRow = ({ item, onRemove }) => {
    const isChecked = !!checks[item];
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border transition-all ${
          isChecked
            ? 'bg-emerald-500/10 border-emerald-500/25'
            : 'bg-white/60 border-slate-200/60 hover:border-slate-300'
        }`}
      >
        <button
          onClick={() => handleToggle(item)}
          className="flex flex-1 items-center gap-3 p-3.5 text-left min-w-0 cursor-pointer"
        >
          <span className={`check-circle ${isChecked ? 'checked' : ''}`}>
            {isChecked && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <span className={`text-sm font-semibold truncate ${isChecked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {item}
          </span>
        </button>
        {onRemove && (
          <button
            onClick={() => onRemove(item)}
            className="p-2 mr-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-500/10 transition-colors shrink-0"
            title={`Remove ${item}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Header */}
      <div className="card !p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 font-display">Grocery Checklist</p>
            <p className="text-xs text-slate-400 font-medium">Weekly shopping list · ticks are saved automatically</p>
          </div>
        </div>
        <span className="pill pill-green text-xs font-bold">
          {totalChecked} / {allItems.length} collected
        </span>
      </div>

      {GROCERY_LIST.map((cat, ci) => {
        const total = cat.items.length;
        const done = cat.items.filter(item => checks[item]).length;
        const complete = done === total;

        return (
          <div key={ci} className="card !p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{CATEGORY_ICONS[cat.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-bold text-slate-900 font-display">{cat.category}</p>
                  <p className="text-xs text-slate-400 font-medium">{done} of {total} items</p>
                </div>
              </div>
              <span className={`pill text-xs font-bold ${complete ? 'pill-green' : 'pill-gray'}`}>
                {complete ? '✓ Complete' : `${total - done} left`}
              </span>
            </div>

            <div className="space-y-2">
              {cat.items.map((item, ii) => <ItemRow key={ii} item={item} />)}
            </div>
          </div>
        );
      })}

      {/* Custom Items */}
      <div className="card !p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 font-display">Custom Items</p>
            <p className="text-xs text-slate-400 font-medium">Anything outside the standard weekly list</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomItem()}
            placeholder="Add an item..."
            className="input-field flex-1 text-sm"
          />
          <button onClick={handleAddCustomItem} disabled={!newItem.trim()} className="btn-primary !px-4 disabled:opacity-40">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {customItems.length > 0 ? (
          <div className="space-y-2">
            {customItems.map((item, i) => (
              <ItemRow key={i} item={item} onRemove={handleRemoveCustomItem} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No custom items yet.</p>
        )}
      </div>
    </div>
  );
}
