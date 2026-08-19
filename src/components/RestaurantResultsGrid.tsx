import React, { useState } from 'react';
import {
  MapPin,
  Star,
  DollarSign,
  ExternalLink,
  Utensils,
  Award,
  Sparkles,
  Heart,
  Car,
  Clock,
  Flame,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import type { RestaurantPlace } from '../types';

interface RestaurantResultsGridProps {
  restaurants: RestaurantPlace[];
  isLoading: boolean;
  query: string;
  onSaveRestaurant?: (restaurant: RestaurantPlace) => void;
  savedRestaurantIds?: string[];
}

export const RestaurantResultsGrid: React.FC<RestaurantResultsGridProps> = ({
  restaurants,
  isLoading,
  query,
  onSaveRestaurant,
  savedRestaurantIds = [],
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShareRestaurant = (place: RestaurantPlace) => {
    const text = `🍽️ ${place.name} (${place.cuisine})\n⭐ Rating: ${place.rating.toFixed(1)}/5 (${place.reviewCount}+ reviews) | ${place.priceLevel}\n📍 ${place.address}\n✨ Recommended Dish: ${place.matchedDish} (${place.dishPrice || ''})\n🗺️ Directions: ${place.googleMapsUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(place.id);
    setTimeout(() => setCopiedId(null), 2500);
  };
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
          className="inline-block p-4 bg-rose-500/10 rounded-full mb-4"
        >
          <Utensils className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </motion.div>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
          Scanning Nearby Menus & Local Spots...
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-md mx-auto">
          Comparing distance, quality tiers, and authentic dish matches for "{query}"
        </p>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>🍽️ Nearby Dining Matches</span>
            <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold rounded-full border border-rose-500/20">
              {restaurants.length} Places Found
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 mt-0.5">
            Curated according to your location, requested quality tier, and taste craving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((place, index) => {
          const isSaved = savedRestaurantIds.includes(place.id);
          const isFastFood = place.qualityTier?.toLowerCase().includes('fast food');
          const isFineDining = place.qualityTier?.toLowerCase().includes('fine dining');
          const isGourmet = place.qualityTier?.toLowerCase().includes('gourmet');

          const qualityBadgeColor = isFineDining
            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
            : isGourmet
            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
            : isFastFood
            ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30'
            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';

          return (
            <motion.div
              key={place.id}
              id={`restaurant-card-${place.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-300 dark:border-stone-700 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden p-6 relative group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${qualityBadgeColor}`}>
                      {place.qualityTier}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-md border border-stone-200 dark:border-stone-700">
                      {place.priceLevel}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-black text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
                    <MapPin className="w-3.5 h-3.5" />
                    {place.estimatedDistance}
                  </span>
                </div>

                {/* Restaurant Name & Ratings */}
                <div className="mb-3">
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-stone-600 dark:text-stone-400 mt-1">
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {place.rating.toFixed(1)}
                      <span className="text-stone-500 dark:text-stone-400 font-normal">({place.reviewCount}+)</span>
                    </span>
                    <span>•</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">{place.cuisine}</span>
                    {place.openNow && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Open Now
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Address & Neighborhood */}
                <div className="text-xs text-stone-600 dark:text-stone-400 mb-4 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>

                {/* Recommended / Matched Dish Showcase */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 mb-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended Signature Match
                    </span>
                    {place.dishPrice && (
                      <span className="text-xs font-black text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-700 px-2 py-0.5 rounded-md shadow-xs border border-stone-200 dark:border-stone-600">
                        {place.dishPrice}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
                    {place.matchedDish}
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2">
                    {place.dishDescription}
                  </p>

                  {/* Why it matches */}
                  <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-700 flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      <strong className="font-bold text-stone-900 dark:text-stone-100">Why it matches: </strong>
                      {place.whyItMatches}
                    </p>
                  </div>

                  {place.textureNotes && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                      <Layers className="w-3 h-3 text-stone-500" />
                      <span><strong className="font-semibold">Texture Profile:</strong> {place.textureNotes}</span>
                    </div>
                  )}
                </div>

                {/* Highlights and service options */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {place.diningOptions.map((opt) => (
                    <span
                      key={opt}
                      className="text-[11px] font-semibold px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-md border border-stone-200 dark:border-stone-700"
                    >
                      {opt}
                    </span>
                  ))}
                  {place.highlights.slice(0, 2).map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 rounded-md border border-amber-500/20"
                    >
                      ★ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
                <motion.a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </motion.a>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShareRestaurant(place)}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
                  title="Share Restaurant Info"
                >
                  {copiedId === place.id ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>

                {onSaveRestaurant && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSaveRestaurant(place)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-300 dark:border-rose-800'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                    title={isSaved ? 'Saved in your library' : 'Save Restaurant'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
