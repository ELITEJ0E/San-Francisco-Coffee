"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Loader2, Coffee, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrder, type Order } from "@/app/context/OrderContext";

export default function CheckoutStatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeOrder, orders } = useOrder();

  // Pick the target order from state or most recent
  const orderFromState = (location.state as { order?: Order })?.order;
  const currentOrder = orderFromState || activeOrder || orders[0];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Step 1: Verifying payment (0 to 1.2s)
    const t1 = setTimeout(() => {
      setCurrentStep(2);
    }, 1300);

    // Step 2: Routing to outlet kitchen (1.3s to 2.6s)
    const t2 = setTimeout(() => {
      setCurrentStep(3);
    }, 2600);

    // Step 3: Confirmed & completed (3.5s)
    const t3 = setTimeout(() => {
      setIsCompleted(true);
    }, 3600);

    // Redirect to Order Status Page after celebration (4.8s)
    const t4 = setTimeout(() => {
      if (currentOrder) {
        navigate(`/order-status/${currentOrder.id}`, { replace: true });
      } else {
        navigate("/orders?tab=active", { replace: true });
      }
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentOrder, navigate]);

  const handleManualProceed = () => {
    if (currentOrder) {
      navigate(`/order-status/${currentOrder.id}`, { replace: true });
    } else {
      navigate("/orders?tab=active", { replace: true });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden relative justify-between p-6">
      {/* Top Brand Header */}
      <div className="text-center pt-6 space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#BA1C24] text-white font-black text-sm shadow-md mb-2">
          SF
        </div>
        <h1 className="text-lg font-black text-stone-900 tracking-tight">
          San Francisco Coffee
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          Securing your coffee order...
        </p>
      </div>

      {/* Center Animated Brewing State */}
      <div className="flex flex-col items-center justify-center my-auto py-6">
        {/* Animated Circle Container */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Outer Pulsing Glow */}
          <div
            className={cn(
              "absolute inset-0 rounded-full transition-all duration-700",
              isCompleted
                ? "bg-emerald-100 animate-ping opacity-30"
                : "bg-[#FFF0EB] animate-pulse opacity-80"
            )}
          />

          {/* Rotating Border Ring */}
          {!isCompleted ? (
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#BA1C24] animate-spin duration-3000" />
          ) : (
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all" />
          )}

          {/* Inner Icon Box */}
          <div
            className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 z-10",
              isCompleted
                ? "bg-emerald-500 text-white scale-105"
                : "bg-white border-4 border-[#FFF0EB] text-[#BA1C24]"
            )}
          >
            {isCompleted ? (
              <Check className="w-14 h-14 stroke-[3] animate-in zoom-in-50 duration-300" />
            ) : (
              <Coffee className="w-12 h-12 text-[#BA1C24] animate-bounce" />
            )}
          </div>
        </div>

        {/* State Title */}
        <div className="text-center space-y-1">
          <h2 className="text-base font-black text-stone-900">
            {isCompleted
              ? "Order Successfully Confirmed!"
              : currentStep === 1
              ? "Verifying Payment & Balance..."
              : currentStep === 2
              ? "Connecting with Barista Station..."
              : "Preparing Order Ticket..."}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {isCompleted
              ? "Your order has been transmitted to the store kitchen."
              : "Please stay on this screen while we lock in your fresh brew."}
          </p>
        </div>

        {/* Progress Step List */}
        <div className="w-full max-w-xs bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs mt-6 space-y-3">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                currentStep > 1 || isCompleted
                  ? "bg-emerald-500 text-white"
                  : currentStep === 1
                  ? "bg-[#BA1C24] text-white"
                  : "bg-stone-200 text-stone-500"
              )}
            >
              {currentStep > 1 || isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-stone-900">Payment Authorized</p>
              <p className="text-[10px] text-stone-400">
                {currentOrder?.paymentMethod || "SFC Wallet / Card"}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                currentStep > 2 || isCompleted
                  ? "bg-emerald-500 text-white"
                  : currentStep === 2
                  ? "bg-[#BA1C24] text-white"
                  : "bg-stone-100 text-stone-400"
              )}
            >
              {currentStep > 2 || isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : currentStep === 2 ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "2"
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-stone-900">Store Kitchen Notified</p>
              <p className="text-[10px] text-stone-400">
                {currentOrder?.outlet?.name || "San Francisco Coffee"}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : currentStep === 3
                  ? "bg-[#BA1C24] text-white"
                  : "bg-stone-100 text-stone-400"
              )}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : currentStep === 3 ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "3"
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-stone-900">Pickup Code Generated</p>
              <p className="text-[10px] text-stone-400">
                Code: {currentOrder?.pickupCode || "SF-14"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Manual Proceed Action */}
      <div className="pt-4 border-t border-stone-200/60">
        <button
          onClick={handleManualProceed}
          className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-md shadow-red-900/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>View Live Order Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
