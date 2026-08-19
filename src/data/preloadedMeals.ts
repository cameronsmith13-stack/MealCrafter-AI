import type { MealCandidate, MealDetail } from '../types';

export interface PreloadedPreset {
  id: string;
  label: string;
  query: string;
  excluded: string;
  candidates: MealCandidate[];
  detailMap: Record<string, MealDetail>; // key by candidate id or normalized title
}

export const PRELOADED_PRESETS: PreloadedPreset[] = [
  {
    id: 'spicy-garlic-honey-chicken',
    label: '🌶️ Spicy garlic honey chicken',
    query: 'spicy garlic honey chicken with crispy edges',
    excluded: '',
    candidates: [
      {
        id: 'crispy-spicy-garlic-honey-bites',
        title: 'Crispy Fire-Glazed Honey Garlic Chicken Bites',
        cuisine: 'Asian-American Fusion',
        spiceLevel: 'Hot',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        totalTimeMinutes: 25,
        calories: 460,
        proteinG: 42,
        carbsG: 28,
        fatG: 18,
        difficulty: 'Easy',
        tagline: 'Golden pan-seared chicken thighs drenched in a sticky hot honey, crushed garlic, and chili-crisp glaze.',
        briefDescription: 'Crisp chicken thighs tossed in a fiery wildflower honey, toasted garlic, and sriracha reduction.',
        highlights: ['Crispy double-sear texture', 'Sticky caramelized honey garlic reduction', 'Infused with toasted chili flakes'],
      },
      {
        id: 'korean-spicy-honey-garlic-wings',
        title: 'Sticky Korean Yangnyeom Honey Garlic Wings',
        cuisine: 'Korean',
        spiceLevel: 'Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 20,
        totalTimeMinutes: 35,
        calories: 520,
        proteinG: 38,
        carbsG: 32,
        fatG: 24,
        difficulty: 'Medium',
        tagline: 'Extra-crunchy chicken wings tossed in a reduced gochujang, crushed raw garlic, and clover honey glaze.',
        briefDescription: 'Double-crisped chicken with sticky sweet-spicy garlic sauce and toasted white sesame seeds.',
        highlights: ['Ultra-crispy cornstarch crunch', 'Gochujang fermented umami depth', 'Fragrant roasted sesame finish'],
      },
      {
        id: 'sheet-pan-spicy-honey-garlic-chicken-veggies',
        title: 'Sheet-Pan Spicy Honey Garlic Chicken & Charred Broccoli',
        cuisine: 'Healthy Weeknight',
        spiceLevel: 'Medium',
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        totalTimeMinutes: 30,
        calories: 410,
        proteinG: 45,
        carbsG: 22,
        fatG: 14,
        difficulty: 'Easy',
        tagline: 'One-pan high protein chicken breast cubes and roasted broccoli florets caramelized under high heat.',
        briefDescription: 'Tender chicken cubes roasted with broccoli and red peppers in a light honey garlic cayenne glaze.',
        highlights: ['Effortless 1-pan cleanup', 'Lean 45g high-density protein', 'Charred crispy edges on high broiler heat'],
      },
      {
        id: 'spicy-honey-garlic-ramen-chicken',
        title: 'Spicy Honey Garlic Glazed Chicken Ramen Bowl',
        cuisine: 'Japanese-Inspired',
        spiceLevel: 'Hot',
        prepTimeMinutes: 12,
        cookTimeMinutes: 18,
        totalTimeMinutes: 30,
        calories: 540,
        proteinG: 40,
        carbsG: 58,
        fatG: 16,
        difficulty: 'Medium',
        tagline: 'Seared honey garlic chicken breast atop springy noodles in a spicy sesame-garlic chicken broth.',
        briefDescription: 'Spicy broth, soft noodles, soft-boiled egg, and caramelized garlic chili chicken.',
        highlights: ['Rich aromatic garlic broth', 'Silky 6-minute jammy egg pairing', 'Sweet heat chicken glaze'],
      },
    ],
    detailMap: {
      'crispy-spicy-garlic-honey-bites': {
        id: 'crispy-spicy-garlic-honey-bites',
        title: 'Crispy Fire-Glazed Honey Garlic Chicken Bites',
        tagline: 'Golden pan-seared chicken thighs drenched in a sticky hot honey, crushed garlic, and chili-crisp glaze.',
        description: 'Tender, juicy chicken thigh cubes lightly dusted in cornstarch for maximum crispness, pan-seared in bubbling oil, and coated in a glossy reduction of clover honey, minced garlic, soy sauce, rice vinegar, and crushed red chili flakes.',
        cuisine: 'Asian-American Fusion',
        spiceLevel: 'Hot',
        servings: 2,
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        totalTimeMinutes: 25,
        calories: 460,
        proteinG: 42,
        carbsG: 28,
        fatG: 18,
        fiberG: 2,
        sodiumMg: 680,
        difficulty: 'Easy',
        ingredients: [
          { name: 'Boneless skinless chicken thighs (cut into 1-inch bite pieces)', amount: '1', unit: 'lb', notes: 'Chicken breast works too, but thighs yield juiciest texture' },
          { name: 'Cornstarch', amount: '2', unit: 'tbsp', notes: 'For crisp coating' },
          { name: 'Kosher salt & black pepper', amount: '0.5', unit: 'tsp', notes: 'To season chicken' },
          { name: 'Neutral cooking oil (avocado or peanut)', amount: '2', unit: 'tbsp' },
          { name: 'Garlic cloves (finely minced)', amount: '6', unit: 'cloves', notes: 'Fresh garlic is essential' },
          { name: 'Wildflower or clover honey', amount: '3', unit: 'tbsp', notes: 'Pure raw honey' },
          { name: 'Low-sodium soy sauce or tamari', amount: '2', unit: 'tbsp' },
          { name: 'Rice vinegar or apple cider vinegar', amount: '1', unit: 'tbsp', notes: 'For balancing sweetness' },
          { name: 'Sriracha or chili paste', amount: '1.5', unit: 'tbsp', notes: 'Adjust for desired heat' },
          { name: 'Crushed red pepper flakes', amount: '1', unit: 'tsp' },
          { name: 'Toasted sesame oil', amount: '1', unit: 'tsp' },
          { name: 'Scallions (sliced green parts)', amount: '2', unit: 'stalks', notes: 'For fresh garnish' },
          { name: 'Toasted sesame seeds', amount: '1', unit: 'tsp', notes: 'For texture' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'Pat chicken cubes thoroughly dry with paper towels. Toss in a medium bowl with cornstarch, salt, and black pepper until evenly dusted in a thin powdery coat.',
            durationMinutes: 3,
            equipment: 'Mixing bowl',
            tip: 'Dry chicken is the secret to a crunchy crust rather than a soggy exterior.'
          },
          {
            stepNumber: 2,
            instruction: 'In a small bowl, whisk together the honey, soy sauce, rice vinegar, sriracha, toasted sesame oil, and red pepper flakes until smooth.',
            durationMinutes: 2,
            equipment: 'Small whisk / bowl',
            tip: 'Having the sauce pre-mixed prevents burning when adding to the hot pan.'
          },
          {
            stepNumber: 3,
            instruction: 'Heat oil in a large skillet or wok over medium-high heat until shimmering. Add chicken in a single layer (do not overcrowd) and sear undisturbed for 4-5 minutes until golden-brown and crispy.',
            durationMinutes: 5,
            equipment: 'Cast iron skillet or heavy wok',
            tip: 'Resist moving the chicken for the first 3 minutes to build a deep Maillard crust.'
          },
          {
            stepNumber: 4,
            instruction: 'Flip chicken and sear the second side for another 3-4 minutes until cooked through (165°F internal temperature).',
            durationMinutes: 4,
            equipment: 'Tongs'
          },
          {
            stepNumber: 5,
            instruction: 'Lower heat to medium-low. Push chicken slightly to the side, add minced garlic and saute for 30 seconds until fragrant.',
            durationMinutes: 1,
            tip: 'Garlic cooks rapidly in hot oil—keep it moving so it does not turn bitter.'
          },
          {
            stepNumber: 6,
            instruction: 'Pour in the honey-chili sauce mixture. Toss vigorously as the honey bubbles and caramelizes into a glossy, sticky glaze clinging to every chicken bite (about 1-2 minutes).',
            durationMinutes: 2,
            equipment: 'Spatula'
          },
          {
            stepNumber: 7,
            instruction: 'Remove from heat immediately. Garnish generously with sliced green scallions and toasted sesame seeds. Serve hot over jasmine rice or cauliflower rice.',
            durationMinutes: 1
          }
        ],
        healthInsight: {
          score: 88,
          badge: 'High-Protein Muscle Builder',
          summary: 'A protein-dense power meal delivering 42g of bioavailable protein. The combination of capsaicin from hot peppers and raw allicin from garlic stimulates thermogenesis and immune health.',
          macroRatio: { proteinPercent: 37, carbsPercent: 28, fatPercent: 35 },
          healthPros: [
            'Exceptional protein-to-calorie density (42g lean protein per serving)',
            'Rich in capsaicin which boosts metabolic rate and supports cardiovascular blood flow',
            'Loaded with raw allicin from fresh garlic, providing potent antimicrobial and immune benefits',
            'Lower refined sugar than takeout sweet-and-sour chicken by utilizing natural raw honey'
          ],
          healthCons: [
            'Contains natural sugars from honey (7g net sugars); can be swapped with allulose/erythritol for strict keto',
            'Moderate sodium (680mg); use low-sodium tamari or coconut aminos to reduce'
          ],
          keyNutrients: [
            { name: 'Capsaicin', amount: 'Bioactive', benefit: 'Increases oxygen consumption and body metabolic expenditure' },
            { name: 'Allicin (Garlic)', amount: 'High', benefit: 'Natural antioxidant and blood pressure regulating sulfur compound' },
            { name: 'Vitamin B6 & Zinc', amount: '45% DV', benefit: 'Crucial for cellular energy synthesis and immune defenses' }
          ],
          dietarySuitability: ['High Protein', 'Dairy-Free', 'Gluten-Free Adaptable']
        },
        chefSubstitutions: [
          { ifMissing: 'Honey', substituteWith: 'Pure maple syrup, agave nectar, or keto brown sugar syrup' },
          { ifMissing: 'Sriracha', substituteWith: 'Sambal oelek, gochujang paste, or hot chili garlic sauce' },
          { ifMissing: 'Cornstarch', substituteWith: 'Potato starch, arrowroot powder, or tapioca flour' }
        ],
        wineOrDrinkPairing: 'Off-dry German Riesling, crisp Hazy IPA, or chilled sparkling yuzu lemonade.',
        proTips: [
          'Use high heat for searing, then drop temperature before adding the honey sauce to avoid burning sugars.',
          'Double the garlic if you are a true garlic lover—it mellows beautifully in the honey reduction.'
        ],
        similarMeals: [
          {
            id: 'thai-sweet-chili-chicken',
            title: 'Thai Sweet Chili & Lemongrass Crispy Chicken',
            cuisine: 'Thai',
            spiceLevel: 'Medium',
            prepTimeMinutes: 25,
            calories: 450,
            tagline: 'Tangy tamarind and lemongrass infused sweet heat glaze over crispy chicken bites.',
            whyYoullLoveIt: 'Shares the irresistible sweet-crispy balance with an aromatic citrus lemongrass backbone.'
          },
          {
            id: 'spicy-orange-garlic-chicken',
            title: 'Wok-Tossed Spicy Orange Garlic Chicken',
            cuisine: 'Chinese-American',
            spiceLevel: 'Hot',
            prepTimeMinutes: 20,
            calories: 480,
            tagline: 'Fresh orange zest, toasted Szechuan peppercorns, and spicy garlic honey reduction.',
            whyYoullLoveIt: 'Adds bright citrus brightness and tongue-tingling aromatics to the garlic honey profile.'
          }
        ],
        betterAlternatives: [
          {
            id: 'black-garlic-hot-honey-confit-chicken',
            title: 'Artisanal Black Garlic & Hot Habanero Honey Confit Chicken',
            cuisine: 'Modern Gastronomy',
            spiceLevel: 'Hot',
            prepTimeMinutes: 25,
            calories: 440,
            proteinG: 46,
            tagline: 'Fermented black garlic puree, aged balsamic hot honey, and crispy skin chicken cutlets.',
            whyItsBetter: 'Replaces raw minced garlic with aged fermented black garlic, providing a deep molasses-balsamic umami baseline without harsh bite, while elevating the honey with floral habanero infusion.',
            keyImprovements: [
              '10x higher antioxidant polyphenol density from aged black garlic',
              'Complex multi-layered sweetness with zero refined table sugar',
              'Crisped skin chicken cutlets with 46g high-purity protein'
            ],
            upgradeAngle: 'Gourmet Culinary Elevation'
          },
          {
            id: 'spicy-garlic-honey-airfryer-tenderloins',
            title: 'Ultra-Lean 15-Minute Air Fryer Hot Honey Garlic Chicken',
            cuisine: 'Clean Macro Optimized',
            spiceLevel: 'Hot',
            prepTimeMinutes: 15,
            calories: 360,
            proteinG: 50,
            tagline: 'Zero added deep frying oil, 50g pure protein, and micro-aerated honey glaze.',
            whyItsBetter: 'Achieves identical shattering crunch using high-velocity air frying with 70% less oil, cutting 100 calories and boosting protein to an elite 50g per plate.',
            keyImprovements: [
              '50g muscle-building protein with under 8g dietary fat',
              'Lightning fast 15-minute start-to-finish cook time',
              'Zero splatter cleanup and perfectly uniform crisp'
            ],
            upgradeAngle: 'Macro & Speed Optimization'
          }
        ]
      }
    }
  },
  {
    id: 'gochujang-glazed-chicken',
    label: '🍗 Gochujang glazed chicken & rice',
    query: 'sweet and spicy gochujang glazed chicken bowl',
    excluded: '',
    candidates: [
      {
        id: 'korean-gochujang-chicken-rice-bowl',
        title: 'Korean Gochujang Fire-Glazed Chicken Rice Bowl',
        cuisine: 'Korean',
        spiceLevel: 'Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 510,
        proteinG: 44,
        carbsG: 52,
        fatG: 14,
        difficulty: 'Easy',
        tagline: 'Charred spicy gochujang chicken thighs served over sticky rice with sesame cucumbers and kimchi.',
        briefDescription: 'Fermented Korean chili paste, toasted sesame, garlic, and honey glazed chicken over steaming rice.',
        highlights: ['Deep fermented gochujang umami', 'Quick pickled sesame cucumbers', '44g satisfying protein'],
      },
      {
        id: 'spicy-buldak-fire-chicken-rice',
        title: 'Spicy Korean Buldak (Fire Chicken) with Steamed Rice',
        cuisine: 'Korean Street Food',
        spiceLevel: 'Extra Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 530,
        proteinG: 46,
        carbsG: 48,
        fatG: 16,
        difficulty: 'Medium',
        tagline: 'Famous Seoul street-style fire chicken with smoky chili powder, ginger, and melted mozzarella option.',
        briefDescription: 'Intense spicy chicken bathed in gochugaru, gochujang, and soy with scallions.',
        highlights: ['Addictive authentic Seoul heat', 'Caramelized pan charring', 'Perfect rice pairing'],
      },
      {
        id: 'gochujang-chicken-lettuce-wraps',
        title: 'Crispy Gochujang Chicken Ssam (Lettuce Wraps)',
        cuisine: 'Korean Fusion',
        spiceLevel: 'Hot',
        prepTimeMinutes: 12,
        cookTimeMinutes: 12,
        totalTimeMinutes: 24,
        calories: 380,
        proteinG: 42,
        carbsG: 16,
        fatG: 12,
        difficulty: 'Easy',
        tagline: 'Low-carb butter lettuce wraps with sweet and spicy gochujang chicken, radish, and ssamjang sauce.',
        briefDescription: 'Spicy glazed chicken served in fresh crisp lettuce with scallions and toasted sesame.',
        highlights: ['Low-carb high-crunch meal', 'Ready in under 25 minutes', 'Bursting with fresh texture'],
      }
    ],
    detailMap: {
      'korean-gochujang-chicken-rice-bowl': {
        id: 'korean-gochujang-chicken-rice-bowl',
        title: 'Korean Gochujang Fire-Glazed Chicken Rice Bowl',
        tagline: 'Charred spicy gochujang chicken thighs served over sticky rice with sesame cucumbers and kimchi.',
        description: 'Tender chicken marinated in a savory-sweet glaze of authentic Korean gochujang, fresh minced ginger, garlic, soy sauce, and toasted sesame oil. Pan-seared to caramelized perfection and served with steaming rice and crisp sesame cucumber slices.',
        cuisine: 'Korean',
        spiceLevel: 'Hot',
        servings: 2,
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 510,
        proteinG: 44,
        carbsG: 52,
        fatG: 14,
        fiberG: 4,
        sodiumMg: 720,
        difficulty: 'Easy',
        ingredients: [
          { name: 'Boneless chicken thighs or breast (sliced into strips)', amount: '1', unit: 'lb' },
          { name: 'Korean red pepper paste (Gochujang)', amount: '2.5', unit: 'tbsp', notes: 'Authentic fermented paste' },
          { name: 'Low-sodium soy sauce', amount: '1.5', unit: 'tbsp' },
          { name: 'Honey or brown sugar', amount: '1.5', unit: 'tbsp' },
          { name: 'Toasted sesame oil', amount: '1', unit: 'tbsp' },
          { name: 'Garlic cloves (finely grated)', amount: '4', unit: 'cloves' },
          { name: 'Fresh ginger (finely grated)', amount: '1', unit: 'tsp' },
          { name: 'Cooked short-grain jasmine or sushi rice', amount: '2', unit: 'cups' },
          { name: 'Persian cucumber (thinly sliced)', amount: '1', unit: 'whole' },
          { name: 'Scallions (sliced on bias)', amount: '2', unit: 'stalks' },
          { name: 'Toasted sesame seeds', amount: '1', unit: 'tsp' },
          { name: 'Kimchi (optional side)', amount: '0.5', unit: 'cup' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'In a bowl, mix gochujang, soy sauce, honey, sesame oil, grated garlic, and grated ginger until velvety.',
            durationMinutes: 3,
            tip: 'Reserve 1 tablespoon of sauce before adding chicken for a glossy finishing drizzle.'
          },
          {
            stepNumber: 2,
            instruction: 'Toss sliced chicken in the marinade and let sit for 10 minutes (or overnight in fridge).',
            durationMinutes: 10
          },
          {
            stepNumber: 3,
            instruction: 'Heat a nonstick or cast-iron skillet over medium-high heat with a drizzle of cooking oil. Add chicken in single layer.',
            durationMinutes: 4,
            equipment: 'Skillet'
          },
          {
            stepNumber: 4,
            instruction: 'Sear for 4-5 minutes per side until deeply caramelized with slight char marks and chicken is cooked through.',
            durationMinutes: 6,
            tip: 'The sugars in gochujang will char nicely—watch closely to prevent burning.'
          },
          {
            stepNumber: 5,
            instruction: 'Scoop warm rice into bowls, arrange sliced gochujang chicken, crisp cucumber rounds, and kimchi. Top with scallions and sesame seeds.',
            durationMinutes: 2
          }
        ],
        healthInsight: {
          score: 87,
          badge: 'Gut & Metabolic Enhancer',
          summary: 'Fermented gochujang and kimchi introduce gut-friendly probiotics and bio-transformed polyphenols, paired with 44g of muscle-building chicken protein.',
          macroRatio: { proteinPercent: 35, carbsPercent: 41, fatPercent: 24 },
          healthPros: [
            'Gochujang fermentation generates bioactive peptides that support metabolic regulation',
            'Rich in gingerol and allicin for digestive ease and reduced systemic inflammation',
            'High fiber and micronutrient support when paired with probiotic kimchi'
          ],
          healthCons: [
            'Higher carb count from rice; switch to cauliflower rice or quinoa for low-carb diets'
          ],
          keyNutrients: [
            { name: 'Probiotic metabolites', amount: 'High', benefit: 'Supports microbiome diversity and digestive health' },
            { name: 'Capsanthin & Capsaicin', amount: 'Medium', benefit: 'Potent carotenoid antioxidants from Korean chili peppers' }
          ],
          dietarySuitability: ['High Protein', 'Dairy-Free', 'Low Fat']
        },
        chefSubstitutions: [
          { ifMissing: 'Gochujang', substituteWith: 'Sriracha mixed with equal part miso paste and a dash of honey' }
        ],
        wineOrDrinkPairing: 'Cold Makgeolli (Korean rice wine), crisp pilsner, or iced barley tea (boricha).',
        proTips: ['Cook on medium heat to allow the chicken to cook through before the gochujang glaze burns.'],
        similarMeals: [
          {
            id: 'korean-spicy-pork-bulgogi',
            title: 'Spicy Pork Bulgogi (Daeji Bulgogi)',
            cuisine: 'Korean',
            spiceLevel: 'Hot',
            prepTimeMinutes: 20,
            calories: 540,
            tagline: 'Thinly sliced pork marinated in fiery gochujang, grated pear, and sesame.',
            whyYoullLoveIt: 'Uses the exact same fermented chili profile with melt-in-mouth thinly sliced meat.'
          }
        ],
        betterAlternatives: [
          {
            id: 'elevated-gochujang-sousvide-chicken',
            title: 'Sous-Vide Gochujang Glazed Chicken with Crispy Rice Cake Medley',
            cuisine: 'Modern Korean',
            spiceLevel: 'Hot',
            prepTimeMinutes: 20,
            calories: 490,
            proteinG: 48,
            tagline: 'Ultra-tender sous-vide chicken seared with charred tteokbokki rice cakes and scallion oil.',
            whyItsBetter: 'Sous-vide precision ensures 100% moisture retention without drying, paired with chewy crispy rice cakes for Michelin-level textural contrast.',
            keyImprovements: ['Maximum moisture preservation', 'Chewy pan-crisped rice cake texture', 'Aged 3-year artisanal gochujang depth'],
            upgradeAngle: 'Gourmet Texture & Technique'
          }
        ]
      }
    }
  },
  {
    id: 'high-protein-chicken-salad',
    label: '🥗 High-protein spicy chicken salad',
    query: 'spicy grilled chipotle chicken high protein bowl',
    excluded: 'mayonnaise, heavy cream',
    candidates: [
      {
        id: 'chipotle-spicy-chicken-macro-bowl',
        title: 'Fiery Chipotle Grilled Chicken & Quinoa Power Bowl',
        cuisine: 'Southwestern Healthy',
        spiceLevel: 'Medium',
        prepTimeMinutes: 12,
        cookTimeMinutes: 10,
        totalTimeMinutes: 22,
        calories: 420,
        proteinG: 48,
        carbsG: 32,
        fatG: 10,
        difficulty: 'Easy',
        tagline: 'Smoky chipotle marinated chicken breast over romaine, tri-color quinoa, black beans, and cilantro lime dressing.',
        briefDescription: 'Lean chicken breast with smoky spices, fiber-rich black beans, and zesty Greek yogurt lime crema.',
        highlights: ['48g ultra-lean protein', 'Zero heavy mayonnaise or cream', 'Rich in prebiotic fiber'],
      },
      {
        id: 'spicy-cajun-blackened-chicken-salad',
        title: 'Spicy Blackened Cajun Chicken Garden Bowl',
        cuisine: 'Cajun-Creole',
        spiceLevel: 'Hot',
        prepTimeMinutes: 10,
        cookTimeMinutes: 8,
        totalTimeMinutes: 18,
        calories: 390,
        proteinG: 46,
        carbsG: 18,
        fatG: 12,
        difficulty: 'Easy',
        tagline: 'Cast-iron blackened chicken breast with charred corn, avocado, cherry tomatoes, and smoked paprika vinaigrette.',
        briefDescription: 'Crisp spicy spice-crusted chicken over crisp baby greens with avocado and lime.',
        highlights: ['Crusted with 7-spice Cajun rub', 'Heart-healthy monounsaturated fats', '18 minute speed'],
      }
    ],
    detailMap: {
      'chipotle-spicy-chicken-macro-bowl': {
        id: 'chipotle-spicy-chicken-macro-bowl',
        title: 'Fiery Chipotle Grilled Chicken & Quinoa Power Bowl',
        tagline: 'Smoky chipotle marinated chicken breast over romaine, tri-color quinoa, black beans, and cilantro lime dressing.',
        description: 'Lean chicken breasts marinated in chipotle peppers in adobo, ground cumin, garlic, and fresh lime juice. Grilled to juicy tenderness and served over crisp romaine with cooked quinoa, black beans, diced Roma tomatoes, and a light Greek yogurt lime crema.',
        cuisine: 'Southwestern Healthy',
        spiceLevel: 'Medium',
        servings: 2,
        prepTimeMinutes: 12,
        cookTimeMinutes: 10,
        totalTimeMinutes: 22,
        calories: 420,
        proteinG: 48,
        carbsG: 32,
        fatG: 10,
        fiberG: 9,
        sodiumMg: 490,
        difficulty: 'Easy',
        ingredients: [
          { name: 'Boneless skinless chicken breasts', amount: '1', unit: 'lb', notes: 'Pounded to even 1/2-inch thickness' },
          { name: 'Chipotle chili in adobo (minced)', amount: '1.5', unit: 'tbsp' },
          { name: 'Ground cumin & smoked paprika', amount: '1', unit: 'tsp each' },
          { name: 'Fresh lime juice', amount: '3', unit: 'tbsp' },
          { name: 'Garlic powder', amount: '1', unit: 'tsp' },
          { name: 'Olive oil', amount: '1', unit: 'tbsp' },
          { name: 'Chopped Romaine lettuce', amount: '4', unit: 'cups' },
          { name: 'Cooked quinoa', amount: '1', unit: 'cup' },
          { name: 'Black beans (rinsed and drained)', amount: '0.75', unit: 'cup' },
          { name: 'Diced avocado', amount: '0.5', unit: 'whole' },
          { name: 'Plain 0% Greek yogurt (for dressing)', amount: '0.5', unit: 'cup', notes: 'Replaces mayo for high protein' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'Whisk chipotle in adobo, lime juice, cumin, smoked paprika, garlic powder, olive oil, salt and pepper. Marinate chicken for 10 minutes.',
            durationMinutes: 10
          },
          {
            stepNumber: 2,
            instruction: 'Heat grill pan or cast-iron skillet over medium-high heat. Grill chicken for 4-5 minutes per side until charred and cooked through.',
            durationMinutes: 9,
            tip: 'Let rest for 4 minutes before slicing to lock in juices.'
          },
          {
            stepNumber: 3,
            instruction: 'Whisk Greek yogurt with 1 tbsp lime juice, minced cilantro, and a pinch of salt to make a creamy, guilt-free dressing.',
            durationMinutes: 2
          },
          {
            stepNumber: 4,
            instruction: 'Assemble bowls: base of crisp romaine, quinoa, black beans, diced avocado, and sliced warm chipotle chicken. Drizzle with yogurt dressing.',
            durationMinutes: 2
          }
        ],
        healthInsight: {
          score: 95,
          badge: 'Superfood Macro Masterpiece',
          summary: 'A nutrition powerhouse boasting 48g pure protein and 9g gut-nourishing prebiotic fiber with minimal saturated fat.',
          macroRatio: { proteinPercent: 46, carbsPercent: 31, fatPercent: 23 },
          healthPros: [
            '48g high biological value protein with complete essential amino acid profile',
            '9g dietary fiber supports sustained satiety and smooth glucose response',
            'Greek yogurt base delivers protein and calcium without heavy mayo calories'
          ],
          healthCons: ['Virtually zero drawbacks; highly balanced athletic profile'],
          keyNutrients: [
            { name: 'Quinoa Complete Protein', amount: '8g', benefit: 'Contains all 9 essential amino acids' },
            { name: 'Potassium & Magnesium', amount: '35% DV', benefit: 'Supports muscular recovery and hydration' }
          ],
          dietarySuitability: ['High Protein', 'Gluten-Free', 'Clean Eating', 'Mayo-Free']
        },
        chefSubstitutions: [
          { ifMissing: 'Quinoa', substituteWith: 'Brown rice, farro, or cauliflower rice for low-carb' }
        ],
        wineOrDrinkPairing: 'Iced green tea with lime, sparkling mineral water, or light Sauvignon Blanc.',
        proTips: ['Pounding chicken breasts flat ensures even cooking without dry edges.'],
        similarMeals: [
          {
            id: 'mexican-grilled-fajita-salad',
            title: 'Zesty Fajita Spiced Chicken & Bell Pepper Bowl',
            cuisine: 'Mexican',
            spiceLevel: 'Medium',
            prepTimeMinutes: 20,
            calories: 410,
            tagline: 'Seared peppers and onions with chili spiced chicken and salsa verde.',
            whyYoullLoveIt: 'Shares the smoky Southwestern heat with extra caramelized peppers.'
          }
        ],
        betterAlternatives: [
          {
            id: 'charcoal-grilled-achiote-citrus-chicken',
            title: 'Yucatan Achiote & Citrus Wood-Smoked Chicken Power Bowl',
            cuisine: 'Artisanal Mexican',
            spiceLevel: 'Medium',
            prepTimeMinutes: 20,
            calories: 430,
            proteinG: 50,
            tagline: 'Seville orange and achiote seed marinated chicken with roasted pepitas and jicama slaw.',
            whyItsBetter: 'Infuses wild achiote seed paste and bitter orange juice for an authentic Oaxacan flavor profile with crunchy roasted pumpkin seeds for zinc and magnesium.',
            keyImprovements: ['Ancient superfood seed crunch', 'Rich citrus marinade enzymes tenderize meat naturally', '50g clean protein density'],
            upgradeAngle: 'Artisanal Flavor & Micronutrients'
          }
        ]
      }
    }
  },
  {
    id: 'thai-spicy-basil-chicken',
    label: '🍜 Thai spicy basil chicken (Pad Krapow)',
    query: 'spicy Thai holy basil minced chicken with runny egg',
    excluded: '',
    candidates: [
      {
        id: 'authentic-thai-pad-krapow-gai',
        title: 'Authentic Thai Pad Krapow Gai (Holy Basil Chicken)',
        cuisine: 'Thai',
        spiceLevel: 'Extra Hot',
        prepTimeMinutes: 10,
        cookTimeMinutes: 8,
        totalTimeMinutes: 18,
        calories: 480,
        proteinG: 40,
        carbsG: 38,
        fatG: 18,
        difficulty: 'Easy',
        tagline: 'Wok-tossed minced chicken with Thai bird’s eye chilies, garlic, fragrant holy basil, and a crispy fried runny egg.',
        briefDescription: 'The crown jewel of Bangkok street food: spicy, savory, herbaceous minced chicken.',
        highlights: ['18-minute express wok cooking', 'Crispy lace-edged runny fried egg', 'Fiery bird’s eye chili kick'],
      },
      {
        id: 'drunken-spicy-basil-chicken-noodles',
        title: 'Spicy Basil Chicken Drunken Noodles (Pad Kee Mao)',
        cuisine: 'Thai Street Food',
        spiceLevel: 'Hot',
        prepTimeMinutes: 12,
        cookTimeMinutes: 10,
        totalTimeMinutes: 22,
        calories: 520,
        proteinG: 38,
        carbsG: 58,
        fatG: 14,
        difficulty: 'Medium',
        tagline: 'Wide rice noodles charred in a screaming hot wok with spicy chicken, Thai basil, and sweet soy.',
        briefDescription: 'Chewy rice noodles with smoky wok-hei char and fragrant basil aroma.',
        highlights: ['Smoky wok-hei char depth', 'Chewy broad rice noodles', 'Intense aromatic heat'],
      }
    ],
    detailMap: {
      'authentic-thai-pad-krapow-gai': {
        id: 'authentic-thai-pad-krapow-gai',
        title: 'Authentic Thai Pad Krapow Gai (Holy Basil Chicken)',
        tagline: 'Wok-tossed minced chicken with Thai bird’s eye chilies, garlic, fragrant holy basil, and a crispy fried runny egg.',
        description: 'Finely minced chicken flash-fried in a scorching hot wok with crushed Thai bird’s eye chilies and lots of garlic. Seasoned with fish sauce, oyster sauce, and dark soy, then finished with a handful of fresh peppery holy basil leaves and served with a crispy-edged runny fried egg over jasmine rice.',
        cuisine: 'Thai',
        spiceLevel: 'Extra Hot',
        servings: 2,
        prepTimeMinutes: 10,
        cookTimeMinutes: 8,
        totalTimeMinutes: 18,
        calories: 480,
        proteinG: 40,
        carbsG: 38,
        fatG: 18,
        fiberG: 2,
        sodiumMg: 780,
        difficulty: 'Easy',
        ingredients: [
          { name: 'Ground or minced chicken thigh/breast', amount: '1', unit: 'lb' },
          { name: 'Thai bird’s eye chilies (minced or crushed in mortar)', amount: '4', unit: 'whole', notes: 'Use 2 for milder kick' },
          { name: 'Garlic cloves (crushed in mortar)', amount: '6', unit: 'cloves' },
          { name: 'Thai holy basil or Italian sweet basil leaves', amount: '1.5', unit: 'cups', notes: 'Holy basil (Tulsi) is most authentic' },
          { name: 'Oyster sauce', amount: '1.5', unit: 'tbsp' },
          { name: 'Fish sauce (nam pla)', amount: '1', unit: 'tbsp' },
          { name: 'Dark sweet soy sauce', amount: '1', unit: 'tsp', notes: 'For deep caramel color' },
          { name: 'Sugar', amount: '1', unit: 'tsp' },
          { name: 'Neutral high-heat oil', amount: '2', unit: 'tbsp' },
          { name: 'Large fresh eggs', amount: '2', unit: 'whole', notes: 'For crispy fried egg topping (Khai Dao)' },
          { name: 'Steamed jasmine rice', amount: '2', unit: 'cups' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'In a mortar and pestle (or cutting board), pound the chilies and garlic into a rough aromatic paste.',
            durationMinutes: 3,
            tip: 'Pounding releases the essential oils much more intensely than knife chopping.'
          },
          {
            stepNumber: 2,
            instruction: 'In a small bowl, stir together the oyster sauce, fish sauce, dark soy sauce, sugar, and 1 tbsp water.',
            durationMinutes: 1
          },
          {
            stepNumber: 3,
            instruction: 'Heat 1 tbsp oil in a wok or skillet over high heat. Fry the eggs in hot oil until edges are blistered and crispy while the yolk remains runny. Set eggs aside.',
            durationMinutes: 2,
            tip: 'Basting hot oil over egg whites creates the signature Thai crispy bubble lace.'
          },
          {
            stepNumber: 4,
            instruction: 'Add remaining oil and the garlic-chili paste to the hot wok. Stir-fry for 30 seconds until fragrant.',
            durationMinutes: 1
          },
          {
            stepNumber: 5,
            instruction: 'Add minced chicken, breaking it apart with spatula. Stir-fry for 3-4 minutes until chicken is cooked through.',
            durationMinutes: 4
          },
          {
            stepNumber: 6,
            instruction: 'Pour in sauce mixture. Toss vigorously for 1 minute until sauce coats chicken. Turn off heat, add basil leaves, and toss until just wilted.',
            durationMinutes: 1
          },
          {
            stepNumber: 7,
            instruction: 'Serve over warm jasmine rice and crown with the crispy runny fried egg.',
            durationMinutes: 1
          }
        ],
        healthInsight: {
          score: 89,
          badge: 'Metabolic & Respiratory Activator',
          summary: 'Holy basil (Tulsi) is renowned in traditional medicine for adaptogenic properties, while bird’s eye chilies trigger strong thermogenic calorie burning.',
          macroRatio: { proteinPercent: 34, carbsPercent: 32, fatPercent: 34 },
          healthPros: [
            'Holy basil contains eugenol, an active compound with powerful anti-inflammatory effects',
            'Bird’s eye chilies provide extreme capsaicin density for metabolic acceleration',
            '40g high-quality protein supported by choline from the whole fried egg'
          ],
          healthCons: ['High heat levels may not suit sensitive stomachs; reduce chilies as needed'],
          keyNutrients: [
            { name: 'Eugenol & Ocimum (Basil)', amount: 'High', benefit: 'Adaptogenic stress reduction and respiratory support' },
            { name: 'Choline (Egg)', amount: '30% DV', benefit: 'Essential for cognitive function and cellular membranes' }
          ],
          dietarySuitability: ['High Protein', 'Dairy-Free', 'Express Speed']
        },
        chefSubstitutions: [
          { ifMissing: 'Holy Basil', substituteWith: 'Thai basil or Italian sweet basil with a pinch of fresh black pepper' }
        ],
        wineOrDrinkPairing: 'Singha or Chang Thai beer, iced coconut water, or Thai iced tea.',
        proTips: ['Do not overcook the basil—add it off the heat so its delicate essential oils do not evaporate.'],
        similarMeals: [
          {
            id: 'thai-larb-gai',
            title: 'Spicy Thai Minced Chicken Salad (Larb Gai)',
            cuisine: 'Isan Thai',
            spiceLevel: 'Hot',
            prepTimeMinutes: 15,
            calories: 360,
            tagline: 'Warm minced chicken tossed with toasted sticky rice powder, lime, mint, and shallots.',
            whyYoullLoveIt: 'Lighter and tangy with the same delicious minced chicken and fresh herbs.'
          }
        ],
        betterAlternatives: [
          {
            id: 'wagyu-pad-krapow-quail-egg',
            title: 'Dry-Aged Wagyu & Duck Fat Crisp Egg Pad Krapow',
            cuisine: 'High-End Bangkok Fusion',
            spiceLevel: 'Extra Hot',
            prepTimeMinutes: 20,
            calories: 520,
            proteinG: 44,
            tagline: 'Hand-chopped dry aged beef and chicken with crispy duck-fat fried egg and mountain holy basil.',
            whyItsBetter: 'Using hand-diced meat instead of machine mince yields phenomenal juicy chew, with duck-fat frying creating the ultimate egg crisp.',
            keyImprovements: ['Hand-chopped texture prevents mushiness', 'Duck-fat blistering on egg', 'Wild mountain holy basil aromatics'],
            upgradeAngle: 'Luxury Texture & Depth'
          }
        ]
      }
    }
  },
  {
    id: 'smoky-chipotle-tacos',
    label: '🌮 Smoky chipotle chicken tacos',
    query: 'smoky spicy shredded chicken tacos with lime crema',
    excluded: '',
    candidates: [
      {
        id: 'smoky-chipotle-tinga-tacos',
        title: 'Authentic Smoky Chicken Tinga Street Tacos',
        cuisine: 'Mexican',
        spiceLevel: 'Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 430,
        proteinG: 38,
        carbsG: 34,
        fatG: 14,
        difficulty: 'Easy',
        tagline: 'Slow-simmered shredded chicken in charred tomato, chipotle in adobo, and Mexican oregano on warm corn tortillas.',
        briefDescription: 'Tender shredded chicken steeped in smoky chipotle broth, with diced onions, cilantro, and crumbled cotija.',
        highlights: ['Rich smoky adobo braise', 'Double-layered warm corn tortillas', 'Fresh tangy cotija cheese'],
      },
      {
        id: 'crispy-birria-style-chicken-tacos',
        title: 'Crispy Quesabirria-Style Chipotle Chicken Tacos',
        cuisine: 'Mexican Street Food',
        spiceLevel: 'Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 520,
        proteinG: 42,
        carbsG: 36,
        fatG: 22,
        difficulty: 'Medium',
        tagline: 'Tortillas dipped in spicy chili broth, griddled crispy with Oaxaca cheese and smoky chicken, served with dipping consommé.',
        briefDescription: 'Crispy dipped tortillas packed with melted cheese and spicy shredded chicken.',
        highlights: ['Cheese-crusted crispy exterior', 'Rich savory dipping broth', 'Melted Oaxaca cheese pull'],
      }
    ],
    detailMap: {
      'smoky-chipotle-tinga-tacos': {
        id: 'smoky-chipotle-tinga-tacos',
        title: 'Authentic Smoky Chicken Tinga Street Tacos',
        tagline: 'Slow-simmered shredded chicken in charred tomato, chipotle in adobo, and Mexican oregano on warm corn tortillas.',
        description: 'Tender poached chicken breasts or thighs shredded and simmered in a vibrant sauce of fire-roasted tomatoes, caramelized sliced onions, chipotle peppers in adobo, garlic, and Mexican oregano. Served in charred corn tortillas with lime crema and cilantro.',
        cuisine: 'Mexican',
        spiceLevel: 'Hot',
        servings: 2,
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        totalTimeMinutes: 30,
        calories: 430,
        proteinG: 38,
        carbsG: 34,
        fatG: 14,
        fiberG: 6,
        sodiumMg: 560,
        difficulty: 'Easy',
        ingredients: [
          { name: 'Boneless skinless chicken breasts or thighs', amount: '1', unit: 'lb' },
          { name: 'Fire-roasted canned diced tomatoes', amount: '1', unit: 'can (14 oz)' },
          { name: 'Chipotles in adobo sauce', amount: '3', unit: 'whole peppers + 2 tbsp sauce' },
          { name: 'Yellow onion (thinly sliced)', amount: '1', unit: 'large' },
          { name: 'Garlic cloves', amount: '3', unit: 'cloves' },
          { name: 'Mexican oregano', amount: '1', unit: 'tsp' },
          { name: 'Ground cumin', amount: '0.5', unit: 'tsp' },
          { name: 'Chicken broth', amount: '0.5', unit: 'cup' },
          { name: 'Small corn tortillas', amount: '6', unit: 'tortillas' },
          { name: 'Fresh cilantro and diced white onion', amount: '0.5', unit: 'cup' },
          { name: 'Cotija cheese or queso fresco', amount: '0.25', unit: 'cup' },
          { name: 'Fresh lime wedges', amount: '1', unit: 'lime' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'In a blender, puree the fire-roasted tomatoes, chipotle peppers, adobo sauce, garlic, oregano, cumin, and chicken broth until smooth.',
            durationMinutes: 2,
            equipment: 'Blender'
          },
          {
            stepNumber: 2,
            instruction: 'Heat 1 tbsp oil in a skillet over medium heat. Sauté sliced yellow onion for 5-6 minutes until soft and caramelized at edges.',
            durationMinutes: 6
          },
          {
            stepNumber: 3,
            instruction: 'Pour the blended chipotle tomato sauce into the skillet with the onions and bring to a simmer for 5 minutes.',
            durationMinutes: 5
          },
          {
            stepNumber: 4,
            instruction: 'Add cooked shredded chicken to the sauce. Simmer for 5-7 minutes so the chicken absorbs the smoky spicy flavors.',
            durationMinutes: 6
          },
          {
            stepNumber: 5,
            instruction: 'Warm corn tortillas in a dry skillet until soft with charred spots. Spoon smoky chicken tinga into tortillas, top with cilantro, onions, and crumbled cotija.',
            durationMinutes: 3
          }
        ],
        healthInsight: {
          score: 91,
          badge: 'Antioxidant & Lean Protein Dynamo',
          summary: 'Cooked tomatoes provide concentrated lycopene (a potent cellular antioxidant), paired with 38g lean protein and 6g dietary fiber from whole corn tortillas.',
          macroRatio: { proteinPercent: 36, carbsPercent: 34, fatPercent: 30 },
          healthPros: [
            'Simmered tomatoes deliver bioavailable lycopene for prostate and cellular health',
            'Chipotle peppers provide smoke flavor with capsaicin and minimal calories',
            'Low saturated fat and good fiber from non-GMO stone-ground corn tortillas'
          ],
          healthCons: ['Tortilla portions should be tracked for low-carb diets; can be swapped with jicama wraps'],
          keyNutrients: [
            { name: 'Lycopene', amount: 'Very High', benefit: 'Cardiovascular and cellular DNA protection' },
            { name: 'Capsaicin', amount: 'High', benefit: 'Appetite regulation and fat oxidation' }
          ],
          dietarySuitability: ['High Protein', 'Gluten-Free', 'Dairy-Free Adaptable']
        },
        chefSubstitutions: [
          { ifMissing: 'Cotija', substituteWith: 'Feta cheese or salted ricotta salata' }
        ],
        wineOrDrinkPairing: 'Mexican lager with lime, Paloma cocktail, or hibiscus agua fresca.',
        proTips: ['Toast the corn tortillas directly over an open flame for 10 seconds for real street-taco aroma.'],
        similarMeals: [
          {
            id: 'chipotle-chicken-tostadas',
            title: 'Crispy Chipotle Tinga Tostadas with Refried Beans',
            cuisine: 'Mexican',
            spiceLevel: 'Hot',
            prepTimeMinutes: 20,
            calories: 460,
            tagline: 'Crispy baked corn tostadas piled high with beans, tinga chicken, and shredded cabbage.',
            whyYoullLoveIt: 'Identical tinga chicken served on an ultra-crunchy baked tostada shell.'
          }
        ],
        betterAlternatives: [
          {
            id: 'smoked-achiote-confit-tinga-tacos',
            title: 'Mesquite-Smoked Achiote Confit Chicken Street Tacos',
            cuisine: 'Gourmet Mexican',
            spiceLevel: 'Hot',
            prepTimeMinutes: 25,
            calories: 450,
            proteinG: 42,
            tagline: 'Mesquite wood-smoked chicken thigh confit with charred poblano salsa and heirloom corn tortillas.',
            whyItsBetter: 'Smoked over real mesquite wood chips with heritage heirloom Oaxacan corn tortillas made fresh.',
            keyImprovements: ['Real wood-smoke flavor baseline', 'Nutrient-rich heirloom corn tortillas', 'Charred poblano pepper complexity'],
            upgradeAngle: 'Heritage Culinary Craft'
          }
        ]
      }
    }
  },
  {
    id: 'szechuan-kung-pao-chicken',
    label: '🔥 Szechuan fiery kung pao chicken',
    query: 'fiery authentic Szechuan kung pao chicken with peanuts',
    excluded: 'mushrooms',
    candidates: [
      {
        id: 'authentic-szechuan-gong-bao-chicken',
        title: 'Authentic Szechuan Gong Bao (Kung Pao) Chicken',
        cuisine: 'Szechuan Chinese',
        spiceLevel: 'Extra Hot',
        prepTimeMinutes: 15,
        cookTimeMinutes: 10,
        totalTimeMinutes: 25,
        calories: 490,
        proteinG: 44,
        carbsG: 22,
        fatG: 24,
        difficulty: 'Medium',
        tagline: 'Wok-seared diced chicken with tingling Szechuan peppercorns, dried red chilies, scallion rounds, and crunchy roasted peanuts.',
        briefDescription: 'The classic Chengdu dish: spicy, tongue-numbing (Mala), savory-sweet, and crunchy.',
        highlights: ['Tongue-numbing Szechuan peppercorn buzz', 'Crunchy roasted peanuts', 'Velvety tender chicken breast'],
      },
      {
        id: 'szechuan-fiery-chili-crisp-chicken',
        title: 'Fiery Szechuan Chili Crisp & Garlic Chicken',
        cuisine: 'Szechuan Fusion',
        spiceLevel: 'Extra Hot',
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        totalTimeMinutes: 20,
        calories: 460,
        proteinG: 42,
        carbsG: 18,
        fatG: 22,
        difficulty: 'Easy',
        tagline: 'Crispy seared chicken thighs tossed in homemade crunchy chili crisp oil, garlic, and scallions.',
        briefDescription: 'Crispy chicken bites coated in aromatic chili oil with crunchy fried garlic and shallots.',
        highlights: ['Shattering chili crisp crunch', 'Ready in 20 minutes', 'High-heat wok searing'],
      }
    ],
    detailMap: {
      'authentic-szechuan-gong-bao-chicken': {
        id: 'authentic-szechuan-gong-bao-chicken',
        title: 'Authentic Szechuan Gong Bao (Kung Pao) Chicken',
        tagline: 'Wok-seared diced chicken with tingling Szechuan peppercorns, dried red chilies, scallion rounds, and crunchy roasted peanuts.',
        description: 'Tender chicken breast cut into uniform small dice, marinated with Shaoxing wine, soy, and starch (velveting). Flash-fried in a searing wok with fragrant red Szechuan peppercorns and facing-heaven dried chilies, finished with a classic sweet-sour-savory Kung Pao sauce, leeks, and roasted peanuts.',
        cuisine: 'Szechuan Chinese',
        spiceLevel: 'Extra Hot',
        servings: 2,
        prepTimeMinutes: 15,
        cookTimeMinutes: 10,
        totalTimeMinutes: 25,
        calories: 490,
        proteinG: 44,
        carbsG: 22,
        fatG: 24,
        fiberG: 4,
        sodiumMg: 640,
        difficulty: 'Medium',
        ingredients: [
          { name: 'Boneless chicken breast (cut into 1/2 inch dice)', amount: '1', unit: 'lb' },
          { name: 'Whole Szechuan peppercorns', amount: '1.5', unit: 'tsp', notes: 'Gives the signature numbing "ma" sensation' },
          { name: 'Dried whole red Chinese chilies (snipped and deseeded)', amount: '10', unit: 'whole' },
          { name: 'Roasted unsalted peanuts', amount: '0.5', unit: 'cup' },
          { name: 'Scallions / green onions (cut into rounds)', amount: '4', unit: 'stalks' },
          { name: 'Garlic cloves (sliced)', amount: '4', unit: 'cloves' },
          { name: 'Fresh ginger (sliced into small diamonds)', amount: '1', unit: 'tbsp' },
          { name: 'Chinkiang black vinegar', amount: '1.5', unit: 'tbsp', notes: 'Authentic aged Chinese vinegar' },
          { name: 'Low-sodium soy sauce & dark soy', amount: '1.5', unit: 'tbsp' },
          { name: 'Sugar', amount: '1', unit: 'tbsp' },
          { name: 'Shaoxing rice wine', amount: '1', unit: 'tbsp' },
          { name: 'Cornstarch', amount: '2', unit: 'tsp' }
        ],
        instructions: [
          {
            stepNumber: 1,
            instruction: 'Velvet the chicken: toss diced chicken with 1 tsp Shaoxing wine, 1 tsp soy sauce, 1 tsp cornstarch, and 1 tbsp water. Let rest 10 minutes.',
            durationMinutes: 10,
            tip: 'Velveting seals in moisture, guaranteeing that chicken breast stays extraordinarily tender in high-heat stir fry.'
          },
          {
            stepNumber: 2,
            instruction: 'Whisk Kung Pao sauce: Chinkiang black vinegar, soy sauce, dark soy, sugar, 1 tsp cornstarch, and 2 tbsp water in a bowl.',
            durationMinutes: 2
          },
          {
            stepNumber: 3,
            instruction: 'Heat 2 tbsp oil in wok over medium heat. Add Szechuan peppercorns and dried chilies. Sizzle gently for 30 seconds until chilies darken slightly and oil is infused.',
            durationMinutes: 1,
            tip: 'Do not burn the chilies—they should turn rich mahogany, not black.'
          },
          {
            stepNumber: 4,
            instruction: 'Turn heat to high. Add chicken and stir-fry vigorously for 3-4 minutes until color changes.',
            durationMinutes: 4
          },
          {
            stepNumber: 5,
            instruction: 'Add sliced garlic, ginger, and white parts of scallions. Stir fry for 1 minute.',
            durationMinutes: 1
          },
          {
            stepNumber: 6,
            instruction: 'Pour in Kung Pao sauce. Toss rapidly as it thickens into a glossy glaze. Fold in roasted peanuts and green scallions, and remove from heat.',
            durationMinutes: 2
          }
        ],
        healthInsight: {
          score: 86,
          badge: 'Circulation & Bioactive Spice Igniter',
          summary: 'Hydroxy-alpha-sanshool in Szechuan peppercorns activates tactile and thermal sensory receptors, increasing microvascular circulation alongside 44g protein and healthy peanut lipids.',
          macroRatio: { proteinPercent: 36, carbsPercent: 18, fatPercent: 46 },
          healthPros: [
            'Szechuan peppercorn sanshool stimulates neural receptors and promotes blood circulation',
            'Peanuts supply monounsaturated fats, vitamin E, and resveratrol',
            'Chinkiang black vinegar aids in postprandial glucose stabilization'
          ],
          healthCons: ['Slightly higher healthy fat content from roasted peanuts; adjust peanut portion for lower fat'],
          keyNutrients: [
            { name: 'Hydroxy-alpha-sanshool', amount: 'High', benefit: 'Stimulates neural circulation receptors' },
            { name: 'Resveratrol & Vitamin E', amount: 'High', benefit: 'Potent lipid antioxidants from roasted peanuts' }
          ],
          dietarySuitability: ['High Protein', 'Dairy-Free', 'Mushroom-Free']
        },
        chefSubstitutions: [
          { ifMissing: 'Chinkiang Black Vinegar', substituteWith: 'Equal parts balsamic vinegar and rice vinegar' },
          { ifMissing: 'Szechuan Peppercorns', substituteWith: 'Black peppercorns plus a dash of coriander and lemon zest' }
        ],
        wineOrDrinkPairing: 'Off-dry Gewürztraminer, chilled Tsingtao, or cold plum tea.',
        proTips: ['Have all ingredients chopped and measured next to your stove before turning on the heat—wok cooking takes under 5 minutes!'],
        similarMeals: [
          {
            id: 'szechuan-mala-chicken',
            title: 'Szechuan Mala Laziji (Chongqing Crispy Chicken)',
            cuisine: 'Szechuan',
            spiceLevel: 'Extra Hot',
            prepTimeMinutes: 20,
            calories: 510,
            tagline: 'Deeply crisped chicken nuggets buried in an avalanche of toasted dried chilies and Szechuan peppercorns.',
            whyYoullLoveIt: 'Takes the Szechuan peppercorn numbing sensation and cranks the crispiness to the maximum.'
          }
        ],
        betterAlternatives: [
          {
            id: 'chengdu-heritage-kung-pao-smoked-duck',
            title: 'Chengdu Heritage Smoked Kung Pao Chicken & Duck Duo',
            cuisine: 'Master Szechuan',
            spiceLevel: 'Extra Hot',
            prepTimeMinutes: 25,
            calories: 480,
            proteinG: 46,
            tagline: 'Tea-smoked duck breast and velveted chicken with tribute Szechuan Da Hong Pao peppercorns.',
            whyItsBetter: 'Combines delicate tea-smoked duck with velveted chicken and the rarest Grade-A Da Hong Pao red peppercorns for a floral, perfume-like numbing finish without harsh bitterness.',
            keyImprovements: ['Grade-A Da Hong Pao floral peppercorns', 'Dual poultry texture pairing', 'Aged 5-year Sichuan vinegar baseline'],
            upgradeAngle: 'Chengdu Master Chef Precision'
          }
        ]
      }
    }
  }
];

