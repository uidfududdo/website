/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Compass, Flame, Shield, Truck, Sparkles, MapPin, CheckCircle, Timer } from "lucide-react";

interface Step {
  id: number;
  label: string;
  desc: string;
  icon: any;
  duration: number; // typical percent or time
}

const steps: Step[] = [
  {
    id: 1,
    label: "Gastronomic Selection",
    desc: "The client selects from Master Sato's fresh, limited daily menu.",
    icon: Compass,
    duration: 5,
  },
  {
    id: 2,
    label: "Safe Order Lock",
    desc: "Order is registered and immediate ingredients allocation begins.",
    icon: Shield,
    duration: 10,
  },
  {
    id: 3,
    label: "Handcrafted Preparation",
    desc: "Slices compiled at exact 36.5°C body heat or seared in teppans.",
    icon: Flame,
    duration: 25,
  },
  {
    id: 4,
    label: "Thermal Wood Dispatch",
    desc: "Secured in high-end matte-black thermal bamboo boxes for premium isolation.",
    icon: Truck,
    duration: 15,
  },
];

export default function InteractiveDelivery() {
  const [activeStep, setActiveStep] = useState(2); // Default to Preparing stage for premium look
  const [pulsingNode, setPulsingNode] = useState(true);

  useEffect(() => {
    // Loop steps to make it feel like a live simulation or dynamic workflow
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto z-20 text-white select-none">
      
      {/* Background radial soft light beams */}
      <div className="absolute inset-0 bg-radial-gradient from-red-950/5 via-transparent to-transparent pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Visual Map/Dashboard column */}
        <div className="order-2 lg:order-1 relative bg-stone-950 border border-stone-900 rounded-3xl p-6 overflow-hidden shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-900 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-red-650 rounded-full animate-ping"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-gray-400">
                LIVE THERMAL TRANSIT NETWORK
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono bg-stone-900 px-2.5 py-1 rounded border border-stone-850 text-[#C9A227]">
              <Timer className="w-3.5 h-3.5" />
              <span>AVG SPEED: 24 km/h</span>
            </div>
          </div>

          {/* Holographic grid simulation with rotating radial radars */}
          <div className="relative h-64 bg-[#080808] border border-stone-905 overflow-hidden rounded-2xl flex items-center justify-center">
            
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute w-48 h-48 border border-[#C9A227]/5 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-72 h-72 border border-red-500/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

            {/* Simulated Radar Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 origin-center rotate-45 animate-[spin_8s_linear_infinite]" />

            {/* Origin & Destination Nodes */}
            <div className="absolute left-10 bottom-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500 flex items-center justify-center shadow-lg shadow-red-950/50 z-20">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-2">SAMURAI HQ</span>
            </div>

            <div className="absolute right-12 top-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227] flex items-center justify-center shadow-lg shadow-yellow-950/50 z-20 animate-bounce">
                <MapPin className="w-5 h-5 text-[#C9A227]" />
              </div>
              <span className="text-[10px] font-mono text-stone-400 mt-2 uppercase tracking-widest font-bold">YOUR ESTATE</span>
            </div>

            {/* Interactive Moving Delivery Line Vector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 250">
              <path
                id="trans-path"
                d="M 60,195 Q 160,50 250,150 T 440,65"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
              />
              <motion.path
                d="M 60,195 Q 160,50 250,150 T 440,65"
                fill="none"
                stroke="url(#dashed-g)"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              
              <defs>
                <linearGradient id="dashed-g" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D32F2F" />
                  <stop offset="100%" stopColor="#C9A227" />
                </linearGradient>
              </defs>

              {/* Animated Rider Circle indicator */}
              <circle cx="210" cy="118" r="6" fill="#D32F2F" className="animate-pulse" />
              <circle cx="210" cy="118" r="14" fill="transparent" stroke="#D32F2F" strokeWidth="1" className="animate-ping" style={{ animationDuration: "3s" }} />
            </svg>

            {/* Active tracking notification box */}
            <div className="absolute bottom-4 right-4 bg-stone-950/95 border border-stone-850 px-3 py-2 rounded-lg backdrop-blur shadow-xl max-w-[200px]">
              <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 font-bold uppercase mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THERMOSHOLD LOCK</span>
              </div>
              <p className="text-[9px] text-gray-500 font-sans leading-tight">
                Vitals: 68°C thermal core pressure locked securely.
              </p>
            </div>

          </div>

          <div className="flex justify-between items-center bg-[#0d0d0d] border border-stone-900 rounded-xl p-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase">Estimated arrival</span>
              <p className="text-sm font-sans font-semibold text-white">
                18 - 25 Minutes Maximum
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/20 uppercase">
                Zero Carbon Ready
              </span>
            </div>
          </div>
        </div>

        {/* Narrative steps timeline info column */}
        <div className="order-1 lg:order-2 space-y-8">
          <div className="flex items-center space-x-3">
            <span className="w-12 h-[1px] bg-red-650"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-red-500 font-mono">
              PREMIUM DELIVERY SEQUENCE
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white leading-tight">
            Designed For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#C9A227]">
              Uncompromising Speed
            </span>
          </h2>

          <p className="text-gray-400 font-sans text-xs md:text-sm leading-relaxed max-w-md">
            Our specialized courier network is dedicated specifically to single orders. 
            No batch-grouping or multi-stop delivery. Your order leaves Samurai HQ and travels 
            as an absolute straight-line coordinate straight to your home.
          </p>

          <div className="space-y-4 pt-4">
            {steps.map((st) => {
              const isActive = activeStep === st.id;
              const isPast = activeStep > st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStep(st.id)}
                  className={`flex items-start space-x-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "bg-[#111111]/80 border-red-600/60 shadow-lg" 
                      : "bg-transparent border-stone-900/60 hover:bg-stone-950/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-red-600 text-white scale-110"
                        : isPast
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                        : "bg-stone-900 text-gray-500 border border-stone-850"
                    }`}
                  >
                    {isPast ? <CheckCircle className="w-4 h-4" /> : <st.icon className="w-4.5 h-4.5" />}
                  </div>

                  <div className="space-y-1">
                    <h4 className={`text-sm font-sans font-medium transition-colors ${isActive ? "text-white" : "text-gray-400"}`}>
                      {st.label}
                    </h4>
                    <p className="text-gray-500 text-xs font-sans leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
