import React from 'react';
import { ChefHat, Bookmark, LogIn, LogOut, Sparkles, Sun, Moon, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  savedCount: number;
  onOpenSaved: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onResetToHome: () => void;
  isSigningIn?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  savedCount,
  onOpenSaved,
  onSignIn,
  onSignOut,
  onResetToHome,
  isSigningIn = false,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-300 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <motion.div
          id="app-logo-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:rotate-6 transition-transform">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-stone-100">
                MealCrafter
              </span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                AI
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-stone-600 dark:text-stone-400 font-semibold -mt-0.5">
              Tailored Recipes & Restaurant Guide
            </span>
          </div>
        </motion.div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          <motion.button
            id="theme-toggle-btn"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </motion.button>

          {/* Saved Meals Drawer Trigger */}
          <motion.button
            id="open-saved-meals-btn"
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl border border-stone-300 dark:border-stone-700 transition-all cursor-pointer shadow-xs"
          >
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Saved Meals</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black">
                {savedCount}
              </span>
            )}
          </motion.button>

          {/* User Auth Info / Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-300 dark:border-stone-800">
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700"
                title={user.email || user.displayName || ''}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full border border-amber-500 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-bold text-stone-900 dark:text-stone-100 truncate max-w-[130px]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              <motion.button
                id="sign-out-btn"
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              id="google-sign-in-btn"
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={onSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>{isSigningIn ? 'Signing In...' : 'Sign In'}</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
