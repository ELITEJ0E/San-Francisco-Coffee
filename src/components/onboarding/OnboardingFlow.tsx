"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, ChevronRight } from "lucide-react";

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingFlow({ isOpen, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<"splash" | "location" | "notification">("splash");

  useEffect(() => {
    if (!isOpen) {
      setStep("splash");
      return;
    }

    // Auto-advance from splash screen after 1.8 seconds
    const timer = setTimeout(() => {
      setStep("location");
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLocationAllow = () => {
    localStorage.setItem("sfc_location_permission", "granted");
    setStep("notification");
  };

  const handleLocationSkip = () => {
    localStorage.setItem("sfc_location_permission", "denied");
    setStep("notification");
  };

  const handleNotificationAllow = () => {
    localStorage.setItem("sfc_notification_permission", "granted");
    localStorage.setItem("sfc_onboarding_completed", "true");
    onComplete();
  };

  const handleNotificationSkip = () => {
    localStorage.setItem("sfc_notification_permission", "denied");
    localStorage.setItem("sfc_onboarding_completed", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs select-none">
      <AnimatePresence mode="wait">
        {/* STEP 1: SPLASH SCREEN */}
        {step === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[430px] h-full sm:h-[844px] bg-[#BA1C24] flex flex-col items-center justify-center text-white px-8 relative shadow-2xl overflow-hidden"
          >
            {/* Background subtle radial glow */}
            <div className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center text-center z-10"
            >
              {/* SF Coffee Red Square Logo */}
              <div className="w-24 h-24 bg-white rounded-3xl p-2.5 shadow-2xl flex items-center justify-center mb-6 ring-4 ring-white/20">
                <img
                  src="/assets/sf-logo.svg"
                  alt="San Francisco Coffee"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
                San Francisco Coffee
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-[#FED7AA] font-semibold mt-2">
                Fresh Roasted in Malaysia · Est. 1997
              </p>
            </motion.div>

            {/* Tap to skip */}
            <button
              onClick={() => setStep("location")}
              className="absolute bottom-10 text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>Tap to continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: LOCATION PERMISSION MODAL */}
        {step === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-[90%] max-w-sm bg-[#FAF8F5] rounded-3xl p-6 text-center shadow-2xl border border-stone-200/80 z-20 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center mb-4 shadow-xs border border-[#FED7AA]">
              <MapPin className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 leading-tight">
              Allow Location Access?
            </h2>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-xs">
              We use your current location to show nearby San Francisco Coffee outlets, estimate brewing & pickup times, and enable seamless Dine-In table ordering.
            </p>

            <div className="w-full space-y-2.5 mt-6">
              <button
                onClick={handleLocationAllow}
                className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all"
              >
                While Using the App
              </button>
              <button
                onClick={handleLocationSkip}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs py-3 rounded-xl transition-colors"
              >
                Don't Allow
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PUSH NOTIFICATION MODAL */}
        {step === "notification" && (
          <motion.div
            key="notification"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-[90%] max-w-sm bg-[#FAF8F5] rounded-3xl p-6 text-center shadow-2xl border border-stone-200/80 z-20 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center mb-4 shadow-xs border border-[#FED7AA] relative">
              <Bell className="w-8 h-8 stroke-[2.2]" />
              <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-[#BA1C24] rounded-full ring-2 ring-white" />
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 leading-tight">
              Stay Updated on Orders
            </h2>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-xs">
              Receive live alerts when your coffee is brewing and ready at the pickup counter, plus exclusive 15% OFF member vouchers and seasonal releases.
            </p>

            <div className="w-full space-y-2.5 mt-6">
              <button
                onClick={handleNotificationAllow}
                className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all"
              >
                Allow Notifications
              </button>
              <button
                onClick={handleNotificationSkip}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs py-3 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
