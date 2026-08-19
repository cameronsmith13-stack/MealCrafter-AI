import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChefHat,
  Flame,
  Clock,
  HeartPulse,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Utensils,
  AlertCircle,
  Activity,
  Zap,
  Scale,
  Dna,
  FlaskConical,
  Wine,
  Refrigerator,
  DollarSign,
  ShieldCheck,
  CheckSquare,
  Square,
  ThermometerSnowflake,
  Info,
  Play,
  Printer,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import type { MealDetail, SimilarMeal, BetterAlternativeMeal, Ingredient } from '../types';
import { getChefSecrets, getKitchenGuide } from '../utils/culinaryHelpers';
import { CookingModeModal } from './CookingModeModal';

interface MealDetailViewProps {
  meal: MealDetail;
  onBack: () => void;
  onSelectAlternative: (title: string, brief?: string) => void;
  onSaveMeal: (meal: MealDetail, notes?: string) => Promise<void>;
  isSaved: boolean;
  isSaving: boolean;
  onOpenSousChef: () => void;
}

export const MealDetailView: React.FC<MealDetailViewProps> = ({
  meal,
  onBack,
  onSelectAlternative,
  onSaveMeal,
  isSaved,
  isSaving,
  onOpenSousChef,
}) => {
  const [activeTab, setActiveTab] = useState<'recipe' | 'health' | 'secrets' | 'better' | 'similar' | 'kitchen'>('recipe');
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(meal.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [checkedEquipment, setCheckedEquipment] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [selectedReheatMethod, setSelectedReheatMethod] = useState<number>(0);

  const scale = servingsMultiplier / (meal.servings || 2);

  const chefSecrets = getChefSecrets(meal);
  const kitchenGuide = getKitchenGuide(meal);

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleAllIngredients = () => {
    const allChecked = meal.ingredients.every((ing) => checkedIngredients[ing.name]);
    if (allChecked) {
      setCheckedIngredients({});
    } else {
      const next: Record<string, boolean> = {};
      meal.ingredients.forEach((ing) => {
        next[ing.name] = true;
      });
      setCheckedIngredients(next);
    }
  };

  const toggleStep = (stepNum: number) => {
    setCheckedSteps((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const toggleEquipment = (name: string) => {
    setCheckedEquipment((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSaveClick = async () => {
    await onSaveMeal(meal);
    if (!isSaved) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const copyGroceryList = () => {
    const list = meal.ingredients
      .map((i) => `• ${formatIngredientAmount(i.amount, scale)} ${i.unit} ${i.name} ${i.notes ? `(${i.notes})` : ''}`)
      .join('\n');
    const text = `🛒 Grocery List for ${meal.title} (Serves ${servingsMultiplier}):\n\n${list}`;
    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const copyRecipeToClipboard = () => {
    const text = `🍽️ ${meal.title} (${meal.cuisine} Cuisine)
${meal.description}

⏱️ Prep: ${meal.prepTimeMinutes}m | Cook: ${meal.cookTimeMinutes}m | Servings: ${servingsMultiplier}
🔥 Calories: ${Math.round(meal.calories * scale)} kcal | Protein: ${Math.round(meal.proteinG * scale)}g | Carbs: ${Math.round(meal.carbsG * scale)}g | Fat: ${Math.round(meal.fatG * scale)}g

🛒 INGREDIENTS:
${meal.ingredients
  .map((i) => `- ${formatIngredientAmount(i.amount, scale)} ${i.unit} ${i.name} ${i.notes ? `(${i.notes})` : ''}`)
  .join('\n')}

👨‍🍳 INSTRUCTIONS:
${meal.instructions.map((ins) => `${ins.stepNumber}. ${ins.instruction}`).join('\n\n')}

💡 CHEF PRO TIP:
${meal.proTips?.[0] || 'Enjoy while fresh and hot!'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  function formatIngredientAmount(rawAmount: string | number, multiplier: number): string {
    if (!rawAmount) return '';
    const numeric = parseFloat(String(rawAmount));
    if (isNaN(numeric)) return String(rawAmount);
    const scaled = numeric * multiplier;
    if (Number.isInteger(scaled)) return scaled.toString();
    return scaled.toFixed(1).replace(/\.0$/, '');
  }

  // Health Score Tier Helper
  const healthScore = meal.healthInsight?.score || 85;
  const healthGrade = healthScore >= 90 ? 'Grade A+' : healthScore >= 80 ? 'Grade A' : healthScore >= 70 ? 'Grade B+' : 'Grade B';

  return (
    <div id="meal-detail-container" className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <motion.button
          id="back-to-results-btn"
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-600 dark:text-stone-300" />
          <span>Back to Meal Results</span>
        </motion.button>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            id="start-cook-mode-btn"
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCookModeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs sm:text-sm font-black shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>Start Cook Mode</span>
          </motion.button>

          <motion.button
            id="print-recipe-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePrintRecipe}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
            title="Print Recipe"
          >
            <Printer className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            <span>Print</span>
          </motion.button>

          <motion.button
            id="share-copy-recipe-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={copyRecipeToClipboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
            title="Copy Recipe"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                <span>Share</span>
              </>
            )}
          </motion.button>

          <motion.button
            id="ask-sous-chef-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenSousChef}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 dark:bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs sm:text-sm font-bold border border-amber-500/30 transition-all cursor-pointer"
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sous Chef</span>
          </motion.button>

          <motion.button
            id="save-meal-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white/90'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Hero Recipe Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-300 dark:border-stone-700 shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full text-xs font-bold uppercase tracking-wider border border-stone-200 dark:border-stone-700">
            {meal.cuisine} Cuisine
          </span>

          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-200 dark:border-orange-800">
            <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            {meal.spiceLevel} Spice
          </span>

          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Health Score {healthScore}/100 ({healthGrade})
          </span>

          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-xs font-bold border border-stone-200 dark:border-stone-700">
            {meal.difficulty} Level
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight mb-3">
          {meal.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium leading-relaxed max-w-3xl mb-6">
          {meal.description || meal.tagline}
        </p>

        {/* Nutritional & Cooking Pillars Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="bg-stone-50 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-0.5">
              Calories
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100">
              {Math.round(meal.calories * scale)}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">kcal/portion</span>
          </div>

          <div className="bg-amber-500/10 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-0.5">
              Protein
            </span>
            <span className="text-xl font-black text-amber-800 dark:text-amber-300">
              {Math.round(meal.proteinG * scale)}g
            </span>
            <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block">high bioavailable</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-0.5">
              Carbs
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100">
              {Math.round(meal.carbsG * scale)}g
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{meal.fiberG || 4}g fiber</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-0.5">
              Healthy Fat
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100">
              {Math.round(meal.fatG * scale)}g
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">unsaturated oils</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-0.5">
              Prep Time
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100">
              {meal.prepTimeMinutes}m
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">chop & season</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/90 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-0.5">
              Cook Time
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100">
              {meal.cookTimeMinutes}m
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">pan sear</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar (Organized into 2 Balanced Rows) */}
      <div className="space-y-2.5 border-b border-stone-300 dark:border-stone-800 pb-4">
        {/* Row 1: Core Recipe, Clinical Health & Chef Pairings */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            id="tab-recipe-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('recipe')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'recipe'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Full Recipe & Steps</span>
          </motion.button>

          <motion.button
            id="tab-health-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('health')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'health'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Health Insights & Macros</span>
          </motion.button>

          <motion.button
            id="tab-secrets-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('secrets')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'secrets'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <Wine className="w-4 h-4 text-rose-500" />
            <span>Chef Secrets & Drink Pairings</span>
          </motion.button>
        </div>

        {/* Row 2: Elevated Alternatives, Similar Dishes & Storage Guide */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            id="tab-better-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('better')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'better'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>"Better Than That" Upgrades ({meal.betterAlternatives?.length || 0})</span>
          </motion.button>

          <motion.button
            id="tab-similar-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('similar')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'similar'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Similar Dishes ({meal.similarMeals?.length || 0})</span>
          </motion.button>

          <motion.button
            id="tab-kitchen-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('kitchen')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'kitchen'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700'
            }`}
          >
            <Refrigerator className="w-4 h-4 text-sky-500" />
            <span>Storage & Kitchen Guide</span>
          </motion.button>
        </div>
      </div>

      {/* TAB 1: RECIPE CONTENT */}
      {activeTab === 'recipe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Ingredients Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-300 dark:border-stone-700 shadow-md">
              <div className="flex flex-col gap-3 mb-4 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                      Ingredients Checklist
                    </h3>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {Object.values(checkedIngredients).filter(Boolean).length} of {meal.ingredients?.length} packed
                    </span>
                  </div>

                  {/* Serving Scaler */}
                  <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700">
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">Serves:</span>
                    <button
                      type="button"
                      onClick={() => setServingsMultiplier((prev) => Math.max(1, prev - 1))}
                      className="w-6 h-6 flex items-center justify-center font-black text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md text-sm transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400 w-5 text-center">
                      {servingsMultiplier}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServingsMultiplier((prev) => prev + 1)}
                      className="w-6 h-6 flex items-center justify-center font-black text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md text-sm transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Grocery Action Row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={toggleAllIngredients}
                    className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {meal.ingredients.every((ing) => checkedIngredients[ing.name])
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={copyGroceryList}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition-all cursor-pointer"
                  >
                    {copiedGrocery ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Grocery List Copied!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Copy Grocery List</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2.5">
                {meal.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[ing.name];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(ing.name)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-stone-100/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                          : 'bg-stone-50 dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-400 dark:border-stone-600 bg-white dark:bg-stone-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 text-xs sm:text-sm">
                        <span className={`font-bold ${isChecked ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                          {formatIngredientAmount(ing.amount, scale)} {ing.unit} {ing.name}
                        </span>
                        {ing.notes && (
                          <span className="block text-stone-500 dark:text-stone-400 text-xs italic mt-0.5">
                            ({ing.notes})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Substitutions Box */}
            {meal.chefSubstitutions && meal.chefSubstitutions.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-300 dark:border-stone-700 shadow-md space-y-3">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <span>Missing Something? Chef Substitutions</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {meal.chefSubstitutions.map((sub, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      <strong className="text-amber-800 dark:text-amber-400">If out of {sub.ifMissing}:</strong>
                      <span className="text-stone-700 dark:text-stone-300 block mt-0.5">Swap in {sub.substituteWith}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Step-by-Step Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-700 shadow-md space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                      Step-by-Step Instructions
                    </h3>
                    <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                      {Object.values(checkedSteps).filter(Boolean).length} of {meal.instructions.length} steps completed
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setIsCookModeOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Cook Mode</span>
                  </motion.button>
                </div>

                {/* Step completion progress bar */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${(Object.values(checkedSteps).filter(Boolean).length / Math.max(1, meal.instructions.length)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {meal.instructions.map((ins) => {
                  const isDone = !!checkedSteps[ins.stepNumber];
                  return (
                    <div
                      key={ins.stepNumber}
                      onClick={() => toggleStep(ins.stepNumber)}
                      className={`flex items-start gap-4 p-3 rounded-2xl transition-all cursor-pointer ${
                        isDone
                          ? 'bg-stone-50 dark:bg-stone-800/40 opacity-70 border border-emerald-500/20'
                          : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl font-black flex items-center justify-center flex-shrink-0 text-sm shadow-md transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-amber-600 text-white shadow-amber-600/20'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : ins.stepNumber}
                      </div>

                      <div className="flex-1 space-y-2">
                        <p
                          className={`text-sm sm:text-base font-medium leading-relaxed ${
                            isDone
                              ? 'line-through text-stone-500 dark:text-stone-400'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {ins.instruction}
                        </p>

                        {ins.tip && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 font-medium flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Chef Secret:</strong> {ins.tip}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-600 dark:text-stone-400 font-semibold">
                          {ins.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-500" />
                              ~{ins.durationMinutes} minutes
                            </span>
                          )}
                          {ins.equipment && (
                            <span className="flex items-center gap-1">
                              <Utensils className="w-3.5 h-3.5 text-stone-500" />
                              Use: {ins.equipment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pro Tips & Wine Pairing Card */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ChefHat className="w-5 h-5" />
                <span>Executive Chef's Finishing Touch</span>
              </div>

              {meal.proTips && meal.proTips.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-stone-200 leading-relaxed list-disc list-inside">
                  {meal.proTips.map((tip, idx) => (
                    <li key={idx} className="font-medium">
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {meal.wineOrDrinkPairing && (
                <div className="pt-3 border-t border-stone-800 flex items-center gap-3 text-xs text-stone-300">
                  <span className="font-bold text-amber-300">Recommended Pairing:</span>
                  <span>{meal.wineOrDrinkPairing}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPANDED HEALTH & CLINICAL NUTRITION INSIGHTS */}
      {activeTab === 'health' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Health Score & Macro Caloric Distribution Banner */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-300 dark:border-stone-700 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Clinical & Culinary Nutritional Breakdown
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                  {meal.healthInsight?.badge || 'Nutrient Balanced Powerhouse'}
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-2xl mt-2 leading-relaxed font-medium">
                  {meal.healthInsight?.summary}
                </p>
              </div>

              {/* Health Score Badge Box */}
              <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 flex-shrink-0">
                <div className="text-center">
                  <span className="block text-4xl font-black text-amber-700 dark:text-amber-400">
                    {healthScore}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-extrabold tracking-wider">
                    Health Score
                  </span>
                </div>
                <div className="h-12 w-px bg-stone-300 dark:bg-stone-700" />
                <div className="text-xs space-y-1">
                  <div className="text-stone-700 dark:text-stone-300 font-semibold">
                    Tier: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{healthGrade}</strong>
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-medium">
                    {Math.round(meal.calories * scale)} kcal / serving
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-medium">
                    {Math.round(meal.proteinG * scale)}g Protein
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Distribution Bars */}
            <div className="mb-8 p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-300 dark:border-stone-700">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                  Macronutrient Caloric Distribution
                </h4>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  Target: 40% Protein | 35% Carbs | 25% Fat
                </span>
              </div>

              <div className="h-6 w-full rounded-full overflow-hidden flex bg-stone-200 dark:bg-stone-700 p-0.5 border border-stone-300 dark:border-stone-600">
                <div
                  style={{ width: `${meal.healthInsight?.macroRatio?.proteinPercent || 40}%` }}
                  className="bg-amber-600 h-full flex items-center justify-center text-[11px] font-black text-white rounded-l-full"
                  title={`Protein ${meal.healthInsight?.macroRatio?.proteinPercent}%`}
                >
                  {meal.healthInsight?.macroRatio?.proteinPercent || 40}% Protein
                </div>
                <div
                  style={{ width: `${meal.healthInsight?.macroRatio?.carbsPercent || 35}%` }}
                  className="bg-emerald-600 h-full flex items-center justify-center text-[11px] font-black text-white"
                  title={`Carbs ${meal.healthInsight?.macroRatio?.carbsPercent}%`}
                >
                  {meal.healthInsight?.macroRatio?.carbsPercent || 35}% Carbs
                </div>
                <div
                  style={{ width: `${meal.healthInsight?.macroRatio?.fatPercent || 25}%` }}
                  className="bg-rose-500 h-full flex items-center justify-center text-[11px] font-black text-white rounded-r-full"
                  title={`Fats ${meal.healthInsight?.macroRatio?.fatPercent}%`}
                >
                  {meal.healthInsight?.macroRatio?.fatPercent || 25}% Fat
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center text-xs font-bold text-stone-800 dark:text-stone-200 mt-3 px-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-600" />
                  Protein: {Math.round(meal.proteinG * scale)}g ({meal.healthInsight?.macroRatio?.proteinPercent || 40}%)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  Carbohydrates: {Math.round(meal.carbsG * scale)}g ({meal.healthInsight?.macroRatio?.carbsPercent || 35}%)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  Healthy Fats: {Math.round(meal.fatG * scale)}g ({meal.healthInsight?.macroRatio?.fatPercent || 25}%)
                </span>
              </div>
            </div>

            {/* Advanced Metabolic & Satiety Scorecards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-stone-50 dark:bg-stone-800/90 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    Satiety Index
                  </span>
                  <Scale className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {meal.healthInsight?.satietyIndex || 88}/100
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  High satiety score prevents blood sugar crashes and curbs hunger for 3–5 hours.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/90 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    Glycemic Load
                  </span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {meal.healthInsight?.glycemicImpact || 'Low-to-Moderate'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  Pairing protein with wholesome carbohydrates ensures gentle, sustained insulin response.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/90 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    Digestion Dynamics
                  </span>
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {meal.healthInsight?.digestionSpeed || 'Optimal & Steady'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  Digestive enzymes stimulated by natural capsaicin and allicin support gut absorption.
                </p>
              </div>
            </div>

            {/* Key Micro-Nutrients & Bio-Active Compounds Matrix */}
            <div className="mb-8">
              <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <Dna className="w-4 h-4 text-amber-600" />
                <span>Active Micronutrients & Bioactive Compounds</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meal.healthInsight?.keyNutrients.map((nut, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-1"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                        {nut.name}
                      </span>
                      <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                        {nut.amount}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {nut.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Chemistry & Bioavailability Insights */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-850 rounded-2xl border border-amber-200 dark:border-stone-700 mb-8 space-y-3">
              <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Cooking Chemistry & Nutrient Bioavailability
              </h4>
              <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium list-disc list-inside leading-relaxed">
                <li>
                  <strong>Maillard Caramelization:</strong> Searing meat develops complex umami peptides that stimulate salivary digestive enzymes without adding excess calories.
                </li>
                <li>
                  <strong>Fat-Soluble Nutrient Absorption:</strong> Sautéing spices and aromatics in monounsaturated oils (like avocado or olive) boosts bioavailability of fat-soluble vitamins (A, D, E, K) by up to 300%.
                </li>
                <li>
                  <strong>Allicin Activation:</strong> Crushing fresh garlic 5–10 minutes prior to heat application allows alliinase enzymes to convert alliin into active allicin for maximum cardio-protective benefits.
                </li>
              </ul>
            </div>

            {/* Health Pros vs. Mindful Considerations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="p-5 bg-emerald-50/80 dark:bg-stone-800 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Health Advantages & Functional Pros
                </h4>
                <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {meal.healthInsight?.healthPros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-3">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Mindful Nutritional Watchouts
                </h4>
                <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {meal.healthInsight?.healthCons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dietary Suitability Badges */}
            {meal.healthInsight?.dietarySuitability && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-extrabold text-stone-600 dark:text-stone-400 mr-2 uppercase tracking-wider">
                  Suitability:
                </span>
                {meal.healthInsight.dietarySuitability.map((diet, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-lg border border-stone-300 dark:border-stone-700"
                  >
                    ✓ {diet}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CHEF SECRETS & DRINK PAIRINGS (NEW HIGH-VALUE SECTION) */}
      {activeTab === 'secrets' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-700 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                  Gastronomy & Sommelier Curation
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                  Chef Secrets, Flavor Radar & Pairings
                </h3>
                <p className="text-sm text-stone-700 dark:text-stone-300 max-w-2xl mt-1 font-medium">
                  Elevate your home dining experience with curated beverage pairings, balanced flavor science, and master culinary techniques.
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-xs font-bold text-rose-800 dark:text-rose-300">
                <Wine className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Michelin-Inspired Pairings</span>
              </div>
            </div>

            {/* Sommelier & Beverage Pairings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Alcoholic Sommelier Pick */}
              <div className="p-6 bg-gradient-to-br from-rose-50/70 to-amber-50/50 dark:from-stone-800 dark:to-stone-850 rounded-3xl border border-rose-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-black rounded-full border border-rose-300 dark:border-rose-800">
                    🍷 Wine & Craft Beer Selection
                  </span>
                  {chefSecrets.drinkPairings?.servingTemperature && (
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      Serve: {chefSecrets.drinkPairings.servingTemperature}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {chefSecrets.drinkPairings?.alcoholic}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-medium leading-relaxed">
                    {chefSecrets.drinkPairings?.alcoholicNotes}
                  </p>
                </div>
              </div>

              {/* Zero-Proof Mocktail Pairing */}
              <div className="p-6 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-stone-800 dark:to-stone-850 rounded-3xl border border-emerald-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black rounded-full border border-emerald-300 dark:border-emerald-800">
                    🍃 Zero-Proof Artisanal Mocktail
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                    Non-Alcoholic
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {chefSecrets.drinkPairings?.nonAlcoholic}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-medium leading-relaxed">
                    {chefSecrets.drinkPairings?.nonAlcoholicNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Flavor Balance Radar & Meters */}
            <div className="p-6 bg-stone-50 dark:bg-stone-800/90 rounded-3xl border border-stone-200 dark:border-stone-700 mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  Flavor Profile Balance Spectrum
                </h4>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  Sensory Balance: Harmony Index 96%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {/* Savory / Umami */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Umami / Savory</span>
                    <span className="text-amber-700 dark:text-amber-400">{chefSecrets.flavorProfile?.umami || 85}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.umami || 85}%` }} />
                  </div>
                </div>

                {/* Sweetness */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Sweetness</span>
                    <span className="text-orange-600 dark:text-orange-400">{chefSecrets.flavorProfile?.sweet || 60}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.sweet || 60}%` }} />
                  </div>
                </div>

                {/* Acidity / Sour */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Acidity & Brightness</span>
                    <span className="text-emerald-700 dark:text-emerald-400">{chefSecrets.flavorProfile?.sour || 55}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.sour || 55}%` }} />
                  </div>
                </div>

                {/* Heat & Spice */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Heat / Spice Level</span>
                    <span className="text-rose-600 dark:text-rose-400">{chefSecrets.flavorProfile?.spicy || 70}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.spicy || 70}%` }} />
                  </div>
                </div>

                {/* Salinity */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Salt Balance</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{chefSecrets.flavorProfile?.salty || 60}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.salty || 60}%` }} />
                  </div>
                </div>

                {/* Bitter / Herbal Depth */}
                <div className="space-y-1.5 p-3.5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-800 dark:text-stone-200">Aromatic Herb Depth</span>
                    <span className="text-stone-600 dark:text-stone-400">{chefSecrets.flavorProfile?.bitter || 30}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-500 rounded-full" style={{ width: `${chefSecrets.flavorProfile?.bitter || 30}%` }} />
                  </div>
                </div>
              </div>

              {chefSecrets.flavorProfile?.tastingNotes && (
                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium italic pt-2 border-t border-stone-200 dark:border-stone-700">
                  <strong>Sommelier Tasting Analysis:</strong> {chefSecrets.flavorProfile.tastingNotes}
                </p>
              )}
            </div>

            {/* Master Culinary Techniques */}
            <div className="space-y-4 mb-8">
              <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-600" />
                <span>Executive Culinary Science & Searing Secrets</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chefSecrets.culinaryTechniques?.map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="text-sm font-black text-stone-900 dark:text-stone-100">
                        {tech.title}
                      </h5>
                    </div>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {tech.technique}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                      {tech.whyItWorks}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Finishing Touches & Aromatics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200 dark:border-stone-800">
              <div className="p-5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Plating & Finishing Garnishes</span>
                </h5>
                <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {chefSecrets.finishingTouches?.map((finish, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✦</span>
                      <span>{finish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Secret Aromatic Foundations</span>
                </h5>
                <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                  {chefSecrets.secretAromatics?.map((aroma, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✦</span>
                      <span>{aroma}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: "BETTER THAN THAT" ELEVATED UPGRADES */}
      {activeTab === 'better' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Same Ingredients & Craving • Strictly Superior Execution
            </span>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
              "Better Than That" Culinary & Macro Upgrades
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium mt-1">
              These recipes take the exact flavor profile you requested and elevate it using restaurant technique or nutritional optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meal.betterAlternatives?.map((alt) => (
              <div
                key={alt.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-emerald-200 dark:border-emerald-900/60 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {alt.upgradeAngle}
                    </span>
                    <span className="text-xs font-extrabold text-stone-600 dark:text-stone-400">
                      {alt.prepTimeMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-2 leading-tight">
                    {alt.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-4">
                    {alt.tagline}
                  </p>

                  <div className="p-4 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 mb-4 space-y-1">
                    <span className="text-xs font-extrabold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">
                      Why this is superior:
                    </span>
                    <p className="text-xs text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                      {alt.whyItsBetter}
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-xs font-extrabold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                      Key Upgrades:
                    </span>
                    {alt.keyImprovements.map((imp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-800 dark:text-stone-200 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="text-xs text-stone-700 dark:text-stone-300 font-semibold">
                    <strong>{alt.calories}</strong> kcal | <strong>{alt.proteinG}g</strong> Protein
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectAlternative(alt.title, alt.tagline)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <span>Cook This Version</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SIMILAR DISHES */}
      {activeTab === 'similar' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-1">
              Similar Culinary Dishes & Flavor Twins
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">
              Dishes sharing similar cooking techniques, heat dynamics, or aromatic spice blends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meal.similarMeals?.map((sim) => (
              <div
                key={sim.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-300 dark:border-stone-700 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-md border border-stone-200 dark:border-stone-700">
                      {sim.cuisine}
                    </span>
                    <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                      {sim.spiceLevel}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-stone-900 dark:text-stone-100 mb-1">
                    {sim.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-3">
                    {sim.tagline}
                  </p>
                  <p className="text-xs text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-800 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 mb-4 leading-relaxed font-medium">
                    "{sim.whyYoullLoveIt}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    {sim.prepTimeMinutes}m • {sim.calories} kcal
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectAlternative(sim.title, sim.tagline)}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Recipe →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORAGE & KITCHEN PREP GUIDE (NEW HIGH-VALUE SECTION) */}
      {activeTab === 'kitchen' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-300 dark:border-stone-700 shadow-md space-y-8">
            {/* Header & Scorecards */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                  Culinary Practicality & Kitchen Logistics
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                  Storage, Meal Prep & Kitchen Guide
                </h3>
                <p className="text-sm text-stone-700 dark:text-stone-300 max-w-2xl mt-1 font-medium">
                  Expert guidelines on container packing, shelf-life longevity, foolproof reheating, and essential cookware.
                </p>
              </div>

              {/* Batch Prep Rating Badge */}
              <div className="flex items-center gap-4 bg-sky-50 dark:bg-sky-950/40 p-4 rounded-2xl border border-sky-200 dark:border-sky-900/60 flex-shrink-0">
                <div className="text-center">
                  <span className="block text-3xl font-black text-sky-800 dark:text-sky-300">
                    {kitchenGuide.mealPrepRating}/100
                  </span>
                  <span className="text-[10px] text-sky-700 dark:text-sky-400 uppercase font-extrabold">
                    Prep Index
                  </span>
                </div>
                <div className="h-10 w-px bg-sky-300 dark:bg-sky-800" />
                <div className="text-xs space-y-0.5">
                  <div className="font-black text-stone-900 dark:text-stone-100">
                    {kitchenGuide.mealPrepBadge}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-medium">
                    Cleanup: {kitchenGuide.cleanupDifficulty}
                  </div>
                </div>
              </div>
            </div>

            {/* Freshness & Longevity Tracker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Refrigerator Shelf Life
                  </span>
                  <Refrigerator className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {kitchenGuide.fridgeLifeDays} Days
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  Keep sealed in airtight glass container at 38°F (3°C) or below.
                </p>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Freezer Longevity
                  </span>
                  <ThermometerSnowflake className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {kitchenGuide.freezerLifeMonths} Month{kitchenGuide.freezerLifeMonths > 1 ? 's' : ''}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  Vacuum seal or use heavy freezer-grade zip bags with air removed.
                </p>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Estimated Cost / Portion
                  </span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {kitchenGuide.estimatedCostPerServing}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  {kitchenGuide.estimatedRestaurantSavings}
                </p>
              </div>
            </div>

            {/* Container Storage Tip */}
            {kitchenGuide.containerTip && (
              <div className="p-4 bg-sky-50 dark:bg-stone-800 rounded-2xl border border-sky-200 dark:border-stone-700 flex items-start gap-3 text-xs text-stone-800 dark:text-stone-200 font-medium">
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-950 dark:text-sky-200 block font-bold mb-0.5">Master Container Packing Tip:</strong>
                  <span>{kitchenGuide.containerTip}</span>
                </div>
              </div>
            )}

            {/* Reheating Mastery Guide with Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>Reheating Mastery: How to Restore Texture & Moisture</span>
                </h4>
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  Select Method:
                </span>
              </div>

              {/* Method Switcher Buttons */}
              <div className="flex flex-wrap gap-2">
                {kitchenGuide.reheatingInstructions.map((ins, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedReheatMethod(idx)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedReheatMethod === idx
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{ins.method}</span>
                    {ins.recommended && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/20 text-white rounded font-black">
                        Best
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Method Details Box */}
              {kitchenGuide.reheatingInstructions[selectedReheatMethod] && (
                <div className="p-5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Method: {kitchenGuide.reheatingInstructions[selectedReheatMethod].method}
                    </span>
                    {kitchenGuide.reheatingInstructions[selectedReheatMethod].tempOrTime && (
                      <span className="text-xs font-bold px-2.5 py-1 bg-stone-200 dark:bg-stone-700 rounded-lg text-stone-800 dark:text-stone-200">
                        {kitchenGuide.reheatingInstructions[selectedReheatMethod].tempOrTime}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                    {kitchenGuide.reheatingInstructions[selectedReheatMethod].instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Essential Cookware & Equipment Checklist */}
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                  <span>Essential Cookware & Equipment Checklist</span>
                </h4>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {Object.values(checkedEquipment).filter(Boolean).length} of {kitchenGuide.essentialEquipment.length} ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kitchenGuide.essentialEquipment.map((eq, idx) => {
                  const isChecked = !!checkedEquipment[eq.name];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleEquipment(eq.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-stone-100/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                          : 'bg-stone-50 dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-400 dark:border-stone-600 bg-white dark:bg-stone-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="text-xs flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`font-bold ${isChecked ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                            {eq.name}
                          </span>
                          {eq.category && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded">
                              {eq.category}
                            </span>
                          )}
                        </div>
                        {eq.whyNeeded && (
                          <p className="text-stone-500 dark:text-stone-400 text-[11px] font-medium leading-tight">
                            {eq.whyNeeded}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Hands-Free Cooking Companion Modal */}
      <CookingModeModal
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        meal={meal}
        servings={servingsMultiplier}
        onOpenSousChef={onOpenSousChef}
      />
    </div>
  );
};
