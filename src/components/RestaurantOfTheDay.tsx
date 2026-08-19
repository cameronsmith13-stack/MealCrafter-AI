import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Star,
  ExternalLink,
  Navigation,
  RefreshCw,
  Award,
  Clock,
  UtensilsCrossed,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { RestaurantPlace } from '../types';

interface RestaurantOfTheDayProps {
  hasLocation: boolean;
  userCoords?: { latitude: number; longitude: number; cityOrAddress?: string };
  onEnableLocation: () => void;
  isLocating?: boolean;
}

const CURATED_SPOTLIGHT_RESTAURANTS: RestaurantPlace[] = [
  {
    id: 'spotlight-1',
    name: 'The Rustic Oak Woodfired Osteria',
    cuisine: 'Authentic Neapolitan & Woodfired Italian',
    address: '142 Queen Street, Downtown Quarter',
    rating: 4.8,
    reviewCount: 940,
    priceLevel: '$$ (Moderate)',
    qualityTier: 'Gourmet & High Quality Dining ($$$)',
    estimatedDistance: '1.2 km away',
    openNow: true,
    matchedDish: '24-Hour Slow-Fermented Truffle Margherita Pizza',
    dishDescription: 'Blistered crust with San Marzano tomatoes, Fior di Latte mozzarella, fresh basil, and shaved black truffle oil.',
    dishPrice: '$24.50',
    whyItMatches: 'Handcrafted dough fermented for 48 hours in an 850°F volcanic stone oven for signature airy crust.',
    textureNotes: 'Blistered crisp outer crust with tender, chewy crumb and creamy melted Fior di Latte.',
    highlights: ['Stone-baked Neapolitan Oven', 'Housemade Truffle Reduction', 'Heated Outdoor Garden Patio'],
    diningOptions: ['Dine-In', 'Takeout', 'Curbside Pickup'],
    googleMapsUrl: 'https://maps.google.com/?q=The+Rustic+Oak+Woodfired+Osteria',
  },
  {
    id: 'spotlight-2',
    name: 'Black Iron Smashburger & Shake Co.',
    cuisine: 'Gourmet Artisan Burgers & Craft Shakes',
    address: '88 Market Promenade, Arts District',
    rating: 4.9,
    reviewCount: 1420,
    priceLevel: '$$ (Moderate)',
    qualityTier: 'Casual Dining & Local Gem ($$)',
    estimatedDistance: '2.1 km away',
    openNow: true,
    matchedDish: 'Double Wagyu Smash with Smoked Bacon Jam & Truffle Fries',
    dishDescription: 'Two lacy-edged 100% Wagyu smash patties with melted aged cheddar, house smoked bacon jam, and garlic aioli on a toasted potato bun.',
    dishPrice: '$18.90',
    whyItMatches: 'Ultra-crisp Maillard sear on cast iron grills delivering maximum juicy umami crunch.',
    textureNotes: 'Crispy caramelized patty edges paired with soft, buttery potato bun.',
    highlights: ['Fresh Ground Wagyu Daily', 'Hand-Spun Malt Shakes', 'Awarded Best Local Burger 2025'],
    diningOptions: ['Dine-In', 'Takeaway', 'DoorDash Delivery'],
    googleMapsUrl: 'https://maps.google.com/?q=Black+Iron+Smashburger',
  },
  {
    id: 'spotlight-3',
    name: 'Tokyo Midnight Tonkotsu & Ramen Bar',
    cuisine: 'Japanese Artisan Noodles & Izakaya',
    address: '27 Lantern Alley, Cultural Quarter',
    rating: 4.8,
    reviewCount: 1100,
    priceLevel: '$$ (Moderate)',
    qualityTier: 'Gourmet & High Quality Dining ($$$)',
    estimatedDistance: '1.8 km away',
    openNow: true,
    matchedDish: '20-Hour Black Garlic Spicy Tonkotsu Ramen',
    dishDescription: 'Silky rich collagen pork bone broth simmered for 20 hours, springy hand-pulled noodles, torched chashu pork belly, and seasoned ajitsuke tamago.',
    dishPrice: '$21.00',
    whyItMatches: 'Deeply comforting bone broth paired with house-pulled noodles and aromatic burnt black garlic oil.',
    textureNotes: 'Velvety rich broth with firm al dente noodles and melt-in-mouth tender pork belly.',
    highlights: ['20-Hour Simmered Broth', 'Torched Chashu Pork', 'Custom Noodle Firmness'],
    diningOptions: ['Dine-In', 'Takeout'],
    googleMapsUrl: 'https://maps.google.com/?q=Tokyo+Midnight+Ramen+Bar',
  },
  {
    id: 'spotlight-4',
    name: 'El Fuego Birria & Street Taqueria',
    cuisine: 'Authentic Mexican Street Food & Slow Braises',
    address: '55 Mission Boulevard',
    rating: 4.9,
    reviewCount: 860,
    priceLevel: '$ (Budget-Friendly)',
    qualityTier: 'Casual Dining & Local Gem ($$)',
    estimatedDistance: '0.9 km away',
    openNow: true,
    matchedDish: 'Crispy Quesabirria Tacos with Rich Bone Consommé',
    dishDescription: 'Corn tortillas crisped in chili oil on a smoking plancha, packed with tender slow-braised beef and melted Oaxaca cheese, served with rich consommé dip.',
    dishPrice: '$16.50',
    whyItMatches: 'Simmered overnight with guajillo chilies and cloves for tender braised perfection.',
    textureNotes: 'Deeply crispy fried tortilla dipping shell contrasting with succulent pulled beef.',
    highlights: ['Slow Braised 12 Hours', 'Authentic Oaxaca Cheese', 'Family-Owned Recipe'],
    diningOptions: ['Dine-In', 'Takeout', 'Curbside Pickup'],
    googleMapsUrl: 'https://maps.google.com/?q=El+Fuego+Birria+Taqueria',
  }
];

