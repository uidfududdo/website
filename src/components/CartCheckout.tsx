/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Trash2, ShieldCheck, TicketCheck, Phone, MapPin, 
  CreditCard, Smartphone, CheckCircle, Clock, ChefHat, Sparkles, Navigation 
} from "lucide-react";
import { CartItem, MenuItem } from "../types";

interface CartCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQt: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartCheckout({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartCheckoutProps) {
  const [step, setStep] = useState<"cart" | "address" | "payment" | "success">("cart");
  
  // Checkout particulars
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "applepay">("cod");
  const [orderId, setOrderId] = useState("");

  // Postorder track milestone simulation
  const [preparationProgress, setPreparationProgress] = useState(1); // 1 = prep, 2 = cook, 3 = transit, 4 = delivered

  const handleApplyCoupon = () => {
    const formatted = couponCode.toUpperCase().trim();
    if (formatted === "SAMURAI10") {
      setActiveCoupon({ code: "SAMURAI10", discount: 0.1 });
    } else if (formatted === "SAMURAI5") {
      setActiveCoupon({ code: "SAMURAI5", discount: 5.0 }); // €5 flat discount
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discount < 1) {
      return subtotal * activeCoupon.discount;
    }
    return activeCoupon.discount;
  }, [activeCoupon, subtotal]);

  const deliveryFee = useMemo(() => {
    if (subtotal > 45) return 0; // free delivery over €45
    return 4.90;
  }, [subtotal]);

  const tax = useMemo(() => {
    return subtotal * 0.10; // 10% VAT
  }, [subtotal]);

  const total = useMemo(() => {
    const calculated = subtotal - discountAmount + deliveryFee + tax;
    return Math.max(0, calculated);
  }, [subtotal, discountAmount, deliveryFee, tax]);

  const handleProcessOrder = () => {
    if (!name || !address || !phone) {
      alert("Please supply your name, delivery address, and contact number.");
      return;
    }
    
    // Simulate order placement
    setOrderId(`SMR-${Math.floor(Math.random() * 900000) + 100000}`);
    setStep("success");
    
    // Begin postorder countdown sequence simulation
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      setPreparationProgress(currentStep);
      if (currentStep === 4) {
        clearInterval(interval);
      }
    }, 4500);
  };

  const handleRestartOrderFlow = () => {
    onClearCart();
    setStep("cart");
    setName("");
    setAddress("");
    setPhone("");
    setNotes("");
    setActiveCoupon(null);
    setCouponCode("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          
          {/* Backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== "success" && onClose()}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Slider Core Container */}
          <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-[#111111] border-l border-stone-850 flex flex-col justify-between shadow-2xl z-50">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-mono block mb-1">
                  SAMURAI SECURE DISPATCH
                </span>
                <h3 className="text-xl font-sans font-semibold text-white">
                  {step === "cart" && "Culinary Checklist"}
                  {step === "address" && "Delivery Destination"}
                  {step === "payment" && "Biometric Authorization"}
                  {step === "success" && "Order Flow Complete!"}
                </h3>
              </div>

              {step !== "success" && (
                <button
                  onClick={onClose}
                  className="p-2 border border-stone-800 rounded-full text-gray-500 hover:text-white bg-stone-950 hover:bg-stone-900 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* MAIN INNER CHANNELS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* STEP 1: REVIEW THE CART ITEMS */}
              {step === "cart" && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <p className="text-6xl">🍱</p>
                      <h4 className="text-md font-sans text-stone-300 font-semibold uppercase">Your Cart holds no delicacies</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Navigate our culinary menu and select items prepared with direct precision by Master Kenji Sato.
                      </p>
                      <button 
                        onClick={onClose}
                        className="mt-4 px-5 py-2.5 bg-stone-900 border border-stone-800 hover:border-red-650/50 text-xs font-mono tracking-widest text-white uppercase rounded-md cursor-pointer transition-all"
                      >
                        Return to menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-stone-950 border border-stone-900 rounded-xl p-4 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-sans font-medium text-white">{item.menuItem.name}</h4>
                            <p className="text-xs text-[#C9A227] font-mono font-bold">€{(item.menuItem.price * item.quantity).toFixed(2)}</p>
                            <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">
                              CAT: {item.menuItem.category}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-stone-900 border border-stone-850 px-2 py-1 rounded-lg">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-white font-bold px-1.5 focus:outline-none cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-stone-300">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-white font-bold px-1.5 focus:outline-none cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-2 border border-stone-900 text-gray-500 hover:text-red-500 hover:border-red-950 hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Promo Code section */}
                      <div className="border-t border-dashed border-stone-900 pt-6">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter Code (e.g. SAMURAI10)"
                            className="flex-1 bg-stone-950 border border-stone-900 focus:outline-none focus:border-[#C9A227] rounded-lg p-2.5 text-xs font-mono uppercase text-stone-300 tracking-wider"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="bg-stone-900 hover:bg-stone-850 text-xs px-4 text-white font-bold border border-stone-800 rounded-lg cursor-pointer transition-all"
                          >
                            Apply
                          </button>
                        </div>
                        {activeCoupon && (
                          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mt-2 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded">
                            <TicketCheck className="w-4 h-4" />
                            <span>Coupon applied: Save {activeCoupon.discount < 1 ? "10%" : "€5.00"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: ADDRESS DETAIL FORM */}
              {step === "address" && (
                <div className="space-y-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">Recipient name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Master Alexander"
                      className="w-full bg-stone-950 border border-stone-900 rounded-xl p-3 text-xs focus:ring-1 focus:ring-red-650 focus:border-red-650 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">Delivery address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-red-500" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 12 Avenue des Champs-Élysées, Paris"
                        className="w-full bg-stone-950 border border-stone-900 rounded-xl p-3 pl-10 text-xs focus:ring-1 focus:ring-red-650 focus:border-red-650 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">Phone number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-[#C9A227]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +33 6 45 67 89 21"
                        className="w-full bg-stone-950 border border-stone-900 rounded-xl p-3 pl-10 text-xs focus:ring-1 focus:ring-red-650 focus:border-red-650 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block">Delivery notes (Access codes, gates)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Floor 4, Code 495A. Please leave wooden crate at security desk."
                      className="w-full bg-stone-950 border border-stone-900 rounded-xl p-3 text-xs focus:ring-1 focus:ring-red-650 focus:border-red-650 text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: INTERACTIVE BIOMETRIC PAYMENT SELECTIONS */}
              {step === "payment" && (
                <div className="space-y-6">
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">
                    Select a secure authorization protocol. All details are encrypted through bank-grade networks.
                  </p>

                  <div className="space-y-3">
                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "cod" 
                          ? "bg-[#111111]/90 border-red-500 shadow-md" 
                          : "bg-stone-950 border-stone-900 hover:bg-stone-900/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-950/40 flex items-center justify-center text-red-500">
                          <span>💶</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-sans font-medium text-white">Cash on Delivery</h4>
                          <span className="text-[9px] font-mono text-gray-500 block uppercase">No extra fee</span>
                        </div>
                      </div>
                      <div className={`w-4.5 h-4.5 border rounded-full flex items-center justify-center ${paymentMethod === "cod" ? "border-red-500" : "border-gray-500"}`}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                      </div>
                    </div>

                    {/* Visa / Card option */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "card" 
                          ? "bg-[#111111]/90 border-[#C9A227] shadow-md" 
                          : "bg-stone-950 border-stone-900 hover:bg-stone-900/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-950/40 flex items-center justify-center text-[#C9A227]">
                          <CreditCard className="w-4.5 h-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-sans font-medium text-white">Secured Credit Card</h4>
                          <span className="text-[9px] font-mono text-gray-500 block">PCI-DSS Compliant v3.2</span>
                        </div>
                      </div>
                      <div className={`w-4.5 h-4.5 border rounded-full flex items-center justify-center ${paymentMethod === "card" ? "border-[#C9A227]" : "border-gray-500"}`}>
                        {paymentMethod === "card" && <div className="w-2.5 h-2.5 bg-[#C9A227] rounded-full" />}
                      </div>
                    </div>

                    {/* Apple Pay / Google Pay simulated option */}
                    <div
                      onClick={() => setPaymentMethod("applepay")}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "applepay" 
                          ? "bg-[#111111]/90 border-emerald-500 shadow-md" 
                          : "bg-stone-950 border-stone-900 hover:bg-stone-900/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-950/40 flex items-center justify-center text-emerald-400">
                          <Smartphone className="w-4.5 h-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-sans font-medium text-white">Apple Pay / Google Pay</h4>
                          <span className="text-[9px] font-mono text-gray-500 block">Biometric Fingerprint Verified</span>
                        </div>
                      </div>
                      <div className={`w-4.5 h-4.5 border rounded-full flex items-center justify-center ${paymentMethod === "applepay" ? "border-emerald-500" : "border-gray-500"}`}>
                        {paymentMethod === "applepay" && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-stone-950 border border-stone-900 rounded-xl p-4 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full bg-[#111111] text-xs p-2.5 rounded border border-stone-850 text-white focus:outline-none"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="col-span-2 w-full bg-[#111111] text-xs p-2.5 rounded border border-stone-850 text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-full bg-[#111111] text-xs p-2.5 rounded border border-stone-850 text-white focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "applepay" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-black/40 border border-emerald-950 p-6 rounded-2xl flex flex-col items-center text-center space-y-3"
                    >
                      <div className="w-14 h-14 rounded-full border border-dashed border-emerald-500 flex items-center justify-center animate-pulse">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <p className="text-xs font-mono text-emerald-400">Place Fingerprint on Reader Sensor to authorize</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: SUCCESS COUNTDOWN SCREEN */}
              {step === "success" && (
                <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-2xl">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-[#C9A227] tracking-widest uppercase">ORDER ID: {orderId}</span>
                    <h3 className="text-2xl font-sans font-semibold text-white">Your Gastronomy is Active</h3>
                    <p className="text-gray-400 text-xs max-w-sm font-sans leading-relaxed">
                      Chef Sato is organizing the raw ingredients. Standard dispatch timing initialized to thermal Wood box.
                    </p>
                  </div>

                  {/* Postorder Timeline Tracker */}
                  <div className="w-full bg-stone-950 border border-stone-900 rounded-2xl p-5 text-left space-y-4">
                    <h4 className="text-[10px] font-mono text-[#C9A227] tracking-widest uppercase">LATEST REPORT STEP</h4>

                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${preparationProgress >= 1 ? "bg-emerald-500 text-black" : "bg-stone-900 text-gray-500"}`}>
                          1
                        </div>
                        <span className={`text-xs font-sans ${preparationProgress >= 1 ? "text-white font-medium" : "text-gray-500"}`}>
                          Allocation of Ingredients Done ({name})
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${preparationProgress >= 2 ? "bg-emerald-500 text-black" : "bg-stone-900 text-gray-500"}`}>
                          2
                        </div>
                        <span className={`text-xs font-sans ${preparationProgress >= 2 ? "text-white font-medium animate-pulse" : "text-gray-500"}`}>
                          Woks & Shinto fire searing...
                          {preparationProgress === 2 && <ChefHat className="inline-block w-4 h-4 ml-1.5 text-orange-500 animate-[spin_4s_linear_infinite]" />}
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${preparationProgress >= 3 ? "bg-[#C9A227] text-black" : "bg-stone-900 text-gray-500"}`}>
                          3
                        </div>
                        <span className={`text-xs font-sans ${preparationProgress >= 3 ? "text-white font-medium animate-pulse" : "text-gray-500"}`}>
                          Matte-Black thermal box dispatch and transit
                          {preparationProgress === 3 && <Navigation className="inline-block w-3.5 h-3.5 ml-1.5 text-[#C9A227] animate-pulse" />}
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${preparationProgress >= 4 ? "bg-emerald-500 text-black animate-ping" : "bg-stone-900 text-gray-500"}`}>
                          4
                        </div>
                        <span className={`text-xs font-sans ${preparationProgress >= 4 ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                          Arrived Safely. Bon Appétit!
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRestartOrderFlow}
                    className="w-full py-3 bg-[#111111] hover:bg-stone-900 border border-stone-800 text-xs font-mono font-bold uppercase text-white tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    PLACE ANOTHER ORDER
                  </button>
                </div>
              )}

            </div>

            {/* BILL FOOTER CALCULATIONS AND CONTROLS */}
            {step !== "success" && cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-900 bg-stone-950 space-y-4">
                
                {/* Visual Bills block */}
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-emerald-450">
                      <span>Discount Coupon</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>VAT Standard (10%)</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Insulated Thermal Carrier</span>
                    <span>{deliveryFee === 0 ? "FREE" : `€${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-white border-t border-stone-900 pt-2 font-mono">
                    <span>TOTAL DUE</span>
                    <span className="text-[#C9A227]">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary CTA navigation */}
                {step === "cart" && (
                  <button
                    onClick={() => setStep("address")}
                    className="w-full py-3.5 bg-red-650 hover:bg-red-700 hover:border-red-500 rounded-xl text-white font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer block text-center"
                  >
                    CONTINUE TO DESTINATION
                  </button>
                )}

                {step === "address" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep("cart")}
                      className="py-3.5 bg-stone-900 border border-stone-800 rounded-xl text-gray-400 hover:text-white font-mono text-xs uppercase cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!name || !address || !phone) {
                          alert("Please fill out Name, Address, and Phone number.");
                          return;
                        }
                        setStep("payment");
                      }}
                      className="py-3.5 bg-red-650 hover:bg-red-700 rounded-xl text-white font-mono font-bold text-xs tracking-widest uppercase transition-all cursor-pointer"
                    >
                      ENTER PAYMENT
                    </button>
                  </div>
                )}

                {step === "payment" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep("address")}
                      className="py-3.5 bg-stone-900 border border-stone-800 rounded-xl text-gray-400 hover:text-white font-mono text-xs uppercase cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProcessOrder}
                      className="py-3.5 bg-emerald-650 hover:bg-emerald-700 rounded-xl text-white font-mono font-bold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
                    >
                      AUTHENTICATE & CHECKOUT
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>SECURED BY STRIPE METADATA ENCRYPTION</span>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
