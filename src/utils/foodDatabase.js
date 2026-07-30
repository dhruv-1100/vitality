// Comprehensive Food Database for Indian & Fitness Meals
export const FOOD_DATABASE = [
  // Protein Sources
  { id: 'whey_protein', name: 'Whey Protein Powder', serving: '1 scoop (32g)', cals: 120, protein: 25, category: 'Protein Supplements' },
  { id: 'soya_chunks', name: 'Soya Chunks (Dry)', serving: '50g dry', cals: 172, protein: 26, category: 'High Protein Foods' },
  { id: 'paneer_raw', name: 'Paneer (Cottage Cheese)', serving: '100g', cals: 265, protein: 18, category: 'High Protein Foods' },
  { id: 'tofu_firm', name: 'Firm Tofu', serving: '100g', cals: 140, protein: 15, category: 'High Protein Foods' },
  { id: 'greek_yogurt', name: 'Greek Yogurt (Plain / Low Fat)', serving: '200g', cals: 130, protein: 18, category: 'Dairy' },
  { id: 'curd_dahi', name: 'Curd / Dahi', serving: '200g bowl', cals: 120, protein: 6, category: 'Dairy' },
  { id: 'whole_milk', name: 'Whole Milk (Full Cream)', serving: '250ml glass', cals: 160, protein: 8, category: 'Dairy' },
  { id: 'toned_milk', name: 'Toned Milk (Low Fat)', serving: '250ml glass', cals: 120, protein: 8, category: 'Dairy' },
  { id: 'boiled_eggs', name: 'Boiled Eggs (Whole)', serving: '2 eggs', cals: 155, protein: 13, category: 'Eggs' },
  { id: 'egg_whites', name: 'Egg Whites', serving: '4 whites', cals: 68, protein: 14, category: 'Eggs' },

  // Grains & Carbs
  { id: 'cooked_rice', name: 'Cooked Basmati Rice', serving: '1 bowl (150g)', cals: 195, protein: 4, category: 'Carbs & Grains' },
  { id: 'whole_wheat_roti', name: 'Whole Wheat Roti / Chapati', serving: '2 chapatis', cals: 180, protein: 6, category: 'Carbs & Grains' },
  { id: 'cooked_pasta', name: 'Whole Wheat Pasta (Cooked)', serving: '1 bowl (180g)', cals: 220, protein: 8, category: 'Carbs & Grains' },
  { id: 'rolled_oats', name: 'Rolled Oats (Dry)', serving: '50g', cals: 190, protein: 7, category: 'Carbs & Grains' },
  { id: 'besan_chilla', name: 'Besan Chilla (Chickpea Pancake)', serving: '2 chillas', cals: 210, protein: 10, category: 'Carbs & Grains' },
  { id: 'poha_cooked', name: 'Poha (flattened rice cooked)', serving: '1 bowl (150g)', cals: 230, protein: 5, category: 'Carbs & Grains' },
  { id: 'brown_bread', name: 'Whole Wheat Bread', serving: '2 slices', cals: 140, protein: 5, category: 'Carbs & Grains' },
  { id: 'whole_pita', name: 'Whole Wheat Pita Bread', serving: '1 pita', cals: 150, protein: 5, category: 'Carbs & Grains' },

  // Legumes & Pulses
  { id: 'moong_dal', name: 'Cooked Moong Dal', serving: '1 bowl (200g)', cals: 160, protein: 9, category: 'Legumes & Dals' },
  { id: 'toor_dal', name: 'Cooked Toor / Arhar Dal', serving: '1 bowl (200g)', cals: 170, protein: 9, category: 'Legumes & Dals' },
  { id: 'rajma_curry', name: 'Cooked Rajma (Kidney Beans)', serving: '1 bowl (200g)', cals: 210, protein: 11, category: 'Legumes & Dals' },
  { id: 'chana_masala', name: 'Cooked Chana (Chickpeas)', serving: '1 bowl (200g)', cals: 230, protein: 11, category: 'Legumes & Dals' },
  { id: 'moong_sprouts', name: 'Moong Sprouts (Raw/Steam)', serving: '1 bowl (100g)', cals: 60, protein: 6, category: 'Legumes & Dals' },
  { id: 'hummus', name: 'Hummus Dip', serving: '3 tbsp (60g)', cals: 130, protein: 5, category: 'Legumes & Dals' },

  // Healthy Fats & Snacks
  { id: 'peanut_butter', name: 'Peanut Butter (Natural)', serving: '2 tbsp (32g)', cals: 190, protein: 8, category: 'Nuts & Seeds' },
  { id: 'almonds', name: 'Almonds (Badam)', serving: '15 nuts (20g)', cals: 116, protein: 4, category: 'Nuts & Seeds' },
  { id: 'walnuts', name: 'Walnuts (Akhrot)', serving: '5 halves (15g)', cals: 100, protein: 2, category: 'Nuts & Seeds' },
  { id: 'chia_seeds', name: 'Chia / Flax Seeds', serving: '1 tbsp (12g)', cals: 55, protein: 2, category: 'Nuts & Seeds' },

  // Fruits & Pre-workout
  { id: 'banana_medium', name: 'Banana (Medium)', serving: '1 medium (100g)', cals: 89, protein: 1, category: 'Fruits' },
  { id: 'apple', name: 'Apple', serving: '1 medium', cals: 95, protein: 0.5, category: 'Fruits' },
  { id: 'black_coffee', name: 'Black Coffee (No Sugar)', serving: '1 cup', cals: 5, protein: 0, category: 'Beverages' }
];

export const searchFoodDatabase = (query) => {
  if (!query || query.trim() === '') return FOOD_DATABASE.slice(0, 10);
  const q = query.toLowerCase().trim();
  return FOOD_DATABASE.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );
};
