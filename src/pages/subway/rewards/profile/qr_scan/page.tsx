"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, QrCode, Zap, ZapOff, Keyboard, Coffee, Check, Sparkles } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function QRScanPage() {
  const navigate = useNavigate();
  const { setDiningMode, setTableNumber } = useOrder();

  const [flashOn, setFlashOn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState("3");
  const [isScanning, setIsScanning] = useState(false);

  // Live Camera Video
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (showManualEntry) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      return;
    }

    let isMounted = true;
    const initCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setIsCameraActive(true);
      } catch (e) {
        console.warn("QRScanPage camera error:", e);
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [showManualEntry]);

  const handleConnectTable = (tableNum = "3") => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDiningMode("eat-in");
      setTableNumber(tableNum);
      toast.success(`Connected to Table ${tableNum}! Opening Menu...`);
      navigate(`/menu?orderType=eat-in&table=${tableNum}`);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-stone-950 text-white overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="px-4 py-3.5 flex items-center justify-between bg-stone-900/90 border-b border-stone-800 z-30 sticky top-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-800 text-stone-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="font-serif font-bold text-base text-white block leading-tight">
            Scan Table QR Code
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            San Francisco Coffee Table Standee
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`p-1.5 rounded-full transition-colors ${
              flashOn ? "bg-amber-400 text-stone-950 shadow-xs" : "bg-stone-800 text-stone-300 hover:bg-stone-700"
            }`}
            title="Toggle Flash"
          >
            {flashOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className={`p-1.5 rounded-full transition-colors ${
              showManualEntry ? "bg-[#BA1C24] text-white" : "bg-stone-800 text-stone-300 hover:bg-stone-700"
            }`}
            title="Manual Entry"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewfinder / Manual Body */}
      {showManualEntry ? (
        <div className="flex-1 bg-[#FAF8F5] text-stone-900 p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#BA1C24] flex items-center justify-center shadow-md border border-stone-200">
            <Coffee className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Enter Table Number
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Check the San Francisco Coffee red standee on your table.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3 pt-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Table Number"
              className="w-full bg-white border-2 border-stone-300 rounded-xl px-4 py-3 text-center text-2xl font-bold text-stone-900 focus:outline-none focus:border-[#BA1C24] shadow-xs"
            />

            <div className="flex gap-2 justify-center">
              {["3", "7", "10", "12"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setManualCode(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    manualCode === t
                      ? "bg-[#BA1C24] text-white border-[#BA1C24]"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  Table {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleConnectTable(manualCode || "3")}
              className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <Check className="w-4 h-4" />
              <span>Connect Table {manualCode || "3"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Live Camera Feed */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isCameraActive ? "opacity-100" : "opacity-0"
            }`}
          />

          {flashOn && (
            <div className="absolute inset-0 bg-amber-100/20 pointer-events-none mix-blend-screen z-10" />
          )}

          {/* Virtual Table Overlay Container */}
          <div className="w-64 h-72 bg-stone-900/60 rounded-3xl border border-white/20 p-5 flex flex-col items-center justify-center text-center backdrop-blur-xs relative shadow-2xl z-20">
            <div className="w-9 h-9 rounded-xl bg-[#BA1C24] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
              SF
            </div>
            <p className="text-white font-serif font-bold text-lg leading-tight">
              Table 3
            </p>
            <p className="text-[#FED7AA] text-[10px] uppercase font-bold tracking-wider mb-3">
              San Francisco Coffee
            </p>

            <div className="w-28 h-28 bg-white/95 rounded-2xl p-2.5 flex items-center justify-center shadow-lg relative">
              <QrCode className="w-full h-full text-stone-900" />
              <motion.div
                animate={{ y: [0, 80, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute left-2 right-2 h-0.5 bg-[#BA1C24] shadow-[0_0_10px_#BA1C24]"
              />
            </div>

            <p className="text-white/80 text-[10px] mt-3 font-medium">
              Point camera at Table QR code
            </p>
          </div>

          {/* Connect CTA */}
          <div className="absolute bottom-6 inset-x-6 z-30">
            <button
              onClick={() => handleConnectTable("3")}
              disabled={isScanning}
              className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Connecting to Table #3...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Connect to Table #3</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
