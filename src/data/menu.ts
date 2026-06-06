/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, MenuItemCategory, Review } from "../types";

export const MENU_ITEMS: MenuItem[] = [
  // AROMAKIS
  {
    id: "aro-1",
    name: "Aromaki Saumon Avocat",
    category: MenuItemCategory.AROMAKIS,
    description: "Premium roll wrapped in thin sliced avocado, topped with salmon tartare, dynamic yuzu pearls, and house glazed teriyaki sauce.",
    price: 16.50,
    ingredients: ["Premium Atlantic Salmon", "Hass Avocado", "Yuzu Caviar Pearls", "Teriyaki Reduction", "Koshihikari Rice"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 320,
    prepTime: 12,
    rating: 4.9,
    spicyLevel: 0
  },
  {
    id: "aro-2",
    name: "Spicy Tuna Aromaki",
    category: MenuItemCategory.AROMAKIS,
    description: "Delicate bluefin tuna combined with signature volcanic sriracha emulsion, rolled in black toasted sesame seed, microgreens.",
    price: 17.00,
    ingredients: ["Bluefin Tuna", "Sriracha Emulsion", "Black Toasted Sesame", "Koshihikari Rice", "Serrated Shiso Leaves"],
    isBestSeller: false,
    calories: 290,
    prepTime: 10,
    rating: 4.8,
    spicyLevel: 2
  },

  // CALIFORNIA ROLLS
  {
    id: "cal-1",
    name: "California Rainbow",
    category: MenuItemCategory.CALIFORNIA_ROLLS,
    description: "Luxury combination roll draped in a spectrum of freshly cut Yellowtail tuna, Atlantic salmon, sea bass, and avocado, filled with king crab.",
    price: 19.50,
    ingredients: ["King Crab", "Atlantic Salmon", "Yellowtail Amberjack", "Sea Bass", "Hass Avocado", "Cucumber Capillaries"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 380,
    prepTime: 15,
    rating: 5.0,
    spicyLevel: 0
  },
  {
    id: "cal-2",
    name: "California Saumon Avocat",
    category: MenuItemCategory.CALIFORNIA_ROLLS,
    description: "Elegant toasted sesame roll encasing succulent hand-sliced Atlantic salmon and buttery ripe avocado, dressed with standard organic nori.",
    price: 13.50,
    ingredients: ["Atlantic Salmon", "Toasted Sesame", "Avocado", "Crisp Cucumber", "Nori", "Japanese Mayo"],
    isBestSeller: false,
    calories: 310,
    prepTime: 10,
    rating: 4.7,
    spicyLevel: 0
  },

  // TAPANYAKIS
  {
    id: "tap-1",
    name: "Tapanyaki Gambas",
    category: MenuItemCategory.TAPANYAKIS,
    description: "Jumbo King Tiger prawns seared on our signature volcanic teppan, flamed in luxury sake, soy dashi butter glaze.",
    price: 28.00,
    ingredients: ["King Tiger Prawns", "Organic Sake reduction", "Dashi Butter", "Ginger shoots", "Charred Asparagus Spear"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 420,
    prepTime: 18,
    rating: 4.9,
    spicyLevel: 1
  },
  {
    id: "tap-2",
    name: "Tapanyaki Saumon Glacé",
    category: MenuItemCategory.TAPANYAKIS,
    description: "Fresh Norwegian salmon steak seared on the iron grill with crisp skins, infused with rich mirin and white miso, toasted sesame.",
    price: 24.50,
    ingredients: ["Norwegian Salmon Prime Cut", "Sweet Mirin", "White Shiro Miso", "Sesame crisps", "Teppan-grilled scallions"],
    isBestSeller: false,
    calories: 510,
    prepTime: 16,
    rating: 4.8,
    spicyLevel: 0
  },

  // WOKS
  {
    id: "wok-1",
    name: "Wok Mixte",
    category: MenuItemCategory.WOKS,
    description: "Hand-pulled wheat noodles wok-tossed over extreme flames with Prime Angus beef strips, tender chicken tenders, baby bok choy and garlic soy.",
    price: 18.50,
    ingredients: ["Angus Beef Slices", "Organic Chicken Breast", "Artisanal Wheat Noodles", "Baby Bok Choy", "Garlic Soy Umami sauce"],
    isBestSeller: true,
    calories: 580,
    prepTime: 12,
    rating: 4.9,
    spicyLevel: 1
  },
  {
    id: "wok-2",
    name: "Wok Nouilles Crevettes",
    category: MenuItemCategory.WOKS,
    description: "Sautéed egg noodles combined with wok-charred shrimp, red cabbage julienne, premium bamboo shoots, and a rich oyster-chili glaze.",
    price: 17.50,
    ingredients: ["Atlantic Shrimps", "Golden Egg Noodles", "Red Cabbage Julienne", "Organic Bamboo Shoots", "Savory Oyster Sauce"],
    isBestSeller: false,
    calories: 490,
    prepTime: 11,
    rating: 4.7,
    spicyLevel: 2
  },

  // NEMS
  {
    id: "nem-1",
    name: "Nems Poulet (4pcs)",
    category: MenuItemCategory.NEMS,
    description: "Ultra-crispy hand-rolled spring rolls filled with juicy free-range minced chicken, glass noodles, wood-ear mushroom slivers, served with sweet chili dipping.",
    price: 8.50,
    ingredients: ["Minced Chicken", "Cellophane Rice Noodles", "Dried Wood Ear Mushrooms", "Nước Chấm sauce", "Crisp Lettuce leaves"],
    isBestSeller: false,
    calories: 260,
    prepTime: 8,
    rating: 4.6,
    spicyLevel: 0
  },
  {
    id: "nem-2",
    name: "Nems Crevettes (4pcs)",
    category: MenuItemCategory.NEMS,
    description: "Delicate rice wrapper pastry crisped to light golden-brown perfection, holding vibrant whole wild shrimp seasoned with coriander roots and white pepper.",
    price: 9.50,
    ingredients: ["Wild-caught Shrimps", "Handmade Rice Paper", "Fresh Coriander Root", "White Pepper infusion", "Mint Leaves"],
    isBestSeller: true,
    calories: 220,
    prepTime: 8,
    rating: 4.8,
    spicyLevel: 0
  },

  // SOUPES
  {
    id: "sop-1",
    name: "Miso Soupe Traditionnelle",
    category: MenuItemCategory.SOUPES,
    description: "Authentic dynamic dashi broth cooked with natural fermented organic yellow miso paste, containing silken tofu cubes, wakame dashi kelp, and fine scallion loops.",
    price: 5.50,
    ingredients: ["Fermented Yellow Miso", "Kombu Seaweed", "Silken Organic Tofu", "Green Scallions", "Bonito Extract"],
    isBestSeller: false,
    calories: 90,
    prepTime: 4,
    rating: 4.5,
    spicyLevel: 0
  },
  {
    id: "sop-2",
    name: "Tom Yum Seafood Infused",
    category: MenuItemCategory.SOUPES,
    description: "A hot & sour broth perfumed with fresh lemongrass stalks, young galangal rhizome, kaffir lime, hosting pristine squid, scallops, and wild shrimp.",
    price: 12.00,
    ingredients: ["Fresh Lemongrass", "Wild Squid Rings", "Japanese Scallops", "Lime leaves", "Volcanic Chili Oil"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 210,
    prepTime: 9,
    rating: 4.9,
    spicyLevel: 3
  },

  // COMBOS
  {
    id: "cmb-1",
    name: "Kyoto Premium Plat",
    category: MenuItemCategory.COMBOS,
    description: "The ultimate raw curation: 8 Signature Aromakis, 6 Salmon Nigiri, 6 Tuna Nigiri, and 8 crisp Chef special California rolls.",
    price: 46.00,
    ingredients: ["Selected Salmon", "Bluefin Tuna", "Premium Nigiri Vinegared Rice", "Toasted Sesame", "Hand-grated organic Shizuoka Wasabi"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 890,
    prepTime: 20,
    rating: 5.0,
    spicyLevel: 0
  },
  {
    id: "cmb-2",
    name: "Samurai Combo Supreme",
    category: MenuItemCategory.COMBOS,
    description: "A grandiose selection of grilled, wok-fried, and rolled delicacies designed for two: 2 skewers of chicken yakitori, Wok Mixte, and 8 California rolls.",
    price: 52.00,
    ingredients: ["Chicken Yakitori", "Beef Tenderloins", "Wok Noodles", "Tuna California Rolls", "Pickled Shoga Ginger"],
    isBestSeller: false,
    calories: 1100,
    prepTime: 22,
    rating: 4.9,
    spicyLevel: 1
  },

  // BŒUFS
  {
    id: "buf-1",
    name: "Bœuf Sauté aux Poivrons",
    category: MenuItemCategory.BOEUFS,
    description: "Succulent cubes of tender beef tenderloin wok-seared over intense white charcoal embers, caramelized with garlic sweet soy, red bells, red onion.",
    price: 22.00,
    ingredients: ["Cured Beef Tenderloin", "Sweet Sovereign Bell Pepper", "Garlic Soy Glaze", "Toasted Sesame", "Green Scallion segments"],
    isBestSeller: true,
    calories: 440,
    prepTime: 14,
    rating: 4.8,
    spicyLevel: 1
  },
  {
    id: "buf-2",
    name: "Tataki de Bœuf Impérial",
    category: MenuItemCategory.BOEUFS,
    description: "Delicately flash-seared, raw-centered prime beef loin thin-sliced, drizzled with exquisite garlic ponzu, crispy shallots, shaved black garlic.",
    price: 21.00,
    ingredients: ["Prime Beef Loin", "Citrus Ponzu", "Crispy Organic Shallots", "Shaved Black Garlic", "Serrated Shiso"],
    isBestSeller: false,
    isChefSpecial: true,
    calories: 310,
    prepTime: 10,
    rating: 4.9,
    spicyLevel: 0
  },

  // RIZ CANTONNAIS
  {
    id: "riz-1",
    name: "Riz Cantonnais Royal",
    category: MenuItemCategory.RIZ_CANTONNAIS,
    description: "Wok-fried premium jasmine rice tossed with sweet cured barbecue glaze, ocean shrimp chunks, farm fresh organic egg ribbon, sweet green peas.",
    price: 11.50,
    ingredients: ["Jasmine Rice", "Cured Char Siu", "Sweet Shrimp Chunks", "Cage-free Egg ribbons", "Sweet French Peas"],
    isBestSeller: false,
    calories: 390,
    prepTime: 8,
    rating: 4.7,
    spicyLevel: 0
  },

  // EBIS
  {
    id: "ebi-1",
    name: "Ebi Tempura (5pcs)",
    category: MenuItemCategory.EBIS,
    description: "Pristine whole sweet shrimp coated in crispy Japanese lace-tempura batter, fried to safe 180°C, served with warm tentsuyu dipping.",
    price: 14.00,
    ingredients: ["Sweet Prawns", "Crisp Lace Rice flour batter", "Warm Tentsuyu broth", "Daikon radish snow", "Mirin essence"],
    isBestSeller: true,
    calories: 250,
    prepTime: 9,
    rating: 4.9,
    spicyLevel: 0
  },

  // SAMURAI FRY
  {
    id: "fry-1",
    name: "Crispy Samurai Roll Fry",
    category: MenuItemCategory.SAMURAI_FRY,
    description: "A premium flash-fried roll containing cooked salmon, high-grade cream cheese and legal avocado, covered with crisp crunchy panko, sriracha honey drizzle.",
    price: 15.50,
    ingredients: ["Double Cooked Salmon", "Premium Cream Cheese", "Ripe Avocado", "Panko flakes", "Spicy Honey-Sriracha"],
    isBestSeller: true,
    isChefSpecial: true,
    calories: 450,
    prepTime: 12,
    rating: 5.0,
    spicyLevel: 1
  },

  // SALADES
  {
    id: "sal-1",
    name: "Salade Exotique",
    category: MenuItemCategory.SALADES,
    description: "Healthy salad featuring organic dynamic mango strips, sweet lobster claw meat, cherry tomatoes, mixed field crisp baby lettuce, drizzled with passionfruit ginger glaze.",
    price: 15.00,
    ingredients: ["Organic Mango Ribbon", "Sweet Lobsters claws", "Cherry heirloom Tomatoes", "Fresh Mint", "Passionfruit Zesty Vinaigrette"],
    isBestSeller: false,
    calories: 190,
    prepTime: 8,
    rating: 4.6,
    spicyLevel: 0
  },

  // BROCHETTES
  {
    id: "bro-1",
    name: "Yakitori Poulet Fromage (3pcs)",
    category: MenuItemCategory.BROCHETTES,
    description: "Sweet soy coated skewers of chicken thigh rolled around melting Emmental cheese core, charred to glazed, caramelized golden perfection.",
    price: 9.00,
    ingredients: ["Chicken Thigh Cubes", "Emmental Cheese core", "Sweet Teriyaki Mirin tare", "Toasted sesame sprinkling"],
    isBestSeller: true,
    calories: 340,
    prepTime: 10,
    rating: 4.8,
    spicyLevel: 0
  },

  // BOISSONS
  {
    id: "drk-1",
    name: "Matcha Tea Fusion Glacé",
    category: MenuItemCategory.BOISSONS,
    description: "Finely whisked ceremony-grade Uji matcha poured over chilled crystal spring ice cubes, lightly touched with organic jasmine nectar.",
    price: 6.50,
    ingredients: ["Uji Ceremonial Matcha", "Chilled Spring Water", "Organic Jasmine Nectar", "Vibrant Mint leaves"],
    isBestSeller: false,
    calories: 45,
    prepTime: 3,
    rating: 4.8,
    spicyLevel: 0
  },
  {
    id: "drk-2",
    name: "Limonade Ramune Tradition",
    category: MenuItemCategory.BOISSONS,
    description: "Classic sparkling dynamic carbonated soda with the iconic glass marble stopper mechanism, flavored with natural wild strawberry extract.",
    price: 5.00,
    ingredients: ["Carbonated Ramune Soda", "Natural Strawberry Extract", "Pure cane sugars"],
    isBestSeller: false,
    calories: 95,
    prepTime: 2,
    rating: 4.6,
    spicyLevel: 0
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Alexander Vance",
    rating: 5,
    comment: "The Aromaki Saumon literally melts in your mouth. The cinematic delivery timing was down to the minute, and the interactive tracking felt like a beautiful live video game. Outstanding luxury experience!",
    role: "Michelin Guide Reviewer",
    date: "2 days ago"
  },
  {
    id: "rev-2",
    name: "Mai Tanaka",
    rating: 5,
    comment: "Pure visual artistry matching phenomenal kitchen mastery. Samurai bridges Parisian elegance with Tokyo's authentic traditional tastes beautifully. Authentic wasabi is the ultimate touch.",
    role: "Gastronomic Critic",
    date: "1 week ago"
  },
  {
    id: "rev-3",
    name: "Claire de Lune",
    rating: 5,
    comment: "Ordering tonight changed my expectations forever. The packaging is premium thermal matte-black wood boxes, and the Tom Yum Seafood souped broth arrived boiling hot!",
    role: "Verified Epicurean Client",
    date: "3 hours ago"
  }
];