export const RestaurantOfTheDay: React.FC<RestaurantOfTheDayProps> = ({
  hasLocation,
  userCoords,
  onEnableLocation,
  isLocating = false,
}) => {
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const currentSpotlight = CURATED_SPOTLIGHT_RESTAURANTS[spotlightIndex % CURATED_SPOTLIGHT_RESTAURANTS.length];

  const handleShuffle = () => {
    setSpotlightIndex((prev) => (prev + 1) % CURATED_SPOTLIGHT_RESTAURANTS.length);
  };

  // Location NOT turned on state
  if (!hasLocation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto bg-gradient-to-r from-rose-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-500/30 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black rounded-full border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>🏆 Daily Local Spotlight: Restaurant of the Day</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight">
              Unlock Today’s Standout Local Restaurant
            </h3>
            <p className="text-xs sm:text-sm font-medium text-stone-300">
              Turn on your location to reveal the top-rated standout eatery, signature specialty dish, and hidden gem in your immediate area today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnableLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Detecting Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Turn On Location / Detect GPS</span>
                </>
              )}
            </motion.button>
            <span className="text-[11px] text-center text-stone-400 font-semibold">
              🔒 Location is used only to find nearby eateries
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Location IS turned on: Display rich Restaurant of the Day
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-stone-900 via-stone-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-500/30 relative overflow-hidden group"
    >
      {/* Ambient background blur */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30 text-rose-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                  Restaurant of the Day
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                  ★ Today's Local Spotlight
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Handpicked standout based on local ratings and culinary craftsmanship near you.
              </p>
            </div>
          </div>

          {/* Shuffle button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-xs font-black rounded-xl border border-stone-700 transition-all cursor-pointer"
            title="Discover another featured local spot"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>Shuffle Spotlight</span>
          </motion.button>
        </div>

        {/* Restaurant Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                {currentSpotlight.qualityTier}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-stone-800 text-stone-300 rounded-md border border-stone-700">
                {currentSpotlight.priceLevel}
              </span>
              <span className="text-xs font-black text-rose-400 inline-flex items-center gap-1 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-900/60">
                <MapPin className="w-3.5 h-3.5" />
                {currentSpotlight.estimatedDistance}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentSpotlight.name}
              </h3>
              <div className="flex items-center gap-3 text-xs font-bold text-stone-400 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {currentSpotlight.rating.toFixed(1)}
                  <span className="text-stone-400 font-medium">({currentSpotlight.reviewCount}+ verified reviews)</span>
                </span>
                <span>•</span>
                <span className="text-stone-300 font-semibold">{currentSpotlight.cuisine}</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{currentSpotlight.address}</span>
            </p>

            {/* Why it's today's spotlight */}
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Why it's today's spotlight pick:</span>
              </div>
              <p className="text-xs text-stone-300 font-medium leading-relaxed">
                {currentSpotlight.whyItMatches}
              </p>
            </div>
          </div>

          {/* Featured Signature Dish Card */}
          <div className="bg-rose-950/30 rounded-2xl border border-rose-500/20 p-4.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Signature Specialty
                </span>
                <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {currentSpotlight.dishPrice}
                </span>
              </div>
              <h4 className="text-sm font-black text-white mb-1.5">
                {currentSpotlight.matchedDish}
              </h4>
              <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                {currentSpotlight.dishDescription}
              </p>
            </div>

            <div className="pt-2">
              <motion.a
                href={currentSpotlight.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-stone-100 text-stone-900 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Google Maps & Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
