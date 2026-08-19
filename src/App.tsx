import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AppModeToggle, type AppMode } from './components/AppModeToggle';
import { MealSearchBar } from './components/MealSearchBar';
import { RestaurantSearchBar } from './components/RestaurantSearchBar';
import { RestaurantOfTheDay } from './components/RestaurantOfTheDay';
import { RestaurantResultsGrid } from './components/RestaurantResultsGrid';
import { MealOfTheDay } from './components/MealOfTheDay';
import { MealCandidatesGrid } from './components/MealCandidatesGrid';
import { MealDetailView } from './components/MealDetailView';
import { SousChefChat } from './components/SousChefChat';
import { SavedMealsDrawer } from './components/SavedMealsDrawer';
import { motion, AnimatePresence } from 'motion/react';
import {
  auth,
  signInWithGoogle,
  logOut,
  saveMeal,
  removeSavedMeal,
  updateSavedMealStatus,
  subscribeToSavedMeals,
} from './lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { MealCandidate, MealDetail, SavedMealRecord, RestaurantPlace, RestaurantSearchParams } from './types';
import {
  PRELOADED_PRESETS,
  getPreloadedCandidatesForQuery,
  getPreloadedDetailForCandidate,
} from './data/preloadedMeals';
import {
  ChefHat,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  HeartPulse,
  Flame,
  Utensils,
  Check,
  Zap,
  Award
} from 'lucide-react';

