import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { SavedRecipe } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../i18n';

interface CalendarViewProps {
  scheduledRecipes: SavedRecipe[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onViewRecipe: (recipe: SavedRecipe) => void;
  t: any;
  currentLang: Language;
}

const CalendarView: React.FC<CalendarViewProps> = ({ scheduledRecipes, onClose, onRemove, onViewRecipe, t, currentLang }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthYearLabel = new Intl.DateTimeFormat(currentLang, { month: 'long', year: 'numeric' }).format(currentDate);

  // Generate localized weekday names
  const weekdays = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(currentLang, { weekday: 'short' });
    const days = [];
    const now = new Date();
    // Start from Sunday (Date.getDay() 0)
    const currentDay = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - currentDay);
    
    for(let i=0; i<7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        days.push(formatter.format(d));
    }
    return days;
  }, [currentLang]);


  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-script text-stone-800 font-bold">{t.calendarTitle}</h2>
            <p className="text-stone-500 font-hand">{t.calendarSubtitle} {monthYearLabel}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-200 rounded-full transition-colors text-stone-600">
            <X size={24} />
          </button>
        </div>

        {/* Calendar Nav */}
        <div className="flex justify-between items-center px-6 py-4 bg-white">
            <button onClick={prevMonth} className="p-1 hover:bg-stone-100 rounded-full"><ChevronLeft /></button>
            <span className="font-bold text-lg text-stone-700">{monthYearLabel}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-stone-100 rounded-full"><ChevronRight /></button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-6 flex-1 bg-stone-50">
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {weekdays.map(day => (
              <div key={day} className="text-center font-bold text-stone-400 text-sm uppercase mb-2">{day}</div>
            ))}
            
            {/* Pad Start of month */}
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {daysInMonth.map((day) => {
              const recipesForDay = scheduledRecipes.filter(r => r.dateScheduled && isSameDay(new Date(r.dateScheduled), day));
              const isCurrentDay = isToday(day);

              return (
                <div 
                  key={day.toISOString()} 
                  className={`min-h-[100px] bg-white rounded-xl p-2 border border-stone-200 flex flex-col gap-1 transition-shadow hover:shadow-md ${isCurrentDay ? 'ring-2 ring-emerald-300 bg-emerald-50' : ''}`}
                >
                  <span className={`text-sm font-bold ${isCurrentDay ? 'text-emerald-600' : 'text-stone-400'}`}>
                    {day.getDate()}
                  </span>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[120px] custom-scrollbar">
                    {recipesForDay.map(r => (
                      <div 
                        key={r.id} 
                        onClick={() => onViewRecipe(r)}
                        className="group relative bg-amber-100 p-1.5 rounded-lg text-xs border border-amber-200 cursor-pointer hover:bg-amber-200 transition-colors"
                      >
                        <p className="font-hand font-bold text-amber-900 line-clamp-2 leading-tight">{r.title}</p>
                         <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(r.id); }}
                            className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X size={10} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;