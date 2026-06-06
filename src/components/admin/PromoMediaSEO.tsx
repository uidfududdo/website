/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TicketCheck, Save, Plus, Trash2, CheckCircle, Flame, Sparkles, Folder, 
  UploadCloud, FileImage, ShieldCheck, Globe, Search, RefreshCw, Layers 
} from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { Coupon, WebsiteSEO } from "../../types";

interface PromoMediaSEOProps {
  state: AppState;
}

export default function PromoMediaSEO({ state }: PromoMediaSEOProps) {
  const [activePane, setActivePane] = useState<"coupons" | "media" | "seo">("coupons");
  const [successMsg, setSuccessMsg] = useState("");

  // --- COUPON FORM STATE ---
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState<"percent" | "flat" | "free_delivery">("percent");
  const [couponVal, setCouponVal] = useState(10);
  const [couponLimit, setCouponLimit] = useState(100);
  const [couponExpiry, setCouponExpiry] = useState("2026-12-31");

  // --- MEDIA LIBRARY STATE ---
  const [activeFolder, setActiveFolder] = useState<"Menu" | "Hero" | "Promotions" | "Gallery">("Menu");
  const [mimeFiles, setMimeFiles] = useState([
    { name: "aromaki_saumon.webp", folder: "Menu", size: "112 KB", saved: "92%", orig: "1.4 MB" },
    { name: "california_rainbow.webp", folder: "Menu", size: "140 KB", saved: "90%", orig: "1.5 MB" },
    { name: "teppan_shrimp.webp", folder: "Menu", size: "185 KB", saved: "93%", orig: "2.8 MB" },
    { name: "signature_bg.webp", folder: "Hero", size: "320 KB", saved: "95%", orig: "6.8 MB" },
    { name: "seasonal_winter.webp", folder: "Promotions", size: "190 KB", saved: "91%", orig: "2.1 MB" },
    { name: "restaurant_interior.webp", folder: "Gallery", size: "280 KB", saved: "94%", orig: "4.9 MB" }
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // --- SEO FORMS STATE ---
  const [activeSeoPage, setActiveSeoPage] = useState<"homepage" | "menu" | "promotions">("homepage");
  const [seoConfig, setSeoConfig] = useState<WebsiteSEO>(state.seo);

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2200);
  };

  // --- ACTIONS: COUPONS ---
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    storeActions.addCoupon({
      code: couponCode.toUpperCase().trim(),
      type: couponType,
      value: couponVal,
      usageLimit: couponLimit,
      expiryDate: couponExpiry,
      active: true
    });

    setCouponCode("");
    triggerToast("Discount promotion code initialized successfully.");
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    storeActions.editCoupon(coupon.id, { active: !coupon.active });
    triggerToast(`Promotion ${coupon.code} status toggled.`);
  };

  const handleDeleteCoupon = (id: string) => {
    storeActions.deleteCoupon(id);
    triggerToast("Coupon code deleted.");
  };

  // --- ACTIONS: MEDIA COMPRESSION ---
  const handleUploadMock = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            
            // Generate optimized mock descriptor
            const nextFiles = [
              {
                name: `upload_${Math.floor(Math.random() * 100000)}.webp`,
                folder: activeFolder,
                size: "95 KB",
                saved: "96%",
                orig: "2.4 MB"
              },
              ...mimeFiles
            ];
            setMimeFiles(nextFiles);
            triggerToast("Asset optimized as WebP and compressed successfully (96% saved)!");
          }, 350);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  // --- ACTIONS: SEO PREVIEWS ---
  const handleSavePageSEO = (e: React.FormEvent) => {
    e.preventDefault();
    storeActions.updateSEO(seoConfig);
    triggerToast(`Meta variables for ${activeSeoPage} compiled live.`);
  };

  const handleFieldChange = (field: "title" | "description" | "keywords", val: string) => {
    setSeoConfig(prev => {
      const perPage = { ...prev.perPage };
      perPage[activeSeoPage] = {
        ...perPage[activeSeoPage],
        [field]: val
      };
      return {
        ...prev,
        perPage
      };
    });
  };

  return (
    <div className="space-y-6 select-none relative">
      
      {/* Toast Alert */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-emerald-950/85 border border-emerald-500 text-emerald-300 text-xs py-3 px-5 rounded-xl z-50 shadow-2xl flex items-center space-x-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header navigations */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-4 flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase font-bold">HAUTE SUPPORT PLATFORM</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Promotions, Assets & SEO</span>
          </h2>
        </div>

        <div className="flex bg-[#111111] p-1 rounded-xl border border-stone-850 text-xs font-mono">
          <button
            onClick={() => setActivePane("coupons")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activePane === "coupons" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            📋 Coupons
          </button>
          <button
            onClick={() => setActivePane("media")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activePane === "media" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            📂 Library
          </button>
          <button
            onClick={() => setActivePane("seo")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activePane === "seo" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            🌐 SEO Meta
          </button>
        </div>
      </div>

      {activePane === "coupons" && (
        // --- 1. PROMO COUPONS MANAGER ---
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Coupon creation form */}
          <div className="xl:col-span-5 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase block">CAMPAIGN REGISTRATION RULES</span>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mt-0.5">Create Promo Coupon</h3>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 font-sans text-xs">
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. AUTUMN20"
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-mono text-xs uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">Type Model</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2 px-3 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Cash (€)</option>
                    <option value="free_delivery">Free Delivery</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Value rate (€ / %)</label>
                  <input
                    type="number"
                    required
                    disabled={couponType === "free_delivery"}
                    value={couponVal}
                    onChange={(e) => setCouponVal(parseFloat(e.target.value))}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 disabled:opacity-30 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Usage limit count</label>
                  <input
                    type="number"
                    required
                    value={couponLimit}
                    onChange={(e) => setCouponLimit(parseInt(e.target.value))}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Expiry threshold</label>
                  <input
                    type="date"
                    required
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C9A227] hover:scale-103 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>BUILD CODE REGISTER</span>
              </button>

            </form>
          </div>

          {/* Coupons catalog listings */}
          <div className="xl:col-span-7 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase block">DURABLE PROMOTION CODES</span>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mt-0.5">Coupons Catalog</h3>
            </div>

            <div className="divide-y divide-stone-900 overflow-y-auto max-h-[380px] scrollbar-thin space-y-1 pt-1">
              {state.coupons.map((c) => (
                <div key={c.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-[#111111]/20 px-3 rounded-xl transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded bg-stone-900 border border-stone-850 text-red-500 flex items-center justify-center text-sm flex-shrink-0">
                      🎟️
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-white block uppercase">{c.code}</span>
                      <div className="flex items-center space-x-2 text-[9px] font-mono text-stone-500 mt-1">
                        <span className="font-semibold text-stone-400">
                          {c.type === "percent" ? `${c.value}% Off` : c.type === "flat" ? `€${c.value} Dec` : "Free Ship"}
                        </span>
                        <span>•</span>
                        <span>limit: {c.usedCount}/{c.usageLimit}</span>
                        <span>•</span>
                        <span>Exp: {c.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(c)}
                      className={`text-[8px] font-mono select-none px-2 py-1 rounded font-bold border uppercase ${c.active ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" : "bg-red-950/20 border-red-900/40 text-red-450"}`}
                    >
                      {c.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-1.5 border border-stone-850 hover:border-red-650 text-stone-500 hover:text-red-500 rounded bg-stone-900 cursor-pointer"
                      title="Purge promo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activePane === "media" && (
        // --- 2. MEDIA MANAGER LIBRARY ---
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* Folders navigation rail */}
          <div className="xl:col-span-1 bg-stone-950 border border-stone-900 rounded-2xl p-4 shadow-xl space-y-4 font-mono text-xs">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Folders</span>
            <div className="space-y-1">
              {(["Menu", "Hero", "Promotions", "Gallery"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFolder(f)}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center space-x-2.5 transition-colors cursor-pointer ${activeFolder === f ? "bg-red-650 text-white font-bold" : "text-stone-450 hover:bg-stone-900/60 hover:text-white"}`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{f}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Files grid view and optimized converter details */}
          <div className="xl:col-span-3 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-900 pb-3">
              <div>
                <span className="text-[10px] font-mono text-stone-500 block uppercase">HERMETIC STORAGE ARCHIVES</span>
                <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Asset Folder: {activeFolder}</h3>
              </div>
              
              <button
                onClick={handleUploadMock}
                disabled={isUploading}
                className="bg-[#C9A227] text-black hover:scale-103 font-mono font-bold border-none text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isUploading ? "OPTIMIZING SEALS..." : "UPLOAD FILE"}</span>
              </button>
            </div>

            {isUploading && (
              <div className="bg-stone-900 p-4 rounded-xl border border-stone-850 space-y-3 font-mono text-[10px]">
                <div className="flex justify-between text-stone-400 uppercase">
                  <span>WEBP AUTOCONVI - HEIC TO WEBP COMPRESSOR...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C9A227] h-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mimeFiles.filter(item => item.folder === activeFolder).map((f, idx) => (
                <div key={idx} className="p-4 bg-stone-900/40 border border-stone-900 hover:border-[#C9A227]/30 rounded-xl space-y-3 font-mono text-[10px]">
                  <div className="w-full h-24 bg-[#0B0B0B] border border-stone-850 rounded-lg flex items-center justify-center text-[#C9A227] relative overflow-hidden select-none text-2xl">
                    🖼️
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between p-1.5 text-[8px] font-mono">
                      <span className="text-emerald-400 font-bold">{f.saved} SAVED</span>
                      <span className="text-stone-550 truncate font-sans max-w-[50px]">{f.orig}</span>
                    </div>
                  </div>

                  <div className="space-y-1 block truncate">
                    <span className="text-white block truncate uppercase text-[9px] font-bold">{f.name}</span>
                    <span className="text-stone-500 font-bold text-[8px] block">Size: {f.size} WEBP</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {activePane === "seo" && (
        // --- 3. SEO MANAGEMENT CONFIGURATION ---
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* SEO Per-page configuration forms */}
          <div className="xl:col-span-6 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3 flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono text-stone-500 block uppercase">SEO GLOBAL SEARCH INDEX</span>
                <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Meta Tags Configuration</h3>
              </div>
              <div className="flex bg-[#111] p-0.5 border border-stone-850 rounded-lg text-[9px] font-mono">
                {(["homepage", "menu", "promotions"] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setActiveSeoPage(p)}
                    className={`px-2 py-1 rounded transition-colors uppercase ${activeSeoPage === p ? "bg-red-650 text-white font-bold" : "text-stone-500 hover:text-white"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSavePageSEO} className="space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold flex items-center justify-between">
                  <span>Meta Title Headline</span>
                  <span className="text-[8px] text-stone-505 font-mono">{seoConfig.perPage[activeSeoPage]?.title.length || 0} / 60 chars</span>
                </label>
                <input
                  type="text"
                  required
                  value={seoConfig.perPage[activeSeoPage]?.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold flex items-center justify-between">
                  <span>Meta Description Copy</span>
                  <span className="text-[8px] text-stone-505 font-mono">{seoConfig.perPage[activeSeoPage]?.description.length || 0} / 160 chars</span>
                </label>
                <textarea
                  required
                  rows={3.5}
                  value={seoConfig.perPage[activeSeoPage]?.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Meta Keywords (Comma Sep)</label>
                <input
                  type="text"
                  required
                  value={seoConfig.perPage[activeSeoPage]?.keywords || ""}
                  onChange={(e) => handleFieldChange("keywords", e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>SAVE & BUILD META</span>
              </button>
            </form>
          </div>

          {/* RIGHT AREA: GOOGLE SEARCH CARD PREVIEWS AUTOMATION */}
          <div className="xl:col-span-6 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-mono text-stone-505 block uppercase">AUTOMATED RICH CARD RENDERERS</span>
              <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Google Search Mock Preview</h3>
            </div>

            {/* Simulated Desktop Google Snippet */}
            <div className="bg-[#111111]/30 border border-stone-900 rounded-xl p-5 space-y-3 font-sans text-xs">
              <span className="text-[8px] font-mono tracking-widest text-stone-500 uppercase block">DESKTOP GOOGLE BOT ENGINE</span>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-stone-400 text-[10px] truncate leading-none">
                  <Globe className="w-3 h-3 text-emerald-500" />
                  <span>https://samuraifusion.com</span>
                  <span className="text-stone-705">› {activeSeoPage}</span>
                </div>

                <h4 className="text-[#1a0dab] hover:underline cursor-pointer font-medium text-sm leading-snug truncate">
                  {seoConfig.perPage[activeSeoPage]?.title || "Samurai Tokyo Fusion Artistry"}
                </h4>

                <p className="text-[#4d5156] text-[11px] leading-relaxed select-text font-sans">
                  {seoConfig.perPage[activeSeoPage]?.description || "Paris' premier award-winning traditional yet modernized Japanese visual cuisine, delivered in signature insulated thermal cases."}
                </p>
              </div>
            </div>

            {/* Mobile Google Search Simulator */}
            <div className="bg-[#111111]/30 border border-stone-900 rounded-xl p-5 space-y-3 font-sans text-xs">
              <span className="text-[8px] font-mono tracking-widest text-stone-500 uppercase block">MOBILE INTERIOR CARD ENGINE</span>

              <div className="space-y-1.5 max-w-sm">
                <div className="flex items-center space-x-2 text-stone-400 text-[8px] truncate">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 text-[8px] font-mono font-bold">S</div>
                  <div>
                    <span className="text-white font-bold block leading-none">SAMURAI</span>
                    <span className="text-stone-600 block text-[6px] leading-none mt-0.5">https://samuraifusion.com › {activeSeoPage}</span>
                  </div>
                </div>

                <h4 className="text-[#15c] font-medium text-[13px] leading-snug line-clamp-2 select-text">
                  {seoConfig.perPage[activeSeoPage]?.title || "Samurai Tokyo Fusion Artistry"}
                </h4>

                <p className="text-[#4d5156] text-[10px] leading-relaxed line-clamp-3 select-text font-sans">
                  {seoConfig.perPage[activeSeoPage]?.description || "Paris' premier award-winning traditional yet modernized Japanese visual cuisine, delivered in signature insulated thermal cases."}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
