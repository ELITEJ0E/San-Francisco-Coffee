"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("redirect") || "/";
  const { login } = useOrder();

  const [countryCode, setCountryCode] = useState("+60");
  const [phoneNumber, setPhoneNumber] = useState("123456789");

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber}`;
    toast.success(`OTP sent via WhatsApp to ${fullPhone}`);

    navigate(`/auth/otp?phone=${encodeURIComponent(fullPhone)}&redirect=${encodeURIComponent(returnUrl)}`);
  };

  const handleQuickDemoLogin = () => {
    login("+60 12-896 2547", "Jennifer", "jennifer@sfcoffee.com");
    toast.success("Welcome back, Jennifer!");
    navigate(returnUrl);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] text-stone-900 overflow-y-auto">
      {/* Top Bar with Back Arrow */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <div className="w-8" />
      </header>

      {/* Main Container */}
      <div className="flex-1 px-5 pb-6 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-5 text-center">
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#BA1C24] rounded-2xl p-2 shadow-md flex items-center justify-center mb-3">
              <img
                src="/assets/sf-logo.svg"
                alt="San Francisco Coffee"
                className="w-full h-full object-contain filter invert drop-shadow-xs"
              />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              San Francisco Coffee
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Brewing Happiness Since 1997
            </p>
          </div>

          {/* Cozy Window Coffee Photo Card */}
          <div className="w-full h-44 sm:h-48 rounded-3xl overflow-hidden shadow-md border border-stone-200/80 relative bg-stone-900">
            <img
              src="/assets/login-cozy-window.svg"
              alt="Cozy Coffee Table"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Phone Number Input Form */}
          <div className="space-y-2 text-left pt-1">
            <label className="text-xs font-bold text-stone-800 block">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              {/* Country Code Select */}
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-3 text-xs font-bold text-stone-800 shadow-2xs focus:outline-none focus:border-[#BA1C24] appearance-none pr-7"
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
              <div className="flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="12 345 6789"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24]"
                />
              </div>
            </div>
          </div>

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all"
          >
            Sent OTP
          </button>

          {/* Demo Shortcut */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#BA1C24] border border-[#FED7AA] font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Test Login (as Jennifer)</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="pt-6 pb-2 text-center">
          <p className="text-[11px] text-stone-500 leading-relaxed max-w-xs mx-auto">
            By signing up or login, I confirm that I accept the{" "}
            <span className="text-[#BA1C24] font-semibold underline cursor-pointer">
              Loyalty Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-[#BA1C24] font-semibold underline cursor-pointer">
              Personal Data Protection Policy
            </span>.
          </p>
        </div>
      </div>
    </div>
  );
}
