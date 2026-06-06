/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Save, Plus, Trash2, CheckCircle, Flame, Sparkles, UserCheck, 
  UserMinus, Download, UploadCloud, Database, Clock, Calendar, ShieldCheck, Edit, X
} from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { AdminUser } from "../../types";

interface OperationSettingsProps {
  state: AppState;
}

export default function OperationSettings({ state }: OperationSettingsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "users" | "backups">("general");
  const [successMsg, setSuccessMsg] = useState("");

  // --- GENERAL SETTINGS ---
  const [restName, setRestName] = useState(state.settings.restaurantName);
  const [restPhone, setRestPhone] = useState(state.settings.phone);
  const [restEmail, setRestEmail] = useState(state.settings.email);
  const [restAddress, setRestAddress] = useState(state.settings.address);
  const [restHours, setRestHours] = useState(state.settings.openingHours);

  // --- ADMIN USERS CMS ---
  const [userEditMode, setUserEditMode] = useState<"list" | "form">("list");
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // User form fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"owner" | "manager" | "staff">("staff");
  const [userPassword, setUserPassword] = useState("secret-seals");

  // Success alert trigger
  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    storeActions.updateSettings({
      restaurantName: restName,
      phone: restPhone,
      email: restEmail,
      address: restAddress,
      openingHours: restHours
    });
    triggerToast("Global operational settings updated successfully.");
  };

  const handleOpenAddUser = () => {
    setIsEditingUser(false);
    setSelectedUser(null);
    setUserName("Miyamoto Musashi");
    setUserEmail("musashi@samuraifusion.com");
    setUserRole("staff");
    setUserPassword("katana1615");
    setUserEditMode("form");
  };

  const handleOpenEditUser = (u: AdminUser) => {
    setIsEditingUser(true);
    setSelectedUser(u);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserPassword("********"); // hidden
    setUserEditMode("form");
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingUser && selectedUser) {
      storeActions.editAdminUser(selectedUser.id, {
        name: userName,
        email: userEmail,
        role: userRole
      });
      triggerToast("Admin staff card updated.");
    } else {
      storeActions.addAdminUser({
        name: userName,
        email: userEmail,
        role: userRole,
        active: true
      });
      triggerToast("New administrator keys created successfully.");
    }
    setUserEditMode("list");
  };

  const handleDeleteUser = (id: string) => {
    storeActions.deleteAdminUser(id);
    triggerToast("Admin credential cleared from registry.");
  };

  // --- DATA BACKUP AND CSV EXPORTS ---
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `samurai_db_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Durable database exported as backup JSON successfully.");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = storeActions.importDatabaseJSON(content);
        if (res.success) {
          triggerToast("Global database schema restored successfully.");
        } else {
          alert(res.error || "Invalid file format. Ensure backup holds correct tables schema.");
        }
      } catch (err) {
        alert("Parsing error. Confirm backup file validity.");
      }
    };
    fileReader.readAsText(file);
  };

  const handleExportOrdersCSV = () => {
    if (state.orders.length === 0) {
      triggerToast("No orders available to write to CSV spreadsheet.");
      return;
    }

    const headers = ["OrderID", "Customer", "Contact", "Destination", "Fulfillment Status", "Calculation Total (EUR)", "Created Timestamp"].join(",");
    const rows = state.orders.map(o => {
      const escapedAddress = `"${o.address.replace(/"/g, '""')}"`;
      return [o.id, o.customerName, o.phone, escapedAddress, o.status, o.total.toFixed(2), o.createdAt].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, ...rows].join("\n"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `samurai_fulfillment_ledger_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Ledger CSV compiled and downloaded.");
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

      {/* Header operations */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-4 flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase font-bold">SYSTEM BACKBONE UTILITIES</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Operational & Admin Settings</span>
          </h2>
        </div>

        <div className="flex bg-[#111111] p-1 rounded-xl border border-stone-850 text-xs font-mono">
          <button
            onClick={() => { setActiveTab("general"); setUserEditMode("list"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "general" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            ⚙️ General
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "users" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            👥 Admins
          </button>
          <button
            onClick={() => { setActiveTab("backups"); setUserEditMode("list"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "backups" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            💾 Backups
          </button>
        </div>
      </div>

      {activeTab === "general" && (
        // --- 1. GENERAL SETTINGS CONTENT ---
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <form onSubmit={handleSaveGeneral} className="lg:col-span-8 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-mono text-stone-550 uppercase block font-bold">GLOBAL CONTACT SEALS</span>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mt-0.5">Restaurant Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Restaurant Brand Name</label>
                <input
                  type="text"
                  required
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Telephone Hotline Line</label>
                <input
                  type="text"
                  required
                  value={restPhone}
                  onChange={(e) => setRestPhone(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Inquiries Email Contact</label>
                <input
                  type="email"
                  required
                  value={restEmail}
                  onChange={(e) => setRestEmail(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">Operations Hours Window</label>
                <input
                  type="text"
                  required
                  value={restHours}
                  onChange={(e) => setRestHours(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Bespoke Physical GPS Address Coordinates</label>
              <textarea
                required
                rows={2}
                value={restAddress}
                onChange={(e) => setRestAddress(e.target.value)}
                className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs select-text leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>SAVE COMPREHENSIVE SETTINGS</span>
            </button>
          </form>

          {/* Quick operations guidelines widget info */}
          <div className="lg:col-span-4 bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-4 font-sans text-xs select-none">
            <span className="text-[9px] font-mono tracking-widest text-[#C9A227] uppercase block font-bold">Live Status Monitor</span>
            
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-900 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-stone-300">Live Client Link</span>
                </div>
                <span className="text-[9px] text-emerald-450 font-mono font-bold bg-emerald-950/20 py-0.5 px-2 rounded border border-emerald-900/40 uppercase">ACTIVE ONLINE</span>
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-900 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span className="text-[10px] font-mono text-stone-300">SSL Crate Shields</span>
                </div>
                <span className="text-[9px] text-[#C9A227] font-mono font-bold uppercase block">128-BIT KEY LOCKS</span>
              </div>
            </div>

            <p className="text-stone-500 text-[10px] leading-relaxed pt-2">
              Operational tags can be adjusted safely. Real-time updates push automatically to customer carts.
            </p>
          </div>

        </div>
      )}

      {activeTab === "users" && (
        // --- 2. ADMIN CREDENTIALS CMS ---
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6">
          
          {userEditMode === "list" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-900 pb-3 flex-wrap gap-4">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">AUTHENTIFICATION KEY REGISTRY</span>
                  <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Admin Staff Directory</h3>
                </div>

                <button
                  onClick={handleOpenAddUser}
                  className="bg-[#C9A227] hover:scale-103 text-black font-mono font-bold text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>ADD OPERATOR PRIVILEGE</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.adminUsers.map((u) => (
                  <div key={u.id} className="p-4 bg-stone-900/40 border border-stone-900 rounded-xl flex flex-col justify-between hover:border-red-650/40 transition-colors">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-sm font-bold text-stone-400">
                          👤
                        </div>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-widest ${u.role === "owner" ? "bg-red-950/20 border-red-900/40 text-red-400" : u.role === "manager" ? "bg-amber-950/20 border-amber-900/40 text-[#C9A227]" : "bg-stone-900 border-stone-800 text-stone-450"}`}>
                          {u.role}
                        </span>
                      </div>

                      <div>
                        <span className="font-sans text-xs text-white block font-semibold">{u.name}</span>
                        <span className="text-[10px] font-mono text-stone-500 block truncate mt-1">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-stone-900/60 pt-3 mt-4">
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="p-1.5 border border-stone-850 hover:border-[#C9A227] rounded-lg bg-stone-900/60 text-stone-400 hover:text-[#C9A227] transition-all cursor-pointer"
                        title="Edit credentials parameters"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={state.adminUsers.length === 1}
                        className="p-1.5 border border-stone-850 hover:border-red-600 rounded-lg bg-stone-900/60 text-stone-400 hover:text-red-500 transition-all disabled:opacity-30 cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Form Add/edit
            <form onSubmit={handleSaveUser} className="space-y-6 font-sans text-xs select-none">
              <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                <span className="text-xs font-mono text-stone-400 font-semibold uppercase">
                  STAFF KEYS / <span className="text-[#C9A227] tracking-widest block font-bold">{isEditingUser ? "Configure Parameter" : "Form New Keys"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setUserEditMode("list")}
                  className="p-1.5 border border-stone-850 rounded-lg text-stone-500 hover:text-white cursor-pointer bg-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Admin Full Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#C9A227] block font-bold">Access Role Permissions</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2 px-3 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  >
                    <option value="owner">Owner (Full admin keys)</option>
                    <option value="manager">Manager (Curation & dispatch)</option>
                    <option value="staff">Staff (Fulfillment queues only)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Sign-in Email Link</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="satoshi@samuraifusion.com"
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block font-bold">Passphrase Gate key</label>
                  <input
                    type="password"
                    required
                    disabled={isEditingUser}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-2.5 px-4 disabled:opacity-30 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-mono text-xs"
                  />
                </div>

              </div>

              <div className="flex justify-end space-x-3 border-t border-stone-900 pt-4">
                <button
                  type="button"
                  onClick={() => setUserEditMode("list")}
                  className="px-5 py-2.5 border border-stone-800 text-stone-455 hover:text-white rounded-xl text-xs font-mono tracking-wider transition-colors cursor-pointer bg-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-650 hover:bg-red-750 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>AUTHORIZE STAFF ACCESS</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {activeTab === "backups" && (
        // --- 3. DATABASE BACKUP AND SHEET CSV EXPORTS ---
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-stone-400">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase block font-bold">DURABLE BACKUP DRIVES</span>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mt-0.5">Global Database Backups</h3>
            </div>

            <p className="font-sans leading-relaxed text-stone-400 select-text">
              Our durable JSON core database backplanes can be copied and downloaded below. In the case of hardware failures or testing, re-upload the JSON key backups to restore perfect state operations instantly.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <button
                type="button"
                onClick={handleExportJSON}
                className="py-3 px-4 border border-stone-850 hover:border-[#C9A227] hover:text-[#C9A227] text-white rounded-xl flex items-center justify-center space-x-2 font-mono transition-colors text-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD JSON BACKUP DB</span>
              </button>

              <div className="relative group overflow-hidden border border-dashed border-stone-800 hover:border-stone-700 p-4 rounded-xl text-center bg-stone-900/20">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-1 font-mono text-[10px]">
                  <UploadCloud className="w-6 h-6 text-[#C9A227] mx-auto" />
                  <span className="text-white block">CHOOSE BACKUP FILE TO RESTORE</span>
                  <span className="text-stone-600 block text-[8px] uppercase">JSON models only</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-stone-400">
            <div>
              <span className="text-[10px] font-mono text-[#C9A227] uppercase block font-bold">SPREADSHEET EXPORTATION LEDGERS</span>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mt-0.5">Orders Archive Spreadsheet</h3>
            </div>

            <p className="font-sans leading-relaxed text-stone-400 select-text">
              Acquire complete sales records formatted under standardized CSV parameters. Intended for financial reconciliations, accounting software, or CRM ingest channels.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleExportOrdersCSV}
                className="w-full py-3 bg-stone-900 hover:bg-[#111] hover:text-[#C9A227] text-white border border-[#C9A227]/40 rounded-xl flex items-center justify-center space-x-2 font-mono transition-colors text-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#C9A227]" />
                <span>EXPORT FULFILLMENT LEDGER (.CSV)</span>
              </button>
            </div>

            <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900/60 leading-relaxed font-mono text-[9px] text-[#C9A227] flex items-start space-x-2">
              <span className="text-sm">🛡️</span>
              <div>
                <span className="text-white font-bold block uppercase leading-none mb-1">Financial Compliance verified</span>
                CSV files are compiled server-side, securing direct transactional keys perfectly.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
