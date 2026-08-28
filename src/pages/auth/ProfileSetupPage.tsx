"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import BirthDatePickerSheet from "@/components/auth/BirthDatePickerSheet";
import { toast } from "sonner";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "+60 123456789";
  const returnUrl = searchParams.get("redirect") || "/";
  const { login } = useOrder();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<{ day: string; month: string; year: string } | null>(null);
  const [receivePromos, setReceivePromos] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Mandatory check: Birth Date is required according to spec diagram
  const isFormValid = Boolean(birthDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please select your birth date");
      return;
    }

    const finalName = name.trim() || "Jennifer";
    const finalEmail = email.trim() || "jennifer@sfcoffee.com";

    // Complete login in OrderContext
    login(phone, finalName, finalEmail);

    toast.success(`Welcome, ${finalName}!`);

    // Navigate to returnUrl (or homepage) with query param to trigger Welcome Reward Modal
    const targetPath = returnUrl.includes("?") ? `${returnUrl}&welcome=true` : `${returnUrl}?welcome=true`;
    navigate(targetPath);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] text-stone-900 overflow-y-auto">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <div className="w-8" />
      </header>

      {/* Main Body */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 px-5 pb-6 flex flex-col justify-between max-w-md mx-auto w-full"
      >
        <div className="space-y-5">
          {/* Centered Brand Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#BA1C24] rounded-2xl p-2 shadow-md flex items-center justify-center mb-3">
              <img
                src="/assets/sf-logo.svg"
                alt="San Francisco Coffee"
                className="w-full h-full object-contain filter invert drop-shadow-xs"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Almost There
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Just a few more things to get you started
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 pt-2">
            {/* Name (Optional) */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Name <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24]"
              />
            </div>

            {/* Mobile Number (Prefilled, Readonly) */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-3 text-xs font-bold text-stone-600 shadow-2xs">
                  🇲🇾 +60
                </div>
                <input
                  type="text"
                  disabled
                  value={phone.replace(/^\+60\s?/, "")}
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-600 shadow-2xs cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Email <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24]"
              />
            </div>

            {/* Birth Date * (Mandatory!) */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1">
                Birth Date<span className="text-[#BA1C24] ml-0.5">*</span>
              </label>
              <div
                onClick={() => setIsDatePickerOpen(true)}
                className="grid grid-cols-3 gap-2 cursor-pointer"
              >
                {/* Month Dropdown */}
                <div className="bg-white border border-stone-300 rounded-xl px-3 py-3 text-xs font-semibold text-stone-800 shadow-2xs flex items-center justify-between hover:border-[#BA1C24]">
                  <span>{birthDate ? birthDate.month : "Month"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>

                {/* Day Dropdown */}
                <div className="bg-white border border-stone-300 rounded-xl px-3 py-3 text-xs font-semibold text-stone-800 shadow-2xs flex items-center justify-between hover:border-[#BA1C24]">
                  <span>{birthDate ? birthDate.day : "Day"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>

                {/* Year Dropdown */}
                <div className="bg-white border border-stone-300 rounded-xl px-3 py-3 text-xs font-semibold text-stone-800 shadow-2xs flex items-center justify-between hover:border-[#BA1C24]">
                  <span>{birthDate ? birthDate.year : "Year"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            </div>

            {/* Promo Offers Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={receivePromos}
                onChange={(e) => setReceivePromos(e.target.checked)}
                className="w-4 h-4 rounded text-[#BA1C24] border-stone-300 focus:ring-[#BA1C24] mt-0.5 accent-[#BA1C24]"
              />
              <span className="text-xs text-stone-600 leading-tight">
                I would like to receive promotional offers and latest news from San Francisco Coffee
              </span>
            </label>
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-6 pb-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-bold text-sm py-3.5 rounded-xl transition-all shadow-md ${
              isFormValid
                ? "bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white"
                : "bg-[#EBBABF] text-white cursor-not-allowed opacity-80"
            }`}
          >
            Submit
          </button>
        </div>
      </form>

      {/* Birth Date Picker Wheel Sheet */}
      <BirthDatePickerSheet
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        initialDate={birthDate || { month: "Feb", day: "01", year: "2000" }}
        onSelectDate={(date) => setBirthDate(date)}
      />
    </div>
  );
}
