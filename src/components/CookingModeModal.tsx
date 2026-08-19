import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Sparkles,
  Volume2,
  Clock,
  Utensils,
  Award,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import type { MealDetail, RecipeStep } from '../types';
import { playCookingTimerAlarm } from '../utils/audioTimer';

interface CookingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealDetail;
  servings: number;
  onOpenSousChef: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  isOpen,
  onClose,
  meal,
  servings,
  onOpenSousChef,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTotal, setTimerTotal] = useState<number>(0);

  const steps = meal.instructions || [];
  const currentStep = steps[currentStepIndex] || {
    stepNumber: 1,
    instruction: 'Prepare ingredients and preheat cookware.',
  };

  // When step changes, if step has durationMinutes, initialize timer
  useEffect(() => {
    if (currentStep.durationMinutes && currentStep.durationMinutes > 0) {
      const totalSec = currentStep.durationMinutes * 60;
      setTimerTotal(totalSec);
      setTimerSeconds(totalSec);
      setIsTimerRunning(false);
    } else {
      setTimerTotal(0);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex]);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playCookingTimerAlarm();
            confetti({ particleCount: 35, spread: 50, origin: { y: 0.5 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentStepIndex < steps.length - 1) {
          handleNextStep();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    setCompletedSteps((prev) => ({ ...prev, [currentStepIndex]: true }));
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all steps
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const toggleStepComplete = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const formatTimerDisplay = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const isFinalStep = currentStepIndex === steps.length - 1;
  const isAllComplete = Object.keys(completedSteps).length === steps.length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md text-stone-100 flex flex-col justify-between animate-fadeIn overflow-y-auto">
      {/* Top Navbar */}
      <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/60 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                Live Kitchen Cook Mode
              </span>
              <span className="text-xs text-stone-400">Serves {servings}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white truncate max-w-xs sm:max-w-md">
              {meal.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSousChef}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ask AI Sous Chef</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            title="Exit Cook Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-900 h-2">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-r-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Indicators Dots */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 flex items-center justify-center gap-2 overflow-x-auto py-2">
        {steps.map((s, idx) => {
          const isDone = !!completedSteps[idx];
          const isCurrent = idx === currentStepIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-105'
                  : isDone
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-stone-900 text-stone-500 border border-stone-800 hover:border-stone-700'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : null}
              <span>Step {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Focus Area: Step Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-stone-900/90 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-2xl space-y-6"
          >
            {/* Step Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  {currentStepIndex + 1}
                </span>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <p className="text-xs text-stone-400 font-semibold">
                    {currentStep.equipment ? `Equipment: ${currentStep.equipment}` : 'Cooking Step'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleStepComplete(currentStepIndex)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  completedSteps[currentStepIndex]
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
                    : 'bg-stone-800 text-stone-400 border border-stone-700 hover:text-stone-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedSteps[currentStepIndex] ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>

            {/* Step Instruction text in large easy-to-read font */}
            <p className="text-xl sm:text-2xl md:text-3xl text-stone-100 font-medium leading-relaxed tracking-tight">
              {currentStep.instruction}
            </p>

            {/* Chef Tip if available */}
            {currentStep.tip && (
              <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-800/60 text-amber-200 text-sm font-medium flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">Chef's Secret Technique:</strong>
                  <span>{currentStep.tip}</span>
                </div>
              </div>
            )}

            {/* Interactive Step Timer if duration present or manual timer */}
            <div className="p-4 sm:p-5 bg-stone-950/70 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    Step Cooking Timer
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-mono text-white tracking-widest">
                      {formatTimerDisplay(timerSeconds)}
                    </span>
                    {isTimerRunning && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Timer</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Timer</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(timerTotal || 300);
                  }}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                {/* Preset +1 min button */}
                <button
                  type="button"
                  onClick={() => setTimerSeconds((prev) => prev + 60)}
                  className="px-2.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold border border-stone-700 transition-colors cursor-pointer"
                >
                  +1 min
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Controls */}
      <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-900/80 sticky bottom-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 font-bold text-sm border border-stone-700 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </motion.button>

          <div className="text-center hidden sm:block">
            <span className="text-xs text-stone-400 font-semibold block">
              Tip: Use Left/Right Arrow keys on your keyboard
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleNextStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm shadow-lg transition-all cursor-pointer ${
              isFinalStep
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/40'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-amber-950/40'
            }`}
          >
            <span>{isFinalStep ? 'Complete Dish! 🎉' : 'Next Step'}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
