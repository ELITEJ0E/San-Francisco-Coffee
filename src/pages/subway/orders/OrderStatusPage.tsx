"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  QrCode,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Receipt,
  RotateCcw,
  Coffee,
  Check,
} from "lucide-react";
import { useOrder, type Order, type OrderStatus } from "@/app/context/OrderContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    orders,
    activeOrder,
    markOrderCompleted,
    addToCart,
    setSelectedOutlet,
    userProfile,
  } = useOrder();

  // Find order by param ID or fallback to activeOrder or latest order
  const order: Order | undefined =
    orders.find((o) => o.id === id) || activeOrder || orders[0];

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    order?.status || "Received"
  );
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [countdownMinutes] = useState(
    order?.estimatedReadyMinutes || 8
  );

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 text-center">
        <Coffee className="w-12 h-12 text-[#BA1C24] mb-3" />
        <h2 className="text-base font-bold text-stone-900">No order found</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          Please select an order from your history.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-[#BA1C24] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          View My Orders
        </button>
      </div>
    );
  }

  // Interactive demo status toggle for testing/simulation
  const handleSimulateStatus = (nextStatus: OrderStatus) => {
    setCurrentStatus(nextStatus);
    toast.success(`Barista updated order to: ${nextStatus}`);
    if (nextStatus === "Completed") {
      markOrderCompleted(order.id);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart({
        ...item,
        id: `${item.menuItemId}-${Date.now()}-${Math.random()}`,
      });
    });
    setSelectedOutlet(order.outlet);
    navigate("/checkout");
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-[#BA1C24] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-md shrink-0">
        <button
          onClick={() => navigate("/orders?tab=active")}
          className="flex items-center gap-1 text-white font-bold text-xs hover:text-[#FED7AA] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>My Orders</span>
        </button>
        <span className="text-xs font-black tracking-wider uppercase text-[#FED7AA]">
          Order #{order.id}
        </span>
        <button
          onClick={() => setShowReceiptModal(true)}
          className="text-xs font-bold text-white hover:text-[#FED7AA] flex items-center gap-1"
        >
          <Receipt className="w-4 h-4" />
          <span>Receipt</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {/* Success Celebration Banner */}
        <div className="bg-gradient-to-br from-[#BA1C24] to-[#8C1016] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xs pointer-events-none" />

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#BA1C24] flex items-center justify-center shadow-md shrink-0">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider bg-[#FFF0EB] text-[#BA1C24] px-2 py-0.5 rounded-full">
                  Payment Successful
                </span>
                <span className="text-[10px] text-[#FED7AA]">
                  {order.date} · {order.time}
                </span>
              </div>
              <h1 className="text-base font-black text-white mt-1 leading-tight">
                Your Coffee is Being Crafted!
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#FED7AA] leading-relaxed">
            Thank you for ordering with San Francisco Coffee. Show your pickup code
            at the store counter when your order is ready.
          </p>
        </div>

        {/* Pickup Code Big Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider">
              In-Store Pickup Code
            </span>
            <span className="text-[11px] font-bold text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-md">
              {order.orderType === "to-go" ? "Takeaway / Pickup" : "Dine In"}
            </span>
          </div>

          <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-stone-900 tracking-wider">
                {order.pickupCode}
              </span>
              <p className="text-[10px] text-[#BA1C24] font-semibold mt-0.5">
                Call number at pickup counter
              </p>
            </div>

            <button
              onClick={() => setShowBarcodeModal(true)}
              className="flex items-center gap-1.5 bg-white border border-[#FED7AA] px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#BA1C24] shadow-xs hover:bg-[#FFF5F0] transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Barcode</span>
            </button>
          </div>
        </div>

        {/* Live Brewing Tracker Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#BA1C24]" />
              <h2 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                Live Order Tracker
              </h2>
            </div>
            <span className="text-xs font-bold text-[#BA1C24]">
              {currentStatus === "Ready"
                ? "Ready Now!"
                : currentStatus === "Completed"
                ? "Completed"
                : `Ready in ~${countdownMinutes} mins`}
            </span>
          </div>

          {/* Stepper Visual */}
          <div className="py-2">
            <div className="grid grid-cols-4 text-center relative">
              {/* Connecting Line */}
              <div className="absolute top-3 left-1/8 right-1/8 h-0.5 bg-stone-200 -z-0" />

              {/* Step 1: Received */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#BA1C24] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-stone-900 mt-1.5">
                  Received
                </span>
                <span className="text-[8px] text-stone-400">{order.time}</span>
              </div>

              {/* Step 2: Brewing */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all",
                    currentStatus === "Preparing" ||
                      currentStatus === "Ready" ||
                      currentStatus === "Completed"
                      ? "bg-[#BA1C24] text-white"
                      : "bg-stone-200 text-stone-500"
                  )}
                >
                  {currentStatus === "Preparing" ? (
                    <Coffee className="w-3.5 h-3.5 animate-bounce" />
                  ) : currentStatus === "Ready" ||
                    currentStatus === "Completed" ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    "2"
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1.5",
                    currentStatus === "Preparing"
                      ? "text-[#BA1C24]"
                      : "text-stone-700"
                  )}
                >
                  Brewing
                </span>
                <span className="text-[8px] text-stone-400">Kitchen</span>
              </div>

              {/* Step 3: Ready */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all",
                    currentStatus === "Ready" || currentStatus === "Completed"
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-200 text-stone-500"
                  )}
                >
                  {currentStatus === "Ready" ||
                  currentStatus === "Completed" ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    "3"
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1.5",
                    currentStatus === "Ready"
                      ? "text-emerald-700 font-extrabold"
                      : "text-stone-500"
                  )}
                >
                  Ready
                </span>
                <span className="text-[8px] text-stone-400">Counter</span>
              </div>

              {/* Step 4: Collected */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-all",
                    currentStatus === "Completed"
                      ? "bg-stone-800 text-white"
                      : "bg-stone-200 text-stone-500"
                  )}
                >
                  {currentStatus === "Completed" ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    "4"
                  )}
                </div>
                <span className="text-[10px] font-bold text-stone-500 mt-1.5">
                  Picked Up
                </span>
                <span className="text-[8px] text-stone-400">Enjoy!</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Helper */}
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-stone-500 font-medium">
              Simulate Barista Step:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleSimulateStatus("Preparing")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                  currentStatus === "Preparing"
                    ? "bg-[#BA1C24] text-white"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                )}
              >
                Brewing
              </button>
              <button
                onClick={() => handleSimulateStatus("Ready")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                  currentStatus === "Ready"
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                )}
              >
                Ready
              </button>
              <button
                onClick={() => handleSimulateStatus("Completed")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                  currentStatus === "Completed"
                    ? "bg-stone-800 text-white"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                )}
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Store Pickup Location Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider">
              Store Pickup Location
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Open Now
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#BA1C24]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-stone-900">
                {order.outlet.name}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                {order.outlet.address}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-stone-400">
                <span>{order.outlet.hours}</span>
                <span>·</span>
                <span>{order.outlet.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                order.outlet.name + " " + order.outlet.address
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#BA1C24]" />
              <span>Get Directions</span>
            </a>
            <a
              href={`tel:${order.outlet.phone}`}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-stone-600" />
              <span>Call Store</span>
            </a>
          </div>
        </div>

        {/* SFC Club Rewards Earned Card */}
        <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#BA1C24] text-white flex items-center justify-center text-xs font-bold">
                🎁
              </div>
              <h3 className="text-xs font-extrabold text-[#BA1C24] uppercase tracking-wider">
                SFC Club Rewards Earned
              </h3>
            </div>
            <span className="text-[10px] font-black bg-[#BA1C24] text-white px-2 py-0.5 rounded-full">
              +{order.pointsEarned} Pts
            </span>
          </div>

          <p className="text-[11px] text-stone-700">
            You earned <strong className="text-stone-900">+1 Stamp</strong> and{" "}
            <strong className="text-[#BA1C24]">{order.pointsEarned} Points</strong> on
            this purchase!
          </p>

          {/* Mini 8-Stamp Visual */}
          <div className="bg-white/80 rounded-xl p-2.5 border border-[#FED7AA]/60">
            <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-stone-700">
              <span>SFC Stamp Card</span>
              <span className="text-[#BA1C24]">
                {userProfile.stamps} / 8 Stamps Collected
              </span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }).map((_, idx) => {
                const isStamped = idx < userProfile.stamps;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "h-6 rounded-md flex items-center justify-center text-[9px] font-black border transition-all",
                      isStamped
                        ? "bg-[#BA1C24] border-[#BA1C24] text-white shadow-2xs"
                        : "bg-white border-stone-200 text-stone-300"
                    )}
                  >
                    {isStamped ? "☕" : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Itemized Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
            Order Items ({order.items.length})
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="w-12 h-12 bg-[#FFF5F0] rounded-xl flex items-center justify-center p-1 shrink-0">
                  <img
                    src={item.image || "/menuImages/lemon-peach-frappe.svg"}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-stone-900">
                      {item.quantity}x {item.name}
                    </h4>
                    <span className="text-xs font-black text-stone-900">
                      {item.price === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `RM ${(item.price * item.quantity).toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {item.detailsSummary && (
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                      {item.detailsSummary}
                    </p>
                  )}
                  {item.remarks && (
                    <p className="text-[9px] text-amber-700 bg-amber-50 rounded px-1 py-0.5 mt-1 inline-block">
                      "{item.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment breakdown */}
          <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">
                RM {order.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>6% SST</span>
              <span className="font-semibold text-stone-900">
                RM {order.tax.toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#BA1C24]">
                <span>Discount ({order.promoCode || "Voucher"})</span>
                <span className="font-bold">-RM {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Rounding adjustment</span>
              <span>-RM 0.02</span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs font-extrabold text-stone-900">
              <span>Total Paid</span>
              <span className="text-base text-[#BA1C24]">
                RM {order.total.toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] text-stone-400 pt-1">
              Paid via {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 w-full sm:max-w-[430px] bg-white border-t border-stone-200 p-3.5 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] flex gap-2">
        <button
          onClick={() => navigate("/menu")}
          className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md shadow-red-900/20 flex items-center justify-center gap-1.5 transition-all"
        >
          <Coffee className="w-4 h-4" />
          <span>Order More</span>
        </button>

        <button
          onClick={handleReorder}
          className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reorder</span>
        </button>
      </div>

      {/* Show Barcode Popup Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Counter Pickup Barcode
              </span>
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Present this to the barista at {order.outlet.name}
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 flex flex-col items-center">
              <div className="h-16 w-48 bg-stone-900 flex items-center justify-center text-white font-mono text-xs tracking-widest rounded shadow-inner">
                ||| | |||| | ||||| | ||
              </div>
              <span className="text-2xl font-black text-[#BA1C24] mt-3 tracking-widest">
                {order.pickupCode}
              </span>
            </div>

            <button
              onClick={() => setShowBarcodeModal(false)}
              className="w-full bg-[#BA1C24] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* e-Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
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
                Order #{order.id} · {order.date} {order.time}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="space-y-1.5">
                {order.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-stone-700">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {it.price === 0 ? "FREE" : `RM ${(it.price * it.quantity).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-2 space-y-1 text-stone-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>RM {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>6% SST</span>
                  <span>RM {order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#BA1C24]">
                    <span>Discount</span>
                    <span>-RM {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Rounding</span>
                  <span>-RM 0.02</span>
                </div>
                <div className="flex justify-between font-black text-xs text-[#BA1C24] pt-1 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span>RM {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF0EB] rounded-xl p-2.5 text-center text-[10px] text-[#BA1C24] font-bold">
              ✨ Earned {order.pointsEarned} Points & {order.stampsEarned} Stamp
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.success("e-Invoice sent to your email!");
                  setShowReceiptModal(false);
                }}
                className="flex-1 bg-[#BA1C24] text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Email e-Invoice
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="bg-stone-100 text-stone-700 px-4 py-2.5 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
