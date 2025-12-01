import React from 'react';
import { FilterState, CuisineType, Difficulty, CalorieGoal, CreativityLevel } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface RecipeFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  t: any;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({ filters, setFilters, t }) => {
  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white/60 p-5 rounded-2xl border border-stone-200 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 text-stone-600">
        <SlidersHorizontal size={20} />
        <h3 className="font-hand font-bold text-xl">{t.rules}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Cuisine */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.cuisine}</label>
          <select
            value={filters.cuisine}
            onChange={(e) => handleChange('cuisine', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
            {Object.values(CuisineType).map(c => (
              <option key={c} value={c}>{t.cuisineOptions[c] || c}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.difficulty}</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
            <option value="Any">{t.any}</option>
            {Object.values(Difficulty).map(d => (
              <option key={d} value={d}>{t.difficultyOptions[d] || d}</option>
            ))}
          </select>
        </div>

        {/* Calories */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.calories}</label>
          <select
            value={filters.calorieGoal}
            onChange={(e) => handleChange('calorieGoal', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
             {Object.values(CalorieGoal).map(c => (
              <option key={c} value={c}>{t.calorieOptions[c] || c}</option>
            ))}
          </select>
        </div>

        {/* Max Time */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.maxTime}</label>
          <select
            value={filters.maxPrepTime}
            onChange={(e) => handleChange('maxPrepTime', Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
            <option value={0}>{t.noLimit}</option>
            <option value={15}>15 {t.minutes}</option>
            <option value={30}>30 {t.minutes}</option>
            <option value={45}>45 {t.minutes}</option>
            <option value={60}>1 {t.hours}</option>
            <option value={90}>1.5 {t.hours}</option>
          </select>
        </div>
        
         {/* Recipe Count */}
         <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.recipeCount}</label>
          <select
            value={filters.recipeCount}
            onChange={(e) => handleChange('recipeCount', Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        {/* Creativity Level */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">{t.creativity}</label>
          <select
            value={filters.creativity}
            onChange={(e) => handleChange('creativity', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-hand text-lg focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer"
          >
            {Object.values(CreativityLevel).map(c => (
              <option key={c} value={c}>{t.creativityOptions[c] || c}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

export default RecipeFilters;