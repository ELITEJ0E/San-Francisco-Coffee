"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Voucher {
  code: string;
  name: string;
  discountDescription: string;
  expiry: string;
  minSpend?: number;
  discountValue: number; // if < 1 percentage, if >= 1 flat amount
  isFreeDrink?: boolean;
}

const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: "FREEDRINK",
    name: "Complimentary Handcrafted Drink",
    discountDescription: "100% Free handcrafted drink (Any Size)",
    expiry: "30 Jul 2026",
    discountValue: 14.5,
    isFreeDrink: true,
  },
  {
    code: "RM5OFF",
    name: "RM 5.00 Welcome Voucher",
    discountDescription: "RM 5 OFF with minimum spend of RM 20.00",
    expiry: "15 Aug 2026",
    minSpend: 20,
    discountValue: 5.0,
  },
  {
    code: "SF10",
    name: "SFC Club 10% Off",
    discountDescription: "10% discount on all handcrafted beverages",
    expiry: "31 Dec 2026",
    discountValue: 0.1,
  },
  {
    code: "BDAYDRINK",
    name: "Birthday Special Drink",
    discountDescription: "Free beverage of your choice during your birthday month",
    expiry: "31 Aug 2026",
    discountValue: 16.5,
    isFreeDrink: true,
  },
];

interface VoucherSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedCode?: string;
  onSelectVoucher: (voucher: Voucher) => void;
  onRemoveVoucher: () => void;
  onOpenFreeDrinkModal: () => void;
}

export default function VoucherSelectModal({
  isOpen,
  onClose,
  appliedCode,
  onSelectVoucher,
  onRemoveVoucher,
  onOpenFreeDrinkModal,
}: VoucherSelectModalProps) {
  const [promoInput, setPromoInput] = useState("");
  const [customError, setCustomError] = useState("");

  if (!isOpen) return null;

  const handleApplyCustom = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === "FREEDRINK" || code === "FREE") {
      onSelectVoucher(AVAILABLE_VOUCHERS[0]);
      onClose();
    } else if (code === "RM5OFF" || code === "SFC5") {
      onSelectVoucher(AVAILABLE_VOUCHERS[1]);
      onClose();
    } else if (code === "SF10" || code === "WELCOME10") {
      onSelectVoucher(AVAILABLE_VOUCHERS[2]);
      onClose();
    } else {
      setCustomError("Invalid voucher code. Try 'FREEDRINK' or 'RM5OFF'");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="bg-[#BA1C24] text-white p-4 relative shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#FED7AA]" />
            <div>
              <h2 className="text-sm font-black text-white">Select Voucher</h2>
              <p className="text-[10px] text-[#FED7AA]">
                Apply your rewards & promotions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Promo code manual input */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setCustomError("");
              }}
              placeholder="Enter voucher code (e.g. FREEDRINK)"
              className="flex-1 bg-white text-stone-800 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#FED7AA] uppercase"
            />
            <button
              onClick={handleApplyCustom}
              className="bg-[#BA1C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#A3161D] transition-colors"
            >
              Apply
            </button>
          </div>
          {customError && (
            <p className="text-[11px] text-red-600 mt-1.5 font-medium">
              {customError}
            </p>
          )}
        </div>

        {/* Vouchers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {AVAILABLE_VOUCHERS.map((v) => {
            const isApplied = appliedCode === v.code;
            return (
              <div
                key={v.code}
                className={cn(
                  "border rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 transition-all",
                  isApplied
                    ? "bg-[#FFF0EB] border-[#BA1C24] ring-1 ring-[#BA1C24]"
                    : "bg-white border-stone-200 hover:border-[#FED7AA]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm",
                        v.isFreeDrink
                          ? "bg-[#BA1C24] text-white"
                          : "bg-[#FF7D54] text-white"
                      )}
                    >
                      {v.isFreeDrink ? "🎁" : "🏷️"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        {v.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {v.discountDescription}
                      </p>
                    </div>
                  </div>

                  {isApplied && (
                    <span className="text-[10px] font-black bg-[#BA1C24] text-white px-2 py-0.5 rounded-full shrink-0">
                      Applied
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100/80 text-[10px] text-stone-400">
                  <span>Valid until {v.expiry}</span>

                  <div className="flex items-center gap-2">
                    {v.isFreeDrink && (
                      <button
                        onClick={() => {
                          onSelectVoucher(v);
                          onClose();
                          onOpenFreeDrinkModal();
                        }}
                        className="text-[10px] font-bold text-[#BA1C24] bg-white border border-[#FED7AA] px-2.5 py-1 rounded-lg hover:bg-[#FFF5F0]"
                      >
                        Customize Free Drink
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (isApplied) {
                          onRemoveVoucher();
                        } else {
                          onSelectVoucher(v);
                        }
                        onClose();
                      }}
                      className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-lg transition-colors",
                        isApplied
                          ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                          : "bg-[#BA1C24] text-white hover:bg-[#A3161D]"
                      )}
                    >
                      {isApplied ? "Remove" : "Use"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
