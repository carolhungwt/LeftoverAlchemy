
import React from 'react';
import { Recipe } from '../types';
import { X, Heart, Clock, ChevronRight, Utensils } from 'lucide-react';

interface FavoritesViewProps {
  favorites: Recipe[];
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
  onRemove: (recipe: Recipe) => void;
  t: any;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onClose, onSelect, onRemove, t }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-rose-50 border-b border-rose-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-rose-200 rounded-full text-rose-800">
                <Heart size={24} fill="currentColor" />
             </div>
             <h2 className="text-3xl font-script text-stone-800 font-bold">{t.favoritesTitle}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-200 rounded-full transition-colors text-stone-600">
            <X size={24} />
          </button>
        </div>

        {/* Grid List */}
        <div className="overflow-y-auto p-6 flex-1 bg-stone-50">
            {favorites.length === 0 ? (
                <div className="text-center text-stone-400 py-20 font-hand text-xl flex flex-col items-center">
                    <Heart size={64} className="mb-4 text-stone-200" />
                    {t.favoritesEmpty}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((recipe) => (
                        <div 
                            key={recipe.id}
                            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all group flex flex-col justify-between"
                        >
                            <div 
                                onClick={() => onSelect(recipe)}
                                className="cursor-pointer"
                            >
                                <h3 className="text-xl font-bold font-script text-stone-800 mb-2 group-hover:text-rose-600 transition-colors line-clamp-1">
                                    {recipe.title}
                                </h3>
                                <p className="text-stone-500 text-sm font-hand mb-4 line-clamp-2 min-h-[2.5em]">
                                    {recipe.description}
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs font-bold text-stone-400 uppercase tracking-wide mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Utensils size={12} />
                                        <span>{recipe.ingredients.length} {t.ingredients}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                                <button
                                    onClick={() => onRemove(recipe)}
                                    className="text-stone-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                    title={t.removeFromFavorites}
                                >
                                    <Heart size={18} fill="currentColor" />
                                </button>
                                <button 
                                    onClick={() => onSelect(recipe)}
                                    className="flex items-center gap-1 text-emerald-600 font-bold font-hand hover:text-emerald-700"
                                >
                                    {t.view} <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesView;
