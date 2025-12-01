
import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeFilters from './components/RecipeFilters';
import RecipeCard from './components/RecipeCard';
import CalendarView from './components/CalendarView';
import HistoryView from './components/HistoryView';
import FavoritesView from './components/FavoritesView';
import Toast from './components/Toast';
import { Recipe, FilterState, CuisineType, SavedRecipe, CalorieGoal, CreativityLevel, SearchSession } from './types';
import { generateRecipe } from './services/geminiService';
import { ChefHat, Loader2, Calendar as CalendarIcon, BookHeart, Globe, UtensilsCrossed, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { languages, translations, Language } from './i18n';

function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const t = translations[currentLang];

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Modal for single recipe view (from calendar or history)
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [scheduledRecipes, setScheduledRecipes] = useState<SavedRecipe[]>(() => {
    const saved = localStorage.getItem('scheduledRecipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<SavedRecipe[]>(() => {
    const saved = localStorage.getItem('favoriteRecipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<SearchSession[]>(() => {
    const saved = localStorage.getItem('recipeHistorySessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filters, setFilters] = useState<FilterState>({
    cuisine: CuisineType.Any,
    difficulty: "Any",
    maxPrepTime: 0,
    calorieGoal: CalorieGoal.Any,
    recipeCount: 3,
    creativity: CreativityLevel.Traditional
  });

  // Update document title when language changes
  useEffect(() => {
    document.title = t.appTitle;
  }, [currentLang, t.appTitle]);

  // Save to local storage whenever scheduled recipes change
  useEffect(() => {
    localStorage.setItem('scheduledRecipes', JSON.stringify(scheduledRecipes));
  }, [scheduledRecipes]);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('recipeHistorySessions', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setRecipes([]);
    
    // returns Recipe[]
    const results = await generateRecipe(ingredients, filters, currentLang);
    
    setRecipes(results);
    
    // Add to history if results found
    if (results.length > 0) {
        const newSession: SearchSession = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ingredients: [...ingredients],
            filters: {...filters},
            recipes: results
        };

        setHistory(prev => {
            // Keep strictly latest 20 sessions
            const newHistory = [newSession, ...prev];
            return newHistory.slice(0, 20);
        });
    }

    setLoading(false);
  };

  const showToastNotification = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
  };

  // Deprecated direct save, now mapped to schedule logic essentially for 'Plan' button context
  // but kept for compatibility if needed. The new UI uses "Favorite" (Heart) and "Plan" (Calendar)
  const handleSaveRecipe = (r: Recipe) => {
     handleScheduleRecipe(r);
  };

  const handleToggleFavorite = (r: Recipe) => {
    const isFav = favorites.some(f => f.id === r.id);
    if (isFav) {
        setFavorites(prev => prev.filter(f => f.id !== r.id));
        showToastNotification(t.removedFromFavorites);
    } else {
        const newFav: SavedRecipe = { ...r, savedAt: new Date().toISOString() };
        setFavorites(prev => [...prev, newFav]);
        showToastNotification(t.addedToFavorites);
    }
  };

  const handleScheduleRecipe = (r: Recipe) => {
    const dateStr = prompt(t.promptDate, format(new Date(), 'yyyy-MM-dd'));
    if (dateStr) {
        const newSaved: SavedRecipe = { ...r, savedAt: new Date().toISOString(), dateScheduled: dateStr };
        setScheduledRecipes(prev => [...prev, newSaved]);
        setShowCalendar(true);
        showToastNotification(t.alertSaved);
    }
  };

  const removeScheduled = (id: string) => {
    setScheduledRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleSelectHistorySession = (session: SearchSession) => {
    // Restore the state from the session
    setRecipes(session.recipes);
    setIngredients(session.ingredients);
    setFilters(session.filters);
    setShowHistory(false);
    
    // Optional: Scroll to results
    setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  const handleViewRecipe = (r: Recipe) => {
      setViewingRecipe(r);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-rose-200" lang={currentLang}>
      
      {/* Navbar / Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex flex-wrap justify-between items-center shadow-sm gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
             <ChefHat className="text-emerald-600" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-script font-bold text-stone-800">{t.appTitle}</h1>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Language Selector */}
           <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 font-hand font-bold transition-colors">
                 <Globe size={18} />
                 <span className="text-sm">{languages.find(l => l.code === currentLang)?.label}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden hidden group-hover:block w-48 z-50">
                 {languages.map(lang => (
                   <button
                     key={lang.code}
                     onClick={() => setCurrentLang(lang.code)}
                     className={`w-full text-left px-4 py-2 hover:bg-emerald-50 text-stone-600 font-hand ${currentLang === lang.code ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
                   >
                     {lang.label}
                   </button>
                 ))}
              </div>
           </div>

           {/* Favorites Button */}
           <button 
                onClick={() => setShowFavorites(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-hand font-bold transition-colors"
                title={t.favorites}
            >
                <BookHeart size={20} />
            </button>

            {/* History Button */}
           <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg font-hand font-bold transition-colors"
                title={t.history}
            >
                <Clock size={20} />
            </button>

           <button 
                onClick={() => setShowCalendar(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-hand font-bold transition-colors"
            >
                <CalendarIcon size={20} />
                <span className="hidden sm:inline">{t.mealPlan}</span>
            </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Hero / Input Section */}
        <section className="text-center mb-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-script font-bold text-stone-700">{t.heroTitle}</h2>
            <p className="text-lg font-hand text-stone-500 max-w-lg mx-auto">
                {t.heroSubtitle}
            </p>
        </section>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-100 mb-12">
            <IngredientInput 
                ingredients={ingredients} 
                setIngredients={setIngredients} 
                placeholder={t.placeholder} 
                emptyText={t.emptyFridge} 
            />
            
            <div className="my-6 border-t border-dashed border-stone-200"></div>
            
            <RecipeFilters filters={filters} setFilters={setFilters} t={t} />

            <button
                onClick={handleGenerate}
                disabled={ingredients.length === 0 || loading}
                className={`w-full py-4 rounded-2xl text-xl font-hand font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg
                    ${ingredients.length === 0 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:shadow-emerald-200'
                    }`}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> {t.generating}
                    </>
                ) : (
                    <>
                        <BookHeart /> {t.generate}
                    </>
                )}
            </button>
        </div>

        {/* Recipe Display */}
        {recipes.length > 0 && (
            <div className="space-y-12 animate-slideUp">
                {recipes.length > 1 && (
                    <div className="flex items-center justify-center gap-2 text-stone-400 font-hand mb-4">
                        <UtensilsCrossed size={16} />
                        <span>Found {recipes.length} delicious options for you</span>
                    </div>
                )}
                
                {recipes.map((recipe, index) => (
                    <div key={recipe.id} className="relative">
                        {recipes.length > 1 && (
                           <div className="absolute -top-4 left-6 z-20 bg-stone-800 text-white px-3 py-1 rounded-full font-hand text-sm shadow-md">
                                Option #{index + 1}
                           </div>
                        )}
                        <RecipeCard 
                            recipe={recipe} 
                            isFavorite={favorites.some(f => f.id === recipe.id)}
                            onToggleFavorite={handleToggleFavorite}
                            onSchedule={handleScheduleRecipe}
                            t={t}
                        />
                    </div>
                ))}
            </div>
        )}

        {/* Empty State / Illustration Area when no recipe */}
        {recipes.length === 0 && !loading && (
            <div className="text-center opacity-40 mt-12 pointer-events-none select-none">
                <div className="w-64 h-64 bg-stone-200 rounded-full mx-auto mb-6 blur-3xl mix-blend-multiply bg-opacity-50"></div>
                <p className="font-hand text-2xl text-stone-400 transform -rotate-2">"{t.cookingQuote}"</p>
            </div>
        )}

      </main>

      {/* Toast Notification */}
      <Toast 
         message={toastMessage} 
         isVisible={showToast} 
         onClose={() => setShowToast(false)} 
      />

      {/* Modals */}
      {showCalendar && (
        <CalendarView 
            scheduledRecipes={scheduledRecipes} 
            onClose={() => setShowCalendar(false)} 
            onRemove={removeScheduled}
            onViewRecipe={handleViewRecipe}
            t={t}
            currentLang={currentLang}
        />
      )}

      {showHistory && (
          <HistoryView 
            history={history}
            onClose={() => setShowHistory(false)}
            onSelect={handleSelectHistorySession}
            t={t}
          />
      )}

      {showFavorites && (
          <FavoritesView 
            favorites={favorites}
            onClose={() => setShowFavorites(false)}
            onSelect={(r) => { handleViewRecipe(r); setShowFavorites(false); }}
            onRemove={handleToggleFavorite}
            t={t}
          />
      )}

      {/* Full Screen Recipe Viewer Modal */}
      {viewingRecipe && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[60] overflow-y-auto">
            <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
                <div className="relative w-full max-w-3xl">
                    <button 
                        onClick={() => setViewingRecipe(null)}
                        className="absolute -top-12 right-0 md:-right-12 text-white hover:text-stone-200 transition-colors bg-stone-800/20 p-2 rounded-full"
                    >
                        <X size={32} />
                    </button>
                    <RecipeCard 
                        recipe={viewingRecipe}
                        isFavorite={favorites.some(f => f.id === viewingRecipe.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSchedule={(r) => { handleScheduleRecipe(r); setViewingRecipe(null); }}
                        t={t}
                    />
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
            animation: slideUp 0.6s ease-out forwards;
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        /* Custom scrollbar for calendar lists */
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d6d3d1;
            border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

export default App;
