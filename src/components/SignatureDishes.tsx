/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Flame, Eye, Leaf, Plus } from "lucide-react";
import { MenuItem } from "../types";

interface SignatureProps {
  onAddToCart: (item: MenuItem) => void;
  onSelectDish: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

export default function SignatureDishes({ onAddToCart, onSelectDish, menuItems }: SignatureProps) {
  // Pull our specific signature items, fall back to first 6 chef specials if altered
  const defaultSignatures = menuItems.filter(item => 
    ["aro-1", "cal-1", "wok-1", "tap-1", "ebi-1", "sal-1"].includes(item.id)
  );
  const signatures = defaultSignatures.length > 0 ? defaultSignatures : menuItems.filter(i => i.isChefSpecial).slice(0, 6);

  return (
    <section className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto z-20 text-white select-none">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 space-y-6 md:space-y-0">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="w-12 h-[1px] bg-red-600"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-red-500 font-mono">
              CHEF&apos;S MASTERPIECES
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white leading-tight">
            The Signature <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#C9A227]">
              Curation Index
            </span>
          </h2>
        </div>
        
        <p className="text-gray-400 font-sans text-xs md:text-sm max-w-sm leading-relaxed border-l border-stone-800 pl-4">
          Crafted to absolute geometric perfection. Six supreme edible art forms embodying centuries of discipline, delivered ready for degustation.
        </p>
      </div>

      {/* Bento-like Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {signatures.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="dish-premium-card group relative bg-stone-950/60 border border-stone-900 rounded-2xl overflow-hidden p-6 hover:border-red-600/50 transition-all duration-300 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[380px]"
          >
            {/* Background luxury gradient flares */}
            <div className="absolute inset-0 bg-radial-gradient from-red-950/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glowing Accent Ring wrapper that mimics 3D depth */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 z-30">
              {item.isChefSpecial && (
                <span className="text-[9px] font-mono tracking-widest text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/30 px-2 py-0.5 rounded-full uppercase font-bold">
                  Chef Choice
                </span>
              )}
              {item.isBestSeller && (
                <span className="text-[9px] font-mono tracking-widest text-red-500 bg-red-950/30 border border-red-900/50 px-2 py-0.5 rounded-full uppercase font-bold">
                  Bestseller
                </span>
              )}
            </div>

            {/* Simulated 3D interactive icon / dynamic dish avatar */}
            <div className="relative mt-4 mb-6 flex justify-center items-center h-40">
              {/* Spinning background zen plate ring */}
              <div className="absolute w-36 h-36 border border-dashed border-[#C9A227]/20 rounded-full group-hover:rotate-180 group-hover:border-red-600/40 transition-transform duration-[6000ms]" />
              <div className="absolute w-28 h-28 border border-double border-stone-800 rounded-full scale-100 group-hover:scale-110 transition-transform duration-500" />
              
              {/* Dynamic Visual Avatar Representation of the Sushi/Wok */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#0F0F0F] to-[#252525] flex items-center justify-center border border-[#C9A227]/50 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 shadow-xl z-20">
                {item.id === "aro-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(211,47,47,0.4)]">🍣</span>
                )}
                {item.id === "cal-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(201,162,39,0.4)]">🍱</span>
                )}
                {item.id === "wok-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(211,47,47,0.4)]">🥢</span>
                )}
                {item.id === "tap-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(211,47,47,0.4)]">🦐</span>
                )}
                {item.id === "ebi-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(201,162,39,0.4)]">🍤</span>
                )}
                {item.id === "sal-1" && (
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(76,175,80,0.4)]">🥗</span>
                )}

                {/* Ambient glow */}
                <div className="absolute inset-0 bg-red-600/10 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Float indicators */}
              {item.spicyLevel && item.spicyLevel > 0 && (
                <div className="absolute bottom-4 left-6 flex items-center space-x-0.5 text-red-500 bg-red-950/20 px-2 py-0.5 rounded-md border border-red-500/10">
                  <Flame className="w-3.5 h-3.5 fill-red-500" />
                  <span className="text-[10px] font-mono">{Array(item.spicyLevel).fill("🔥").join("")}</span>
                </div>
              )}
              
              <div className="absolute bottom-4 right-6 text-gray-500 font-mono text-[10px] tracking-wide">
                ★ {item.rating.toFixed(1)} Rating
              </div>
            </div>

            {/* Text description */}
            <div className="space-y-3 z-20">
              <h3 className="text-xl font-sans font-medium text-white group-hover:text-red-500 transition-colors">
                {item.name}
              </h3>
              
              <p className="text-gray-400 font-sans text-xs line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Shaded ingredient chips */}
              <div className="flex flex-wrap gap-1.5 pt-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {item.ingredients.slice(0, 3).map((ing, iIdx) => (
                  <span 
                    key={iIdx}
                    className="text-[10px] font-sans text-stone-350 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Action footer values */}
            <div className="flex items-center justify-between border-t border-stone-900 mt-6 pt-4 z-20">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono tracking-widest text-[#C9A227] block">PRICE</span>
                <span className="text-xl font-sans font-bold text-white">
                  €{item.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* View Details Button */}
                <button
                  onClick={() => onSelectDish(item)}
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-gray-400 hover:text-[#C9A227] transition-all cursor-pointer"
                  title="View Ingredients"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Add To Cart Trigger */}
                <button
                  onClick={() => onAddToCart(item)}
                  className="cart-trigger inline-flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 border border-red-500 rounded-xl text-white font-sans text-xs tracking-wide transition-all cursor-pointer shadow-lg shadow-red-950/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold uppercase font-mono tracking-wider">ADD</span>
                </button>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
}
