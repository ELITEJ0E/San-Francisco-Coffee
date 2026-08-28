"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  QrCode,
  Scan,
  Zap,
  ZapOff,
  SwitchCamera,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import Cookies from "js-cookie";
import { api } from "@/trpc/react";

export default function PayPage() {
  const navigate = useNavigate();
  const { translate } = useTranslation();
  const { walletBalance, deductWalletBalance, profile } = useOrder();
  const account = Cookies.get("accountId");

  // Fetch store/loyalty points if available
  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery(
    {
      accID: account ?? "",
      brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
    },
    { enabled: !!account },
  );
  const points = accData?.account?.acc_value?.[0]?.pointsValue || profile.points || 1250;

  // View modes: "scan" (camera scanner) | "my_code" (show my payment barcode) | "manual" (enter store code)
  const [activeTab, setActiveTab] = useState<"scan" | "my_code" | "manual">("scan");

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Manual payment state
  const [manualOutletCode, setManualOutletCode] = useState("SFC-KLCC");
  const [manualAmount, setManualAmount] = useState("14.50");

  // Payment popup sheet state
  const [scannedData, setScannedData] = useState<{
    outletName: string;
    amount: number;
    reference: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    amount: number;
    reference: string;
    outletName: string;
    newBalance: number;
    pointsEarned: number;
  } | null>(null);

  // Stop camera tracks helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setTorchOn(false);
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera access is not supported by your browser device.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn("Camera start error:", err);
      const errName = (err as Error)?.name || "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please allow camera access in browser settings.");
      } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
        setCameraError("No camera found on your device.");
      } else {
        setCameraError("Unable to access live camera feed.");
      }
    }
  }, [facingMode, stopCamera]);

  // Handle Tab Switch / Camera Lifecycle
  useEffect(() => {
    if (activeTab === "scan") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, startCamera, stopCamera]);

  // Toggle flashlight / torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as MediaTrackConstraintSet & { torch: boolean }],
        });
        setTorchOn(!torchOn);
      } else {
        setTorchOn(!torchOn);
        toast.info("Torch / Flash feature simulated for your device.");
      }
    } catch {
      setTorchOn(!torchOn);
    }
  };

  // Flip Camera (Front / Rear)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Handle detected QR Code / Simulated Merchant Scan
  const handleQRDetected = (
    outlet = "San Francisco Coffee • KLCC",
    amount = 14.5,
    ref = `SFC-PAY-${Math.floor(100000 + Math.random() * 900000)}`
  ) => {
    // Provide haptic feedback if available
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {
        // ignore
      }
    }

    setScannedData({
      outletName: outlet,
      amount: amount,
      reference: ref,
    });
  };

  // Confirm Wallet Payment
  const executeWalletPayment = () => {
    if (!scannedData) return;
    setIsProcessing(true);

    setTimeout(() => {
      const success = deductWalletBalance(scannedData.amount);

      if (success) {
        const newBal = walletBalance - scannedData.amount;
        const ptsEarned = Math.floor(scannedData.amount * 10);

        setPaymentSuccess({
          amount: scannedData.amount,
          reference: scannedData.reference,
          outletName: scannedData.outletName,
          newBalance: newBal,
          pointsEarned: ptsEarned,
        });
        setScannedData(null);
        toast.success(`Paid RM ${scannedData.amount.toFixed(2)} with SFC Wallet!`);
      } else {
        toast.error("Insufficient SFC Wallet balance! Please top up first.");
      }
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-stone-950 text-white select-none relative overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="px-4 py-3.5 flex items-center justify-between bg-stone-900/90 backdrop-blur-md border-b border-stone-800 z-30 sticky top-0">
        <button
          onClick={() => navigate("/profile/wallet")}
          className="p-2 rounded-full hover:bg-stone-800 text-stone-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="font-serif font-bold text-base text-white leading-tight">
            {translate("Pay") || "SFC Wallet Pay"}
          </h1>
          <p className="text-[11px] text-amber-400 font-medium">
            Balance: RM {walletBalance.toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => navigate("/profile/top_up")}
          className="px-3 py-1 bg-[#BA1C24] hover:bg-[#9E141B] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-xs"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Top Up</span>
        </button>
      </header>

      {/* Mode Selector Tabs */}
      <div className="bg-stone-900/80 border-b border-stone-800 px-4 py-2 flex items-center justify-center gap-2 z-20">
        <button
          onClick={() => setActiveTab("scan")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "scan"
              ? "bg-[#BA1C24] text-white shadow-md"
              : "bg-stone-800 text-stone-400 hover:text-white"
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>Scan QR</span>
        </button>

        <button
          onClick={() => setActiveTab("my_code")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "my_code"
              ? "bg-[#BA1C24] text-white shadow-md"
              : "bg-stone-800 text-stone-400 hover:text-white"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>My Member QR</span>
        </button>

        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "manual"
              ? "bg-[#BA1C24] text-white shadow-md"
              : "bg-stone-800 text-stone-400 hover:text-white"
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Manual Code</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col justify-between overflow-hidden">
        {/* TAB 1: LIVE CAMERA QR SCANNER */}
        {activeTab === "scan" && (
          <div className="flex-1 relative flex flex-col items-center justify-center p-4">
            {/* Real Video Element */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isCameraActive ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Flash Light Simulated Effect Overlay */}
            {torchOn && (
              <div className="absolute inset-0 bg-amber-100/20 pointer-events-none mix-blend-screen z-10" />
            )}

            {/* Viewfinder Dark Overlay Mask */}
            <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none flex flex-col items-center justify-between p-6">
              <div className="w-full text-center pt-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Align QR inside frame to pay
                </span>
              </div>
              <div className="w-full text-center pb-2">
                <p className="text-xs text-stone-300 backdrop-blur-xs py-1">
                  Point camera at San Francisco Coffee merchant QR
                </p>
              </div>
            </div>

            {/* Camera Frame Reticle & Laser */}
            <div className="relative z-20 w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-[2px]">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#BA1C24] rounded-tl-2xl z-20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#BA1C24] rounded-tr-2xl z-20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#BA1C24] rounded-bl-2xl z-20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#BA1C24] rounded-br-2xl z-20" />

              {/* Animated Red Laser Beam */}
              {isCameraActive && (
                <motion.div
                  animate={{ y: [0, 240, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="absolute left-3 right-3 h-0.5 bg-[#BA1C24] shadow-[0_0_15px_#BA1C24] z-20"
                />
              )}

              {/* Camera Fallback State (if denied or loading) */}
              {!isCameraActive && (
                <div className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
                  {cameraError ? (
                    <>
                      <AlertCircle className="w-10 h-10 text-amber-400" />
                      <p className="text-xs text-stone-300 leading-relaxed max-w-xs">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-[#BA1C24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:bg-[#9E141B]"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Enable Camera</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                      <p className="text-xs text-stone-400 font-medium">Starting camera feed...</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Camera Floating Toolbar */}
            <div className="absolute bottom-6 inset-x-6 z-30 flex items-center justify-between gap-3">
              <button
                onClick={toggleTorch}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${
                  torchOn ? "bg-amber-400 text-stone-950 shadow-lg" : "bg-stone-900/80 text-white border border-stone-700 hover:bg-stone-800"
                }`}
                title="Toggle Torch"
              >
                {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
              </button>

              {/* Interactive QR Scan Trigger */}
              <button
                onClick={() => handleQRDetected("San Francisco Coffee • Suria KLCC", 15.50)}
                className="flex-1 py-3 px-4 bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs rounded-2xl shadow-xl border border-red-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Scan className="w-4 h-4" />
                <span>Simulate Scan Merchant QR (RM 15.50)</span>
              </button>

              <button
                onClick={toggleFacingMode}
                className="p-3 bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-white rounded-full backdrop-blur-md transition-all"
                title="Switch Camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SHOW MY MEMBER PAYMENT QR */}
        {activeTab === "my_code" && (
          <div className="flex-1 bg-[#FAF8F5] text-stone-900 p-6 flex flex-col justify-between items-center text-center">
            {/* Top Info */}
            <div className="space-y-1 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#BA1C24]/10 text-[#BA1C24] rounded-full text-xs font-bold">
                <Coffee className="w-3.5 h-3.5" />
                Present at Cashier Register
              </span>
              <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">
                {profile.name || "San Francisco Coffee Member"}
              </h2>
              <p className="text-xs text-stone-500">{points} SFC Points Available</p>
            </div>

            {/* Barcode & QR Display Box */}
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-stone-200/80 space-y-6 my-auto">
              {/* Barcode SVG */}
              <div className="bg-stone-50 p-3 border border-stone-200 rounded-2xl flex flex-col items-center">
                <div className="h-14 w-full flex justify-between items-center px-1">
                  {[4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2, 4, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 4, 2].map((w, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-stone-900 rounded-2xs"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs tracking-widest text-stone-600 mt-2 font-bold">
                  9824 5019 3381 0492
                </span>
              </div>

              {/* QR Image */}
              <div className="flex flex-col items-center justify-center p-2">
                <div className="w-48 h-48 bg-white p-3 border-2 border-stone-200 rounded-2xl shadow-inner flex items-center justify-center">
                  <img
                    src="/images/QrCodeWallet.svg"
                    alt="Member Payment QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  {/* SVG QR Fallback if image fails */}
                  <QrCode className="w-full h-full text-stone-950" />
                </div>
                <p className="text-[11px] text-stone-400 mt-3 font-medium">
                  Auto-refreshes every 60 seconds for security
                </p>
              </div>

              {/* Wallet Balance Summary */}
              <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                  SFC Wallet Balance
                </span>
                <span className="font-serif font-bold text-xl text-[#BA1C24]">
                  RM {walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bottom Note */}
            <p className="text-[11px] text-stone-400 pb-2">
              Cashier will scan this QR to automatically process payment & credit points.
            </p>
          </div>
        )}

        {/* TAB 3: MANUAL OUTLET CODE ENTRY */}
        {activeTab === "manual" && (
          <div className="flex-1 bg-[#FAF8F5] text-stone-900 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-stone-200 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-[#BA1C24]/10 text-[#BA1C24] rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Keyboard className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Manual Merchant Pay
                </h3>
                <p className="text-xs text-stone-500">
                  Enter the store code displayed at the cashier counter.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Store Outlet Code
                  </label>
                  <input
                    type="text"
                    value={manualOutletCode}
                    onChange={(e) => setManualOutletCode(e.target.value)}
                    placeholder="e.g. SFC-KLCC"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#BA1C24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Payment Amount (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-xl font-bold text-[#BA1C24] focus:outline-none focus:border-[#BA1C24]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const num = parseFloat(manualAmount);
                      if (isNaN(num) || num <= 0) {
                        toast.error("Please enter a valid payment amount.");
                        return;
                      }
                      handleQRDetected(
                        `San Francisco Coffee (${manualOutletCode || "Store"})`,
                        num
                      );
                    }}
                    className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Pay RM {parseFloat(manualAmount || "0").toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CONFIRMATION SHEET MODAL */}
      <AnimatePresence>
        {scannedData && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setScannedData(null)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white text-stone-900 rounded-t-[32px] p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex justify-center">
                <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#BA1C24] uppercase tracking-wider">
                  Confirm Wallet Payment
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {scannedData.outletName}
                </h3>
                <p className="text-xs text-stone-500 font-mono">Ref: {scannedData.reference}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Amount Due:</span>
                  <span className="font-serif font-bold text-2xl text-[#BA1C24]">
                    RM {scannedData.amount.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between items-center text-xs">
                  <span className="text-stone-600 font-medium">SFC Wallet Balance:</span>
                  <span className="font-bold text-stone-900">RM {walletBalance.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-emerald-700 font-medium">
                  <span>Balance After Payment:</span>
                  <span className="font-bold">
                    RM {Math.max(0, walletBalance - scannedData.amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {walletBalance < scannedData.amount ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Insufficient balance! Please top up your SFC Wallet.</span>
                  </div>
                  <button
                    onClick={() => {
                      setScannedData(null);
                      navigate("/profile/top_up");
                    }}
                    className="w-full py-3.5 bg-[#BA1C24] hover:bg-[#9E141B] text-white font-bold text-sm rounded-2xl shadow-md"
                  >
                    Top Up Wallet Now
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setScannedData(null)}
                    className="flex-1 py-3.5 border border-stone-300 text-stone-700 font-bold text-sm rounded-2xl hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeWalletPayment}
                    disabled={isProcessing}
                    className="flex-[2] py-3.5 bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 disabled:opacity-60 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Processing Pay...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Pay RM {scannedData.amount.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS RECEIPT MODAL */}
      <AnimatePresence>
        {paymentSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-6 shadow-2xl z-10 space-y-5 text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  Payment Successful
                </span>
                <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                  RM {paymentSuccess.amount.toFixed(2)}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{paymentSuccess.outletName}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-stone-800">{paymentSuccess.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Paid Via:</span>
                  <span className="font-bold text-[#BA1C24]">SFC Wallet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">SFC Points Earned:</span>
                  <span className="font-bold text-amber-600">+{paymentSuccess.pointsEarned} pts</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold">
                  <span className="text-stone-700">Remaining Wallet Balance:</span>
                  <span className="text-stone-900">RM {paymentSuccess.newBalance.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaymentSuccess(null);
                  navigate("/profile/wallet");
                }}
                className="w-full py-3.5 bg-[#BA1C24] hover:bg-[#9E141B] text-white font-bold text-sm rounded-2xl shadow-md"
              >
                Back to Wallet
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
