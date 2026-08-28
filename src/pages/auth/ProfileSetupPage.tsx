"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Sparkles, Gift } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";
import { toast } from "sonner";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "+60 12-896 2547";
  const returnUrl = searchParams.get("redirect") || "/";
  const { login } = useOrder();

  const [name, setName] = useState("Sarah");
  const [email, setEmail] = useState("sarah@sfcoffee.com");
  const [requireEmail, setRequireEmail] = useState(true); // Toggle to support both spec variants
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (requireEmail && (!email || !email.includes("@"))) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!agreedTerms) {
      toast.error("Please agree to the SFC Club terms");
      return;
    }

    // Complete authentication
    login(phone, name.trim(), email.trim());
    toast.success(`Welcome to SFC Club, ${name.trim()}! 15% OFF voucher added to your account.`);

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
          Almost There
        </span>
        <div className="w-8" />
      </header>

      {/* Main Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 px-5 py-6 flex flex-col justify-between max-w-md mx-auto w-full"
      >
        <div className="space-y-5">
          {/* Welcome Banner */}
          <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-3xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#BA1C24] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA1C24]">
                New Member Gift
              </span>
              <h2 className="font-serif font-bold text-base text-stone-900 leading-tight">
                15% OFF Welcome Voucher
              </h2>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Automatically credited to your account upon completing setup!
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FED7AA]">
              Step 3 of 3
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Personalize Your Experience
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Tell us how you'd like your barista to call your name on your cup.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Tan"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24] focus:ring-1 focus:ring-[#BA1C24]"
              />
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Email Address {requireEmail ? <span className="text-red-500">*</span> : <span className="text-stone-400 font-normal">(Optional)</span>}
                </label>
                {/* Variant Toggle: Optional vs Required */}
                <button
                  type="button"
                  onClick={() => setRequireEmail(!requireEmail)}
                  className="text-[10px] text-[#BA1C24] font-medium hover:underline"
                >
                  {requireEmail ? "Toggle: Make Optional" : "Toggle: Make Required"}
                </button>
              </div>
              <input
                type="email"
                required={requireEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah@example.com"
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 placeholder:text-stone-400 shadow-2xs focus:outline-none focus:border-[#BA1C24] focus:ring-1 focus:ring-[#BA1C24]"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                We'll email your order receipts and special coffee launch invitations.
              </p>
            </div>

            {/* Verified Phone Display */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Mobile Number
              </label>
              <div className="bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-600 flex items-center justify-between">
                <span>{phone}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified ✓
                </span>
              </div>
            </div>

            {/* Loyalty Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#BA1C24] border-stone-300 focus:ring-[#BA1C24] mt-0.5"
              />
              <span className="text-xs text-stone-600 leading-tight">
                I agree to the SFC Club Loyalty Terms and consent to receive member rewards and order updates.
              </span>
            </label>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-6 pb-4">
          <button
            type="submit"
            className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete & Claim 15% OFF</span>
          </button>
        </div>
      </form>
    </div>
  );
}
