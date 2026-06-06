/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit, Save, Plus, Trash2, CheckCircle, Flame, Sparkles, MessageSquare, Star, X } from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { Review } from "../../types";

interface WebsiteCMSProps {
  state: AppState;
}

export default function WebsiteCMS({ state }: WebsiteCMSProps) {
  const [successMsg, setSuccessMsg] = useState("");

  // Hero Fields
  const [heroTitle, setHeroTitle] = useState(state.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(state.hero.subtitle);
  const [heroCta, setHeroCta] = useState(state.hero.ctaText);
  const [heroBanner, setHeroBanner] = useState(state.hero.promotionBanner);

  // Story Fields
  const [storyTitle, setStoryTitle] = useState(state.story.title);
  const [storyText, setStoryText] = useState(state.story.text);
  const [storyAlt, setStoryAlt] = useState(state.story.imageAlt);

  // Reviews and Testimonials management forms
  const [reviewEditMode, setReviewEditMode] = useState<"list" | "form">("list");
  const [isEditingExistingReview, setIsEditingExistingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Review Form Fields
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revRole, setRevRole] = useState("");
  const [revComment, setRevComment] = useState("");

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    storeActions.updateHero({
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCta,
      promotionBanner: heroBanner
    });
    triggerSuccess("Homepage Hero header variables updated live.");
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    storeActions.updateStory({
      title: storyTitle,
      text: storyText,
      imageAlt: storyAlt
    });
    triggerSuccess("Traditional Story paragraph compiled live.");
  };

  // Open Add Testimonial
  const handleOpenAddReview = () => {
    setIsEditingExistingReview(false);
    setSelectedReview(null);
    setRevName("Lady Penelope");
    setRevRole("Lifestyle Columnist");
    setRevRating(5);
    setRevComment("An absolute masterpiece. Arrived in standard hermetic lacquer-ware casing flamed cleanly in dry ice. Outstanding flavor parameters!");
    setReviewEditMode("form");
  };

  const handleOpenEditReview = (r: Review) => {
    setIsEditingExistingReview(true);
    setSelectedReview(r);
    setRevName(r.name);
    setRevRole(r.role || "");
    setRevRating(r.rating);
    setRevComment(r.comment);
    setReviewEditMode("form");
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: revName,
      role: revRole || undefined,
      rating: revRating,
      comment: revComment
    };

    if (isEditingExistingReview && selectedReview) {
      storeActions.editReview(selectedReview.id, payload);
      triggerSuccess("Testimonial review card updated safely.");
    } else {
      storeActions.addReview(payload);
      triggerSuccess("Testimonial catalog card generated successfully.");
    }
    setReviewEditMode("list");
  };

  const handleDeleteReview = (id: string) => {
    storeActions.deleteReview(id);
    triggerSuccess("Review card deleted.");
  };

  return (
    <div className="space-y-8 select-none relative">
      
      {/* CMS Success Toast notification */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-emerald-950/85 border border-emerald-500 text-emerald-300 text-xs py-3 px-5 rounded-xl z-50 shadow-2xl flex items-center space-x-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase">CINEMATIC SCREEN CUSTOMIZER</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Website Visual CMS Control</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* HOMEPAGE HERO HEADER VISUAL EDITOR */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A227]/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="border-b border-stone-900 pb-3 mb-6">
            <span className="text-[10px] font-mono text-[#C9A227] block uppercase font-bold">SECTION EDITOR FIELD</span>
            <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Hero Cinematic Area</h3>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Hero Large Heading</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs tracking-wider"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Sub-tagline Paragraph</label>
              <textarea
                required
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">CTA Button Name</label>
                <input
                  type="text"
                  required
                  value={heroCta}
                  onChange={(e) => setHeroCta(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Promo Coupon Display</label>
                <input
                  type="text"
                  required
                  value={heroBanner}
                  onChange={(e) => setHeroBanner(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>SAVE HERO SPECIFICATIONS</span>
            </button>
          </form>

        </div>

        {/* COMPILING SATO TRADITIONAL STORY PARAGRAPH */}
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="border-b border-stone-900 pb-3 mb-6">
            <span className="text-[10px] font-mono text-red-500 block uppercase font-bold">SECTION EDITOR FIELD</span>
            <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Sato Narrative Story</h3>
          </div>

          <form onSubmit={handleSaveStory} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Story Headline</label>
              <input
                type="text"
                required
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs tracking-wider font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Story Narrative copy</label>
              <textarea
                required
                rows={4.5}
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Asset Image alt parameter</label>
              <input
                type="text"
                required
                value={storyAlt}
                onChange={(e) => setStoryAlt(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>SAVE STORY COPYS</span>
            </button>
          </form>

        </div>

      </div>

      {/* EDITORIAL CUSTOMER REVIEW TESTIMONIALS MANAGER */}
      <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full filter blur-2xl pointer-events-none" />
        
        {reviewEditMode === "list" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#C9A227] block uppercase font-bold">CUSTOMER REVIEWS INDEX</span>
                <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Testimonials Catalog</h3>
              </div>
              <button
                onClick={handleOpenAddReview}
                className="bg-[#C9A227] hover:scale-103 font-mono font-bold text-black border-none text-[10px] tracking-widest uppercase px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ADD TESTIMONIAL</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {state.reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-stone-900/40 border border-stone-900 flex flex-col justify-between hover:border-red-650/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-450 text-[#C9A227]" : "text-stone-800"}`} />
                        ))}
                      </div>
                      <span className="text-[8px] font-mono text-stone-605">{r.date || "Just now"}</span>
                    </div>

                    <p className="text-stone-300 font-sans text-xs italic leading-relaxed line-clamp-3 select-text">
                      &quot;{r.comment}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-900/60 pt-3 mt-4">
                    <div className="truncate pr-2">
                      <span className="font-sans text-xs text-white block truncate font-medium">{r.name}</span>
                      <span className="text-[9px] font-mono text-stone-500 block truncate leading-none mt-1">{r.role || "Verified Epicurean client"}</span>
                    </div>

                    <div className="flex space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditReview(r)}
                        className="p-1.5 border border-stone-850 hover:border-[#C9A227] rounded-lg bg-stone-900/60 text-stone-400 hover:text-[#C9A227] transition-all cursor-pointer"
                        title="Edit review copy"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="p-1.5 border border-stone-850 hover:border-red-600 rounded-lg bg-stone-900/60 text-stone-400 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete review card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          // REVIEW ADD/EDIT FORM
          <form onSubmit={handleSaveReview} className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-900 pb-3">
              <span className="text-xs font-mono text-stone-400 font-medium tracking-wide">
                TESTIMONIALS / <span className="text-[#C9A227] uppercase font-bold">{isEditingExistingReview ? "Edit Card" : "New Testimonial"}</span>
              </span>
              <button
                type="button"
                onClick={() => setReviewEditMode("list")}
                className="p-1.5 border border-stone-850 rounded-lg text-stone-500 hover:text-white cursor-pointer bg-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Client Name</label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="e.g. Jean-Luc Godard"
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Client Corporate Title / Role</label>
                <input
                  type="text"
                  required
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  placeholder="e.g. Michelin Star Critic"
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Star rating (1-5)</label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(parseInt(e.target.value))}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs font-mono"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{"⭐".repeat(num) + " " + num + "/5"}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Review Comment Commentaries</label>
              <textarea
                required
                rows={3.5}
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Write beautiful feedback notes..."
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-3.5 border-t border-stone-900 pt-4">
              <button
                type="button"
                onClick={() => setReviewEditMode("list")}
                className="px-5 py-2.5 border border-stone-800 text-stone-450 hover:text-white rounded-xl text-xs font-mono tracking-wider transition-colors cursor-pointer bg-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE TESTIMONIAL</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