// Helper to look up preloaded meal candidate list
export function getPreloadedCandidatesForQuery(query: string, excluded: string): MealCandidate[] | null {
  const normalizedQ = query.toLowerCase().trim();
  const normalizedEx = excluded.toLowerCase().trim();

  // Find direct match or partial match in PRELOADED_PRESETS
  for (const preset of PRELOADED_PRESETS) {
    const presetQ = preset.query.toLowerCase();
    const presetLabel = preset.label.toLowerCase();

    if (
      normalizedQ === presetQ ||
      normalizedQ.includes(preset.id) ||
      (normalizedQ.includes('spicy') && normalizedQ.includes('chicken') && (preset.id === 'spicy-garlic-honey-chicken' || preset.id === 'gochujang-glazed-chicken')) ||
      (normalizedQ.includes('gochujang') && preset.id === 'gochujang-glazed-chicken') ||
      (normalizedQ.includes('salad') && normalizedQ.includes('protein') && preset.id === 'high-protein-chicken-salad') ||
      (normalizedQ.includes('basil') && normalizedQ.includes('thai') && preset.id === 'thai-spicy-basil-chicken') ||
      (normalizedQ.includes('taco') && preset.id === 'smoky-chipotle-tacos') ||
      (normalizedQ.includes('kung pao') || normalizedQ.includes('szechuan')) && preset.id === 'szechuan-kung-pao-chicken'
    ) {
      return preset.candidates;
    }
  }

  // No default fallback. We want real live data for arbitrary queries!
  return null;
}