export default function App() {
  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('meal_crafter_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('meal_crafter_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // App Mode: 'cook' (Cook It Yourself) vs 'restaurants' (Find Nearby Restaurants)
  const [appMode, setAppMode] = useState<AppMode>('cook');

  // Search Form State (Cook at home)
  const [query, setQuery] = useState(PRELOADED_PRESETS[0].query);
  const [excluded, setExcluded] = useState(PRELOADED_PRESETS[0].excluded);
  const [diet, setDiet] = useState('');
  const [texturePreference, setTexturePreference] = useState('');
  const [spicePreference, setSpicePreference] = useState('Medium');
  const [maxCookTime, setMaxCookTime] = useState(0);

  // App Data State - Initialized with preloaded candidates so results appear immediately!
  const [candidates, setCandidates] = useState<MealCandidate[]>(PRELOADED_PRESETS[0].candidates);
  const [selectedMeal, setSelectedMeal] = useState<MealDetail | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(undefined);
  const [savedMeals, setSavedMeals] = useState<SavedMealRecord[]>([]);

  // Restaurant Finder & Restaurant of the Day State
  const [restaurants, setRestaurants] = useState<RestaurantPlace[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [lastRestaurantQuery, setLastRestaurantQuery] = useState('Crispy hot honey garlic chicken');
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<string[]>([]);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number; cityOrAddress?: string } | undefined>(undefined);
  const [hasLocation, setHasLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Auto-detect geolocation on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setHasLocation(true);
        },
        () => {
          // silently handle denied
        },
        { timeout: 6000 }
      );
    }
  }, []);

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported in this environment.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setHasLocation(true);
        setIsLocating(false);
        showToast('📍 Location detected! Unlocked Restaurant of the Day.');
      },
      (err) => {
        setIsLocating(false);
        showToast('Location permission is needed to unlock your local restaurant spotlight.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Meal of the Day State
  const allCuratedCandidates = PRELOADED_PRESETS.flatMap((p) => p.candidates);
  const [dailySpecialIndex, setDailySpecialIndex] = useState(0);
  const mealOfTheDay = allCuratedCandidates[dailySpecialIndex % allCuratedCandidates.length] || PRELOADED_PRESETS[0].candidates[0];

  const handleShuffleMealOfTheDay = () => {
    setDailySpecialIndex((prev) => (prev + 1) % allCuratedCandidates.length);
  };

  // Loading & Error States
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Drawers / Panels
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isSousChefOpen, setIsSousChefOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Saved Meals for authenticated user
  useEffect(() => {
    if (!user) {
      setSavedMeals([]);
      return;
    }

    const unsubscribe = subscribeToSavedMeals(
      user.uid,
      (meals) => {
        setSavedMeals(meals);
      },
      (error) => {
        console.error('Error fetching saved meals:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle 1-Click Popular Inspiration Preset (Instant Preloaded Response)
  const handleSelectPreset = (presetQuery: string, presetExcluded: string) => {
    setQuery(presetQuery);
    setExcluded(presetExcluded);
    setSelectedMeal(null);
    setSelectedCandidateId(undefined);
    setErrorMessage(null);

    const preloaded = getPreloadedCandidatesForQuery(presetQuery, presetExcluded);
    if (preloaded && preloaded.length > 0 && !texturePreference && !diet && maxCookTime === 0) {
      setCandidates(preloaded);
    } else {
      handleSearch();
    }
  };

  // Execute Search for Recipe Candidates (Cook at Home)
  const handleSearch = async () => {
    if (!query.trim()) return;

    // Check if query matches one of our preloaded presets
    const preloaded = getPreloadedCandidatesForQuery(query, excluded);
    if (preloaded && preloaded.length > 0 && !diet && !texturePreference && maxCookTime === 0) {
      setCandidates(preloaded);
      setSelectedMeal(null);
      setSelectedCandidateId(undefined);
      setErrorMessage(null);
      return;
    }

    setIsLoadingSearch(true);
    setErrorMessage(null);
    setSelectedMeal(null);
    setSelectedCandidateId(undefined);

    try {
      const response = await fetch('/api/meals/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          excluded: excluded.trim(),
          diet,
          texturePreference,
          spicePreference,
          maxCookTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to craft meals from Gemini API');
      }

      const data = await response.json();
      if (data.meals && Array.isArray(data.meals)) {
        setCandidates(data.meals);
      } else {
        throw new Error('No meal candidates were generated. Please try adjusting your prompt.');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      const fallback = getPreloadedCandidatesForQuery(query, excluded);
      if (fallback) {
        setCandidates(fallback);
      } else {
        setErrorMessage(err.message || 'An error occurred while generating meal options.');
      }
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Execute Search for Nearby Restaurants
  const handleRestaurantSearch = async (params: RestaurantSearchParams) => {
    setIsLoadingRestaurants(true);
    setErrorMessage(null);
    setLastRestaurantQuery(params.query);

    try {
      const response = await fetch('/api/restaurants/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to find nearby restaurants');
      }

      const data = await response.json();
      if (data.restaurants && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
        setRestaurants(data.restaurants);
      } else {
        throw new Error('No matching restaurants found. Try widening your distance radius.');
      }
    } catch (err: any) {
      console.error('Restaurant search error:', err);
      setErrorMessage(err.message || 'Failed to search for nearby restaurants.');
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  // Handle Saving a Restaurant
  const handleSaveRestaurant = (restaurant: RestaurantPlace) => {
    if (!user) {
      showToast('Please sign in with Google to save restaurants to your library!');
      return;
    }

    if (savedRestaurantIds.includes(restaurant.id)) {
      setSavedRestaurantIds((prev) => prev.filter((id) => id !== restaurant.id));
      showToast(`Removed "${restaurant.name}" from saved places`);
    } else {
      setSavedRestaurantIds((prev) => [...prev, restaurant.id]);
      showToast(`⭐ Saved "${restaurant.name}" to your favorite dining spots!`);
    }
  };

  // Inspect / Load Full Recipe & Insights for a Candidate
  const handleSelectCandidate = async (candidate: MealCandidate) => {
    setSelectedCandidateId(candidate.id);
    setErrorMessage(null);

    // Check for preloaded detail first (instant response)
    const preloadedDetail = getPreloadedDetailForCandidate(candidate.id || candidate.title);
    if (preloadedDetail) {
      setSelectedMeal(preloadedDetail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoadingDetail(true);
    try {
      const response = await fetch('/api/meals/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealTitle: candidate.title,
          userQuery: query,
          excluded,
          cuisine: candidate.cuisine,
          spiceLevel: candidate.spiceLevel,
          brief: candidate.tagline || candidate.briefDescription,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to load recipe details');
      }

      const detail: MealDetail = await response.json();
      detail.id = candidate.id;
      setSelectedMeal(detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Detail error:', err);
      const fallback = getPreloadedDetailForCandidate(candidate.title);
      if (fallback) {
        setSelectedMeal(fallback);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(err.message || 'Could not load recipe details.');
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Switch to an alternative / upgraded meal
  const handleSelectAlternative = async (altTitle: string, altBrief?: string) => {
    setErrorMessage(null);

    // Check preloaded first
    const preloadedAlt = getPreloadedDetailForCandidate(altTitle);
    if (preloadedAlt) {
      setSelectedMeal(preloadedAlt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Now viewing recipe for "${altTitle}"`);
      return;
    }

    setIsLoadingDetail(true);
    try {
      const response = await fetch('/api/meals/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealTitle: altTitle,
          userQuery: query,
          excluded,
          brief: altBrief,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load alternative recipe');
      }

      const detail: MealDetail = await response.json();
      setSelectedMeal(detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Now viewing recipe for "${altTitle}"`);
    } catch (err: any) {
      console.error('Alternative error:', err);
      setErrorMessage(err.message || 'Failed to switch to alternative recipe.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Google Sign-In Handler
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        showToast(`Welcome, ${loggedUser.displayName || loggedUser.email || 'Chef'}!`);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        showToast('Sign-in popup was closed.');
      } else if (err.code === 'auth/popup-blocked') {
        showToast('Popup blocked by browser. Redirecting...');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        showToast(`Sign in error: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // Google Sign-Out Handler
  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('Signed out successfully.');
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  // Save Meal Handler
  const handleSaveMeal = async (mealToSave: MealDetail, notes?: string) => {
    let activeUser = user;
    if (!activeUser) {
      try {
        activeUser = await signInWithGoogle();
      } catch (e) {
        showToast('Please sign in with Google to save meals to your account.');
        return;
      }
    }

    if (!activeUser) return;

    setIsSaving(true);
    try {
      await saveMeal(activeUser.uid, mealToSave, notes);
      showToast(`"${mealToSave.title}" saved to your meals!`);
    } catch (err: any) {
      console.error('Save error:', err);
      showToast(`Failed to save meal: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Saved Meal
  const handleDeleteSavedMeal = async (mealId: string) => {
    if (!user) return;
    try {
      await removeSavedMeal(user.uid, mealId);
      showToast('Meal removed from your saved list.');
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (mealId: string, current: boolean) => {
    if (!user) return;
    try {
      await updateSavedMealStatus(user.uid, mealId, { isFavorite: !current });
    } catch (err: any) {
      console.error('Favorite update error:', err);
    }
  };

  // Toggle Cooked
  const handleToggleCooked = async (mealId: string, current: boolean) => {
    if (!user) return;
    try {
      await updateSavedMealStatus(user.uid, mealId, { hasCooked: !current });
      showToast(!current ? 'Marked as cooked! Great job Chef!' : 'Marked as un-cooked.');
    } catch (err: any) {
      console.error('Cooked status error:', err);
    }
  };

  // Update Notes on Saved Meal
  const handleUpdateNotes = async (mealId: string, notes: string) => {
    if (!user) return;
    try {
      await updateSavedMealStatus(user.uid, mealId, { notes });
      showToast('Personal notes updated.');
    } catch (err: any) {
      console.error('Notes error:', err);
    }
  };

  // Open a saved meal from the library
  const handleSelectSavedMeal = (saved: SavedMealRecord) => {
    if (saved.fullDetail) {
      setSelectedMeal(saved.fullDetail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSelectAlternative(saved.title, saved.tagline);
    }
  };

  const isCurrentMealSaved = selectedMeal
    ? savedMeals.some((m) => m.id === selectedMeal.id || m.title === selectedMeal.title)
    : false;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-950">
      {/* Top Header */}
      <Header
        user={user}
        savedCount={savedMeals.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isSigningIn={isSigningIn}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onResetToHome={() => {
          setSelectedMeal(null);
          setQuery(PRELOADED_PRESETS[0].query);
          setExcluded(PRELOADED_PRESETS[0].excluded);
          setCandidates(PRELOADED_PRESETS[0].candidates);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl shadow-2xl border border-stone-800 dark:border-stone-200 text-sm font-bold animate-slideUp">
          <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Top 2-Button Switcher: Cook Yourself vs Find Restaurants */}
        <AppModeToggle
          mode={appMode}
          setMode={(m) => {
            setAppMode(m);
            setSelectedMeal(null);
            setErrorMessage(null);
          }}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-rose-900 dark:text-rose-200 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <strong className="block font-bold text-rose-950 dark:text-rose-100">Notice</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {appMode === 'cook' ? (
            /* COOK IT YOURSELF MODE */
            selectedMeal ? (
              <motion.div
                key="recipe-detail-view"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <MealDetailView
                  meal={selectedMeal}
                  onBack={() => setSelectedMeal(null)}
                  onSelectAlternative={handleSelectAlternative}
                  onSaveMeal={handleSaveMeal}
                  isSaved={isCurrentMealSaved}
                  isSaving={isSaving}
                  onOpenSousChef={() => setIsSousChefOpen(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="cook-dashboard"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="space-y-8"
              >
                {/* Meal of the Day Feature Card */}
                <MealOfTheDay
                  meal={mealOfTheDay}
                  onSelectMeal={handleSelectCandidate}
                  onShuffleMealOfTheDay={handleShuffleMealOfTheDay}
                  isLoading={isLoadingDetail}
                />

                {/* Craving Search & Exclusions Engine with Texture Preference */}
                <MealSearchBar
                  query={query}
                  setQuery={setQuery}
                  excluded={excluded}
                  setExcluded={setExcluded}
                  diet={diet}
                  setDiet={setDiet}
                  texturePreference={texturePreference}
                  setTexturePreference={setTexturePreference}
                  spicePreference={spicePreference}
                  setSpicePreference={setSpicePreference}
                  maxCookTime={maxCookTime}
                  setMaxCookTime={setMaxCookTime}
                  onSearch={handleSearch}
                  onSelectPreset={handleSelectPreset}
                  isLoading={isLoadingSearch}
                />

                {/* Meal Candidates Results Grid */}
                {candidates.length > 0 && (
                  <MealCandidatesGrid
                    candidates={candidates}
                    onSelectMeal={handleSelectCandidate}
                    selectedMealId={selectedCandidateId}
                    isLoadingDetail={isLoadingDetail}
                  />
                )}
              </motion.div>
            )
          ) : (
            /* FIND RESTAURANTS MODE */
            <motion.div
              key="restaurants-dashboard"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="space-y-8"
            >
              {/* Restaurant of the Day (Needs location turned on) */}
              <RestaurantOfTheDay
                hasLocation={hasLocation}
                userCoords={userCoords}
                onEnableLocation={handleEnableLocation}
                isLocating={isLocating}
              />

              <RestaurantSearchBar
                onSearch={handleRestaurantSearch}
                isLoading={isLoadingRestaurants}
                onLocationDetected={(coords) => {
                  setUserCoords(coords);
                  setHasLocation(true);
                }}
              />

              <RestaurantResultsGrid
                restaurants={restaurants}
                isLoading={isLoadingRestaurants}
                query={lastRestaurantQuery}
                onSaveRestaurant={handleSaveRestaurant}
                savedRestaurantIds={savedRestaurantIds}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Slide-Over: Saved Meals Library */}
      <SavedMealsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedMeals={savedMeals}
        onSelectMeal={handleSelectSavedMeal}
        onDeleteMeal={handleDeleteSavedMeal}
        onToggleFavorite={handleToggleFavorite}
        onToggleCooked={handleToggleCooked}
        onUpdateNotes={handleUpdateNotes}
        user={user}
        onSignIn={handleSignIn}
        isSigningIn={isSigningIn}
      />

      {/* Slide-Over: AI Sous Chef Chat Assistant */}
      <SousChefChat
        isOpen={isSousChefOpen}
        onClose={() => setIsSousChefOpen(false)}
        currentMeal={selectedMeal}
      />
    </div>
  );
}
