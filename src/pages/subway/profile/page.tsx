"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import { cn } from "@/lib/utils";
import {
  Wallet,
  QrCode,
  Ticket,
  Receipt,
  MapPin,
  ChevronRight,
  Plus,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export default function SFCProfilePage() {
  const navigate = useNavigate();
  const { userProfile, topUpWallet } = useOrder();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);

  const handleTopUp = () => {
    topUpWallet(selectedAmount);
    toast.success(`Successfully topped up RM ${selectedAmount.toFixed(2)} to SFC Wallet!`);
    setIsTopUpOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden relative">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#BA1C24] to-[#9E141B] px-4 pt-5 pb-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#BA1C24] flex items-center justify-center font-black text-xs shadow-xs">
              SF
            </div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-[#FED7AA]">
              SFC Club Member
            </span>
          </div>
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#FED7AA]" />
            <span>Member QR</span>
          </button>
        </div>

        {/* Member Profile Banner */}
        <div className="mt-4 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#FED7AA] text-[#8C1017] flex items-center justify-center font-black text-xl border-2 border-white shadow-md">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">{userProfile.name}</h2>
              <span className="text-[10px] font-extrabold bg-[#FED7AA] text-[#8C1017] px-2 py-0.5 rounded-full">
                {userProfile.tier}
              </span>
            </div>
            <p className="text-xs text-[#FED7AA]/90 mt-0.5">{userProfile.email}</p>
            <p className="text-[10px] text-white/70 mt-0.5">Member since Jan 2024 · ID: SFC-88219</p>
          </div>
        </div>
      </header>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {/* SFC Wallet Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#BA1C24]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  SFC E-Wallet Balance
                </span>
                <span className="text-xl font-black text-[#BA1C24]">
                  RM {userProfile.walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsTopUpOpen(true)}
              className="bg-[#BA1C24] hover:bg-[#A3161D] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top Up</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-center">
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">
                SFC Points
              </span>
              <span className="text-sm font-black text-stone-800">
                {userProfile.points} pts
              </span>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">
                Stamp Card
              </span>
              <span className="text-sm font-black text-[#BA1C24]">
                {userProfile.stamps} / 8 Drinks
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Menu */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs divide-y divide-stone-100 overflow-hidden">
          <button
            onClick={() => navigate("/orders")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-800">Order History & Receipts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => navigate("/rewards")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-800">
                Vouchers & Stamp Card ({userProfile.vouchersCount} Active)
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => navigate("/stores")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#BA1C24]">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-800">Store Locations</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Support & Brand Details */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs divide-y divide-stone-100 overflow-hidden">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-800">Freshness Guaranteed</h4>
                <p className="text-[10px] text-stone-400">Roasted in SF & brewed freshly for you</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-800">Customer Support</h4>
                <p className="text-[10px] text-stone-400">customercare@sfcoffee.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* App Version Info */}
        <div className="text-center py-2">
          <p className="text-[11px] font-bold text-stone-400">
            San Francisco Coffee App v3.2.0
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Crafted with passion for authentic coffee lovers
          </p>
        </div>
      </div>

      {/* Member QR / Barcode Modal */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#BA1C24] text-white flex items-center justify-center mx-auto font-black text-sm">
              SF
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">
                SFC Club Member Card
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Scan at register to collect stamps & pay
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 flex flex-col items-center">
              <div className="w-40 h-40 bg-white p-2 border border-stone-300 rounded-xl flex items-center justify-center">
                {/* SVG QR Visual */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-stone-900 rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xs",
                        i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-stone-900"
                      )}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-stone-700 mt-3 tracking-widest">
                SFC-88219-9042
              </span>
            </div>

            <button
              onClick={() => setIsQrOpen(false)}
              className="w-full bg-[#BA1C24] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Top-up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-stone-900">
                Top Up SFC Wallet
              </h3>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Select an amount to reload into your San Francisco Coffee wallet:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={cn(
                    "py-3 rounded-xl border text-xs font-extrabold transition-all",
                    selectedAmount === amt
                      ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] shadow-xs"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  )}
                >
                  RM {amt}
                </button>
              ))}
            </div>

            <div className="bg-[#FFF0EB] rounded-xl p-2.5 text-[10px] text-[#BA1C24] font-semibold text-center">
              🎁 Get 50 Bonus Points for reloads RM 50 and above!
            </div>

            <button
              onClick={handleTopUp}
              className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-red-900/20"
            >
              Confirm Reload RM {selectedAmount.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