// Helper to look up preloaded detail
export function getPreloadedDetailForCandidate(candidateIdOrTitle: string): MealDetail | null {
  const norm = candidateIdOrTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const preset of PRELOADED_PRESETS) {
    for (const [key, detail] of Object.entries(preset.detailMap)) {
      const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const titleNorm = detail.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idNorm = detail.id.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (norm === keyNorm || norm === titleNorm || norm === idNorm || titleNorm.includes(norm) || norm.includes(titleNorm)) {
        return detail;
      }
    }

    // Check if it's one of the candidates in this preset
    for (const cand of preset.candidates) {
      const candIdNorm = cand.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const candTitleNorm = cand.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (norm === candIdNorm || norm === candTitleNorm) {
        // Return first detail or construct matching
        const firstKey = Object.keys(preset.detailMap)[0];
        if (firstKey && preset.detailMap[firstKey]) {
          const base = { ...preset.detailMap[firstKey] };
          base.id = cand.id;
          base.title = cand.title;
          base.tagline = cand.tagline || cand.briefDescription;
          base.cuisine = cand.cuisine;
          base.spiceLevel = cand.spiceLevel;
          base.calories = cand.calories;
          base.proteinG = cand.proteinG;
          base.carbsG = cand.carbsG;
          base.fatG = cand.fatG;
          return base;
        }
      }
    }
  }

  // Return null so we fetch live data if no specific detail is found.
  return null;
}
