"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  X,
  ChevronLeft,
  Search,
  QrCode,
  Coffee,
  Navigation,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const { setDiningMode, setSelectedOutlet, setPickupTime, selectedOutlet } = useOrder();

  const [step, setStep] = useState<"selection" | "scan-qr" | "select-outlet" | "select-time">(
    initialStep
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(selectedOutlet);
  const [pickupDate, setPickupDate] = useState("Today");
  const [selectedHour, setSelectedHour] = useState("1:00 pm");
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  const outlets = [
    {
      id: "outlet-1",
      name: "SFC Suria KLCC",
      distance: "0.8 km",
      hours: "Open 10:00 am - 10:00 pm",
      phone: "+603-8966 2547",
      address: "Concourse Level, Suria KLCC, Kuala Lumpur City Centre, 50088",
      isOpen: true,
    },
    {
      id: "outlet-2",
      name: "SFC Bukit Bintang",
      distance: "1.4 km",
      hours: "Close 10:00 am - 10:00 pm",
      phone: "+603-8966 2547",
      address: "Ground Floor, Fahrenheit 88, 179 Jalan Bukit Bintang, 55100",
      isOpen: false,
    },
    {
      id: "outlet-3",
      name: "SFC Bangsar Baru",
      distance: "4.2 km",
      hours: "Open 8:00 am - 11:00 pm",
      phone: "+603-2282 3411",
      address: "26, Jalan Telawi 5, Bangsar, 59100 Kuala Lumpur",
      isOpen: true,
    },
  ];

  if (!isOpen) return null;

  const handleSelectDineIn = () => {
    setStep("scan-qr");
  };

  const handleSelectPickup = () => {
    setStep("select-outlet");
  };

  const handleConfirmTableQR = (tableNum = "10") => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setDiningMode("eat-in");
      setIsScanningSimulated(false);
      onClose();
      navigate(`/menu?orderType=eat-in&table=${tableNum}`);
    }, 600);
  };

  const handleSelectStoreAndProceed = (store: (typeof outlets)[0]) => {
    setSelectedStore(store);
    setSelectedOutlet(store);
    setStep("select-time");
  };

  const handleConfirmPickupOrder = () => {
    setDiningMode("to-go");
    setPickupTime(`${pickupDate === "Today" ? "Today" : pickupDate}, ${selectedHour}`);
    onClose();
    navigate(`/menu?orderType=to-go`);
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
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Camera Viewfinder Mockup */}
            <div className="flex-1 bg-stone-950 relative flex flex-col items-center justify-center p-6 text-white overflow-hidden">
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
                Point your camera at the table tent QR
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-white border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => handleConfirmTableQR("10")}
                disabled={isScanningSimulated}
                className="w-full bg-[#BA1C24] text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isScanningSimulated ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Table #10 Connected...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Simulate Scan (Connect to Table #10)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose your restaurant */}
        {step === "select-outlet" && (
          <div className="flex flex-col h-[560px]">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
              <button
                onClick={() => setStep("selection")}
                className="flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-stone-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-serif font-bold text-base">Choose your restaurant</span>
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-stone-50 border-b border-stone-100 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location, store name..."
                  className="w-full bg-white text-stone-800 placeholder:text-stone-400 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#BA1C24]/30"
                />
              </div>
            </div>

            {/* Map Preview Graphic */}
            <div className="h-32 bg-stone-200 relative overflow-hidden shrink-0">
              {/* Stylized vector map representation */}
              <div className="absolute inset-0 bg-[#E8ECE9]">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white border-y border-stone-300" />
                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white border-x border-stone-300" />
                <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-white border-x border-stone-300 rotate-12" />
                
                {/* Store Pin: Suria KLCC */}
                <div className="absolute top-6 left-1/3 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#BA1C24] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <span className="font-black text-[10px]">SF</span>
                  </div>
                  <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded-md shadow-xs text-stone-800 mt-0.5">
                    Suria KLCC
                  </span>
                </div>

                {/* Store Pin: Bukit Bintang */}
                <div className="absolute bottom-4 right-1/4 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-stone-700 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <span className="font-bold text-[8px]">SF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Stores List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Nearby Stores
              </h3>

              {outlets.map((outlet) => (
                <div
                  key={outlet.id}
                  className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs hover:border-[#BA1C24] transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900 text-sm">{outlet.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                            outlet.isOpen
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-stone-500 bg-stone-100"
                          }`}
                        >
                          {outlet.distance}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {outlet.hours} | {outlet.phone}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                        {outlet.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(outlet.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs flex items-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-[10px] font-semibold">Maps</span>
                    </a>

                    <button
                      onClick={() => handleSelectStoreAndProceed(outlet)}
                      className="flex-1 bg-[#BA1C24] hover:bg-red-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      Select this outlet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Select Pickup Date & Time */}
        {step === "select-time" && (
          <div className="p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep("select-outlet")}
                className="flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-stone-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-serif font-bold text-base">Select Pickup Date & Time</span>
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Store Pill */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center font-bold text-xs shrink-0">
                SF
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-stone-900">{selectedStore.name}</p>
                <p className="text-[10px] text-stone-500 truncate">{selectedStore.address}</p>
              </div>
            </div>

            {/* Today vs ASAP toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setPickupDate("Today")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  pickupDate === "Today"
                    ? "bg-white text-[#BA1C24] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  setPickupDate("Today");
                  setSelectedHour("ASAP (15 mins)");
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedHour.includes("ASAP")
                    ? "bg-white text-[#BA1C24] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ASAP
              </button>
            </div>

            {/* Date selection row */}
            <label className="text-xs font-bold text-stone-600 mb-2 block">
              Pickup Date
            </label>
            <div className="flex gap-2 mb-4">
              {["Today, 09 Jan", "Sat, 10 Jan", "Sun, 11 Jan"].map((date) => (
                <button
                  key={date}
                  onClick={() => setPickupDate(date)}
                  className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                    pickupDate === date
                      ? "border-[#BA1C24] bg-red-50/50 text-[#BA1C24] font-bold"
                      : "border-stone-200 bg-white text-stone-700"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>

            {/* Time selection grid */}
            <label className="text-xs font-bold text-stone-600 mb-2 block">
              Pickup Time
            </label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {["1:00 pm", "1:15 pm", "1:30 pm", "1:45 pm", "2:00 pm", "2:30 pm"].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedHour(time)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedHour === time
                      ? "border-[#BA1C24] bg-[#BA1C24] text-white font-bold shadow-xs"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Ready to order button */}
            <button
              onClick={handleConfirmPickupOrder}
              className="w-full bg-[#BA1C24] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 active:scale-95 transition-all shadow-md"
            >
              Ready to order
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
