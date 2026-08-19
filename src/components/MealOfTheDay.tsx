import React from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  HeartPulse,
  ChefHat,
  TrendingUp,
  ArrowRight,
  RotateCw,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import type { MealCandidate } from '../types';

interface MealOfTheDayProps {
  meal: MealCandidate;
  onSelectMeal: (meal: MealCandidate) => void;
  onShuffleMealOfTheDay: () => void;
  isLoading?: boolean;
}

export const MealOfTheDay: React.FC<MealOfTheDayProps> = ({
  meal,
  onSelectMeal,
  onShuffleMealOfTheDay,
  isLoading,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  // Safe resolution of ingredients, cook time, and complexity
  const ingredientsList = Array.isArray(meal.keyIngredients) && meal.keyIngredients.length > 0
    ? meal.keyIngredients
    : Array.isArray(meal.heroFlavorNotes) && meal.heroFlavorNotes.length > 0
    ? meal.heroFlavorNotes
    : Array.isArray(meal.highlights) && meal.highlights.length > 0
    ? meal.highlights
    : ['Farm-Fresh Aromatics', 'Artisan Seasonings', 'Signature Sauce'];

  const displayCookTime = meal.estimatedCookTime || (meal.totalTimeMinutes ? `${meal.totalTimeMinutes} mins` : '30 mins');
  const displayComplexity = meal.complexity || meal.difficulty || 'Easy';

  return (
    <motion.div
      id="meal-of-the-day-banner"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl shadow-amber-950/20 mb-10 border border-amber-400/30"
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column: Headline & Meal Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-yellow-200 border border-white/30">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              Meal of the Day • {todayFormatted}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              {meal.spiceLevel || 'Mild'} Spice
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-xs font-semibold text-white border border-white/10">
              {meal.cuisine || 'Curated Specialty'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm leading-tight">
              {meal.title}
            </h2>
            <p className="text-sm sm:text-base text-amber-100 font-medium mt-2 leading-relaxed max-w-2xl">
              {meal.tagline || meal.briefDescription}
            </p>
          </div>

          {/* Key Ingredient Tags */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-200">
              Signature Flavor Notes:
            </span>
            {ingredientsList.slice(0, 4).map((ing, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-black/20 text-white border border-white/10"
              >
                {ing}
              </span>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-amber-100 pt-2">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-yellow-300" />
              {displayCookTime}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <Zap className="w-4 h-4 text-orange-300" />
              {displayComplexity}
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
          <motion.button
            id="view-meal-of-the-day-btn"
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectMeal(meal)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white text-stone-900 font-black text-sm hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <ChefHat className="w-5 h-5 text-amber-600 group-hover:rotate-12 transition-transform" />
            <span>{isLoading ? 'Loading Full Recipe...' : 'Cook This Today'}</span>
            <ArrowRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            id="shuffle-meal-of-the-day-btn"
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onShuffleMealOfTheDay}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-black/25 hover:bg-black/40 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            title="Discover another curated daily special"
          >
            <RotateCw className="w-3.5 h-3.5 text-yellow-300" />
            <span>Shuffle Daily Special</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
