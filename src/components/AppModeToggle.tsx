import React from 'react';
import { ChefHat, UtensilsCrossed, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export type AppMode = 'cook' | 'restaurants';

interface AppModeToggleProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const AppModeToggle: React.FC<AppModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2">
      <div className="bg-stone-200/90 dark:bg-stone-800/95 p-1.5 rounded-2xl sm:rounded-full border border-stone-300 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-2 shadow-inner relative">
        {/* Cook Yourself Button */}
        <motion.button
          id="mode-cook-btn"
          type="button"
          whileHover={{ scale: mode === 'cook' ? 1.01 : 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('cook')}
          className={`relative z-10 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            mode === 'cook'
              ? 'text-white'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          {mode === 'cook' && (
            <motion.div
              layoutId="active-mode-pill"
              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 rounded-xl sm:rounded-full shadow-md shadow-orange-500/25 -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <ChefHat className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${mode === 'cook' ? 'scale-110 text-white' : 'text-amber-600 dark:text-amber-400'}`} />
          <span>Cook It Yourself (Home Recipes)</span>
        </motion.button>

        {/* Restaurant Meals Button */}
        <motion.button
          id="mode-restaurants-btn"
          type="button"
          whileHover={{ scale: mode === 'restaurants' ? 1.01 : 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setMode('restaurants')}
          className={`relative z-10 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            mode === 'restaurants'
              ? 'text-white'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          {mode === 'restaurants' && (
            <motion.div
              layoutId="active-mode-pill"
              className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-xl sm:rounded-full shadow-md shadow-rose-600/25 -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <UtensilsCrossed className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${mode === 'restaurants' ? 'scale-110 text-white' : 'text-rose-600 dark:text-rose-400'}`} />
          <span>Find Nearby Restaurants (Dine Out / Takeaway)</span>
        </motion.button>
      </div>
    </div>
  );
};
