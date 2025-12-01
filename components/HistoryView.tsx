import React from 'react';
import { SearchSession } from '../types';
import { X, Clock, ChevronRight, Tags, ChefHat } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryViewProps {
  history: SearchSession[];
  onClose: () => void;
  onSelect: (session: SearchSession) => void;
  t: any;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClose, onSelect, t }) => {
  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-200 rounded-full text-amber-800">
                <Clock size={24} />
             </div>
             <h2 className="text-3xl font-script text-stone-800 font-bold">{t.historyTitle}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-200 rounded-full transition-colors text-stone-600">
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-6 flex-1 bg-stone-50">
            {history.length === 0 ? (
                <div className="text-center text-stone-400 py-10 font-hand text-xl">
                    {t.historyEmpty}
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => onSelect(session)}
                            className="w-full bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group text-left"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 text-stone-500 text-sm font-bold uppercase tracking-wide">
                                    <Clock size={14} />
                                    <span>{format(new Date(session.timestamp), 'MMM d, h:mm a')}</span>
                                    <span className="text-stone-300">|</span>
                                    <span>{session.filters.cuisine === 'Any' ? t.any : session.filters.cuisine}</span>
                                    <span className="text-stone-300">|</span>
                                    <span>{session.recipes.length} {t.recipeCount}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5">
                                    {session.ingredients.map((ing, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-hand font-bold text-lg border border-emerald-100">
                                            {ing}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-stone-400 font-hand text-sm flex gap-3">
                                   <span>{t.creativity}: {t.creativityOptions[session.filters.creativity]}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center w-full sm:w-auto self-center">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                    <ChevronRight className="text-stone-400 group-hover:text-emerald-500" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;