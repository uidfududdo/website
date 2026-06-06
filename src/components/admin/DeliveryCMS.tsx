/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Navigation, DollarSign, FileText, CheckCircle, Save, X, Layers } from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { DeliveryZone } from "../../types";

interface DeliveryCMSProps {
  state: AppState;
}

export default function DeliveryCMS({ state }: DeliveryCMSProps) {
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(state.deliveryZones[0] || null);
  
  // Edit Form Fields
  const [fee, setFee] = useState(4.90);
  const [minOrder, setMinOrder] = useState(15.00);
  const [enabled, setEnabled] = useState(true);

  // Success alert
  const [successMsg, setSuccessMsg] = useState("");

  const handleSelectZone = (zone: DeliveryZone) => {
    setSelectedZone(zone);
    setFee(zone.fee);
    setMinOrder(zone.minOrder);
    setEnabled(zone.enabled);
  };

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) return;

    storeActions.updateDeliveryZone(selectedZone.id, {
      fee,
      minOrder,
      enabled
    });

    setSuccessMsg(`Fulfillment values for ${selectedZone.name} modified successfully.`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className="space-y-6 select-none relative">
      
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
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase">FULFILLMENT DISPATCH RULES</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Delivery Zones & Zones Map</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: STYLED INTERACTIVE VECTOR DELIVERY MAP */}
        <div className="xl:col-span-7 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[460px]">
          
          <div className="flex items-center justify-between border-b border-stone-900/60 pb-3 mb-6">
            <div>
              <span className="text-[10px] font-mono text-stone-500 block uppercase">VECTOR GEOGRAPHIC RANGE SECTORS</span>
              <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Interactive Paris Zone Maps</h3>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#C9A227]">
              <span className="w-1.5 h-1.5 bg-red-650 rounded-full inline-block animate-pulse"></span>
              <span>MAP RENDERING SEALS</span>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-4 bg-stone-900/20 border border-stone-900 rounded-xl overflow-hidden min-h-[280px]">
            {/* SVG Vector Map depicting Paris residential sectors */}
            <svg 
              viewBox="0 0 320 220" 
              className="w-full h-full max-h-[260px] max-w-[400px]"
            >
              <g stroke="#222" strokeWidth="1.5">
                {/* Seine River vector curved lines styling the landscape */}
                <path d="M 0,110 C 100,105 160,112 320,105" fill="none" stroke="#221a12" strokeWidth="5" />
                <path d="M 0,110 C 100,105 160,112 320,105" fill="none" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.4" />

                {/* ZONE 1 area (Zone A) */}
                <path 
                  d="M 60,60 L 140,40 L 160,100 L 90,110 Z" 
                  fill={selectedZone?.id === "zone-1" ? "#dc2626" : "#111111"} 
                  fillOpacity={selectedZone?.id === "zone-1" ? 0.25 : 0.6}
                  stroke={selectedZone?.id === "zone-1" ? "#C9A227" : "#333"}
                  className="transition-all duration-300 cursor-pointer hover:fill-red-600/10"
                  onClick={() => handleSelectZone(state.deliveryZones[0])}
                />
                
                {/* ZONE 2 area (Zone B) */}
                <path 
                  d="M 140,40 L 250,55 L 220,105 L 160,100 Z" 
                  fill={selectedZone?.id === "zone-2" ? "#dc2626" : "#111111"} 
                  fillOpacity={selectedZone?.id === "zone-2" ? 0.25 : 0.6}
                  stroke={selectedZone?.id === "zone-2" ? "#C9A227" : "#333"}
                  className="transition-all duration-300 cursor-pointer hover:fill-red-600/10"
                  onClick={() => handleSelectZone(state.deliveryZones[1])}
                />

                {/* ZONE 3 area (Zone C) */}
                <path 
                  d="M 90,110 L 160,100 L 200,170 L 110,180 Z" 
                  fill={selectedZone?.id === "zone-3" ? "#dc2626" : "#111111"} 
                  fillOpacity={selectedZone?.id === "zone-3" ? 0.25 : 0.6}
                  stroke={selectedZone?.id === "zone-3" ? "#C9A227" : "#333"}
                  className="transition-all duration-300 cursor-pointer hover:fill-red-600/10"
                  onClick={() => handleSelectZone(state.deliveryZones[2])}
                />

                {/* ZONE 4 area (Zone D) */}
                <path 
                  d="M 160,100 L 220,105 L 260,160 L 200,170 Z" 
                  fill={selectedZone?.id === "zone-4" ? "#dc2626" : "#111111"} 
                  fillOpacity={selectedZone?.id === "zone-4" ? 0.25 : 0.6}
                  stroke={selectedZone?.id === "zone-4" ? "#C9A227" : "#333"}
                  className="transition-all duration-300 cursor-pointer hover:fill-red-600/10"
                  onClick={() => handleSelectZone(state.deliveryZones[3])}
                />
              </g>

              {/* Labels on Map */}
              <text x="110" y="80" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle" className="font-mono">ZONE A</text>
              <text x="190" y="70" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle" className="font-mono">ZONE B</text>
              <text x="140" y="140" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle" className="font-mono">ZONE C</text>
              <text x="210" y="135" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle" className="font-mono">ZONE D</text>
            </svg>

            {/* Float Overlay Legend */}
            <div className="absolute bottom-4 left-4 right-4 bg-stone-950/90 border border-stone-900 p-2.5 rounded-lg flex justify-between text-[8px] font-mono select-none">
              <span className="text-stone-550">TAP SEGMENTS TO CONFIGURE RULES</span>
              <span className="text-emerald-400">SSL SECURITY VERIFIED</span>
            </div>
          </div>

        </div>

        {/* RIGHT AREA: ZONE PARAMETER FORMS CONTROLLER */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Active zones selector panel */}
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-stone-500 block">ZONES CLASSIFICATIONS</span>
              <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Fulfillment Range</h3>
            </div>

            <div className="space-y-3">
              {state.deliveryZones.map(zone => (
                <div 
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${selectedZone?.id === zone.id ? "bg-red-950/20 border-[#C9A227]" : "bg-[#111111]/40 border-stone-900 hover:border-stone-800"}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5.5 h-5.5 bg-[#000] border border-stone-850 rounded flex items-center justify-center text-xs">
                      💼
                    </div>
                    <div>
                      <span className="font-sans text-xs text-white block truncate font-medium">{zone.name}</span>
                      <span className="text-[9px] font-mono text-stone-500 mt-1 block">
                        {zone.enabled ? `fee: €${zone.fee.toFixed(2)}` : "Unavailable / Offline"}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${zone.enabled ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" : "bg-red-950/20 border-red-900/40 text-red-450"}`}>
                    {zone.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active settings pricing forms */}
          {selectedZone && (
            <form onSubmit={handleSaveParameters} className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-stone-900 pb-3">
                <span className="text-[9px] font-mono text-[#C9A227] block uppercase font-bold">RANGE SETTING DETAILS</span>
                <h3 className="text-sm font-sans font-bold text-white truncate leading-none mt-1 uppercase">
                  {selectedZone.name}
                </h3>
              </div>

              <div className="space-y-4">
                
                {/* Flat rate delivery fee */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Delivery Fee (€)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fee}
                    onChange={(e) => setFee(parseFloat(e.target.value))}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>

                {/* Minimum orders rules */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Minimum Order Cap (€)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(parseFloat(e.target.value))}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>

                {/* Status Toggle enable */}
                <div className="flex items-center justify-between bg-stone-900 p-3.5 rounded-xl border border-stone-850">
                  <div>
                    <span className="text-[9px] font-mono text-stone-300 block uppercase font-bold">Enable Delivery area</span>
                    <span className="text-[8px] text-stone-500 font-sans block mt-0.5">Toggle live operations check</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-red-650 accent-[#C9A227] border-stone-800"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>SAVE RULES</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
