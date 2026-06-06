/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Flame, Snowflake, Compass, Leaf } from "lucide-react";
import { useAppState } from "../data/store";

interface Milestone {
  year: string;
  title: string;
  desc: string;
  icon: any;
  accent: string;
}

const milestones: Milestone[] = [
  {
    year: "2012",
    title: "The Sacred Fire",
    desc: "SAMURAI was born in Kyoto. Master Chef Kenji Sato pledged to honor ancient Shinto culinary ethics: choosing pristine fresh cuts under the morning sun.",
    icon: Flame,
    accent: "text-red-500 bg-red-950/40"
  },
  {
    year: "2016",
    title: "The Fusion Horizon",
    desc: "Opening in Paris, we fused centuries-old Edomae sushi style with French classic butter reductions, inventing our signature Aromakis and glazed Teppanyakis.",
    icon: Compass,
    accent: "text-amber-500 bg-amber-950/40"
  },
  {
    year: "2021",
    title: "Michelin Heritage",
    desc: "Rewarded for absolute precision. We introduced the legendary thermal matte black bamboo wood delivery box that locks fresh temperatures down to the precise degree.",
    icon: Award,
    accent: "text-[#C9A227] bg-yellow-950/40"
  },
  {
    year: "2026",
    title: "The Immersive Era",
    desc: "Integrating state-of-the-art interactive tracking, biometric ordering, and rapid drone-delivery ready networks to bring Michelin perfection to your doorstep.",
    icon: Leaf,
    accent: "text-emerald-500 bg-emerald-950/40"
  }
];

export default function StorySection() {
  const [activeStep, setActiveStep] = useState(2); // Default to Award milestone (2021)
  const state = useAppState();
  const story = state.story;
  const settings = state.settings;

  return (
    <section className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto z-20 text-white select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Story Text Column */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <span className="w-12 h-[1px] bg-[#C9A227]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#C9A227] font-mono">
              THE {settings.restaurantName.replace(" TOKYO FUSION", "")} HERITAGE
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tight leading-tight text-white uppercase">
            {story.title}
          </h2>

          <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed max-w-lg select-text">
            {story.text}
          </p>

          <blockquote className="border-l-[3px] border-red-600 pl-4 py-1 italic text-gray-300 font-sans text-xs max-w-md select-text">
            &ldquo;We don&apos;t just prepare gastronomy. We sculpt raw fire and seas into dynamic poetry that tells a thousand-year-old story.&rdquo;
            <cite className="block text-[10px] uppercase tracking-widest text-[#C9A227] font-mono mt-2 not-italic">
              — Chef Kenzo Sato
            </cite>
          </blockquote>

          {/* Luxury Brush stroke button */}
          <div className="pt-4">
            <a 
              href="#full-menu"
              className="inline-flex items-center space-x-3 px-6 py-3 border border-stone-800 bg-stone-900/60 hover:bg-stone-950/80 transition-all text-xs tracking-[0.25em] text-[#C9A227] hover:text-white uppercase transition-duration-300"
            >
              <span>Explore Culinary Timeline</span>
              <span className="text-red-500">→</span>
            </a>
          </div>
        </div>

        {/* Interactive Timeline column */}
        <div className="relative p-6 md:p-8 bg-[#111111]/80 border border-stone-800 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="absolute top-4 right-4 flex space-x-1.5">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-stone-800 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-stone-800 rounded-full"></span>
          </div>

          {/* Timeline Indicators */}
          <div className="flex justify-between items-center mb-10 border-b border-stone-800 pb-6 relative">
            {milestones.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setActiveStep(idx)}
                className="relative flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <span
                  className={`text-xs md:text-sm font-mono font-medium mb-2 transition-colors ${
                    activeStep === idx ? "text-[#C9A227] scale-110" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                >
                  {m.year}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    activeStep === idx
                      ? "bg-red-600/90 text-white ring-4 ring-red-950/60"
                      : "bg-stone-900 text-gray-500 group-hover:bg-stone-800 group-hover:text-gray-300"
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                </div>
                {activeStep === idx && (
                  <motion.div
                    layoutId="timeline-glow"
                    className="absolute -bottom-[26px] w-12 h-1 bg-red-600 rounded-full shadow-lg"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Active Milestone Display */}
          <div className="min-h-[160px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${milestones[activeStep].accent}`}>
                    {(() => {
                      const IconComp = milestones[activeStep].icon;
                      return <IconComp className="w-5 h-5" />;
                    })()}
                  </div>
                  <h4 className="text-xl font-medium tracking-tight text-white">
                    {milestones[activeStep].title} – {milestones[activeStep].year}
                  </h4>
                </div>

                <p className="text-gray-400 font-sans text-xs md:text-sm leading-relaxed">
                  {milestones[activeStep].desc}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#C9A227]/80 bg-stone-950 border border-stone-800 px-2 py-0.5 rounded uppercase">
                    Edomae Precision
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-red-500/80 bg-stone-950 border border-stone-800 px-2 py-0.5 rounded uppercase">
                    Michelin Level
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
