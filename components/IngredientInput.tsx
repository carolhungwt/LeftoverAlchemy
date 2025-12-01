import React, { useState, KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
  emptyText: string;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients, placeholder, emptyText }) => {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim().toLowerCase())) {
      setIngredients([...ingredients, inputValue.trim().toLowerCase()]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-5 py-4 text-lg border-2 border-stone-300 rounded-2xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white/80 font-hand transition-all shadow-sm"
        />
        <button
          onClick={addIngredient}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[50px]">
        {ingredients.length === 0 && (
          <p className="text-stone-400 italic font-hand pl-2">{emptyText}</p>
        )}
        {ingredients.map((ing) => (
          <span
            key={ing}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-hand font-bold bg-amber-100 text-amber-800 border-2 border-amber-200 animate-fadeIn"
          >
            {ing}
            <button
              onClick={() => removeIngredient(ing)}
              className="ml-2 hover:text-amber-900 focus:outline-none"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;