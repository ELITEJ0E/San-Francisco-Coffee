"use client";

import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

interface WelcomeFirstOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeFirstOrderModal({
  isOpen,
  onClose,
}: WelcomeFirstOrderModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 border border-stone-100">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Welcome Illustration Image */}
        <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#FFF5F2] flex items-center justify-center p-1">
          <img
            src="/assets/welcome-coffee-reward.svg"
            alt="Welcome Complimentary Coffee Gift"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content Details */}
        <div className="space-y-2 px-1">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0EB] border border-[#FED7AA] text-[#BA1C24] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>First Order Gift</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-stone-900 leading-tight">
            Welcome to SFC Club!
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed">
            Enjoy a complimentary coffee on your first order through our app. Kickstart your coffee journey in San Francisco!
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              navigate("/rewards");
            }}
            className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>My Rewards</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-stone-500 hover:text-stone-900 font-semibold text-xs py-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
