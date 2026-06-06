/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, UtensilsCrossed, ShoppingBag, MapPin, Globe, Ticket,
  Settings, LogOut, ShieldCheck, UserCheck, Menu, X, BellDot, Sparkles
} from "lucide-react";
import { AppState, storeActions, useAppState } from "../../data/store";
import DashboardHome from "./DashboardHome";
import MenuCMS from "./MenuCMS";
import OrderManager from "./OrderManager";
import DeliveryCMS from "./DeliveryCMS";
import WebsiteCMS from "./WebsiteCMS";
import PromoMediaSEO from "./PromoMediaSEO";
import OperationSettings from "./OperationSettings";

export default function AdminDashboard() {
  const state = useAppState();
  
  // Sidebar responsive toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Selected Sidebar module Tab
  const [activeTab, setActiveTab] = useState<
    "analytics" | "menu" | "orders" | "delivery" | "website" | "promo" | "settings"
  >("analytics");

  // Fetch verified session metadata
  const session = state.currentUser;
  
  const handleLogout = () => {
    storeActions.logout();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center font-mono text-xs text-[#C9A227]">
        <span>ERROR: EXPIRED ADMIN ENTRANCE KEYS</span>
      </div>
    );
  }

  // Strict Role-Based Navigation Access Configuration
  // "owner" => sees everything
  // "manager" => sees Analytics, Menu CMS, Orders Dispatch, Website, Promo, but NOT settings
  // "staff" => sees ONLY Orders Dispatch

  const tabsConfig = [
    { id: "analytics" as const, label: "Analytics Overview", icon: BarChart3, roles: ["owner", "manager"] },
    { id: "menu" as const, label: "Menu Curation", icon: UtensilsCrossed, roles: ["owner", "manager"] },
    { id: "orders" as const, label: "Order Dispatch", icon: ShoppingBag, roles: ["owner", "manager", "staff"] },
    { id: "delivery" as const, label: "Fulfillment Zones", icon: MapPin, roles: ["owner", "manager"] },
    { id: "website" as const, label: "Web Content CMS", icon: Globe, roles: ["owner", "manager"] },
    { id: "promo" as const, label: "Promo & SEO Meta", icon: Ticket, roles: ["owner", "manager"] },
    { id: "settings" as const, label: "Global Settings & Backups", icon: Settings, roles: ["owner"] }
  ];

  // Filter allowed tabs based on role authentication
  const visibleTabs = tabsConfig.filter(t => t.roles.includes(session.role));

  // Determine actual starting fallback if current active tab is unauthorized
  const actualActiveTab = visibleTabs.some(t => t.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id || "orders");

  return (
    <div className="min-h-screen bg-[#070707] text-white flex select-none font-sans overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-stone-950 pb-6 border-r border-stone-900/60 flex flex-col justify-between z-[1001] transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="space-y-6">
          
          {/* Brand header */}
          <div className="h-16 border-b border-stone-900 flex items-center justify-between px-6 bg-stone-950/40">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-red-650 flex items-center justify-center text-white font-serif text-xs font-bold shadow-lg">侍</span>
              <div>
                <span className="text-xs font-mono font-bold text-white block uppercase tracking-widest leading-none">HAUTE PORTAL</span>
                <span className="text-[7px] font-mono text-stone-500 block">Restricted Operator Terminal</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 border border-stone-850 rounded bg-stone-900 text-stone-400 hover:text-white cursor-pointer lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current verified profile segment */}
          <div className="mx-4 p-3 bg-stone-900/40 border border-stone-900 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-850 flex items-center justify-center text-xs">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold text-white block truncate leading-none mb-0.5">{session.name}</span>
                <span className="text-[8px] font-mono text-[#C9A227] tracking-wider block uppercase font-bold">{session.role} LEVEL ACCESS</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {visibleTabs.map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 font-mono text-[10px] uppercase font-semibold text-left transition-all tracking-wider rounded-xl cursor-pointer flex items-center space-x-3 ${actualActiveTab === tab.id ? "bg-red-650 text-white font-bold" : "text-stone-450 hover:bg-stone-900/60 hover:text-white"}`}
                >
                  <IconComp className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* LOGOUT AND OPERATIONAL SEALS */}
        <div className="px-4 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-red-500 rounded-lg font-mono text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center space-x-2 border border-stone-850"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>TERMINATE SESSION</span>
          </button>

          <div className="flex items-center justify-center space-x-1 text-[7px] font-mono text-stone-605">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="uppercase tracking-widest text-[#C9A227]">SECURITY ENCRYPTED</span>
          </div>
        </div>

      </aside>

      {/* 2. RIGHT CONTAINER AREA (Content wrapper) */}
      <div className="flex-1 min-h-screen flex flex-col justify-between overflow-x-hidden">
        
        {/* Top Header section */}
        <header className="h-16 px-6 border-b border-stone-900/60 bg-stone-950/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 border border-stone-850 rounded-lg bg-stone-900 text-stone-400 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest hidden sm:block">
              SAMURAI HQ PORTAL / STAFF MODULES
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active alert notifier mock */}
            <div className="relative cursor-pointer" title="Operational alerts">
              <div className="w-8 h-8 rounded-full border border-stone-850 bg-stone-900/40 flex items-center justify-center text-stone-400 hover:text-white transition-all">
                <BellDot className="w-4 h-4 text-[#C9A227] animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-red-650 animate-ping" />
            </div>

            {/* Logout floating button */}
            <button
              onClick={handleLogout}
              className="p-1.5 border border-stone-850 hover:border-red-650 rounded-lg bg-stone-900/40 text-stone-550 hover:text-red-500 cursor-pointer transition-colors"
              title="Logout session keys"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN DYNAMIC TAB CONTENT PORTAL VIEWPORT */}
        <main className="flex-grow p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={actualActiveTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-[480px]"
            >
              {actualActiveTab === "analytics" && <DashboardHome state={state} />}
              {actualActiveTab === "menu" && <MenuCMS state={state} />}
              {actualActiveTab === "orders" && <OrderManager state={state} />}
              {actualActiveTab === "delivery" && <DeliveryCMS state={state} />}
              {actualActiveTab === "website" && <WebsiteCMS state={state} />}
              {actualActiveTab === "promo" && <PromoMediaSEO state={state} />}
              {actualActiveTab === "settings" && <OperationSettings state={state} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer info brand links */}
        <footer className="py-4 border-t border-stone-900/60 bg-stone-950/10 text-center text-[8px] font-mono text-stone-600 block uppercase select-none">
          © 2026 Samurai Tokyo Fusion. All administrative operations are logged securely.
        </footer>

      </div>

    </div>
  );
}
