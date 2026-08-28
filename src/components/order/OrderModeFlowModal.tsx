"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  X,
  QrCode,
  Coffee,
  Sparkles,
  ChevronLeft,
  Zap,
  ZapOff,
  Keyboard,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { OpenStreetMapOutletPicker } from "@/components/map/OpenStreetMapOutletPicker";

interface OrderModeFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: "selection" | "scan-qr" | "select-outlet";
}

export default function OrderModeFlowModal({
  isOpen,
  onClose,
  initialStep = "selection",
}: OrderModeFlowModalProps) {
  const navigate = useNavigate();
  const { setDiningMode, setSelectedOutlet, setTableNumber } = useOrder();

  const [step, setStep] = useState<"selection" | "scan-qr" | "select-outlet">(
    initialStep
  );
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualTableInput, setManualTableInput] = useState("3");

  if (!isOpen) return null;

  const handleSelectDineIn = () => {
    setStep("scan-qr");
  };

  const handleSelectPickup = () => {
    setStep("select-outlet");
  };

  const handleConfirmTableQR = (tableNum = "3") => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setDiningMode("eat-in");
      setTableNumber(tableNum);
      setIsScanningSimulated(false);
      onClose();
      navigate(`/menu?orderType=eat-in&table=${tableNum}`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal / Sheet Container */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="w-full sm:max-w-[430px] bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col relative"
      >
        {/* Step 1: Selection ("How would you like to get your order?") */}
        {step === "selection" && (
          <div className="p-5 flex flex-col">
            {/* Grabber bar */}
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-900 font-serif">
                How would you like to get your order?
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-2">
              {/* Dine In Card */}
              <button
                onClick={handleSelectDineIn}
                className="group border-2 border-stone-200 hover:border-[#BA1C24] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all bg-white hover:bg-red-50/20 active:scale-95 shadow-2xs"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-red-50 flex items-center justify-center mb-3 transition-colors border border-amber-100/50 group-hover:border-red-200">
                  <Coffee className="w-8 h-8 text-[#BA1C24]" />
                </div>
                <span className="font-serif font-bold text-base text-stone-900 group-hover:text-[#BA1C24] transition-colors">
                  Dine In
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5">Order at table</span>
              </button>

              {/* Pickup Card */}
              <button
                onClick={handleSelectPickup}
                className="group border-2 border-stone-200 hover:border-[#BA1C24] p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all bg-white hover:bg-red-50/20 active:scale-95 shadow-2xs"
              >
                <div className="w-16 h-16 rounded-2xl bg-stone-50 group-hover:bg-red-50 flex items-center justify-center mb-3 transition-colors border border-stone-100 group-hover:border-red-200">
                  <img
                    src="/assets/order-now-illustration.svg"
                    alt="Pickup"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-base text-stone-900 group-hover:text-[#BA1C24] transition-colors">
                  Pickup
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5">Skip the queue</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Scan Table QR */}
        {step === "scan-qr" && (
          <div className="flex flex-col h-[520px]">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setStep("selection")}
                className="flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-stone-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Scan Table QR</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Flash Toggle */}
                <button
                  onClick={() => setFlashOn(!flashOn)}
                  className={`p-1.5 rounded-full transition-colors ${
                    flashOn ? "bg-amber-400 text-stone-950 shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                  title={flashOn ? "Turn Flash Off" : "Turn Flash On"}
                >
                  {flashOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                </button>

                {/* Manual Code Alternative */}
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className={`p-1.5 rounded-full transition-colors ${
                    showManualEntry ? "bg-[#BA1C24] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                  title="Enter Table Number Manually"
                >
                  <Keyboard className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewfinder or Manual Entry */}
            {showManualEntry ? (
              <div className="flex-1 p-6 bg-[#FAF8F5] flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#BA1C24] flex items-center justify-center shadow-xs border border-stone-200">
                  <Coffee className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Enter Table Number
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Look at the red wooden tent or sticker on your table
                  </p>
                </div>

                <div className="w-full max-w-xs space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={manualTableInput}
                      onChange={(e) => setManualTableInput(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full bg-white border-2 border-stone-300 rounded-xl px-4 py-3 text-center text-xl font-bold text-stone-900 focus:outline-none focus:border-[#BA1C24]"
                    />
                  </div>

                  <div className="flex gap-2 justify-center">
                    {["3", "7", "10", "14"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setManualTableInput(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          manualTableInput === t
                            ? "bg-[#BA1C24] text-white border-[#BA1C24]"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        Table {t}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleConfirmTableQR(manualTableInput || "3")}
                    className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Table {manualTableInput || "3"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex-1 bg-stone-950 relative flex flex-col items-center justify-center p-6 text-white overflow-hidden ${flashOn ? "ring-8 ring-amber-100/30" : ""}`}>
                {/* Flash light overlay effect */}
                {flashOn && (
                  <div className="absolute inset-0 bg-radial from-amber-200/20 to-transparent pointer-events-none" />
                )}

                {/* Background table tent graphic */}
                <div className="w-56 h-64 bg-white/10 rounded-2xl border border-white/20 p-4 flex flex-col items-center justify-center text-center backdrop-blur-xs relative shadow-2xl">
                  <div className="w-8 h-8 rounded-lg bg-[#BA1C24] text-white flex items-center justify-center font-bold text-xs mb-2">
                    SF
                  </div>
                  <p className="text-white font-serif font-bold text-base leading-tight">
                    Table 3
                  </p>
                  <p className="text-[#FED7AA] text-[10px] uppercase font-bold tracking-wider mb-2">
                    Digital Menu
                  </p>
                  
                  {/* QR Code Graphic */}
                  <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg relative">
                    <QrCode className="w-full h-full text-stone-900" />
                    {/* Active Scanning laser line */}
                    <motion.div
                      animate={{ y: [0, 70, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute left-1 right-1 h-0.5 bg-[#BA1C24] shadow-[0_0_8px_#BA1C24]"
                    />
                  </div>

                  <p className="text-white/70 text-[9px] mt-2">
                    Scan QR code for contactless order
                  </p>
                </div>

                {/* Viewfinder Target Frame corners */}
                <div className="absolute inset-x-12 inset-y-16 pointer-events-none border-2 border-white/30 rounded-3xl">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#BA1C24] rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#BA1C24] rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#BA1C24] rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#BA1C24] rounded-br-xl" />
                </div>

                <p className="text-xs text-white/80 mt-4 text-center font-medium">
                  Point camera at table QR or tap manual entry above
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            {!showManualEntry && (
              <div className="p-4 bg-white border-t border-stone-100 flex flex-col gap-2">
                <button
                  onClick={() => handleConfirmTableQR("3")}
                  disabled={isScanningSimulated}
                  className="w-full bg-[#BA1C24] text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isScanningSimulated ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Table #3 Connected...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Simulate Scan (Connect Table #3)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Choose your restaurant with OpenStreetMap */}
        {step === "select-outlet" && (
          <div className="flex flex-col h-[640px] max-h-[85vh] overflow-hidden">
            <OpenStreetMapOutletPicker
              onBack={() => setStep("selection")}
              onSelectOutlet={(outlet) => {
                setSelectedOutlet(outlet);
                setDiningMode("to-go");
                onClose();
                navigate("/menu?orderType=to-go");
              }}
              isModal={true}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
