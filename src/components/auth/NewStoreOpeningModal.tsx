"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Sparkles, Gift, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NewStoreOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewStoreOpeningModal({ isOpen, onClose }: NewStoreOpeningModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClaimOpeningPerk = () => {
    toast.success("TRX Grand Opening Voucher (Buy 1 Free 1) added to your Rewards!");
    onClose();
    navigate("/rewards");
  };

  const handleViewStore = () => {
    onClose();
    navigate("/stores");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200"
        >
          {/* Header Banner */}
          <div className="bg-[#BA1C24] text-white p-5 relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1 bg-[#FFF0EB] text-[#BA1C24] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#BA1C24]" />
              New Store Opening
            </div>

            <h2 className="font-serif text-xl font-bold text-white leading-tight">
              San Francisco Coffee @ The Exchange TRX
            </h2>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FED7AA]" />
              <span>Concourse Level, Lot C.08.0 · Now Brewing</span>
            </p>
          </div>

          {/* Promo Details */}
          <div className="p-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#BA1C24] font-bold text-xs">
                <Gift className="w-4 h-4" />
                <span>Grand Opening Exclusive</span>
              </div>
              <p className="font-serif text-base font-bold text-stone-900 leading-tight">
                Buy 1 Free 1 on All Handcrafted Drinks
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Celebrate our newest specialty coffee destination in Kuala Lumpur. Valid for any Regular or Large beverage during opening week!
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleClaimOpeningPerk}
                className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Claim Grand Opening Voucher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleViewStore}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
              >
                View Store Details & Directions
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
