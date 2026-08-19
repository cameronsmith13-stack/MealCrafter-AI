import React from 'react';
import { Flame, Clock, ChefHat, Sparkles, Dumbbell, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { MealCandidate } from '../types';

interface MealCandidatesGridProps {
  candidates: MealCandidate[];
  onSelectMeal: (meal: MealCandidate) => void;
  selectedMealId?: string;
  isLoadingDetail?: boolean;
}

export const MealCandidatesGrid: React.FC<MealCandidatesGridProps> = ({
  candidates,
  onSelectMeal,
  selectedMealId,
  isLoadingDetail,
}) => {
  const getSpiceBadge = (spice: string) => {
    switch (spice) {
      case 'Extra Hot':
        return { label: 'Extra Hot 🔥🔥🔥', color: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800' };
      case 'Hot':
        return { label: 'Hot 🔥🔥', color: 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800' };
      case 'Medium':
        return { label: 'Medium Kick 🔥', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800' };
      case 'Mild':
        return { label: 'Mild', color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
      default:
        return { label: 'No Heat', color: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700' };
    }
  };

  return (
    <div id="curated-meals-section" className="w-full max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Curated Meal Discoveries ({candidates.length})
          </h3>
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mt-1">
            Select any dish below to view its full recipe, health diagnostics, similar dishes, and elevated alternatives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((meal, index) => {
          const spiceInfo = getSpiceBadge(meal.spiceLevel);
          const isCurrentLoading = isLoadingDetail && selectedMealId === meal.id;
          
          // Safe resolution for ingredients, cook time, and complexity
          const ingredientsList = Array.isArray(meal.keyIngredients) && meal.keyIngredients.length > 0
            ? meal.keyIngredients
            : Array.isArray(meal.heroFlavorNotes) && meal.heroFlavorNotes.length > 0
            ? meal.heroFlavorNotes
            : Array.isArray(meal.highlights) && meal.highlights.length > 0
            ? meal.highlights
            : ['Fresh Ingredients', 'Seasonings & Herbs', 'Pantry Aromatics'];

          const displayCookTime = meal.estimatedCookTime || (meal.totalTimeMinutes ? `${meal.totalTimeMinutes} mins` : '30 mins');
          const displayComplexity = meal.complexity || meal.difficulty || 'Easy';

          return (
            <motion.div
              key={meal.id || `candidate-${index}`}
              id={`meal-card-${meal.id || index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isLoadingDetail && onSelectMeal(meal)}
              className={`group relative flex flex-col justify-between bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl ${
                selectedMealId === meal.id
                  ? 'border-amber-600 ring-4 ring-amber-500/20 shadow-amber-500/20'
                  : 'border-stone-300 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-500'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {meal.cuisine || 'Home Cooking'}
                  </span>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${spiceInfo.color}`}>
                    {spiceInfo.label}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h4 className="text-xl font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {meal.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-medium line-clamp-2 leading-relaxed">
                  {meal.tagline || meal.briefDescription}
                </p>

                {/* Primary ingredients pill preview */}
                <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Key Components:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ingredientsList.slice(0, 4).map((ing, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-md border border-stone-200 dark:border-stone-700"
                      >
                        {ing}
                      </span>
                    ))}
                    {ingredientsList.length > 4 && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 text-stone-500 dark:text-stone-400">
                        +{ingredientsList.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{displayCookTime}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-800 dark:text-orange-300 border border-orange-500/20">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <span>{displayComplexity}</span>
                  </span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  <ChefHat className="w-3.5 h-3.5 text-amber-200" />
                  <span>{isCurrentLoading ? 'Crafting...' : 'View Recipe'}</span>
                  {isCurrentLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin ml-0.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
