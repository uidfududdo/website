/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Flame, Clock, Heart, Sparkles, Filter, X, ChevronRight, ShieldCheck } from "lucide-react";
import { MenuItem, MenuItemCategory } from "../types";

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  selectedDish: MenuItem | null;
  setSelectedDish: (item: MenuItem | null) => void;
  menuItems: MenuItem[];
}

export default function MenuSection({ onAddToCart, selectedDish, setSelectedDish, menuItems }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | "low-cal" | "spicy" | "chef">("all");

  // Generate dynamic category index lists dynamically
  const categories = useMemo(() => {
    return ["All", ...Object.values(MenuItemCategory)];
  }, []);

  // Filter items based on Category, Search query and Dietary limits
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDiet = true;
      if (dietFilter === "low-cal") {
        matchesDiet = item.calories <= 300;
      } else if (dietFilter === "spicy") {
        matchesDiet = (item.spicyLevel || 0) > 0;
      } else if (dietFilter === "chef") {
        matchesDiet = !!item.isChefSpecial;
      }

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [activeCategory, searchQuery, dietFilter, menuItems]);

  // Smart Upsell Feature (Show items from appropriate categories based on items searched)
  const recommendations = useMemo(() => {
    return menuItems.filter(item => item.isChefSpecial && item.id !== selectedDish?.id).slice(0, 3);
  }, [selectedDish, menuItems]);

  return (
    <section id="full-menu" className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto z-20 text-white select-none">
      
      {/* Search Header Container */}
      <div className="bg-stone-950/80 border border-stone-900 rounded-3xl p-6 md:p-8 backdrop-blur-xl mb-12 shadow-2xl relative">
        <div className="absolute -top-4 left-6 bg-[#C9A227] text-black text-[10px] tracking-widest uppercase font-mono py-1 px-3.5 rounded font-bold">
          DIGITAL LUXURY DISK INDEX
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Headline and search feedback */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-sans font-semibold text-white">
              Savor the Samurai Selection
            </h3>
            <p className="text-gray-500 text-xs font-sans leading-relaxed text-stone-500">
              Explore {menuItems.length} premium dishes instantly filtered. Sourced daily, prepared live with precision.
            </p>
          </div>

          {/* Interactive Search Field */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sushi, ingredients, woks..."
              className="w-full bg-[#111111] text-white border border-stone-800 rounded-xl py-3 pl-11 pr-4 focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none font-sans text-xs tracking-wider"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Smart Tags filter line */}
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
            <button
              onClick={() => setDietFilter("all")}
              className={`text-[10px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-lg border ${
                dietFilter === "all" 
                  ? "bg-red-600 border-red-500 text-white font-bold" 
                  : "bg-stone-900 border-stone-800 text-gray-400 hover:text-white"
              } transition-all cursor-pointer`}
            >
              All Speclalties
            </button>
            <button
              onClick={() => setDietFilter("chef")}
              className={`text-[10px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-lg border ${
                dietFilter === "chef" 
                  ? "bg-[#C9A227] border-[#C9A227] text-black font-bold" 
                  : "bg-stone-900 border-stone-800 text-gray-400 hover:text-[#C9A227]"
              } transition-all cursor-pointer`}
            >
              ★ Chef Exclusives
            </button>
            <button
              onClick={() => setDietFilter("low-cal")}
              className={`text-[10px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-lg border ${
                dietFilter === "low-cal" 
                  ? "bg-emerald-600 border-emerald-500 text-white font-bold" 
                  : "bg-stone-900 border-stone-800 text-gray-400 hover:text-emerald-400"
              } transition-all cursor-pointer`}
            >
              🍃 Low Cal (≤300 kcal)
            </button>
          </div>

        </div>

        {/* Categories Pills - Horizontally Scrollable list on mobile */}
        <div className="mt-8 border-t border-stone-900/60 pt-6">
          <div className="flex items-center space-x-2 text-gray-500 text-xs font-mono mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span>CATEGORIES:</span>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-mono tracking-wider uppercase px-4 py-2 rounded-full border shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white text-black border-white font-bold"
                    : "bg-[#111111]/80 border-stone-800 hover:border-gray-500 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Culinary Items grid */}
      <div className="min-h-[400px]">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-stone-950/25 border border-dashed border-stone-800 rounded-3xl">
            <p className="text-[#C9A227] font-mono text-sm tracking-widest uppercase mb-2">
              No Culinary Items Match Filter
            </p>
            <p className="text-gray-500 text-xs max-w-sm font-sans">
              Apologies, Master Sato is currently adjusting ingredients. Try searching with general terms like &quot;Salmon&quot;, &quot;Tempura&quot; or &quot;Roll&quot;.
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); setDietFilter("all"); }}
              className="mt-6 text-xs uppercase tracking-widest text-white underline focus:outline-none cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-stone-900/35 hover:bg-stone-900/60 transition-all border border-stone-900/80 hover:border-[#C9A227]/30 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                        {item.category}
                      </span>
                      {item.isBestSeller && (
                        <span className="text-[8px] font-bold font-mono tracking-widest text-[#C9A227] border border-[#C9A227]/30 px-1.5 py-0.5 rounded uppercase">
                          Popular
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-sans font-medium text-white">
                      {item.name}
                    </h4>

                    <p className="text-gray-400 font-sans text-xs line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center space-x-3 text-gray-500 text-[11px] font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500/80" />
                        <span>{item.prepTime} Mins</span>
                      </span>
                      <span>•</span>
                      <span>{item.calories} kCal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-900/80 mt-4 pt-3">
                    <span className="text-lg font-sans font-bold text-white">
                      €{item.price.toFixed(2)}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedDish(item)}
                        className="text-xs uppercase tracking-widest text-[#C9A227] hover:text-white bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-mono text-xs font-bold uppercase cursor-pointer transition-all"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* DISH DETAILS MODAL - IMMERSIVE OVERLAY */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#111111] border border-stone-800 max-w-2xl w-full rounded-2xl overflow-hidden p-6 md:p-8 space-y-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute right-4 top-4 p-2 text-gray-500 hover:text-white rounded-full bg-stone-900 border border-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#C9A227] uppercase">
                <span>{selectedDish.category}</span>
                <span>•</span>
                <span>Michelin Curation No. {selectedDish.id}</span>
              </div>

              {/* Title & Stats */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-sans font-semibold text-white">
                  {selectedDish.name}
                </h3>
                <p className="text-gray-400 font-sans text-sm leading-relaxed">
                  {selectedDish.description}
                </p>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-red-500 font-mono font-bold">
                  Sourced Raw Ingredients:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-stone-300 font-sans text-xs">
                  {selectedDish.ingredients.map((ing, iIdx) => (
                    <div key={iIdx} className="flex items-center space-x-2 bg-stone-950 px-3 py-2 border border-stone-900 rounded">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caloric & Utility Specs */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-stone-900 py-4 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-500 block uppercase">Preparation Time</span>
                  <span className="text-sm font-sans font-semibold text-white">{selectedDish.prepTime} Mins</span>
                </div>
                <div className="space-y-1 border-l border-r border-stone-900">
                  <span className="text-[9px] font-mono text-gray-500 block uppercase">Energy Rating</span>
                  <span className="text-sm font-sans font-semibold text-white">{selectedDish.calories} kCal</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-500 block uppercase">Spicy Heat Index</span>
                  <span className="text-sm font-sans font-semibold text-red-500">
                    {selectedDish.spicyLevel && selectedDish.spicyLevel > 0 
                      ? Array(selectedDish.spicyLevel).fill("🔥").join("") 
                      : "Sweet / Savory"}
                  </span>
                </div>
              </div>

              {/* Recommendations Sideboard Section */}
              <div className="bg-stone-950 border border-stone-900/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-[#C9A227] text-[10px] font-mono uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>RECOMMENDED SIDE PAIRINGS:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      onClick={() => setSelectedDish(rec)}
                      className="flex-1 bg-[#111111] hover:bg-stone-900 border border-stone-850 p-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-sans text-stone-200 block truncate max-w-[120px]">{rec.name}</span>
                        <span className="text-xs font-mono font-bold text-[#C9A227]">€{rec.price.toFixed(2)}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-650" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-[#C9A227]">NET BILL</span>
                  <span className="text-2xl font-bold font-sans text-white">€{selectedDish.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(selectedDish);
                    setSelectedDish(null);
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  ADD TO LUXURY CART NOW
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
