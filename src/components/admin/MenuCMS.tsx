/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit, Trash2, Eye, Laptop, Smartphone, Save, X, ArrowUp, ArrowDown,
  Sparkles, CheckCircle, HelpCircle, FileText, Flame, ShieldAlert, Layers
} from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { MenuItem, MenuItemCategory } from "../../types";

interface MenuCMSProps {
  state: AppState;
}

export default function MenuCMS({ state }: MenuCMSProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Editor mode states: "list" | "edit" | "add"
  const [editMode, setEditMode] = useState<"list" | "form">("list");
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState<string>("");
  const [formCalories, setFormCalories] = useState(300);
  const [formPrepTime, setFormPrepTime] = useState(10);
  const [formSpicy, setFormSpicy] = useState<0 | 1 | 2 | 3>(0);
  const [formIngredients, setFormIngredients] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Category CMS forms
  const [newCatName, setNewCatName] = useState("");
  const [editingCatName, setEditingCatName] = useState("");
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);

  // Live Preview device simulator: "mobile" | "desktop"
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");

  // Soft delete / Delete states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Save/Feedback confirmation alerts
  const [alertMsg, setAlertMsg] = useState("");

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 2500);
  };

  // Open Form for Adding a new dish
  const handleOpenAddForm = () => {
    setIsEditingExisting(false);
    setSelectedItem(null);
    setFormName("Luxury Spicy Roll");
    setFormDesc("Signature Maki roll drizzled in truffle sriracha sauce and crowned with fresh chives.");
    setFormPrice(18.50);
    setFormCategory(state.categories[0] || "Aromakis");
    setFormCalories(310);
    setFormPrepTime(12);
    setFormSpicy(1);
    setFormIngredients("Bluefin Tuna, Truffle Paste, Volcanic Sriracha, Koshihikari Rice, Nori Wrap");
    setIsBestSeller(true);
    setIsChefSpecial(true);
    setIsAvailable(true);
    setEditMode("form");
  };

  // Open Form for editing a dish
  const handleOpenEditForm = (item: MenuItem) => {
    setIsEditingExisting(true);
    setSelectedItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormCalories(item.calories);
    setFormPrepTime(item.prepTime);
    setFormSpicy(item.spicyLevel || 0);
    setFormIngredients(item.ingredients.join(", "));
    setIsBestSeller(!!item.isBestSeller);
    setIsChefSpecial(!!item.isChefSpecial);
    setIsAvailable(item.prepTime > 0); // available
    setEditMode("form");
  };

  // Save/Submit Form
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = formIngredients
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== "");

    const payload = {
      name: formName,
      description: formDesc,
      price: formPrice,
      category: formCategory as MenuItemCategory,
      calories: formCalories,
      prepTime: isAvailable ? formPrepTime : 0, // 0 prep time means unavailable
      spicyLevel: formSpicy,
      ingredients: ingredientsArray,
      isBestSeller,
      isChefSpecial
    };

    if (isEditingExisting && selectedItem) {
      storeActions.editMenuItem(selectedItem.id, payload);
      triggerAlert("Dish variables revised and updated successfully.");
    } else {
      const added = storeActions.addMenuItem(payload);
      setSelectedItem(added);
      setIsEditingExisting(true); // switch to edit mode of the created item
      triggerAlert("Dispatched & created new masterpiece category card.");
    }
  };

  // Delete actions
  const handleDeleteItem = (id: string) => {
    storeActions.deleteMenuItem(id);
    setDeleteConfirmId(null);
    setEditMode("list");
    setSelectedItem(null);
    triggerAlert("Piece deleted safely from index.");
  };

  // Create Category Action
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    storeActions.createCategory(newCatName.trim());
    setNewCatName("");
    triggerAlert("New Category group initialized.");
  };

  // Edit Category Action
  const handleRenameCategory = (oldName: string) => {
    if (!editingCatName.trim()) return;
    storeActions.editCategory(oldName, editingCatName.trim());
    setRenamingCategory(null);
    setEditingCatName("");
    triggerAlert("Category tags renamed successfully.");
  };

  // Delete Category Action
  const handleDeleteCategory = (catName: string) => {
    storeActions.deleteCategory(catName);
    triggerAlert("Category catalog cleared perfectly.");
  };

  return (
    <div className="space-y-6 select-none relative">
      
      {/* CMS Success Toast notification */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-emerald-950/85 border border-emerald-500 text-emerald-300 text-xs py-3 px-5 rounded-xl z-50 shadow-2xl flex items-center space-x-2 font-mono"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{alertMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title + Action Banner */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase">HAUTE DIRECT CM ENGINE</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Menu & Curation Catalog</span>
          </h2>
        </div>

        <div className="flex bg-[#111111] p-1 rounded-xl border border-stone-850 text-xs font-mono">
          <button
            onClick={() => { setActiveTab("items"); setEditMode("list"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "items" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            Dishes Index
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "categories" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            Categories Catalog
          </button>
        </div>
      </div>

      {activeTab === "items" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: DISH EDITOR CARD */}
          <div className="xl:col-span-7 space-y-6">
            
            {editMode === "list" ? (
              <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-sans font-bold text-stone-200 uppercase tracking-widest leading-none">Dishes Inventory</h3>
                    <span className="text-[10px] text-stone-500 font-mono mt-1 block">Manage pricing details, descriptions and assets</span>
                  </div>
                  <button
                    onClick={handleOpenAddForm}
                    className="bg-red-660 bg-[#C9A227] hover:scale-103 font-mono font-bold text-black border-none text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADD DISH</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-900 overflow-y-auto max-h-[500px] scrollbar-thin">
                  {state.menuItems.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-[#111111]/20 px-3 rounded-xl transition-colors">
                      <div className="flex items-center space-x-4 min-w-0 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-850 flex items-center justify-center text-red-500 text-lg flex-shrink-0">
                          🍣
                        </div>
                        <div className="min-w-0">
                          <span className="font-sans font-medium text-white block truncate text-xs">{item.name}</span>
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-500 mt-1">
                            <span className="bg-[#111111] px-1.5 py-0.5 rounded border border-stone-900">{item.category}</span>
                            <span>•</span>
                            <span className="text-[#C9A227] font-bold">€{item.price.toFixed(2)}</span>
                            {item.prepTime === 0 && (
                              <span className="bg-red-950/20 text-red-400 px-1 py-0.2 rounded font-sans text-[8px] border border-red-900/40">OUT OF STOCK</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="p-2 border border-stone-850 hover:border-[#C9A227] rounded-lg bg-stone-900/60 text-stone-400 hover:text-[#C9A227] transition-all cursor-pointer"
                          title="Configure item parameters"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 border border-stone-850 hover:border-red-600 rounded-lg bg-stone-900/60 text-stone-400 hover:text-red-500 transition-all cursor-pointer"
                          title="Delete dish from index"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              // EDITING FORM (Shoppify Editor left side style)
              <form onSubmit={handleSaveItem} className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-stone-900 pb-4">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <button 
                      type="button" 
                      onClick={() => setEditMode("list")} 
                      className="text-stone-500 hover:text-white"
                    >
                      DISHES
                    </button>
                    <span className="text-stone-750">/</span>
                    <span className="text-[#C9A227] uppercase font-bold">
                      {isEditingExisting ? "Edit Masterpiece" : "Form New Masterpiece"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditMode("list")}
                    className="p-1.5 border border-stone-850 rounded-lg text-stone-500 hover:text-white cursor-pointer bg-stone-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Dish Name */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Aromaki Truffle Salmon"
                      className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Price (€)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value))}
                      placeholder="Price"
                      className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Category Scope</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                    >
                      {state.categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Spicy level */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Spicy Index</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormSpicy(level as any)}
                          className={`py-2 text-[10px] font-mono text-center border rounded-lg cursor-pointer ${formSpicy === level ? "bg-red-650 border-red-500 text-white font-bold" : "bg-stone-900 border-stone-850 text-stone-400 hover:text-white"}`}
                        >
                          {level === 0 ? "🌶️ 0" : "🌶️".repeat(level)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prep Time */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Prep Time (mins)</label>
                    <input
                      type="number"
                      required
                      value={formPrepTime}
                      onChange={(e) => setFormPrepTime(parseInt(e.target.value))}
                      placeholder="Minutes"
                      className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                    />
                  </div>

                  {/* Calories */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      value={formCalories}
                      onChange={(e) => setFormCalories(parseInt(e.target.value))}
                      placeholder="Kcal"
                      className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                    />
                  </div>

                </div>

                {/* Ingredients tag listing */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 flex items-center justify-between font-bold">
                    <span>Ingredients list</span>
                    <span className="text-[8px] text-stone-600">COMMA DELIMITED</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    placeholder="Premium Atlantic Salmon, Hass Avocado, Sesame crunches..."
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Description Text</label>
                  <textarea
                    required
                    rows={2.5}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Write beautiful editorial dining notes representing geometric flavor parameters of this sushi mastercraft piece..."
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-900">
                  <label className="flex items-center space-x-2 text-[10px] text-stone-300 font-mono tracking-wider cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded accent-[#C9A227] border-stone-800"
                    />
                    <span>👑 BEST SELLER</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-stone-300 font-mono tracking-wider cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChefSpecial}
                      onChange={(e) => setIsChefSpecial(e.target.checked)}
                      className="rounded accent-[#C9A227] border-stone-800"
                    />
                    <span>⭐ CHEF SPECIAL</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-stone-300 font-mono tracking-wider cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded accent-[#C9A227] border-stone-800"
                    />
                    <span>📦 IN STOCK</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setEditMode("list")}
                    className="px-5 py-3 border border-stone-800 text-stone-450 hover:text-white rounded-xl text-xs font-mono tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE Masterpiece</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* RIGHT AREA: SHOPIFY THEME EDITOR STYLE DEVICE PREVIEW */}
          <div className="xl:col-span-5 space-y-4">
            
            <div className="flex items-center justify-between bg-stone-950 border border-stone-900 rounded-2xl py-3 px-4 shadow-lg text-xs font-mono">
              <span className="text-stone-500 font-bold uppercase tracking-wider">Device Live Preview Router</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg border cursor-pointer ${previewDevice === "mobile" ? "bg-stone-900 border-[#C9A227] text-white" : "border-stone-850 text-stone-500 hover:text-white"}`}
                  title="Simulate iPhone layout views"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg border cursor-pointer ${previewDevice === "desktop" ? "bg-stone-900 border-[#C9A227] text-white" : "border-stone-850 text-stone-500 hover:text-white"}`}
                  title="Simulate MacBook high-res responsive views"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Virtual Device stage */}
            <div className="flex justify-center flex-1 bg-stone-900/40 border border-stone-900 p-8 rounded-3xl min-h-[480px]">
              
              {previewDevice === "mobile" ? (
                // iPhone Device structure
                <div className="relative w-[280px] h-[520px] bg-black border-[6px] border-stone-850 rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between">
                  {/* Camera island notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-stone-900"></span>
                  </div>

                  {/* Safe header area */}
                  <div className="bg-[#0B0B0B] text-center pt-5 pb-3 px-4 border-b border-white/5 z-10 flex items-center justify-between">
                    <span className="text-white text-[8px] font-sans font-semibold tracking-wider font-mono">SAMURAI</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-650 flex items-center justify-center text-white text-[6px]">侍</span>
                  </div>

                  {/* Screen Content */}
                  <div className="bg-[#0B0B0B] flex-1 overflow-y-auto p-4 space-y-4 text-white scrollbar-none select-none">
                    
                    <span className="text-[6px] font-mono tracking-widest text-[#C9A227] block uppercase">LIVE PREVIEW THEME RENDER</span>
                    
                    {/* Render Form dish if actively editing, otherwise first catalog items */}
                    <div className="bg-stone-950/90 border border-stone-900 rounded-xl p-3 space-y-3.5 relative overflow-hidden">
                      {isBestSeller && (
                        <span className="absolute top-2 right-2 bg-[#C9A227] text-black text-[6px] px-1 py-0.2 rounded font-mono font-bold uppercase z-10">Bestseller</span>
                      )}
                      
                      <div className="w-full h-24 bg-stone-900 rounded-lg flex items-center justify-center text-2xl relative overflow-hidden">
                        🍣
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-between p-1.5 text-[8px] font-mono">
                          <span className="text-stone-300">PREV CARD</span>
                          <span className="text-[#C9A227] font-bold">€{formPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[7px] font-mono tracking-wider text-red-500 uppercase">{formCategory || "AROMAKIS"}</span>
                        <h4 className="text-[11px] font-sans font-bold text-white leading-none tracking-tight block truncate">
                          {formName || "Sato Masterpiece Item"}
                        </h4>
                        <p className="text-gray-500 font-sans text-[8px] leading-relaxed line-clamp-3 select-text">
                          {formDesc || "Write luxury dining notes..."}
                        </p>
                      </div>

                      <div className="border-t border-stone-900/60 pt-2 flex items-center justify-between text-[7px] font-mono text-stone-400">
                        <span>🔥 {formCalories} kcal</span>
                        <span className="text-[#C9A227]">👑 {formSpicy > 0 ? "🌶️".repeat(formSpicy) : "No spice"}</span>
                        <span>⏱ {formPrepTime} mins</span>
                      </div>

                      <div className="bg-stone-900/50 p-1.5 rounded-lg border border-stone-900 text-[6px] font-mono text-stone-500 line-clamp-2 leading-tight">
                        <span className="text-stone-300">INGREDIENTS:</span> {formIngredients || "Fresh elements"}
                      </div>

                      <button type="button" className="w-full py-1.5 bg-red-650 text-white rounded-lg text-[8px] font-mono font-bold tracking-widest uppercase cursor-default">
                        {isAvailable ? "ORDER NOW" : "RESERVE SOLD OUT"}
                      </button>

                    </div>

                    <div className="bg-[#111111]/30 border border-stone-900 p-2.5 rounded-lg text-[6px] text-stone-500 font-mono text-center">
                      * Real-time edits synchronize to client catalog instantly. No code revisions.
                    </div>

                  </div>

                </div>
              ) : (
                // MacBook Desktop Device structure
                <div className="relative w-[440px] h-[340px] bg-black border-[5px] border-stone-850 rounded-[16px] overflow-hidden shadow-2xl flex flex-col justify-between self-center">
                  {/* Top Web browser header */}
                  <div className="bg-stone-950 py-2.5 px-3 border-b border-white/5 z-10 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    </div>
                    <div className="bg-[#111] leading-none px-4 py-1 rounded text-[7px] font-mono text-stone-500 w-48 text-center truncate">
                      https://samuraifusion.com/menu_preview
                    </div>
                  </div>

                  {/* Content stage */}
                  <div className="bg-[#0B0B0B] flex-1 overflow-y-auto p-5 space-y-4 text-white scrollbar-none select-none">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-6 h-[1px] bg-red-600 block"></span>
                      <span className="text-[7px] font-mono tracking-widest uppercase text-red-500">HAUTE DIGI-PREVIEW</span>
                    </div>

                    <div className="flex gap-4 items-start bg-stone-950 p-3.5 rounded-xl border border-stone-900">
                      <div className="w-16 h-16 bg-[#111] rounded-lg border border-stone-850 text-xl flex items-center justify-center flex-shrink-0">
                        🍣
                      </div>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-[#C9A227]">{formCategory || "Menu catalog"}</span>
                          <span className="text-[10px] font-mono text-white">€{formPrice.toFixed(2)}</span>
                        </div>
                        <h4 className="text-[12px] font-sans font-bold leading-none select-text truncate">
                          {formName || "Selected Chef Special"}
                        </h4>
                        <p className="text-[8px] text-gray-500 font-sans leading-relaxed line-clamp-2 select-text">
                          {formDesc || "Describe mastercraft dishes details..."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[7px] font-mono">
                      <div className="bg-[#111] py-1 px-2 rounded border border-stone-900">⏱️ {formPrepTime} min</div>
                      <div className="bg-[#111] py-1 px-2 rounded border border-stone-900">🔥 {formCalories} kcal</div>
                      <div className="bg-[#111] py-1 px-2 rounded border border-stone-900">🌶️ spicy: {formSpicy}</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        // CATEGORY CONTENT MANAGER (Add, renamed delete, reorder categories)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Create category panel */}
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-sans font-bold text-stone-200 uppercase tracking-widest leading-none">Create Category</h3>
              <span className="text-[10px] text-stone-500 font-mono mt-1 block">Initialize custom culinary tags without code modifications</span>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Premium Sashimis"
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>INITIALIZE CATEGORY</span>
              </button>
            </form>
          </div>

          {/* List & edit catalog categories */}
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-sans font-bold text-stone-200 uppercase tracking-widest leading-none">Categories Catalog</h3>
              <span className="text-[10px] text-stone-500 font-mono mt-1 block">Rename titles or wipe empty classifications</span>
            </div>

            <div className="divide-y divide-stone-900 overflow-y-auto max-h-[360px] scrollbar-thin">
              {state.categories.map((cat, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  
                  {renamingCategory === cat ? (
                    <div className="flex items-center space-x-2 flex-grow pr-4">
                      <input
                        type="text"
                        required
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="flex-grow bg-[#111111] text-white border border-stone-850 rounded-lg py-1 px-3 text-xs focus:ring-1 focus:ring-[#C9A227] focus:outline-none"
                      />
                      <button
                        onClick={() => handleRenameCategory(cat)}
                        className="p-1 border border-stone-800 text-emerald-400 hover:bg-stone-900 rounded cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setRenamingCategory(null)}
                        className="p-1 border border-stone-800 text-red-400 hover:bg-stone-900 rounded cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-stone-900 text-stone-500 font-mono text-[9px] flex items-center justify-center border border-stone-850 rounded">
                          {idx + 1}
                        </div>
                        <span className="font-sans font-semibold text-white tracking-wider">{cat}</span>
                        <span className="text-[9px] bg-[#111] px-1 py-0.2 text-stone-500 border border-stone-900 rounded font-mono">
                          {state.menuItems.filter(item => item.category === cat).length} items
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => { setRenamingCategory(cat); setEditingCatName(cat); }}
                          className="p-1.5 border border-stone-850 hover:border-[#C9A227] text-stone-500 hover:text-[#C9A227] bg-stone-900 rounded cursor-pointer"
                          title="Rename classification Title"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 border border-stone-850 hover:border-red-600 text-stone-500 hover:text-red-500 bg-stone-900 rounded cursor-pointer"
                          title="Purge category completely"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* CONFIRMATION MODAL TO DELETE ITEMS */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[2001] backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 border border-red-900/60 p-6 rounded-2xl max-w-sm w-full text-center space-y-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 bg-red-950/40 border border-red-500 flex items-center justify-center rounded-full text-red-500 mx-auto text-xl">
                ⚠️
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest text-[#C9A227] block uppercase font-bold text-center">AUTHENTICATION VERIFIED</span>
                <h3 className="text-sm font-sans font-bold text-white text-center">Purge Masterpiece Sushi?</h3>
                <p className="text-stone-400 font-sans text-xs text-center leading-relaxed">
                  Are you certain you wish to purge this culinary asset from the menu. This action permanently deletes selection values.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 border border-stone-850 font-mono text-xs text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  ABORT
                </button>
                <button
                  type="button"
                  onClick={() => deleteConfirmId && handleDeleteItem(deleteConfirmId)}
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase rounded-lg transition-transform cursor-pointer"
                >
                  CONFIRM PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
