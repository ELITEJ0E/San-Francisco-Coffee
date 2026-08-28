"use client";

import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { toast } from "sonner";

export default function CompactLoginCard() {
  const navigate = useNavigate();
  const { login } = useOrder();

  const handleDemoSignIn = () => {
    login("+60 12-896 2547", "Sarah", "sarah@sfcoffee.com");
    toast.success("Welcome back, Sarah!");
  };

  return (
    <div className="mx-4 my-3 bg-gradient-to-br from-[#FFF5F2] to-[#FAF8F5] border-2 border-[#FED7AA] rounded-2xl p-4 shadow-sm relative overflow-hidden">
      {/* Decorative Ribbon Accent */}
      <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#BA1C24]/5 rounded-full pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA1C24] bg-white px-2 py-0.5 rounded-full border border-[#FED7AA] shadow-2xs">
              SFC Club Member Perk
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700">
              <Sparkles className="w-3 h-3 text-amber-500" />
              15% OFF
            </span>
          </div>

          <h3 className="font-serif font-bold text-sm text-stone-900 leading-snug pt-0.5">
            Sign in to earn stamps & enjoy 15% OFF your first order
          </h3>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Order ahead, collect stamps for free drinks, and pay seamlessly with your e-wallet.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-200/60 relative z-10">
        <button
          onClick={() => navigate("/auth/login")}
          className="flex-1 bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Sign In / Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDemoSignIn}
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1"
          title="Sign in immediately with demo member account"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#BA1C24]" />
          <span>Demo Login</span>
        </button>
      </div>
    </div>
  );
}
