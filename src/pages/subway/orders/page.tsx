"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MapPin,
  QrCode,
  ChevronRight,
  RotateCcw,
  Receipt,
  Coffee,
} from "lucide-react";
import { useOrder, type Order, type OrderStatus } from "@/app/context/OrderContext";

export default function SFCOrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const {
    orders,
    activeOrder,
    markOrderCompleted,
    addToCart,
    setSelectedOutlet,
  } = useOrder();

  const [activeTab, setActiveTab] = useState<"active" | "past">(
    tabParam === "active" || activeOrder ? "active" : "past"
  );
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [showQrModal, setShowQrModal] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === "active") {
      setActiveTab("active");
    } else if (tabParam === "past") {
      setActiveTab("past");
    }
  }, [tabParam]);

  const activeOrdersList = orders.filter(
    (o) => o.status === "Received" || o.status === "Preparing" || o.status === "Ready"
  );

  const pastOrdersList = orders.filter(
    (o) => o.status === "Completed" || o.status === "Cancelled"
  );

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        ...item,
        id: `${item.menuItemId}-${Date.now()}-${Math.random()}`,
      });
    });
    setSelectedOutlet(order.outlet);
    navigate("/checkout");
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Preparing":
        return "bg-[#FFF0EB] text-[#BA1C24] border-[#FED7AA]";
      case "Received":
        return "bg-stone-100 text-stone-800 border-stone-300";
      case "Completed":
        return "bg-stone-100 text-stone-700 border-stone-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-md h-full bg-stone-50 overflow-hidden relative">
      {/* Top Header */}
      <header className="bg-[#BA1C24] px-4 pt-4 pb-3 flex items-center justify-between text-white shadow-md z-10">
        <div>
          <h1 className="text-base font-black text-white">My Orders</h1>
          <p className="text-[11px] text-[#FED7AA] font-medium">
            Live coffee brewing tracker & receipts
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white text-[#BA1C24] flex items-center justify-center font-black text-xs shadow-xs">
            SF
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 flex gap-4 shrink-0 shadow-2xs">
        <button
          onClick={() => setActiveTab("active")}
          className={cn(
            "py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5",
            activeTab === "active"
              ? "border-[#BA1C24] text-[#BA1C24]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          )}
        >
          <span>Active Orders</span>
          {activeOrdersList.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#BA1C24] text-white text-[10px] flex items-center justify-center font-black">
              {activeOrdersList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={cn(
            "py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5",
            activeTab === "past"
              ? "border-[#BA1C24] text-[#BA1C24]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          )}
        >
          <span>Past Orders</span>
          <span className="text-[10px] text-stone-400 font-medium">
            ({pastOrdersList.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {activeTab === "active" ? (
          activeOrdersList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-[#FFF0EB] flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-8 h-8 text-[#BA1C24]" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">No active orders right now</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-5">
                Craving a fresh Peach Frappe or rich Caffe Latte? Place an order now!
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-[#BA1C24] hover:bg-[#A3161D] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                Order Coffee Now
              </button>
            </div>
          ) : (
            activeOrdersList.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3.5 relative overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-900">
                      Order #{order.id}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      · {order.time}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border",
                      getStatusBadge(order.status)
                    )}
                  >
                    {order.status === "Ready" ? "Ready for Pickup" : order.status}
                  </span>
                </div>

                {/* Pickup Code Display */}
                <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-[#BA1C24] tracking-wider block">
                      Pickup Code
                    </span>
                    <span className="text-xl font-black text-stone-900 tracking-wider">
                      {order.pickupCode}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowQrModal(order.pickupCode)}
                    className="flex items-center gap-1 bg-white border border-[#FED7AA] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#BA1C24] shadow-2xs hover:bg-[#FFF5F0]"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Show Barcode</span>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="py-2">
                  <div className="grid grid-cols-3 text-center relative">
                    <div className="absolute top-2.5 left-1/6 right-1/6 h-0.5 bg-stone-200 -z-0" />
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-5 h-5 rounded-full bg-[#BA1C24] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-stone-900 mt-1">Received</span>
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs",
                          order.status === "Preparing" || order.status === "Ready"
                            ? "bg-[#BA1C24] text-white"
                            : "bg-stone-200 text-stone-500"
                        )}
                      >
                        {order.status === "Preparing" || order.status === "Ready" ? "✓" : "2"}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold mt-1",
                          order.status === "Preparing" ? "text-[#BA1C24]" : "text-stone-500"
                        )}
                      >
                        Brewing
                      </span>
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs",
                          order.status === "Ready"
                            ? "bg-emerald-600 text-white animate-pulse"
                            : "bg-stone-200 text-stone-500"
                        )}
                      >
                        {order.status === "Ready" ? "✓" : "3"}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold mt-1",
                          order.status === "Ready" ? "text-emerald-700" : "text-stone-500"
                        )}
                      >
                        Ready!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outlet & Items Summary */}
                <div className="border-t border-stone-100 pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#BA1C24]" />
                      {order.outlet.name}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {order.orderType === "to-go" ? "Pickup" : "Dine In"}
                    </span>
                  </div>

                  <div className="space-y-1 bg-stone-50 rounded-xl p-2.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-stone-800">
                        <span className="truncate max-w-[240px]">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-semibold text-stone-900 shrink-0">
                          RM {(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-stone-200/60 pt-1.5 flex justify-between font-extrabold text-xs text-[#BA1C24]">
                      <span>Total Paid ({order.paymentMethod.split("(")[0].trim()})</span>
                      <span>RM {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => navigate(`/order-status/${order.id}`)}
                    className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Live Tracker</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => markOrderCompleted(order.id)}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Picked Up
                  </button>
                  <button
                    onClick={() => setSelectedReceiptOrder(order)}
                    className="bg-[#FFF0EB] hover:bg-[#FFE4DC] text-[#BA1C24] px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )
        ) : pastOrdersList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-6">
            <p className="text-xs text-stone-500">No past orders yet</p>
          </div>
        ) : (
          pastOrdersList.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Order #{order.id}
                  </h4>
                  <span className="text-[10px] text-stone-400">
                    {order.date} · {order.time}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    getStatusBadge(order.status)
                  )}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl space-y-1">
                <p className="font-semibold text-stone-900">{order.outlet.name}</p>
                <p className="text-[11px] text-stone-500 line-clamp-1">{order.summary}</p>
                <div className="flex justify-between pt-1 border-t border-stone-200/50 text-[11px] font-extrabold text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-[#BA1C24]">RM {order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReorder(order)}
                  className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptOrder(order)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  Receipt
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show Barcode Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">
              In-Store Pickup Barcode
            </h3>
            <p className="text-xs text-stone-500">
              Present this to the barista at San Francisco Coffee counter
            </p>
            <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 flex flex-col items-center">
              <div className="h-16 w-48 bg-stone-900 flex items-center justify-center text-white font-mono text-xs tracking-widest rounded">
                ||| | |||| | ||||| | ||
              </div>
              <span className="text-lg font-black text-[#BA1C24] mt-2">
                {showQrModal}
              </span>
            </div>
            <button
              onClick={() => setShowQrModal(null)}
              className="w-full bg-[#BA1C24] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="text-center pb-3 border-b border-stone-200">
              <span className="w-8 h-8 rounded-full bg-[#BA1C24] text-white font-black text-xs inline-flex items-center justify-center mb-1">
                SF
              </span>
              <h3 className="text-sm font-extrabold text-stone-900">
                San Francisco Coffee
              </h3>
              <p className="text-[10px] text-stone-500">Official e-Receipt</p>
              <p className="text-[10px] text-stone-400 mt-1">
                Order #{selectedReceiptOrder.id} · {selectedReceiptOrder.date}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-1.5">
                {selectedReceiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-stone-700">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold text-stone-900">
                      RM {(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-2 space-y-1 text-stone-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>RM {selectedReceiptOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>6% SST</span>
                  <span>RM {selectedReceiptOrder.tax.toFixed(2)}</span>
                </div>
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-[#BA1C24]">
                    <span>Discount</span>
                    <span>-RM {selectedReceiptOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Rounding</span>
                  <span>-RM 0.02</span>
                </div>
                <div className="flex justify-between font-black text-xs text-[#BA1C24] pt-1 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span>RM {selectedReceiptOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF0EB] rounded-xl p-2.5 text-center text-[10px] text-[#BA1C24] font-bold">
              ✨ Earned {selectedReceiptOrder.pointsEarned} Points & {selectedReceiptOrder.stampsEarned} Stamp
            </div>

            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="w-full bg-[#BA1C24] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
