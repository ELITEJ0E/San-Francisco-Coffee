"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, CreditCard, Wallet, Smartphone, ShieldCheck } from "lucide-react";

interface PaymentOption {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const savedAmount = searchParams.get("amount") || "50.00";

  const paymentOptions: PaymentOption[] = [
    {
      id: "fpx",
      label: "FPX Online Banking",
      sublabel: "Maybank2u, CIMB Clicks, RHB, Public Bank & more",
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: "tng",
      label: "Touch 'n Go eWallet",
      sublabel: "Instant top-up via TNG app",
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      sublabel: "Visa & Mastercard accepted",
      icon: <CreditCard className="w-5 h-5 text-[#BA1C24]" />,
    },
    {
      id: "grabpay",
      label: "GrabPay",
      sublabel: "Pay via Grab e-wallet",
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const handlePaymentSelection = (methodLabel: string) => {
    navigate(`/profile/top_up?amount=${savedAmount}&paymentmethod=${encodeURIComponent(methodLabel)}`);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAFAF9] text-stone-900 select-none">
      {/* Header */}
      <header className="px-4 py-3.5 bg-white border-b border-stone-200 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif font-bold text-lg text-stone-900">
          Payment Method
        </h1>
        <div className="w-8" />
      </header>

      {/* Content */}
      <div className="p-4 space-y-4 flex-1">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium">Top-Up Amount</span>
          <p className="font-serif font-bold text-2xl text-[#BA1C24] mt-0.5">
            RM {parseFloat(savedAmount).toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-bold text-sm text-stone-800 px-1">
            Select Payment Gateway
          </h2>

          <div className="space-y-2.5">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePaymentSelection(option.label)}
                className="w-full bg-white hover:bg-stone-50 active:scale-[0.99] p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-sm text-stone-900 block leading-tight">
                      {option.label}
                    </span>
                    <span className="text-xs text-stone-500 font-normal">
                      {option.sublabel}
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-stone-400 rotate-180" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-2xl p-3.5 flex items-start gap-2.5 mt-4">
          <ShieldCheck className="w-5 h-5 text-[#BA1C24] shrink-0 mt-0.5" />
          <p className="text-xs text-stone-700 leading-relaxed">
            All payments are encrypted & secured via SSL. Your wallet balance will update automatically after confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
