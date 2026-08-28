"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  Bell,
  Star,
  ChevronRight,
} from "lucide-react";
import OrderModeFlowModal from "@/components/order/OrderModeFlowModal";
import { toast } from "sonner";

export default function SFHomePage() {
  const navigate = useNavigate();
  const { userProfile, addToCart } = useOrder();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleReorder = () => {
    addToCart({
      id: `reorder-${Date.now()}`,
      menuItemId: "sp1",
      name: "Lemon Peach Yoghurt Frappe",
      price: 14.5,
      quantity: 1,
      image: "/menuImages/lemon-peach-frappe.svg",
      category: "Special Promo",
      detailsSummary: "Regular · Less Sweet",
    });
    toast.success("Lemon Peach Yoghurt Frappe & 3 items added to your cart!");
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto pb-28 relative scrollbar-none bg-[#FAFAF9] text-stone-900">
      {/* iOS Top Status Bar (9:41, Cellular, Wi-Fi, Battery) */}
      <div className="px-6 pt-3 pb-1 flex items-center justify-between text-stone-900 text-xs font-semibold select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal Bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 bg-stone-900 rounded-xs" />
            <span className="w-0.5 h-1.5 bg-stone-900 rounded-xs" />
            <span className="w-0.5 h-2 bg-stone-900 rounded-xs" />
            <span className="w-0.5 h-2.5 bg-stone-400 rounded-xs" />
          </div>
          {/* Wi-Fi Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.5c3.84 0 7.34 1.5 9.94 3.96L12 18.35 2.06 10.46C4.66 8 8.16 6.5 12 6.5z" />
          </svg>
          {/* Battery */}
          <div className="w-5 h-2.5 border border-stone-800 rounded-xs p-0.5 flex items-center">
            <div className="w-full h-full bg-stone-900 rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Top App Bar (SF COFFEE Logo & Bell Notification) */}
      <header className="px-4 py-2.5 flex items-center justify-between">
        {/* SF COFFEE Red Square Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer active:scale-95 transition-transform"
        >
          <img
            src="/assets/sf-logo.svg"
            alt="San Francisco Coffee"
            className="w-10 h-10 object-contain shadow-xs rounded-xl"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotificationPopup(!showNotificationPopup)}
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 active:scale-95 transition-all"
        >
          <Bell className="w-6 h-6 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full ring-2 ring-white" />
        </button>
      </header>

      {/* Main Content Feed */}
      <div className="px-4 space-y-4 pt-1">
        {/* User Greeting & Balance Row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 text-xs font-normal">Welcome back,</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {userProfile.name || "Sarah"}
            </h1>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="text-[#C8102E] font-bold text-base sm:text-lg tracking-tight">
                RM {userProfile.balance?.toFixed(2) || "100.00"}
              </span>
              <button
                onClick={() => navigate("/profile/top_up")}
                className="bg-[#C8102E] hover:bg-red-700 active:scale-95 transition-all text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs"
              >
                + Top Up
              </button>
            </div>
          </div>

          {/* Wallet Pay Card */}
          <button
            onClick={() => navigate("/profile/qr")}
            className="border border-stone-200/90 rounded-2xl px-3 py-2 flex flex-col items-center justify-center bg-white shadow-2xs hover:border-stone-300 hover:shadow-xs active:scale-95 transition-all w-20 h-20"
          >
            {/* Custom Wallet Pay Icon with 4 corner brackets + 4 squares inside */}
            <div className="w-8 h-8 flex items-center justify-center text-stone-800">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 8V6a2 2 0 0 1 2-2h2" strokeLinecap="round" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" strokeLinecap="round" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                <path d="M16 20h2a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                <rect x="8" y="8" width="3" height="3" fill="currentColor" stroke="none" />
                <rect x="13" y="8" width="3" height="3" fill="currentColor" stroke="none" />
                <rect x="8" y="13" width="3" height="3" fill="currentColor" stroke="none" />
                <rect x="13" y="13" width="3" height="3" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-stone-800 mt-0.5 whitespace-nowrap">
              Wallet Pay
            </span>
          </button>
        </div>

        {/* SFC Rewards Card (Chocolate Brown Banner) */}
        <div
          onClick={() => navigate("/rewards")}
          className="bg-[#3C2513] rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
        >
          {/* Top Row: Star + SFC Rewards + View > */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#D4AF37] stroke-[2.2]" />
              <span className="font-bold text-sm sm:text-base text-white">SFC Rewards</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-white/90 font-medium">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Points & Stamps Summary */}
          <div className="flex items-center gap-2 mt-2 text-sm sm:text-base font-bold text-white">
            <span>3,820 points</span>
            <span className="text-white/30 font-normal">|</span>
            <span>6/10 Stamps</span>
          </div>

          {/* 10 Stamp Circles Row */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-4">
            {/* 6 Completed Stamps (Gold circle with coffee bean icon) */}
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C1934D] flex items-center justify-center shadow-xs shrink-0"
              >
                {/* Coffee Bean Graphic */}
                <svg className="w-4 h-4 text-[#3C2513]" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.43-.22-4.57-1.54-5.74-3.53.86-.48 2.02-.95 3.34-1.2 2.05-.39 3.82.26 4.98 1.41-1.04 1.84-2.58 3.12-4.28 3.32zm-1.7-6.04c-1.39.26-2.55.74-3.41 1.23-.58-1.52-.61-3.23.01-4.8 1.09 1.13 2.76 1.81 4.7 1.44 1.54-.29 2.82-1.08 3.73-2.09.77 1.63.78 3.48-.01 5.16-.94-.58-2.22-.97-3.62-.94z"
                    transform="rotate(-25 12 12)"
                  />
                </svg>
              </div>
            ))}

            {/* 4 Inactive Stamps (Dark brown circle with number 7, 8, 9, 10) */}
            {[7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#524131] flex items-center justify-center text-xs font-semibold text-[#D5CFC9] shrink-0"
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Promo Banner (15% OFF at San Francisco Coffee) */}
        <div
          onClick={() => setIsOrderModalOpen(true)}
          className="rounded-3xl overflow-hidden shadow-md cursor-pointer active:scale-[0.99] transition-transform bg-[#180E08] border border-stone-200/50"
        >
          <img
            src="/assets/hero-banner-15.svg"
            alt="Brew-tiful savings with 15% OFF at San Francisco Coffee"
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Two Action Cards Grid: "Order Now" & "Refer Friends" */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Order Now Card */}
          <div
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-14 h-14 flex items-center justify-center shrink-0">
              <img
                src="/assets/order-now-illustration.svg"
                alt="Order Now"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Order
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Now
              </span>
            </div>
          </div>

          {/* Refer Friends Card */}
          <div
            onClick={() => navigate("/profile/invite_friends")}
            className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-14 h-14 flex items-center justify-center shrink-0">
              <img
                src="/assets/refer-friends-illustration.svg"
                alt="Refer Friends"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Refer
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Friends
              </span>
            </div>
          </div>
        </div>

        {/* "Your Past Orders" Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
              Your Past Orders
            </h2>
            <button
              onClick={() => navigate("/orders")}
              className="text-[#C8102E] text-xs font-bold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Single Past Order Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-2xs gap-3">
            {/* Cup & Bag Illustration */}
            <div className="w-14 h-14 flex items-center justify-center shrink-0">
              <img
                src="/assets/past-order-illustration.svg"
                alt="Past Order"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Middle Order Information */}
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] text-stone-400 font-medium">Pickup at</p>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                Suria KLCC
              </h3>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                Lemon Peach Yoghurt Frappe
              </p>
              <p className="text-[11px] text-stone-400">+3 items</p>
            </div>

            {/* Reorder Button */}
            <button
              onClick={handleReorder}
              className="bg-[#C8102E] hover:bg-red-700 active:scale-95 transition-all text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs shrink-0"
            >
              Reorder
            </button>
          </div>
        </div>

        {/* "Our News" Section */}
        <div className="pt-1 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
              Our News
            </h2>
          </div>

          {/* Horizontal Banner Carousel */}
          <div className="overflow-x-auto scrollbar-none flex gap-3 pb-2 -mx-4 px-4 snap-x">
            {/* News Card 1: Bite into Bliss Cookie Offer */}
            <div
              onClick={() => setIsOrderModalOpen(true)}
              className="w-[88%] sm:w-[92%] shrink-0 snap-start rounded-3xl overflow-hidden shadow-md cursor-pointer active:scale-[0.99] transition-transform bg-[#243B1A] border border-stone-200/50"
            >
              <img
                src="/assets/cookie-news-banner.svg"
                alt="Bite into Bliss! Buy ANY cookie for only RM4 with any drinks purchase"
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* News Card 2 (Peeking on right) */}
            <div
              onClick={() => navigate("/menu?category=SF+Signatures")}
              className="w-[88%] sm:w-[92%] shrink-0 snap-start rounded-3xl overflow-hidden shadow-md cursor-pointer active:scale-[0.99] transition-transform bg-gradient-to-br from-[#3C2513] to-[#1E110A] p-5 text-white flex flex-col justify-between border border-stone-200/50"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 text-[#FED7AA] px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Artisan Roasts
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Single-Origin Guatemala Huehuetenango
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  Notes of dark chocolate, sweet orange blossom, and crisp red apple acidity.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-[#FED7AA]">Available now in store</span>
                <span className="text-xs bg-white text-[#3C2513] px-3 py-1 rounded-xl font-bold">
                  Explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Mode Flow Modal (Handles Dine In Table Scan vs Pickup Outlets) */}
      <OrderModeFlowModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
