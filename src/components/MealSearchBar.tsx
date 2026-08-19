import React from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  ShieldAlert,
  ArrowRight,
  ChefHat,
  Zap,
  Layers,
  HeartPulse,
  Utensils,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

interface MealSearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  excluded: string;
  setExcluded: (e: string) => void;
  diet: string;
  setDiet: (d: string) => void;
  texturePreference: string;
  setTexturePreference: (t: string) => void;
  spicePreference: string;
  setSpicePreference: (s: string) => void;
  maxCookTime: number;
  setMaxCookTime: (t: number) => void;
  onSearch: () => void;
  onSelectPreset?: (presetQuery: string, presetExcluded: string) => void;
  isLoading: boolean;
}

export const PRESET_CRAVINGS = [
  {
    id: 'spicy-garlic-honey-chicken',
    label: 'Spicy garlic honey chicken',
    icon: Flame,
    iconColor: 'text-amber-500',
    query: 'spicy garlic honey chicken with crispy edges',
    excluded: ''
  },
  {
    id: 'gochujang-glazed-chicken',
    label: 'Gochujang glazed chicken & rice',
    icon: Zap,
    iconColor: 'text-orange-500',
    query: 'sweet and spicy gochujang glazed chicken bowl',
    excluded: ''
  },
  {
    id: 'high-protein-chicken-salad',
    label: 'High-protein spicy chicken bowl',
    icon: HeartPulse,
    iconColor: 'text-emerald-500',
    query: 'spicy grilled chipotle chicken high protein bowl',
    excluded: 'mayonnaise, heavy cream'
  },
  {
    id: 'thai-spicy-basil-chicken',
    label: 'Thai spicy basil chicken (Pad Krapow)',
    icon: Utensils,
    iconColor: 'text-rose-500',
    query: 'spicy Thai holy basil minced chicken with runny egg',
    excluded: ''
  },
  {
    id: 'smoky-chipotle-tacos',
    label: 'Smoky chipotle chicken tacos',
    icon: Flame,
    iconColor: 'text-amber-600',
    query: 'smoky spicy shredded chicken tacos with lime crema',
    excluded: ''
  },
  {
    id: 'szechuan-kung-pao-chicken',
    label: 'Szechuan fiery kung pao chicken',
    icon: Sparkles,
    iconColor: 'text-red-500',
    query: 'fiery authentic Szechuan kung pao chicken with peanuts',
    excluded: 'mushrooms'
  },
];

export const MealSearchBar: React.FC<MealSearchBarProps> = ({
  query,
  setQuery,
  excluded,
  setExcluded,
  diet,
  setDiet,
  texturePreference,
  setTexturePreference,
  spicePreference,
  setSpicePreference,
  maxCookTime,
  setMaxCookTime,
  onSearch,
  onSelectPreset,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-stone-300 dark:border-stone-700 p-6 md:p-8 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20 shadow-xs">
          <ChefHat className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            What are you craving today?
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 mt-0.5">
            Tell us your exact taste or ingredients on hand, plus anything to strictly avoid.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Craving Input */}
        <div>
          <label htmlFor="meal-query" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Desired Meal / Flavors</span>
            <span className="text-amber-600 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              id="meal-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. something spicy with chicken, juicy lime garlic steak, creamy low-carb pasta..."
              className="w-full pl-4 pr-16 py-3.5 bg-stone-50 dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base font-semibold"
              disabled={isLoading}
              required
            />
            {query && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-2 py-1 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Exclusions Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="meal-excluded" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Exclude Ingredients (Optional)</span>
            </label>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Allergies or dislikes</span>
          </div>
          <input
            id="meal-excluded"
            type="text"
            value={excluded}
            onChange={(e) => setExcluded(e.target.value)}
            placeholder="e.g. mushrooms, cilantro, dairy, pork, tree nuts, mayo, gluten..."
            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/90 border border-rose-300 dark:border-rose-900/60 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-semibold"
            disabled={isLoading}
          />
        </div>

        {/* Quick presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Popular Inspirations:</span>
            </p>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-extrabold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Instant recipe load</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_CRAVINGS.map((preset) => {
              const isActive = query === preset.query;
              const IconComp = preset.icon;
              return (
                <motion.button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setQuery(preset.query);
                    setExcluded(preset.excluded);
                    if (onSelectPreset) {
                      onSelectPreset(preset.query, preset.excluded);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                    isActive
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : preset.iconColor}`} />
                  <span>{preset.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
          {/* Dietary Filter */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <label htmlFor="diet-filter" className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
              <span>Dietary Style</span>
            </label>
            <select
              id="diet-filter"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Any Style / Unrestricted</option>
              <option value="High Protein">High Protein</option>
              <option value="Low Carb / Keto">Low Carb / Keto</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Dairy-Free">Dairy-Free</option>
              <option value="Paleo / Whole30">Paleo / Whole30</option>
              <option value="Low Calorie / Lean">Low Calorie / Lean</option>
            </select>
          </motion.div>

          {/* Texture Preference Filter */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <label htmlFor="texture-filter" className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Texture Preference</span>
            </label>
            <select
              id="texture-filter"
              value={texturePreference}
              onChange={(e) => setTexturePreference(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Any Texture Profile</option>
              <option value="Crispy & Crunchy">Crispy & Crunchy (Shatter Crust / Seared)</option>
              <option value="Saucy, Sticky & Glazed">Saucy, Sticky & Glazed (Caramelized)</option>
              <option value="Creamy, Rich & Velvety">Creamy, Rich & Velvety (Silky Sauce)</option>
              <option value="Tender, Juicy & Melt-in-Mouth">Tender, Juicy & Melt-in-Mouth (Slow-cooked)</option>
              <option value="Chewy & Al Dente">Chewy & Al Dente (Noodles / Pasta / Crust)</option>
              <option value="Flaky & Light">Flaky & Light (Delicate / Pastry)</option>
              <option value="Silky, Smooth & Brothy">Silky, Smooth & Brothy (Comforting)</option>
            </select>
          </motion.div>

          {/* Spice Level */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <label htmlFor="spice-filter" className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Heat Preference</span>
            </label>
            <select
              id="spice-filter"
              value={spicePreference}
              onChange={(e) => setSpicePreference(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Any Spice Level</option>
              <option value="None">Mild / No Heat</option>
              <option value="Mild">Gentle Heat</option>
              <option value="Medium">Medium Kick</option>
              <option value="Hot">Spicy / Authentic Heat</option>
              <option value="Extra Hot">Fiery / Extra Hot</option>
            </select>
          </motion.div>

          {/* Max Time */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <label htmlFor="time-filter" className="flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Max Time</span>
            </label>
            <select
              id="time-filter"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value={0}>Any Duration</option>
              <option value={20}>Under 20 Minutes (Express)</option>
              <option value={30}>Under 30 Minutes (Quick)</option>
              <option value={45}>Under 45 Minutes</option>
              <option value={60}>Under 60 Minutes</option>
            </select>
          </motion.div>
        </div>

        {/* Submit Action with tactile bounce */}
        <div className="pt-2">
          <motion.button
            id="craft-meals-btn"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            disabled={isLoading || !query.trim()}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:via-orange-700 hover:to-rose-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Culinary Suggestions & Health Models...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Craft My Meal Options</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};
