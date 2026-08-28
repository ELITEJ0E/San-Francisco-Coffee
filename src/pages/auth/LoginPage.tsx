"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, MessageSquare, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("redirect") || "/";
  const { login } = useOrder();

  const [countryCode, setCountryCode] = useState("+60");
  const [phoneNumber, setPhoneNumber] = useState("128962547");
  const [buttonVariant, setButtonVariant] = useState<"single" | "dual">("dual");

  const handleSendOtp = (channel: "sms" | "whatsapp" = "sms") => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber}`;
    toast.success(`OTP sent via ${channel === "whatsapp" ? "WhatsApp" : "SMS"} to ${fullPhone}`);

    navigate(`/auth/otp?phone=${encodeURIComponent(fullPhone)}&channel=${channel}&redirect=${encodeURIComponent(returnUrl)}`);
  };

  const handleQuickDemoLogin = () => {
    login("+60 12-896 2547", "Sarah", "sarah@sfcoffee.com");
    toast.success("Welcome back, Sarah!");
    navigate(returnUrl);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] text-stone-900 overflow-y-auto">
      {/* Top Header */}
      <header className="px-4 py-3.5 flex items-center justify-between border-b border-stone-200/70 bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-serif font-bold text-base text-stone-900">
          Sign In / Register
        </span>
        <div className="w-8" />
      </header>

      {/* Main Content */}
      <div className="flex-1 px-5 py-6 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6">
          {/* Brand Logo & Header */}
          <div className="flex items-center gap-3.5 pt-2">
            <div className="w-14 h-14 bg-white rounded-2xl p-1.5 shadow-md border border-stone-200/80 flex items-center justify-center shrink-0">
              <img
                src="/assets/sf-logo.svg"
                alt="San Francisco Coffee"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FED7AA]">
                SFC Club Membership
              </span>
              <h1 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Enter Mobile Number
              </h1>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Sign in or create an account with your mobile number to unlock <strong>15% OFF</strong> on your first order, earn coffee stamps, and enjoy seamless mobile ordering.
          </p>

          {/* Phone Number Input Group */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              {/* Country Code Select */}
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-800 shadow-2xs focus:outline-none focus:border-[#BA1C24] focus:ring-1 focus:ring-[#BA1C24] appearance-none pr-7"
                >
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+62">🇮🇩 +62</option>
                  <option value="+66">🇹🇭 +66</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] pointer-events-none">
                  ▼
                </span>
              </div>

              {/* Number Field */}
              <div className="flex-1 relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="12 345 6789"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24] focus:ring-1 focus:ring-[#BA1C24]"
                />
              </div>
            </div>
          </div>

          {/* Variant Selector (Single vs Dual Button) */}
          <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-2xs flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">OTP Button Spec Variant:</span>
            <div className="flex gap-1 bg-stone-100 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setButtonVariant("dual")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  buttonVariant === "dual"
                    ? "bg-white text-[#BA1C24] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Dual (WA / SMS)
              </button>
              <button
                type="button"
                onClick={() => setButtonVariant("single")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  buttonVariant === "single"
                    ? "bg-white text-[#BA1C24] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Single Button
              </button>
            </div>
          </div>

          {/* Action Buttons based on variant */}
          {buttonVariant === "dual" ? (
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleSendOtp("whatsapp")}
                className="w-full bg-[#128C7E] hover:bg-[#075E54] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Get OTP via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp("sms")}
                className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Get OTP via SMS</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSendOtp("sms")}
                className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Get OTP Code</span>
              </button>
            </div>
          )}

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-stone-200/60">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#BA1C24] border border-[#FED7AA] font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Test Login (as Sarah)</span>
            </button>
          </div>
        </div>

        {/* Bottom Terms & Security */}
        <div className="pt-8 pb-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
          <p className="text-[10px] text-stone-400 leading-relaxed max-w-xs mx-auto">
            By continuing, you agree to San Francisco Coffee's{" "}
            <span className="text-[#BA1C24] underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-[#BA1C24] underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
