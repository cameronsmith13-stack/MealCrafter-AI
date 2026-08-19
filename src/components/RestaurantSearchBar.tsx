import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  Search,
  Navigation,
  DollarSign,
  ArrowRight,
  UtensilsCrossed,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { RestaurantSearchParams } from '../types';

interface RestaurantSearchBarProps {
  onSearch: (params: RestaurantSearchParams) => void;
  isLoading: boolean;
  onLocationDetected?: (coords: { latitude: number; longitude: number; cityOrAddress?: string }) => void;
}

export const PRESET_RESTAURANT_CRAVINGS = [
  { id: 'crispy-hot-honey-chicken', label: '🍗 Crispy Hot Honey Fried Chicken', query: 'Crispy hot honey fried chicken and waffle fries' },
  { id: 'gourmet-smash-burgers', label: '🍔 Double Smash Burgers & Fries', query: 'Gourmet double smash cheeseburger with truffle aioli' },
  { id: 'woodfired-artisan-pizza', label: '🍕 Woodfired Margherita Pizza', query: 'Authentic woodfired Neapolitan sourdough pizza' },
  { id: 'spicy-tonkotsu-ramen', label: '🍜 Rich Spicy Tonkotsu Ramen', query: 'Rich spicy pork broth tonkotsu ramen with chashu' },
  { id: 'authentic-street-tacos', label: '🌮 Authentic Birria & Al Pastor Tacos', query: 'Crispy birria tacos with rich consommé dip' },
  { id: 'fresh-sashimi-poke', label: '🍣 Fresh Salmon & Tuna Poké Bowl', query: 'Fresh salmon poke bowl with spicy mayo and crispy onions' },
];

