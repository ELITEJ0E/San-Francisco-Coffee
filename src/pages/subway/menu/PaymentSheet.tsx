"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Landmark,
  Wallet,
  CreditCard,
  Store,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  onPaymentSuccess?: () => void;
  orderDetails?: {
    orderId: string;
    customerName: string;
    customerMobile: string;
    description: string;
  };
}

export default function PaymentSheet({
  isOpen,
  onClose,
  grandTotal,
  onPaymentSuccess,
  orderDetails,
}: PaymentSheetProps) {
  const navigate = useNavigate();
  const { selectedOutlet, diningMode, pickupTime, createOrder, cartItems } = useOrder();

  const [isClosing, setIsClosing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"fpx" | "ewallet" | "card" | "counter">("ewallet");
  const [selectedProvider, setSelectedProvider] = useState("tng");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8829");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsProcessing(false);
      setIsSuccess(false);
      document.body.style.overflow = "hidden";
      window.history.pushState({ sheet: "payment" }, "");
    } else {
      document.body.style.overflow = "";
    }

    const handlePopState = () => {
      if (isOpen) {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 300);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (isProcessing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const fpxBanks = [
    { id: "maybank", name: "Maybank2u", badge: "Popular" },
    { id: "cimb", name: "CIMB Clicks", badge: "" },
    { id: "publicbank", name: "Public Bank", badge: "" },
    { id: "rhb", name: "RHB Now", badge: "" },
    { id: "hongleong", name: "Hong Leong Connect", badge: "" },
    { id: "ambank", name: "AmBank", badge: "" },
  ];

  const ewallets = [
    { id: "tng", name: "Touch 'n Go eWallet", badge: "Instant", iconColor: "bg-blue-600" },
    { id: "grabpay", name: "GrabPay", badge: "Points", iconColor: "bg-emerald-600" },
    { id: "boost", name: "Boost eWallet", badge: "", iconColor: "bg-red-600" },
    { id: "shopeepay", name: "ShopeePay", badge: "", iconColor: "bg-orange-500" },
  ];

  const getMethodDisplayName = () => {
    if (selectedCategory === "ewallet") {
      const found = ewallets.find((e) => e.id === selectedProvider);
      return found ? found.name : "eWallet";
    }
    if (selectedCategory === "fpx") {
      const found = fpxBanks.find((b) => b.id === selectedProvider);
      return found ? `${found.name} (FPX)` : "Online Banking (FPX)";
    }
    if (selectedCategory === "card") return "Credit / Debit Card";
    return "Pay at Counter (Cash/Card)";
  };

  const handlePayNow = () => {
    setIsProcessing(true);

    // Simulate authentic payment processing with gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const placedOrder = createOrder({
        total: Number(grandTotal.toFixed(2)),
        paymentMethod: getMethodDisplayName(),
        outlet: selectedOutlet,
        orderType: diningMode,
        pickupTime: pickupTime === "ASAP" ? "Today, ASAP" : pickupTime,
      });

      onPaymentSuccess?.();

      setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
          navigate(`/orders?tab=active&orderId=${placedOrder.id}`);
        }, 300);
      }, 1200);
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300",
          isOpen && !isClosing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Slide-over Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-2xl z-50 transition-transform duration-300 ease-out flex flex-col",
          isOpen && !isClosing ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#008938] px-4 py-4 flex items-center justify-between shadow-md text-white">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-black text-white">
              {orderDetails ? `Payment for ${orderDetails.orderId}` : "Select Payment Method"}
            </h1>
            <p className="text-[11px] text-emerald-100 font-medium">
              Secure 256-Bit SSL Encrypted
            </p>
          </div>
          <div className="w-8 flex justify-end">
            <ShieldCheck className="w-5 h-5 text-[#F5C518]" />
          </div>
        </div>

        {/* Processing / Success Overlays */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-12 h-12 text-[#008938] animate-spin mb-4" />
            <h3 className="text-lg font-black text-gray-900">Authorizing Payment...</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Connecting securely to {getMethodDisplayName()}. Please do not close or refresh this page.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="absolute inset-0 bg-white z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008938] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Payment Successful!</h3>
            <p className="text-sm font-bold text-[#008938] mt-1">RM {grandTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">
              Your Subway Sandwich Artists have received your order!
            </p>
            <div className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full">
              Redirecting to Live Order Tracking...
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {/* Order Snapshot Banner */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#008938]" />
                <span className="text-xs font-bold text-gray-900 truncate">
                  {selectedOutlet.name}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                {diningMode === "to-go" ? "To Go (Pickup)" : "Eat In"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Estimated ready in ~10-12 mins</span>
              </div>
              <span className="font-extrabold text-gray-900">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Payment Method Categories Tabs */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2 px-1">
              Choose Payment Category
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-gray-200/70 p-1 rounded-2xl">
              {[
                { id: "ewallet", label: "eWallet", icon: Wallet },
                { id: "fpx", label: "Online", icon: Landmark },
                { id: "card", label: "Cards", icon: CreditCard },
                { id: "counter", label: "Counter", icon: Store },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedCategory(tab.id as any);
                      if (tab.id === "fpx") setSelectedProvider("maybank");
                      if (tab.id === "ewallet") setSelectedProvider("tng");
                    }}
                    className={cn(
                      "py-2.5 px-1 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 transition-all",
                      isActive
                        ? "bg-[#008938] text-white shadow-md scale-[1.02]"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. eWallet Options */}
          {selectedCategory === "ewallet" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block px-1">
                Select eWallet Provider
              </label>
              {ewallets.map((wallet) => {
                const isSelected = selectedProvider === wallet.id;
                return (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedProvider(wallet.id)}
                    className={cn(
                      "p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all bg-white",
                      isSelected
                        ? "border-[#008938] bg-emerald-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm",
                          wallet.iconColor
                        )}
                      >
                        {wallet.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{wallet.name}</p>
                        <p className="text-[11px] text-gray-500">Fast 1-tap checkout</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {wallet.badge && (
                        <span className="text-[10px] font-extrabold bg-[#F5C518]/30 text-amber-900 px-2 py-0.5 rounded-full">
                          {wallet.badge}
                        </span>
                      )}
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          isSelected
                            ? "border-[#008938] bg-[#008938] text-white"
                            : "border-gray-300"
                        )}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Online Banking (FPX) */}
          {selectedCategory === "fpx" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block px-1">
                Select Bank for FPX Transfer
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fpxBanks.map((bank) => {
                  const isSelected = selectedProvider === bank.id;
                  return (
                    <div
                      key={bank.id}
                      onClick={() => setSelectedProvider(bank.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all bg-white h-20",
                        isSelected
                          ? "border-[#008938] bg-emerald-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <Landmark className="w-5 h-5 text-gray-600" />
                        {bank.badge && (
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            {bank.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {bank.name}
                        </span>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1",
                            isSelected
                              ? "border-[#008938] bg-[#008938]"
                              : "border-gray-300"
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Credit / Debit Card Form */}
          {selectedCategory === "card" && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3 shadow-sm">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#008938]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#008938]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#008938]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Pay at Counter */}
          {selectedCategory === "counter" && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">
                Pay at Restaurant Counter
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Your order will be prepared right away. You can pay via Cash, Credit Card, or DuitNow QR when collecting your sub.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Big Pay Button */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-gray-500 font-medium block">
                Total Payable
              </span>
              <span className="text-2xl font-black text-gray-900">
                RM {grandTotal.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#008938] bg-emerald-50 px-2.5 py-1 rounded-full">
                Earn +{Math.floor(grandTotal)} Subway Points
              </span>
            </div>
          </div>

          <button
            disabled={isProcessing}
            onClick={handlePayNow}
            className="w-full py-4 rounded-full font-black text-gray-900 text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-xl bg-[#F5C518] hover:bg-amber-400 border border-amber-500 disabled:opacity-50"
          >
            Confirm & Pay RM {grandTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </>
  );
}
