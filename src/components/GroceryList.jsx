import React, { useState } from 'react';
import { ShoppingCart, CheckCircle2, Circle, Plus, Package } from 'lucide-react';
import { GROCERY_LIST } from '../utils/transformationData';
import { getGroceryChecks, toggleGroceryItem } from '../utils/storage';

export default function GroceryList() {
  const [checks, setChecks] = useState(getGroceryChecks());
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleToggle = (item) => {
    const updated = toggleGroceryItem(item);
    setChecks(updated);
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const categoryIcons = {
    'Batch Cooking Staples': '🍚',
    'No-Cook Staples (Always Stocked)': '🥛',
    'Frozen Veggie Hacks (Zero Prep)': '🥦',
    'Spices & Pantry Restock': '🌶️',
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Grocery List</h1>
        <p className="text-sm text-gray-400 mt-0.5">Weekly shopping checklist</p>
      </div>

      {GROCERY_LIST.map((cat, ci) => {
        const total = cat.items.length;
        const done = cat.items.filter(item => checks[item]).length;

        return (
          <div key={ci} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{categoryIcons[cat.category] || '📦'}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{cat.category}</p>
                  <p className="text-xs text-gray-400">{done} of {total} items</p>
                </div>
              </div>
              <span className={`pill text-xs ${done === total ? 'pill-green' : 'bg-gray-100 text-gray-500'}`}>
                {done === total ? '✓ Complete' : `${total - done} left`}
              </span>
            </div>

            <div className="space-y-1">
              {cat.items.map((item, ii) => {
                const isChecked = !!checks[item];
                return (
                  <button
                    key={ii}
                    onClick={() => handleToggle(item)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isChecked ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-200 shrink-0" />
                    )}
                    <span className={`text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom Items */}
      <div className="card p-5">
        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-500" />
          Custom Items
        </p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
            placeholder="Add an item..."
            className="input-field flex-1 text-sm"
          />
          <button onClick={addCustomItem} className="btn-primary px-3">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {customItems.length > 0 && (
          <div className="space-y-1">
            {customItems.map((item, i) => {
              const isChecked = !!checks[item];
              return (
                <button key={i} onClick={() => handleToggle(item)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isChecked ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                  {isChecked ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <Circle className="w-5 h-5 text-gray-200 shrink-0" />}
                  <span className={`text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
