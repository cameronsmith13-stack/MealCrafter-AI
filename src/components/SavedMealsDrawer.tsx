import React, { useState } from 'react';
import {
  Bookmark,
  X,
  Trash2,
  Heart,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  LogIn,
  ChefHat
} from 'lucide-react';
import { motion } from 'motion/react';
import type { SavedMealRecord } from '../types';
import type { User } from 'firebase/auth';
import confetti from 'canvas-confetti';

interface SavedMealsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMeals: SavedMealRecord[];
  onSelectMeal: (meal: SavedMealRecord) => void;
  onDeleteMeal: (mealId: string) => Promise<void>;
  onToggleFavorite: (mealId: string, current: boolean) => Promise<void>;
  onToggleCooked: (mealId: string, current: boolean) => Promise<void>;
  onUpdateNotes: (mealId: string, notes: string) => Promise<void>;
  user: User | null;
  onSignIn: () => void;
  isSigningIn?: boolean;
}

export const SavedMealsDrawer: React.FC<SavedMealsDrawerProps> = ({
  isOpen,
  onClose,
  savedMeals,
  onSelectMeal,
  onDeleteMeal,
  onToggleFavorite,
  onToggleCooked,
  onUpdateNotes,
  user,
  onSignIn,
  isSigningIn = false,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'cooked'>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  if (!isOpen) return null;

  const isLoggedIn = !!user;

  const filteredMeals = savedMeals.filter((meal) => {
    const matchesSearch = meal.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (meal.cuisine && meal.cuisine.toLowerCase().includes(searchFilter.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeTab === 'favorites') return !!meal.isFavorite;
    if (activeTab === 'cooked') return !!meal.hasCooked;
    return true;
  });

  const handleCookedClick = async (mealId: string, current: boolean) => {
    await onToggleCooked(mealId, current);
    if (!current) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  const startEditNotes = (meal: SavedMealRecord) => {
    setEditingNotesId(meal.id);
    setTempNotes(meal.notes || '');
  };

  const saveNotes = async (mealId: string) => {
    await onUpdateNotes(mealId, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-300 dark:border-stone-800 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                My Saved Recipes
              </h3>
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {savedMeals.length} recipes saved to your Google account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In Notice */}
        {!isLoggedIn ? (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-300 dark:border-amber-800">
              <LogIn className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-2">
              Sign In to Access Saved Meals
            </h4>
            <p className="text-xs font-medium text-stone-700 dark:text-stone-300 max-w-xs mb-6">
              Sign in with your Google account to bookmark recipes, mark cooked meals, and log personalized culinary notes.
            </p>
            <button
              type="button"
              onClick={onSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  {/* Google SVG */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#fff"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#fff"/>
                  </svg>
                  <span>Sign In with Google</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Search & Tabs Filter */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50 dark:bg-stone-900">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search saved meals..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-1.5 p-1 bg-stone-200 dark:bg-stone-800 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  All ({savedMeals.length})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'favorites'
                      ? 'bg-white dark:bg-stone-700 text-rose-700 dark:text-rose-300 shadow-xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Favorites ({savedMeals.filter((m) => m.isFavorite).length})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setActiveTab('cooked')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'cooked'
                      ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Cooked ({savedMeals.filter((m) => m.hasCooked).length})
                </motion.button>
              </div>
            </div>

            {/* List of Saved Meals */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMeals.length === 0 ? (
                <div className="py-12 text-center text-stone-500 dark:text-stone-400 text-xs">
                  <ChefHat className="w-10 h-10 mx-auto mb-2 text-stone-400 dark:text-stone-600" />
                  <p className="font-bold text-stone-800 dark:text-stone-200 mb-1">No saved meals found</p>
                  <p className="text-stone-600 dark:text-stone-400 font-medium">Generate and save recipes from the search screen to view them here.</p>
                </div>
              ) : (
                filteredMeals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3 transition-all hover:border-amber-500"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-extrabold px-2 py-0.5 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded">
                            {meal.cuisine || 'Recipe'}
                          </span>
                          <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 flex items-center gap-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            {(meal.prepTimeMinutes || 10) + (meal.cookTimeMinutes || 20)}m
                          </span>
                        </div>
                        <h4
                          onClick={() => {
                            onSelectMeal(meal);
                            onClose();
                          }}
                          className="text-base font-black text-stone-900 dark:text-stone-100 hover:text-amber-600 cursor-pointer line-clamp-1"
                        >
                          {meal.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => onToggleFavorite(meal.id, !!meal.isFavorite)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            meal.isFavorite
                              ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/70'
                              : 'text-stone-400 hover:text-rose-600'
                          }`}
                          title="Favorite"
                        >
                          <Heart className="w-4 h-4" fill={meal.isFavorite ? 'currentColor' : 'none'} />
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => onDeleteMeal(meal.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Cooked & Notes bar */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200 dark:border-stone-700">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCookedClick(meal.id, !!meal.hasCooked)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          meal.hasCooked
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 border border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{meal.hasCooked ? 'Cooked' : 'Mark as Cooked'}</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onSelectMeal(meal);
                          onClose();
                        }}
                        className="flex items-center gap-1 font-black text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <span>Open Recipe</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    {/* Notes Section */}
                    {editingNotesId === meal.id ? (
                      <div className="pt-2 space-y-2">
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Add your personal recipe tweaks, tasting notes, or adjustments..."
                          className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="text-xs px-2.5 py-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveNotes(meal.id)}
                            className="text-xs px-3 py-1 bg-amber-600 text-white font-bold rounded-lg cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditNotes(meal)}
                        className="text-xs p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium hover:border-amber-400 cursor-pointer flex items-center justify-between"
                      >
                        <span className="line-clamp-1 italic">
                          {meal.notes ? `Note: "${meal.notes}"` : '+ Add personal cooking notes...'}
                        </span>
                        <Edit3 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