export const RestaurantSearchBar: React.FC<RestaurantSearchBarProps> = ({
  onSearch,
  isLoading,
  onLocationDetected,
}) => {
  const [query, setQuery] = useState('Crispy hot honey garlic chicken');
  const [cityOrAddress, setCityOrAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'granted' | 'denied' | 'manual'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);

  // 4 Core Restaurant Preference Questions
  const [maxDistance, setMaxDistance] = useState('Within 5 km / 3 mi (Short Drive)');
  const [qualityTier, setQualityTier] = useState('Any Quality Tier');
  const [priceRange, setPriceRange] = useState('Any Price');
  const [diningStyle, setDiningStyle] = useState('Any Service Style');

  // Attempt auto-geolocation on initial mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('manual');
      setLocationError('Geolocation not supported by your browser. Please enter city/suburb below.');
      return;
    }

    setLocationStatus('locating');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setLocationStatus('granted');

        try {
          // Attempt reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                // Nominatim requires a User-Agent
                'User-Agent': 'MealCrafterApp/1.0',
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              const { suburb, city, town, village, state, road } = data.address;
              const area = suburb || city || town || village || '';
              const locationParts = [road, area, state].filter(Boolean);
              if (locationParts.length > 0) {
                const formattedLocation = locationParts.join(', ');
                setCityOrAddress(formattedLocation);
                if (onLocationDetected) {
                  onLocationDetected({ latitude: lat, longitude: lon, cityOrAddress: formattedLocation });
                }
                return; // Return early if successful
              }
            }
          }
        } catch (error) {
          console.warn('Reverse geocoding failed:', error);
        }

        // Fallback if reverse geocoding fails
        if (onLocationDetected) {
          onLocationDetected({ latitude: lat, longitude: lon, cityOrAddress });
        }
      },
      (err) => {
        console.warn('Geolocation access issue:', err.message);
        setLocationStatus('denied');
        setLocationError('Location access was denied or timed out. Enter your city or area below.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    onSearch({
      query: query.trim(),
      location: {
        latitude,
        longitude,
        cityOrAddress: cityOrAddress.trim(),
      },
      maxDistance,
      qualityTier,
      priceRange,
      diningStyle,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-xl border border-stone-300 dark:border-stone-700 p-6 md:p-8 transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-2xl border border-rose-500/20">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Find Nearby Restaurants & Takeout
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 mt-0.5">
            Discover real local spots matching your exact food craving, proximity radius, and dining tier.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Craving Input */}
        <div>
          <label htmlFor="restaurant-query" className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-1.5">
            What are you craving to eat? <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              id="restaurant-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. crispy hot honey chicken, smash burgers, authentic woodfired pizza, tonkotsu ramen..."
              className="w-full pl-4 pr-14 py-3.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm sm:text-base font-semibold"
              disabled={isLoading}
              required
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Location Detection Box */}
        <div className="p-4 bg-stone-100/90 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
              <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Your Search Location</span>
              {locationStatus === 'granted' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> GPS Detected
                </span>
              )}
              {locationStatus === 'locating' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Locating...
                </span>
              )}
            </div>

            <button
              id="detect-gps-btn"
              type="button"
              onClick={detectLocation}
              disabled={locationStatus === 'locating'}
              className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-rose-200 bg-white dark:bg-stone-700 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-rose-600" />
              <span>{locationStatus === 'granted' ? 'Refresh GPS Location' : 'Auto-Detect GPS'}</span>
            </button>
          </div>

          {/* Optional manual location input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input
                id="restaurant-city-input"
                type="text"
                value={cityOrAddress}
                onChange={(e) => setCityOrAddress(e.target.value)}
                placeholder="Or enter city, suburb, or neighborhood (e.g. Melbourne CBD, Austin TX)"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center justify-center sm:justify-start px-1 font-medium">
              {latitude && longitude ? (
                <span>📍 Active: {cityOrAddress || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`}</span>
              ) : (
                <span>📍 Enter city or use GPS</span>
              )}
            </div>
          </div>

          {locationError && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {locationError}
            </p>
          )}
        </div>

        {/* 4 Core Preference Questions */}
        <div className="p-4.5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-200">
              4 Dining Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Distance Radius */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <label htmlFor="distance-filter" className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                1. Max Distance
              </label>
              <select
                id="distance-filter"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Within 2 km / 1.5 mi (Walking Distance)">Within 2 km (Walking)</option>
                <option value="Within 5 km / 3 mi (Short Drive)">Within 5 km (Short Drive)</option>
                <option value="Within 10 km / 6 mi (Neighborhood)">Within 10 km (Neighborhood)</option>
                <option value="Within 25 km / 15 mi (Wider Metro)">Within 25 km (Wider Metro)</option>
              </select>
            </motion.div>

            {/* 2. Restaurant Quality Tier */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <label htmlFor="quality-filter" className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                2. Quality Tier
              </label>
              <select
                id="quality-filter"
                value={qualityTier}
                onChange={(e) => setQualityTier(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Any Quality Tier">Any Quality Tier</option>
                <option value="Fast Food & Quick Bites (e.g. McDonald's, Drive-thru)">Fast Food & Quick Bites</option>
                <option value="Casual Dining & Local Gem ($$)">Casual Dining / Local Gem ($$)</option>
                <option value="Gourmet & High Quality Dining ($$$)">Gourmet & High Quality ($$$)</option>
                <option value="Fine Dining & Chef's Table ($$$$)">Fine Dining & Chef's Table ($$$$)</option>
              </select>
            </motion.div>

            {/* 3. Price / Budget */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <label htmlFor="price-filter" className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                3. Price & Budget
              </label>
              <select
                id="price-filter"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Any Price">Any Price Range</option>
                <option value="$ Budget-Friendly ($5 - $15)">$ Budget-Friendly ($5 - $15)</option>
                <option value="$$ Moderate ($15 - $30)">$$ Moderate ($15 - $30)</option>
                <option value="$$$ Upscale ($30 - $60)">$$$ Upscale ($30 - $60)</option>
                <option value="$$$$ Luxury / Splurge ($60+)">$$$$ Luxury / Splurge ($60+)</option>
              </select>
            </motion.div>

            {/* 4. Service Style */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <label htmlFor="style-filter" className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                4. Dining Style
              </label>
              <select
                id="style-filter"
                value={diningStyle}
                onChange={(e) => setDiningStyle(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Any Service Style">Any Service Style</option>
                <option value="Dine-In (Sit-Down Table Service)">Dine-In (Sit-Down Table)</option>
                <option value="Takeout / Curbside Pickup">Takeout & Pickup</option>
                <option value="Fast Delivery Available">Fast Delivery Available</option>
                <option value="Drive-Thru / Quick On-The-Go">Drive-Thru & On-The-Go</option>
              </select>
            </motion.div>
          </div>
        </div>

        {/* Popular Restaurant Cravings */}
        <div>
          <p className="text-xs font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2">
            Popular Eat-Out Inspirations:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_RESTAURANT_CRAVINGS.map((preset) => (
              <motion.button
                key={preset.id}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setQuery(preset.query)}
                className="text-xs px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl font-bold transition-all cursor-pointer"
              >
                {preset.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <motion.button
            id="find-restaurants-btn"
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading || !query.trim()}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-700 hover:via-red-700 hover:to-amber-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Locating Matching Eateries & Menu Specialties...</span>
              </>
            ) : (
              <>
                <Compass className="w-5 h-5" />
                <span>Find Matching Restaurants Near Me</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
