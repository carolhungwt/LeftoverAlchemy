import React, { useRef } from 'react';
import { Recipe } from '../types';
import { Clock, BarChart, Flame, Save, Share2, Calendar, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onSchedule: (recipe: Recipe) => void;
  t: any;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave, onSchedule, t }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const text = t.shareText.replace('{title}', recipe.title) + `\n\n${t.ingredients}: ${recipe.ingredients.join(', ')}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert(t.copied);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Higher resolution
                backgroundColor: '#ffffff', // Ensure white background
                useCORS: true
            });
            const link = document.createElement('a');
            link.download = `${recipe.title.replace(/\s+/g, '_')}_recipe.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to download image', error);
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div ref={cardRef} className="paper-card rounded-3xl p-6 sm:p-8 border-2 border-stone-100 relative overflow-hidden transition-all hover:shadow-xl transform duration-300">
        {/* Decorative watercolor blotch top right */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        
        <div className="relative z-10">
            <h2 className="text-4xl font-script font-bold text-stone-800 mb-2">{recipe.title}</h2>
            <p className="text-stone-500 font-hand text-xl italic mb-6">{recipe.description}</p>

            <div className="flex flex-wrap gap-4 mb-8 text-stone-600 font-hand font-bold text-lg">
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                <Clock size={18} className="text-blue-400" />
                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} {t.minutes}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                <BarChart size={18} className="text-orange-400" />
                <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                <Flame size={18} className="text-red-400" />
                <span>{recipe.calories || 'N/A'} kcal</span>
            </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-script text-stone-800 mb-3 border-b-2 border-stone-100 pb-1">{t.ingredients}</h3>
                <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 font-hand text-lg text-stone-700">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                    {ing}
                    </li>
                ))}
                </ul>
            </div>

            <div>
                <h3 className="text-2xl font-script text-stone-800 mb-3 border-b-2 border-stone-100 pb-1">{t.instructions}</h3>
                <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 font-body text-stone-700 leading-relaxed">
                    <span className="font-script text-2xl text-stone-300 font-bold">#{idx + 1}</span>
                    <span className="pt-1">{step}</span>
                    </li>
                ))}
                </ol>
            </div>
            </div>
        </div>
        </div>

        {/* Actions Bar (Outside the downloadable ref) */}
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2 px-2">
            <div className="flex gap-2">
                <button 
                onClick={() => onSave(recipe)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-colors font-hand text-sm sm:text-base"
                >
                    <Save size={18} /> {t.save}
                </button>
                <button 
                onClick={() => onSchedule(recipe)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold transition-colors font-hand text-sm sm:text-base"
                >
                    <Calendar size={18} /> {t.plan}
                </button>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-bold transition-colors font-hand text-sm sm:text-base"
                >
                    <Download size={18} /> {t.download}
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold transition-colors font-hand text-sm sm:text-base"
                >
                    <Share2 size={18} /> {t.share}
                </button>
            </div>
        </div>
    </div>
  );
};

export default RecipeCard;