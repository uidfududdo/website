/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Phone, MapPin, User, FileText, CheckCircle, Clock, X,
  ArrowRight, ToggleLeft, ShieldAlert, Check, HelpCircle, RotateCcw, Ban
} from "lucide-react";
import { AppState, storeActions } from "../../data/store";
import { Order } from "../../types";

interface OrderManagerProps {
  state: AppState;
}

export default function OrderManager({ state }: OrderManagerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeBoardFilter, setActiveBoardFilter] = useState<"kanban" | "all-list">("kanban");
  
  // Quick status map mapping database status to visual pipelines
  // Database values: "pending" | "preparing" | "cooking" | "dispatched" | "arriving" | "delivered"
  // Request values: "New", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"
  
  const pipelineColumns = useMemo(() => {
    return [
      { id: "new", title: "New Request", color: "from-blue-600/20 to-blue-500/10", border: "border-blue-900/40" },
      { id: "preparing", title: "In Kitchen", color: "from-amber-600/20 to-amber-500/10", border: "border-amber-900/40" },
      { id: "dispatched", title: "With Courier", color: "from-purple-600/20 to-purple-500/10", border: "border-purple-900/40" },
      { id: "delivered", title: "Delivered", color: "from-emerald-600/20 to-emerald-500/10", border: "border-emerald-900/40" }
    ];
  }, []);

  const getPipelineId = (status: Order["status"]): string => {
    if (status === "pending") return "new";
    if (status === "preparing" || status === "cooking") return "preparing";
    if (status === "dispatched" || status === "arriving") return "dispatched";
    return "delivered";
  };

  const getOrderStatusColor = (status: Order["status"] | "cancelled") => {
    switch (status) {
      case "pending": return "bg-blue-950/45 text-blue-400 border border-blue-900/40";
      case "preparing":
      case "cooking": return "bg-amber-950/45 text-amber-400 border border-amber-900/40";
      case "dispatched":
      case "arriving": return "bg-purple-950/45 text-purple-400 border border-purple-900/40";
      case "delivered": return "bg-emerald-950/45 text-emerald-400 border border-emerald-900/40";
      default: return "bg-stone-900 text-stone-400 border border-stone-850";
    }
  };

  const handleAdvanceStatus = (order: Order) => {
    let nextStatus: Order["status"] = "delivered";
    if (order.status === "pending") nextStatus = "preparing";
    else if (order.status === "preparing") nextStatus = "cooking";
    else if (order.status === "cooking") nextStatus = "dispatched";
    else if (order.status === "dispatched") nextStatus = "arriving";
    else if (order.status === "arriving") nextStatus = "delivered";

    storeActions.updateOrderStatus(order.id, nextStatus);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    storeActions.updateOrderStatus(orderId, "cancelled" as any);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: "cancelled" as any } : null);
    }
  };

  const ordersByPipeline = useMemo(() => {
    const map: { [key: string]: Order[] } = {
      new: [],
      preparing: [],
      dispatched: [],
      delivered: []
    };
    state.orders.forEach(o => {
      // Exclude cancelled order from active kanban columns
      if ((o.status as any) === "cancelled") return;
      const pipelineId = getPipelineId(o.status);
      if (map[pipelineId]) {
        map[pipelineId].push(o);
      }
    });
    return map;
  }, [state.orders]);

  return (
    <div className="space-y-6 select-none relative">
      
      {/* 1. TOP CONTROL ROW */}
      <div className="flex items-center justify-between border-b border-stone-900 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A227] block uppercase">HAUTE FULFILLMENT STATION</span>
          <h2 className="text-lg md:text-xl font-sans font-medium text-white flex items-center space-x-2">
            <span>Orders Dispatch Board</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded-full">
              {state.orders.filter(o => o.status !== "delivered").length} Active
            </span>
          </h2>
        </div>

        <div className="flex bg-[#111111] p-1 rounded-xl border border-stone-850 text-xs font-mono">
          <button
            onClick={() => setActiveBoardFilter("kanban")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeBoardFilter === "kanban" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            Kanbann Board
          </button>
          <button
            onClick={() => setActiveBoardFilter("all-list")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeBoardFilter === "all-list" ? "bg-red-650 text-white font-bold" : "text-stone-400 hover:text-white"}`}
          >
            Archival Log
          </button>
        </div>
      </div>

      {activeBoardFilter === "kanban" ? (
        // 2a. MODERN KANBAN WORKFLOW LAYOUT
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {pipelineColumns.map(col => {
            const list = ordersByPipeline[col.id] || [];
            return (
              <div 
                key={col.id} 
                className="bg-stone-950 rounded-2xl border border-stone-900/60 shadow-xl p-4 flex flex-col justify-between min-h-[460px] relative overflow-hidden"
              >
                {/* Visual decorative flare */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${col.color}`} />
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-900/60">
                    <span className="font-sans font-bold text-xs text-white uppercase tracking-wider">{col.title}</span>
                    <span className="text-[10px] font-mono select-none px-2 py-0.5 bg-stone-900 rounded text-stone-500 font-bold">
                      {list.length}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[380px] scrollbar-none">
                    {list.map(o => (
                      <div 
                        key={o.id} 
                        onClick={() => setSelectedOrder(o)}
                        className="p-3.5 bg-stone-900/40 border border-stone-900 rounded-xl hover:border-[#C9A227]/40 hover:bg-[#111]/30 transition-all cursor-pointer space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#C9A227] font-semibold">{o.id}</span>
                          <span className="text-[8px] font-mono text-stone-500 uppercase">
                            {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div>
                          <span className="font-sans text-xs text-white block truncate font-medium">{o.customerName}</span>
                          <p className="text-[9px] font-mono text-stone-500 block truncate mt-1">
                            {o.items.map(it => `${it.menuItem.name}x${it.quantity}`).join(", ")}
                          </p>
                        </div>

                        {o.notes && (
                          <div className="bg-[#111] p-1.5 rounded border border-stone-900/60 text-[8px] font-mono text-stone-500 line-clamp-1">
                            📝 {o.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-stone-900/60 pt-2 text-[9px] font-mono">
                          <span className="text-white font-bold">€{o.total.toFixed(2)}</span>
                          <span className="text-stone-400 capitalize">{o.paymentMethod === "cod" ? "COD" : "Paid"}</span>
                        </div>

                        {/* Fast Shift arrow button */}
                        {col.id !== "delivered" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(o);
                            }}
                            className="absolute bottom-2 right-2 p-1 border border-stone-850 bg-stone-950 text-stone-500 rounded hover:text-white hover:border-[#C9A227] transition-colors cursor-pointer hidden group-hover:block"
                            title="Advance order to next pipeline phase"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                      </div>
                    ))}

                    {list.length === 0 && (
                      <div className="text-center py-16 text-stone-600 text-xs font-mono">
                        No active queue here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-900/60 text-[8px] font-mono text-stone-550 text-center uppercase tracking-widest leading-none">
                  Samurai Courier Link Active
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // 2b. COMPREHENSIVE ARCHIVAL SHEET LOG
        <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-sans font-bold text-stone-200 uppercase tracking-widest leading-none">Archival Fulfillment Log</h3>
            <span className="text-[10px] text-stone-500 font-mono mt-1 block">Inspect complete historical orders including payments</span>
          </div>

          <div className="border border-stone-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs select-none">
                <thead className="bg-[#111111] text-stone-400 font-mono text-[9px] uppercase tracking-widest border-b border-stone-900">
                  <tr>
                    <th className="p-4">OrderID</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Delivery address</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900 text-stone-300">
                  {state.orders.map(o => (
                    <tr key={o.id} className="hover:bg-[#111111]/30 transition-colors">
                      <td className="p-4 font-mono text-[#C9A227] font-semibold">{o.id}</td>
                      <td className="p-4 font-medium text-white">{o.customerName}</td>
                      <td className="p-4 font-mono text-stone-400">{o.phone}</td>
                      <td className="p-4 truncate max-w-[160px] text-stone-400" title={o.address}>{o.address}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full capitalize ${getOrderStatusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">€{o.total.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1.5 border border-stone-800 bg-stone-900 hover:text-[#C9A227] text-stone-400 transition-colors rounded-lg cursor-pointer font-mono text-[10px]"
                        >
                          INSPECT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. POPUP MODAL DIALOG COMPREHENSIVE RECEIPT SLIP AND STATUS CHANGERS */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[1002] backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 border border-stone-900 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-12"
            >
              
              {/* Receipt slip half design */}
              <div className="md:col-span-7 bg-stone-950/60 p-6 border-r border-stone-900 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-stone-900">
                  <div className="flex items-center space-x-2">
                    <span className="w-5.5 h-5.5 rounded-full bg-red-650 flex items-center justify-center text-white text-[8px] font-bold">侍</span>
                    <div>
                      <span className="text-[10px] font-mono text-white block uppercase tracking-widest leading-none">SAMURAI SEALS</span>
                      <span className="text-[7px] font-mono text-stone-550 block mt-0.5">PARIS HAUS ROUTE</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#C9A227]">{selectedOrder.id}</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-stone-400">
                    <div>
                      <span className="text-stone-600 block text-[8px] uppercase">Client Desk</span>
                      <span className="text-white block truncate">{selectedOrder.customerName}</span>
                    </div>
                    <div>
                      <span className="text-stone-600 block text-[8px] uppercase">Contact Tel</span>
                      <span className="text-white block truncate">{selectedOrder.phone}</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-stone-400">
                    <span className="text-stone-600 block text-[8px] uppercase">Bespoke Destination</span>
                    <span className="text-white block text-xs leading-tight select-text">{selectedOrder.address}</span>
                  </div>

                  {selectedOrder.notes && (
                    <div className="bg-[#111] border border-stone-900 p-2.5 rounded-xl text-[9px] font-mono text-stone-400">
                      <span className="text-stone-600 block text-[7px] uppercase">Fulfillment Directions:</span>
                      <span className="select-text">{selectedOrder.notes}</span>
                    </div>
                  )}

                  {/* Order products mapping */}
                  <div className="space-y-2 pt-2">
                    <span className="text-stone-600 text-[8px] font-mono uppercase tracking-wider block">Dishes Selected</span>
                    <div className="divide-y divide-stone-900/60 overflow-y-auto max-h-[140px] scrollbar-thin">
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-stone-300">{it.menuItem.name} <span className="text-xs text-red-500 font-bold">x{it.quantity}</span></span>
                          <span className="text-white">€{(it.menuItem.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculations receipts */}
                  <div className="border-t border-stone-900 pt-3 space-y-1.5 text-[10px] font-mono text-stone-400">
                    <div className="flex items-center justify-between">
                      <span>Dining Subtotal:</span>
                      <span className="text-white">€{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sealed Delivery:</span>
                      <span className="text-white">€{selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>VAT Tax (10%):</span>
                      <span className="text-white">€{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white border-t border-stone-900 pt-2 font-bold font-sans">
                      <span className="font-mono">FINAL CRATE TOTAL:</span>
                      <span className="text-[#C9A227]">€{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Status controller side */}
              <div className="md:col-span-5 bg-stone-950 p-6 flex flex-col justify-between relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="absolute right-4 top-4 p-1 rounded-lg border border-stone-850 bg-stone-900 text-stone-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-6 flex-1">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#C9A227] block uppercase">STATUS CONTROL RAIL</span>
                    <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider mt-0.5">Fulfillment workflow</h4>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Display current status parameters */}
                    <div className="p-3 bg-[#111] border border-stone-900 rounded-xl">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block">Active status</span>
                      <span className="text-xs font-sans font-bold text-white block uppercase tracking-wide mt-1 capitalize">
                        {selectedOrder.status}
                      </span>
                    </div>

                    {selectedOrder.status !== "delivered" && (selectedOrder.status as any) !== "cancelled" ? (
                      <button
                        onClick={() => handleAdvanceStatus(selectedOrder)}
                        className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>TRANSITION STATUS</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-[10px] p-3 rounded-xl leading-relaxed text-center font-mono">
                        ✓ Order state has successfully terminated inside delivered archives.
                      </div>
                    )}

                    {(selectedOrder.status as any) !== "cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="w-full py-3 border border-stone-850 hover:border-red-650 text-stone-400 hover:text-red-500 font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer bg-stone-900"
                      >
                        ❌ VOID / CANCEL ORDER
                      </button>
                    )}

                  </div>
                </div>

                <div className="pt-4 border-t border-stone-900 text-[8px] font-mono text-stone-550 leading-relaxed uppercase">
                  Staff Role: update state as courier completes phase.
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
