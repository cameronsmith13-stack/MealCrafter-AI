export interface MealCandidate {
  id: string;
  title: string;
  tagline: string;
  cuisine: string;
  spiceLevel: 'None' | 'Mild' | 'Medium' | 'Hot' | 'Extra Hot' | string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings?: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced' | 'Medium' | string;
  highlights: string[];
  briefDescription: string;
  heroFlavorNotes?: string[];
  keyIngredients?: string[];
  estimatedCookTime?: string;
  complexity?: string;
  imageUrl?: string;
  accentGradient?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  category?: 'Produce' | 'Meat & Seafood' | 'Pantry & Spices' | 'Dairy & Refrigerated' | 'Bakery' | 'Other' | string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
  durationMinutes?: number;
  equipment?: string;
}

export interface HealthInsight {
  score: number; // 1-100
  badge: string; // e.g. "Lean Protein Champion"
  summary: string;
  macroRatio: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
  keyNutrients: {
    name: string;
    amount: string;
    benefit: string;
  }[];
  healthPros: string[];
  healthCons: string[];
  dietarySuitability: string[]; // e.g. "Gluten-Free Friendly", "Keto Adaptable", "High Protein"
  satietyIndex?: number; // 1-100 score
  glycemicImpact?: string; // e.g. "Low (Steady 4-hr energy)"
  digestionSpeed?: string; // e.g. "Gradual & Sustained"
  cookingChemistryInsights?: string[];
  metabolicEffect?: string;
}

export interface SimilarMeal {
  id: string;
  title: string;
  tagline: string;
  whyYoullLoveIt: string;
  prepTimeMinutes: number;
  calories: number;
  cuisine: string;
  spiceLevel: string;
}

export interface BetterAlternativeMeal {
  id: string;
  title: string;
  tagline: string;
  cuisine?: string;
  spiceLevel?: string;
  whyItsBetter: string;
  upgradeAngle: 'Gourmet Culinary Upgrade' | 'Health & Macro Optimization' | 'Time & Efficiency Hack' | 'Flavor Intensity Boost' | string;
  keyImprovements: string[];
  calories: number;
  proteinG: number;
  prepTimeMinutes: number;
}

export interface DrinkPairingDetail {
  alcoholic: string;
  alcoholicNotes?: string;
  nonAlcoholic: string;
  nonAlcoholicNotes?: string;
  servingTemperature?: string;
}

export interface FlavorProfile {
  sweet: number; // 0-100
  salty: number; // 0-100
  sour: number; // 0-100
  umami: number; // 0-100
  bitter: number; // 0-100
  spicy: number; // 0-100
  tastingNotes?: string;
}

export interface KitchenGuide {
  mealPrepRating: number; // 1-100
  mealPrepBadge?: string;
  fridgeLifeDays: number;
  freezerLifeMonths: number;
  containerTip?: string;
  reheatingInstructions: {
    method: 'Oven / Air Fryer' | 'Stovetop' | 'Microwave' | string;
    instructions: string;
    recommended?: boolean;
    tempOrTime?: string;
  }[];
  essentialEquipment: {
    name: string;
    category?: 'Cookware' | 'Prep Tool' | 'Cutlery' | 'Measurement' | string;
    whyNeeded?: string;
  }[];
  estimatedCostPerServing?: string;
  estimatedRestaurantSavings?: string;
  cleanupDifficulty?: 'Minimal (1 Pan)' | 'Moderate (2-3 items)' | 'Complex' | string;
}

export interface ChefSecrets {
  flavorProfile?: FlavorProfile;
  drinkPairings?: DrinkPairingDetail;
  culinaryTechniques?: {
    title: string;
    technique: string;
    whyItWorks: string;
  }[];
  finishingTouches?: string[];
  secretAromatics?: string[];
}

export interface MealDetail {
  id: string;
  title: string;
  tagline: string;
  cuisine: string;
  spiceLevel: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  difficulty: string;
  description: string;
  ingredients: Ingredient[];
  instructions: RecipeStep[];
  healthInsight: HealthInsight;
  similarMeals: SimilarMeal[];
  betterAlternatives: BetterAlternativeMeal[];
  chefSubstitutions: {
    ifMissing: string;
    substituteWith: string;
  }[];
  proTips: string[];
  wineOrDrinkPairing: string;
  chefSecrets?: ChefSecrets;
  kitchenGuide?: KitchenGuide;
  groundingInsights?: {
    culinaryOrigin?: string;
    regionalTraditions?: string;
    sources?: { title: string; uri: string }[];
  };
}

export interface SavedMealRecord {
  id: string;
  userId: string;
  title: string;
  tagline?: string;
  cuisine?: string;
  spiceLevel?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  healthScore?: number;
  healthBadge?: string;
  healthPros?: string[];
  healthCons?: string[];
  ingredients?: Ingredient[];
  instructions?: RecipeStep[];
  similarMeals?: SimilarMeal[];
  betterAlternatives?: BetterAlternativeMeal[];
  notes?: string;
  isFavorite?: boolean;
  hasCooked?: boolean;
  createdAt: string;
  updatedAt?: string;
  fullDetail?: MealDetail;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface RestaurantPlace {
  id: string;
  name: string;
  cuisine: string;
  qualityTier: 'Fast Food & Quick Bites' | 'Casual Dining & Local Gem' | 'Gourmet & High Quality' | 'Fine Dining & Chef Table' | string;
  rating: number; // e.g. 4.6
  reviewCount: number; // e.g. 520
  priceLevel: '$' | '$$' | '$$$' | '$$$$' | string;
  estimatedDistance: string; // e.g. "1.2 km away"
  address: string;
  neighborhood?: string;
  matchedDish: string;
  dishDescription: string;
  dishPrice?: string;
  whyItMatches: string;
  textureNotes?: string;
  diningOptions: string[]; // ["Dine-In", "Takeaway", "Delivery"]
  googleMapsUrl: string;
  highlights: string[];
  phone?: string;
  openNow?: boolean;
}

export interface RestaurantSearchParams {
  query: string;
  location: {
    latitude?: number;
    longitude?: number;
    cityOrAddress?: string;
  };
  maxDistance: string; // "2 km", "5 km", "10 km", "25 km"
  qualityTier: string; // "Fast Food", "Casual", "Gourmet", "Fine Dining"
  priceRange: string; // "$", "$$", "$$$", "$$$$"
  diningStyle: string; // "Dine-In", "Takeaway", "Delivery"
  texturePreference?: string;
  excluded?: string;
}
