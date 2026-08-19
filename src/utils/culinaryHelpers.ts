import type { MealDetail, ChefSecrets, KitchenGuide, FlavorProfile, DrinkPairingDetail } from '../types';

/**
 * Derives or fills Chef Secrets & Pairings if not explicitly provided by the AI payload.
 */
export function getChefSecrets(meal: MealDetail): ChefSecrets {
  if (meal.chefSecrets && meal.chefSecrets.flavorProfile) {
    return meal.chefSecrets;
  }

  const spice = meal.spiceLevel?.toLowerCase() || 'mild';
  const cuisine = meal.cuisine?.toLowerCase() || 'fusion';
  const isSpicy = spice.includes('hot') || spice.includes('medium') || spice.includes('fiery');
  const isSweet = meal.title.toLowerCase().includes('honey') || meal.title.toLowerCase().includes('sweet') || meal.title.toLowerCase().includes('teriyaki');
  const isAsian = cuisine.includes('asian') || cuisine.includes('korean') || cuisine.includes('japanese') || cuisine.includes('thai') || cuisine.includes('chinese');
  const isItalian = cuisine.includes('italian') || cuisine.includes('mediterranean');
  const isMexican = cuisine.includes('mexican') || cuisine.includes('latin');

  // Compute flavor radar
  const flavorProfile: FlavorProfile = {
    sweet: isSweet ? 75 : 35,
    salty: isAsian ? 70 : 55,
    sour: isMexican ? 65 : isAsian ? 60 : 40,
    umami: isAsian ? 90 : isItalian ? 85 : 75,
    bitter: 20,
    spicy: isSpicy ? 80 : 30,
    tastingNotes: `Balanced interplay between ${isUmamiRich(meal) ? 'deep caramelized umami' : 'savory proteins'}, ${isSweet ? 'sweet clover notes' : 'earthy aromatics'}, and ${isSpicy ? 'zesty capsaicin tingling' : 'rounded herbal freshness'}.`,
  };

  // Compute drink pairings
  let drinkPairings: DrinkPairingDetail;
  if (isSpicy && isSweet) {
    drinkPairings = {
      alcoholic: 'Off-Dry German Riesling (Kabinett) or Crisp Citrus Hazy IPA',
      alcoholicNotes: 'Residual fruit sweetness calms capsaicin heat, while high acidity cuts through rich garlic oils and honey glaze.',
      nonAlcoholic: 'Sparkling Yuzu Ginger Beer with Crushed Mint & Lime',
      nonAlcoholicNotes: 'Effervescent bubbles lift spicy oils off the palate; ginger and citrus amplify aromatic freshness.',
      servingTemperature: '44°F - 48°F (6°C - 9°C) Chilled',
    };
  } else if (isItalian) {
    drinkPairings = {
      alcoholic: 'Chianti Classico DOCG or Crisp Pinot Grigio',
      alcoholicNotes: 'Bright sangiovese acidity matches tomato depth and cuts through olive oil and savory parmesan.',
      nonAlcoholic: 'Blood Orange San Pellegrino with Fresh Rosemary Sprig',
      nonAlcoholicNotes: 'Zesty herbal citrus balances savory Mediterranean herbs and garlic.',
      servingTemperature: '60°F (16°C) for Red / 46°F (8°C) for White',
    };
  } else if (isMexican) {
    drinkPairings = {
      alcoholic: 'Cold Mexican Pale Lager with Salt Rim or Smoky Mezcal Paloma',
      alcoholicNotes: 'Crisp corn-malt carbonation scrubs savory fats; smoky agave highlights cumin and roasted chilies.',
      nonAlcoholic: 'Chilled Agua de Jamaica (Hibiscus Cinnamon Iced Tea)',
      nonAlcoholicNotes: 'Tart floral notes cleanse the palate between spicy, savory bites.',
      servingTemperature: '38°F - 42°F (3°C - 5°C) Ice Cold',
    };
  } else {
    drinkPairings = {
      alcoholic: meal.wineOrDrinkPairing || 'Dry French Sauvignon Blanc or Light-Bodied Pinot Noir',
      alcoholicNotes: 'Crisp mineral backbone and delicate fruit structure provide clean contrast without overpowering delicate seasoning.',
      nonAlcoholic: 'Iced Jasmine Green Tea with Lemon Wheel & Honey Drops',
      nonAlcoholicNotes: 'Floral botanicals harmonize with garlic, shallots, and fresh herbs.',
      servingTemperature: '45°F - 50°F (7°C - 10°C) Refreshingly Chilled',
    };
  }

  // Culinary techniques
  const culinaryTechniques = [
    {
      title: 'The Maillard Crust Secret',
      technique: 'Pat protein completely dry with paper towels before hitting high heat. Never crowd the skillet.',
      whyItWorks: 'Moisture creates steam rather than sear. Dry surfaces allow amino acids and sugars to caramelize at 300°F+ creating hundreds of new flavor compounds.',
    },
    {
      title: 'Pan Fond Deglazing & Emulsion',
      technique: 'After searing, add 2 tbsp of liquid (broth, vinegar, or citrus) to scrape up browned bits, then swirl in 1 tsp cold butter or oil.',
      whyItWorks: 'Dissolves concentrated fond sugars and proteins into a silky restaurant-grade pan sauce.',
    },
    {
      title: 'Acid & Fresh Herb Finish',
      technique: 'Always finish with a dash of fresh citrus juice or vinegar and chopped green herbs 30 seconds before serving.',
      whyItWorks: 'Heat dulls bright aromatic top notes. Finishing with raw acid and fresh herbs awakens the palate and balances rich fats.',
    },
  ];

  const finishingTouches = [
    'Toasted white sesame seeds or micro-scallions for visual contrast',
    'Flaky Maldon sea salt sprinkled immediately before eating',
    'A quick drizzle of cold-pressed chili oil or toasted sesame oil',
  ];

  const secretAromatics = [
    'Crushed garlic cloves bloomed in low-heat fat for 90 seconds',
    'Freshly grated ginger root or lemongrass stalks for citrusy warmth',
    'Freshly cracked black pepper toasted in dry pan to release piperine oils',
  ];

  return {
    flavorProfile,
    drinkPairings,
    culinaryTechniques,
    finishingTouches,
    secretAromatics,
  };
}

