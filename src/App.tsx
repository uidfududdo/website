/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Volume2, VolumeX, Phone, MessageSquare, Play, Sparkles, 
  ChevronLeft, ChevronRight, X, Heart, Award, ShieldAlert, ArrowUpRight 
} from "lucide-react";

import { MenuItem, CartItem } from "./types";
import { useAppState, storeActions } from "./data/store";
import FloatingCanvas from "./components/FloatingCanvas";
import HeroIntro from "./components/HeroIntro";
import StorySection from "./components/StorySection";
import SignatureDishes from "./components/SignatureDishes";
import MenuSection from "./components/MenuSection";
import InteractiveDelivery from "./components/InteractiveDelivery";
import CartCheckout from "./components/CartCheckout";
import CustomCursor from "./components/CustomCursor";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function App() {
  const state = useAppState();
  const { menuItems, reviews, hero, settings, seo } = state;

  const [introFinished, setIntroFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  
  // Testimonial index
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Exit intent state
  const [showExitIntent, setShowExitIntent] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundDroneRef = useRef<any>(null);

  // Router Path state (Supports standard /admin URLs and hash navigation fallback)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Check persisted admin session & handle path changes
  useEffect(() => {
    storeActions.checkPersistedSession();

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    
    const handleHash = () => {
      if (window.location.hash === "#admin") {
        window.history.pushState(null, "", "/admin");
        setCurrentPath("/admin");
      }
    };
    window.addEventListener("hashchange", handleHash);

    // Initial check
    if (window.location.hash === "#admin") {
      window.history.pushState(null, "", "/admin");
      setCurrentPath("/admin");
    }

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  // Sync brand SEO configurations with document title
  useEffect(() => {
    if (seo?.title) {
      document.title = seo.title;
    }
  }, [seo]);

  // Cart total calculations
  const totalCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Exit Intent Event Listener
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30) {
        // User is moving cursor to close tab or write URL
        const displayed = localStorage.getItem("exit-intent-shown");
        if (!displayed) {
          setShowExitIntent(true);
          localStorage.setItem("exit-intent-shown", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Soft Web Audio API Koto Procedural Synthesizer
  const playKotoPluck = (freq: number) => {
    if (!isPlayingAudio) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Generate pleasant traditional string pluck sound wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Form koto-like timbre using odd harmonics
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      // Lowpass filter for smooth warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (err) {
      console.warn("Web Audio pluck error:", err);
    }
  };

  // Play background traditional Japanese drone
  const toggleAmbientSound = () => {
    if (!isPlayingAudio) {
      // Start sound drone
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Low hum drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 drone

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 perfect fifth

        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        backgroundDroneRef.current = { osc1, osc2, gainNode };
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn("Could not start ambient drone:", err);
      }
    } else {
      // Stop sound drone
      try {
        if (backgroundDroneRef.current) {
          backgroundDroneRef.current.osc1.stop();
          backgroundDroneRef.current.osc2.stop();
          backgroundDroneRef.current = null;
        }
        setIsPlayingAudio(false);
      } catch (e) {}
    }
  };

  // Trigger high pentatonic note pluck on general interactions
  const triggerPluckHover = () => {
    const kotoNotes = [329.63, 349.23, 440.00, 523.25, 587.33, 659.25]; // MI, FA, LA, DO, RE relative to Koto Pentatonic Hirajoshi
    const randomNote = kotoNotes[Math.floor(Math.random() * kotoNotes.length)];
    playKotoPluck(randomNote);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: `${item.id}-${Date.now()}`, menuItem: item, quantity: 1 }];
    });
    // Trigger festive alert pluck sound
    playKotoPluck(440);
    playKotoPluck(659);
    // Auto-open cart to delight user
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQt: number) => {
    if (newQt <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQt } : i)));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  if (currentPath === "/admin" || currentPath === "/admin/") {
    return (
      <div className="relative min-h-screen bg-[#070707] text-[#F5F5F5] font-sans selection:bg-red-650 selection:text-white">
        {state.currentUser ? <AdminDashboard /> : <AdminLogin />}
        <CustomCursor />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans selection:bg-red-650 selection:text-white overflow-x-hidden">
      
      {/* 1. Introductory cinematic splash sequence screen */}
      {!introFinished && <HeroIntro onComplete={() => setIntroFinished(true)} />}

      <CustomCursor />

      {/* 2. Floating Immersive Canvas 3D Sushi world element layer */}
      <FloatingCanvas />

      {/* Floating Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/40 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => triggerPluckHover()}>
          {/* Crimson-Gold Samurai Logo Icon */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-[#C9A227] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-950/20">
            侍
          </div>
          <div>
            <span className="font-sans font-semibold tracking-[0.25em] text-white text-md block leading-none">
              SAMURAI
            </span>
            <span className="text-[8px] font-mono tracking-widest text-[#C9A227] uppercase">
              TOKYO FUSION
            </span>
          </div>
        </div>

        {/* Action Controls Side buttons */}
        <div className="flex items-center space-x-4">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleAmbientSound}
            className="p-2 border border-stone-800 rounded-full bg-stone-950/60 text-gray-400 hover:text-[#C9A227] transition-all cursor-pointer"
            title="Toggle traditional Koto background Sound"
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4 text-[#C9A227] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Checkout Bag button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-red-600 hover:bg-red-700 rounded-full text-white cursor-pointer transition-all shadow-lg shadow-red-950/20 flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartQuantity > 0 && (
              <span className="text-[10px] bg-white text-black font-mono font-bold px-1.5 py-0.5 rounded-full">
                {totalCartQuantity}
              </span>
            )}
          </button>

          {/* Quick Reserve CTA */}
          <a
            href="#full-menu"
            className="hidden sm:inline-block border border-[#C9A227]/40 hover:border-[#C9A227] bg-[#C9A227]/10 text-xs tracking-wider text-white font-mono uppercase font-bold py-2.5 px-5 rounded-xl transition-all"
          >
            ORDER NOW
          </a>
        </div>
      </header>

      {/* Main Container Flow */}
      <main className="relative pt-24 space-y-36">
        
        {/* CINEMATIC HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-16 text-center select-none overflow-hidden z-25">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-red-650/5 rounded-full filter blur-[100px] mix-blend-screen pointer-events-none" />

          {/* Subtext and tag line */}
          <div className="space-y-6 max-w-4xl relative">
            <div className="inline-flex items-center space-x-2 bg-stone-900/65 border border-stone-850 px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#C9A227] animate-spin" />
              <span className="text-[9px] font-mono tracking-[0.25em] text-stone-200 uppercase font-bold">
                Award-winning Culinary Curation
              </span>
            </div>

            {/* Title Display Headings */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans tracking-tight font-extrabold text-white leading-[0.95] uppercase">
              {hero.title.split(" ").slice(0, 2).join(" ")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#C9A227] to-red-650">
                {hero.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 font-sans text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed select-text">
              {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href="#full-menu"
                onClick={() => triggerPluckHover()}
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-red-950/20"
              >
                DISCOVER OUR MENU
              </a>
              <button
                onClick={() => {
                  triggerPluckHover();
                  setIsCartOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl font-mono text-xs text-[#C9A227] tracking-[0.2em] uppercase font-bold transition-all cursor-pointer"
              >
                Instant Delivery
              </button>
            </div>
          </div>

          {/* Quick Feature Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full border-t border-white/5 mt-24 pt-8 text-center text-xs font-mono">
            <div>
              <span className="text-gray-500 block uppercase mb-1">MICHLEIN RECOGNIZED</span>
              <span className="text-sm font-semibold text-white">Top 20 Selection</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase mb-1">RAPID LOCK DESPACH</span>
              <span className="text-sm font-semibold text-white">&lt; 30 Mins Average</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase mb-1">THERMAL CORE STATUS</span>
              <span className="text-sm font-semibold text-[#C9A227]">68°C Minimum Temperature</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase mb-1">CARBON NEUTRAL RIDER</span>
              <span className="text-sm font-semibold text-white">100% Electric Network</span>
            </div>
          </div>
        </section>

        {/* NARRATIVE BRANDING STORY */}
        <StorySection />

        {/* SIGNATURE CHEF DISHES */}
        <SignatureDishes 
          onAddToCart={handleAddToCart}
          onSelectDish={(item) => setSelectedDish(item)}
          menuItems={menuItems}
        />

        {/* LUXURY INTERACTIVE MENU DIRECTORY */}
        <MenuSection 
          onAddToCart={handleAddToCart}
          selectedDish={selectedDish}
          setSelectedDish={setSelectedDish}
          menuItems={menuItems}
        />

        {/* RAPID DELIVERY TIMELINE TRACKER */}
        <InteractiveDelivery />

        {/* LUXURY REVIEW TESTIMONIALS SECTION */}
        <section className="relative py-24 px-6 md:px-16 max-w-4xl mx-auto z-20 text-white select-none text-center space-y-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="w-12 h-[1px] bg-[#C9A227]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#C9A227] font-mono">
              EPICUREAN VERDICTS
            </span>
            <span className="w-12 h-[1px] bg-[#C9A227]"></span>
          </div>

          <div className="min-h-[160px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {reviews.length > 0 && (
                <motion.div
                  key={currentReviewIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Five gold stars */}
                  <div className="flex justify-center text-amber-500 text-sm">
                    {Array(reviews[currentReviewIdx]?.rating || 5).fill("★").join(" ")}
                  </div>

                  <p className="text-lg md:text-xl font-sans italic text-gray-200 leading-relaxed max-w-2xl mx-auto select-text">
                    &ldquo;{reviews[currentReviewIdx]?.comment}&rdquo;
                  </p>

                  <div>
                    <h4 className="text-md font-sans text-white font-medium select-text">
                      {reviews[currentReviewIdx]?.name}
                    </h4>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest select-text">
                      {reviews[currentReviewIdx]?.role} — {reviews[currentReviewIdx]?.date}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                triggerPluckHover();
                setCurrentReviewIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
              }}
              className="p-2 border border-stone-850 rounded-full bg-stone-900 text-gray-500 hover:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                triggerPluckHover();
                setCurrentReviewIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
              }}
              className="p-2 border border-stone-850 rounded-full bg-stone-900 text-gray-500 hover:text-white cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* EXTREME CONVERSION ACTION CONTAINER (LAST CTA) */}
        <section className="relative py-24 px-6 md:px-16 max-w-7xl mx-auto z-20 text-white select-none">
          <div className="bg-gradient-to-tr from-red-950 via-[#120F0F] to-stone-950/90 border border-red-900/40 rounded-3xl p-8 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
            
            {/* Japan core Red glow element */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[120px] pointer-events-none" />

            <div className="space-y-4 max-w-xl mx-auto">
              <span className="text-xs font-mono tracking-widest text-[#C9A227] uppercase">
                COMMENCE THE DEGUSTATION
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
                Order Samurai Tonight
              </h2>
              <p className="text-gray-400 font-sans text-xs md:text-sm leading-relaxed">
                Unlock instant luxury delivery in under 30 minutes. Use coupon code <span className="text-[#C9A227] font-mono font-bold">SAMURAI10</span> during checkout to reduce 10% from your final balance.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <a
                href="#full-menu"
                onClick={() => triggerPluckHover()}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 hover:scale-105 rounded-xl text-white font-mono font-bold tracking-[0.2em] text-xs uppercase cursor-pointer shadow-lg transition-transform"
              >
                ORDER NOW
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer copyright data */}
      <footer className="relative z-20 bg-stone-950/80 border-t border-stone-900 text-gray-500 text-xs py-10 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-2 text-[#C9A227] font-mono text-[10px] tracking-widest uppercase">
            <Award className="w-4 h-4" />
            <span>Award-Winning Digital Haute Cuisine Experience 2026</span>
          </div>
          <p className="font-sans text-[11px] leading-relaxed">
            SAMURAI is a legal, culinary certified restaurant group operating premium thermal wood box routes in Paris, London, and Tokyo. All dishes are subjected to raw food safety checks prior to seal.
          </p>
          <p className="font-sans text-[10px] text-gray-650">
            &copy; 2026 SAMURAI LLC. Designed to uncompromising agency standards.
          </p>
        </div>
      </footer>

      {/* ACTIVE CART DRAWER DIALOG PANEL */}
      <CartCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 3. EXIT INTENT OVERLAY DIALOG */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[1001] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-tr from-[#111111] to-[#1a0c0c] border border-red-900/60 max-w-md w-full rounded-2xl p-6 text-center space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute right-4 top-4 p-1.5 text-gray-500 hover:text-white bg-stone-900 border border-stone-850 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-red-950/40 border border-red-500 flex items-center justify-center rounded-full text-red-500 mx-auto text-xl animate-bounce">
                🎁
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#C9A227] block uppercase font-bold">Chef Sato Special dispatch</span>
                <h3 className="text-xl font-sans font-bold text-white">Wait, Don&apos;t Drift Away Hungry!</h3>
                <p className="text-gray-400 font-sans text-xs leading-relaxed">
                  We offter a one-time gesture. Order tonight and utilize coupon code <span className="text-red-500 font-mono font-bold">SAMURAI10</span> for immediate 10% discount on your thermal crate delivery!
                </p>
              </div>

              <div className="bg-stone-950 border border-stone-900 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500">PROMO CODE:</span>
                <span className="text-[#C9A227] font-bold">SAMURAI10</span>
              </div>

              <button
                onClick={() => {
                  setShowExitIntent(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 bg-red-650 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
              >
                CLAIM MY 10% DISCOUNT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App-like Sticky Bottom Order Nav for stunning mobile feedback */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#0d0d0d]/95 border border-white/5 p-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">SATO SEALS SELECTION</span>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center space-x-2"
        >
          <span>VIEW BAG</span>
          {totalCartQuantity > 0 && (
            <span className="bg-white text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              {totalCartQuantity}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
