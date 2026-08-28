"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  Bell,
  Star,
  ChevronRight,
  Sparkles,
  User,
  QrCode,
  RotateCcw,
  Plus,
} from "lucide-react";
import OrderModeFlowModal from "@/components/order/OrderModeFlowModal";
import NewStoreOpeningModal from "@/components/auth/NewStoreOpeningModal";
import WelcomeFirstOrderModal from "@/components/auth/WelcomeFirstOrderModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { toast } from "sonner";

export default function SFHomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userProfile, addToCart, isAuthenticated, setIsAuthenticated } = useOrder();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showStoreOpeningModal, setShowStoreOpeningModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Check query param for welcome reward modal or onboarding state
  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShowWelcomeModal(true);
      // Remove welcome param from URL without page reload
      searchParams.delete("welcome");
      setSearchParams(searchParams, { replace: true });
    }

    const completed = localStorage.getItem("sfc_onboarding_completed");
    if (!completed) {
      setShowOnboarding(true);
    }
  }, [searchParams, setSearchParams]);

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

  const handleQuickAddRecommended = (item: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => {
    addToCart({
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category,
    });
    toast.success(`Added ${item.name} to your cart!`);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto pb-28 relative scrollbar-none bg-[#FAF8F5] text-stone-900">
      {/* Onboarding Flow Modal */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />

      {/* New Store Opening Notification Modal */}
      <NewStoreOpeningModal
        isOpen={showStoreOpeningModal}
        onClose={() => setShowStoreOpeningModal(false)}
      />

      {/* Post-Signup Welcome Gift Modal */}
      <WelcomeFirstOrderModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      {/* Top App Bar (Header matching reference design) */}
      <header className="px-4 py-3 flex items-center justify-between pt-3 bg-[#FAF8F5]">
        {/* User Greeting Header */}
        <div>
          <span className="text-xs text-stone-500 font-medium block leading-none">
            Hey,
          </span>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 mt-0.5 leading-tight">
            {isAuthenticated ? userProfile.name || "Jennifer" : "Stranger :)"}
          </h1>
        </div>

        {/* Action Icons Group */}
        <div className="flex items-center gap-1.5">
          {/* Reviewer State Switcher Pill */}
          <div className="flex items-center bg-stone-200/80 rounded-full p-0.5 text-[10px] mr-1">
            <button
              onClick={() => setIsAuthenticated(false)}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                !isAuthenticated
                  ? "bg-[#BA1C24] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => setIsAuthenticated(true)}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                isAuthenticated
                  ? "bg-[#BA1C24] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Member
            </button>
          </div>

          {/* Replay Onboarding Button (for testing) */}
          <button
            onClick={() => setShowOnboarding(true)}
            title="Replay Onboarding Splash & Permissions"
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Wallet QR Scanner Icon */}
          <button
            onClick={() => navigate("/profile/qr_scan")}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-stone-50 active:scale-95 transition-all"
            title="Scan QR Code"
          >
            <QrCode className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowStoreOpeningModal(true)}
            className="relative w-9 h-9 rounded-full bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-stone-50 active:scale-95 transition-all"
            title="Store Announcements"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BA1C24] rounded-full ring-2 ring-white" />
          </button>

          {/* Profile / Account Icon */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate("/profile");
              } else {
                navigate("/auth/login");
              }
            }}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-stone-50 active:scale-95 transition-all"
            title="Account Profile"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* Main Feed Content */}
      <div className="px-4 space-y-4 pt-1">
        {/* SFC Rewards / Stats Banner Card */}
        <div
          onClick={() => navigate("/rewards")}
          className="bg-[#3C2513] rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
        >
          {/* Top Row: Star + SFC Rewards + View > */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#D4AF37] stroke-[2.2]" />
              <span className="font-bold text-sm sm:text-base text-white">
                SFC Rewards
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-white/90 font-medium">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Points, Stamps & Rewards Stat Summary Row */}
          <div className="flex items-center justify-between mt-3 text-xs sm:text-sm font-bold text-white bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xs">
            <div className="text-center">
              <span className="text-base sm:text-lg block text-amber-300">
                {isAuthenticated ? (userProfile.points || 3820).toLocaleString() : "3,820"}
              </span>
              <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                Points
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/20" />
            <div className="text-center">
              <span className="text-base sm:text-lg block text-white">
                {isAuthenticated ? userProfile.stamps || 6 : 6}/10
              </span>
              <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                Stamps
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/20" />
            <div className="text-center">
              <span className="text-base sm:text-lg block text-white">
                1
              </span>
              <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                Rewards
              </span>
            </div>
          </div>

          {/* 10 Stamp Circles Indicator */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-3.5">
            {Array.from({ length: 10 }).map((_, idx) => {
              const stampNum = idx + 1;
              const currentStamps = isAuthenticated ? userProfile.stamps || 6 : 6;
              const isCompleted = stampNum <= currentStamps;

              return isCompleted ? (
                <div
                  key={stampNum}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C1934D] flex items-center justify-center shadow-xs shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-[#3C2513]" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.43-.22-4.57-1.54-5.74-3.53.86-.48 2.02-.95 3.34-1.2 2.05-.39 3.82.26 4.98 1.41-1.04 1.84-2.58 3.12-4.28 3.32zm-1.7-6.04c-1.39.26-2.55.74-3.41 1.23-.58-1.52-.61-3.23.01-4.8 1.09 1.13 2.76 1.81 4.7 1.44 1.54-.29 2.82-1.08 3.73-2.09.77 1.63.78 3.48-.01 5.16-.94-.58-2.22-.97-3.62-.94z"
                      transform="rotate(-25 12 12)"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  key={stampNum}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#524131] flex items-center justify-center text-[11px] font-semibold text-[#D5CFC9] shrink-0"
                >
                  {stampNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Promo Banner (15% OFF at San Francisco Coffee) */}
        <div
          onClick={() => setIsOrderModalOpen(true)}
          className="rounded-3xl overflow-hidden shadow-md cursor-pointer active:scale-[0.99] transition-transform bg-[#180E08] border border-stone-200/50 relative"
        >
          <img
            src="/assets/hero-banner-15.svg"
            alt="Brew-tiful savings with 15% OFF at San Francisco Coffee"
            className="w-full h-auto object-cover block"
          />
          <div className="absolute top-3 right-3 bg-[#BA1C24] text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>15% OFF</span>
          </div>
        </div>

        {/* Order Mode Grid (Pickup vs Dine In) */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Pickup Option Card */}
          <div
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] flex items-center justify-center shrink-0 text-[#BA1C24]">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" strokeLinecap="round" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" strokeLinecap="round" />
                <line x1="6" y1="2" x2="6" y2="4" strokeLinecap="round" />
                <line x1="10" y1="2" x2="10" y2="4" strokeLinecap="round" />
                <line x1="14" y1="2" x2="14" y2="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Pickup
              </span>
              <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
                Takeaway
              </span>
            </div>
          </div>

          {/* Dine In Option Card */}
          <div
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0EB] flex items-center justify-center shrink-0 text-[#BA1C24]">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="10" width="18" height="4" rx="1" />
                <line x1="6" y1="14" x2="6" y2="21" strokeLinecap="round" />
                <line x1="18" y1="14" x2="18" y2="21" strokeLinecap="round" />
                <path d="M8 6h8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                Dine In
              </span>
              <span className="text-[10px] text-stone-500 font-medium block mt-0.5">
                Table Order
              </span>
            </div>
          </div>
        </div>

        {/* Member-Only Section: Your Past Orders */}
        {isAuthenticated && (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                Your Past Orders
              </h2>
              <button
                onClick={() => navigate("/orders")}
                className="text-[#BA1C24] text-xs font-bold hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Past Order Card */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs gap-3">
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <img
                  src="/assets/past-order-illustration.svg"
                  alt="Past Order"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] text-stone-400 font-medium">Pickup at</p>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                  Suria KLCC
                </h3>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  Lemon Peach Yoghurt Frappe + 3 items
                </p>
              </div>

              <button
                onClick={handleReorder}
                className="bg-[#BA1C24] hover:bg-[#9E141B] active:scale-95 transition-all text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs shrink-0"
              >
                Reorder
              </button>
            </div>
          </div>
        )}

        {/* Recommended For You Section */}
        <div className="pt-1 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
              Recommended For You
            </h2>
            <button
              onClick={() => navigate("/menu")}
              className="text-[#BA1C24] text-xs font-bold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Drinks Carousel */}
          <div className="overflow-x-auto scrollbar-none flex gap-3.5 pb-2 -mx-4 px-4 snap-x">
            {[
              {
                id: "rec1",
                name: "Pink Guava Berry Yoghurt Frappe",
                price: 15.5,
                image: "/menuImages/pink-guava-frappe.svg",
                category: "Special Promo",
              },
              {
                id: "rec2",
                name: "Lemon Peach Yoghurt Frappe",
                price: 14.5,
                image: "/menuImages/lemon-peach-frappe.svg",
                category: "Special Promo",
              },
              {
                id: "rec3",
                name: "Mango Peach Yoghurt Frappe",
                price: 14.5,
                image: "/menuImages/mango-peach-frappe.svg",
                category: "Special Promo",
              },
              {
                id: "rec4",
                name: "Yuzu Zesty Sparkler",
                price: 13.5,
                image: "/menuImages/yuzu-zesty.svg",
                category: "Refreshers",
              },
            ].map((drink) => (
              <div
                key={drink.id}
                className="w-40 shrink-0 snap-start bg-white border border-stone-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all"
              >
                <div
                  onClick={() => navigate(`/menu?item=${drink.id}`)}
                  className="cursor-pointer"
                >
                  <div className="w-full h-28 bg-[#FFF5F2] rounded-xl mb-2 flex items-center justify-center p-2">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-full h-full object-contain drop-shadow-xs"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-tight min-h-[2rem]">
                    {drink.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                  <span className="font-bold text-xs text-[#BA1C24]">
                    RM {drink.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleQuickAddRecommended(drink)}
                    className="w-7 h-7 rounded-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-90 text-white flex items-center justify-center shadow-2xs transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Mode Flow Modal */}
      <OrderModeFlowModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