function isUmamiRich(meal: MealDetail): boolean {
  const t = (meal.title + ' ' + meal.description).toLowerCase();
  return t.includes('soy') || t.includes('garlic') || t.includes('mushroom') || t.includes('beef') || t.includes('cheese');
}

/**
 * Derives or fills Storage, Meal Prep & Kitchen Guide if not explicitly provided.
 */
export function getKitchenGuide(meal: MealDetail): KitchenGuide {
  if (meal.kitchenGuide && meal.kitchenGuide.reheatingInstructions) {
    return meal.kitchenGuide;
  }

  const prepTime = meal.prepTimeMinutes || 10;
  const cookTime = meal.cookTimeMinutes || 15;
  const totalTime = meal.totalTimeMinutes || (prepTime + cookTime);
  const isCrispy = meal.title.toLowerCase().includes('crispy') || meal.title.toLowerCase().includes('wings') || meal.title.toLowerCase().includes('fried');
  const isSoupOrStew = meal.title.toLowerCase().includes('soup') || meal.title.toLowerCase().includes('stew') || meal.title.toLowerCase().includes('ramen') || meal.title.toLowerCase().includes('curry');

  const mealPrepRating = isSoupOrStew ? 96 : isCrispy ? 82 : 90;
  const mealPrepBadge = isSoupOrStew ? 'Batch Cooking Gold Standard' : isCrispy ? 'Cook Fresh / Air-Fryer Friendly' : 'Top Tier Weeknight Prep';

  return {
    mealPrepRating,
    mealPrepBadge,
    fridgeLifeDays: 4,
    freezerLifeMonths: isCrispy ? 1 : 3,
    containerTip: isCrispy
      ? 'Store sauce separately from crispy proteins to preserve crunch; combine right after reheating.'
      : 'Pack into airtight borosilicate glass containers. Leave 0.5 inch headspace if freezing.',
    reheatingInstructions: [
      {
        method: 'Oven / Air Fryer',
        recommended: isCrispy,
        tempOrTime: '375°F (190°C) for 4–6 mins',
        instructions: 'The gold standard for crispy textures. Pre-heat basket, place pieces in a single layer, and air fry until sizzling and re-crisped.',
      },
      {
        method: 'Stovetop Skillet',
        recommended: !isCrispy && !isSoupOrStew,
        tempOrTime: 'Medium-low heat for 3–5 mins',
        instructions: 'Add 1 tbsp of water or broth to the pan. Cover with lid for 2 mins to steam-heat, then remove lid to reduce sauce back to a glossy glaze.',
      },
      {
        method: 'Microwave Quick Method',
        recommended: isSoupOrStew,
        tempOrTime: 'Medium power (70%) for 90–120s',
        instructions: 'Cover with a damp paper towel to trap moisture and prevent proteins from becoming rubbery. Stir halfway through.',
      },
    ],
    essentialEquipment: [
      {
        name: isCrispy ? 'Heavy-Bottom Cast Iron Skillet or Carbon Steel Wok' : 'Large 12-inch Non-Stick or Stainless Skillet',
        category: 'Cookware',
        whyNeeded: 'Ensures even heat retention across the surface for perfect browning without hot spots.',
      },
      {
        name: "8-Inch Chef's Knife & Wooden Cutting Board",
        category: 'Cutlery',
        whyNeeded: 'Clean, uniform dicing prevents uneven cooking times among aromatics and vegetables.',
      },
      {
        name: 'Digital Instant-Read Food Thermometer',
        category: 'Measurement',
        whyNeeded: 'Verify internal poultry temp hits 165°F (74°C) without cutting and releasing precious juices.',
      },
      {
        name: 'Microplane / Fine Zester & Tongs',
        category: 'Prep Tool',
        whyNeeded: 'Allows ultra-fine garlic and ginger mincing that emulsifies smoothly into pan sauces.',
      },
    ],
    estimatedCostPerServing: '$3.20 - $4.40',
    estimatedRestaurantSavings: 'Save ~$14.00 to $20.00 per portion vs. restaurant takeout',
    cleanupDifficulty: totalTime <= 25 ? 'Minimal (1 Pan)' : 'Moderate (2-3 items)',
  };
}
