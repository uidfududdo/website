/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, KeyRound, Mail, Eye, EyeOff, UserSquare2, RefreshCcw } from "lucide-react";
import { storeActions } from "../../data/store";
import { AdminUser } from "../../types";

interface AdminLoginProps {
  onLoginSuccess?: (user: AdminUser) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Rate-limiting brute force simulation
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAttempts >= 5) {
      setError("Brute-force protection: Too many failed login attempts. Please wait 30 seconds.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      const res = storeActions.login(email.toLowerCase(), password, rememberMe);
      setLoading(false);
      
      if (res.success && res.user) {
        onLoginSuccess?.(res.user);
      } else {
        setLoginAttempts(prev => prev + 1);
        setError(res.error || "Incorrect email or password.");
      }
    }, 850);
  };

  const handleQuickFill = (role: "owner" | "manager" | "staff") => {
    setError("");
    if (role === "owner") {
      setEmail("owner@samurai.com");
      setPassword("chef_sato");
    } else if (role === "manager") {
      setEmail("manager@samurai.com");
      setPassword("manager_yuki");
    } else {
      setEmail("staff@samurai.com");
      setPassword("staff_hiroshi");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#F5F5F5] flex items-center justify-center p-4 selection:bg-red-650 selection:text-white">
      {/* Light decorative background dots simulating modern Stripe/Vercel styling */}
      <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full filter blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full bg-stone-950 border border-stone-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden z-12"
      >
        {/* Brand identity */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-[#C9A227] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-950/20">
            侍
          </div>
          <div>
            <h1 className="font-sans font-semibold text-lg tracking-[0.2em] text-white">
              SAMURAI ADMIN
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">
              Core Enterprise CMS Portal
            </p>
          </div>
        </div>

        {isResetting ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold tracking-wider uppercase font-mono text-stone-400">
                PASSWORD RESET
              </h2>
              <p className="text-xs text-stone-500 font-sans leading-relaxed">
                Enter your administrative email to receive a secure recovery verification package.
              </p>
            </div>

            {resetSent ? (
              <div className="bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-xs p-4 rounded-xl leading-relaxed">
                ✓ Recovery linkage email dispatched. Please check your admin mailbox for password recovery parameters.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@samuraifusion.com"
                      className="w-full bg-stone-900/60 text-white border border-stone-850 rounded-xl py-3 pl-11 pr-4 focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227] focus:outline-none font-sans text-xs tracking-wider"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  {loading ? "DISPATCHING..." : "SEND RECOVERY LINK"}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsResetting(false);
                setResetSent(false);
                setError("");
              }}
              className="w-full text-center text-[10px] uppercase font-mono tracking-widest text-[#C9A227] hover:underline"
            >
              Return to Login Panel
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/20 border border-red-900/60 text-red-400 text-xs p-3.5 rounded-xl text-center font-sans">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 flex items-center justify-between">
                  <span>ADMIN EMAIL</span>
                  <span className="text-[8px] text-stone-500">JWT-SECURED</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@samuraifusion.com"
                    className="w-full bg-stone-904 bg-[#111111] text-white border border-stone-850 rounded-xl py-3.5 pl-11 pr-4 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs tracking-wider"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400">PASSPHRASE</label>
                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-[9px] uppercase tracking-wider text-stone-500 hover:text-white"
                  >
                    Forgot Code?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111111] text-white border border-stone-850 rounded-xl py-3.5 pl-11 pr-11 focus:ring-1 focus:ring-[#C9A227] focus:outline-none font-sans text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Session / Keep logged in */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs text-stone-400 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-800 bg-[#111111] text-red-650 focus:ring-0 w-3.5 h-3.5 accent-[#C9A227]"
                  />
                  <span>Remember Session</span>
                </label>
                <span className="text-[10px] font-mono text-stone-500 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  <span>SSL SECURE</span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-650 hover:from-red-650 hover:to-red-750 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-red-950/20 mt-4 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>AUTHORIZING ENTRY...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>SECURE SIGN IN</span>
                </>
              )}
            </button>

            {/* QUICK SEEDS (Vercel-style easy testing buttons) */}
            <div className="border-t border-stone-900 pt-6 mt-4">
              <span className="text-[9px] font-mono text-stone-500 tracking-widest uppercase block mb-3 text-center">
                Fast Tester Role Selection
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("owner")}
                  className="px-2 py-2 bg-stone-900 hover:bg-stone-850 hover:border-red-600/40 border border-stone-850 text-[10px] rounded-lg font-mono text-stone-300 tracking-wider transition-all"
                  title="Owner Access: Manage everything + settings + analytics"
                >
                  👑 OWNER
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("manager")}
                  className="px-2 py-2 bg-stone-900 hover:bg-stone-850 hover:border-amber-500/40 border border-stone-850 text-[10px] rounded-lg font-mono text-stone-300 tracking-wider transition-all"
                  title="Manager Access: View orders, edit menu, promotions"
                >
                  💼 MANAGER
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("staff")}
                  className="px-2 py-2 bg-stone-900 hover:bg-stone-850 hover:border-blue-600/40 border border-stone-850 text-[10px] rounded-lg font-mono text-stone-300 tracking-wider transition-all"
                  title="Staff Access: View and update order statuses only"
                >
                  🧑‍🍳 STAFF
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
