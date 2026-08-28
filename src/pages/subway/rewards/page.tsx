"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  History,
  QrCode,
  X,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useOrder, type Voucher } from "@/app/context/OrderContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type MainTab = "my_rewards" | "stamps" | "redeem";
type VoucherFilter = "active" | "past";

interface RedeemableReward {
  id: string;
  title: string;
  categoryBadge: string;
  categorySub: string;
  points: number;
  expiryDate: string;
  imageType: "frappe" | "cake" | "beverage" | "merchandise";
  discountType: "drink" | "food" | "discount";
  description: string;
}

const REDEEMABLE_REWARDS: RedeemableReward[] = [
  {
    id: "red-frappe",
    title: "Regular Frappe Drinks",
    categoryBadge: "FRISCO FRAPPE'",
    categorySub: "300pts",
    points: 300,
    expiryDate: "30 Nov 2024",
    imageType: "frappe",
    discountType: "drink",
    description: "Enjoy 1 complimentary Regular Frisco Frappe of your choice (Lemon Peach, Mocha, Caramel, or Hazelnut).",
  },
  {
    id: "red-cake",
    title: "Cake",
    categoryBadge: "CAKE",
    categorySub: "350pts",
    points: 350,
    expiryDate: "30 Nov 2024",
    imageType: "cake",
    discountType: "food",
    description: "Indulge in 1 slice of handcrafted artisan cake from our bakery display.",
  },
  {
    id: "red-bev",
    title: "Regular Hot/Iced Beverage",
    categoryBadge: "HANDCRAFTED BEVERAGE",
    categorySub: "250pts",
    points: 250,
    expiryDate: "30 Nov 2024",
    imageType: "beverage",
    discountType: "drink",
    description: "Redeem any Regular hot or iced signature handcrafted coffee or tea beverage.",
  },
  {
    id: "red-mug",
    title: "SF Series Mugs",
    categoryBadge: "SF SERIES MUG",
    categorySub: "3,500pts",
    points: 3500,
    expiryDate: "30 Nov 2024",
    imageType: "merchandise",
    discountType: "discount",
    description: "Exclusive collectible ceramic San Francisco Coffee signature series mug.",
  },
];

const FREE_DRINKS_LIST = [
  {
    id: "fd-1",
    name: "Espresso",
    subtitle: "Handcrafted Double Shot",
    iconColor: "from-amber-700 to-amber-950",
    image: "/menuImages/espresso.svg",
    bgPattern: "bg-amber-900",
  },
  {
    id: "fd-2",
    name: "Caffè Americano",
    subtitle: "Hot or Iced Rich Espresso",
    iconColor: "from-stone-700 to-stone-900",
    image: "/menuImages/caffe-americano.svg",
    bgPattern: "bg-stone-800",
  },
  {
    id: "fd-3",
    name: "Caffè Latte",
    subtitle: "Smooth Steamed Fresh Milk",
    iconColor: "from-amber-600 to-amber-800",
    image: "/menuImages/caffe-latte.svg",
    bgPattern: "bg-amber-700",
  },
  {
    id: "fd-4",
    name: "Iced Spanish Latte",
    subtitle: "Sweet Condensed Milk & Espresso",
    iconColor: "from-orange-600 to-amber-800",
    image: "/menuImages/iced-spanish-latte.svg",
    bgPattern: "bg-orange-800",
  },
  {
    id: "fd-5",
    name: "Matcha Latte",
    subtitle: "Uji Japanese Green Tea",
    iconColor: "from-emerald-700 to-emerald-900",
    image: "/menuImages/matcha-latte.svg",
    bgPattern: "bg-emerald-800",
  },
  {
    id: "fd-6",
    name: "SF Iced Lemon Tea",
    subtitle: "Refreshing Ceylon Citrus Blend",
    iconColor: "from-amber-500 to-orange-700",
    image: "/menuImages/iced-lemon-tea.svg",
    bgPattern: "bg-amber-600",
  },
];

// Custom Coffee Bean SVG Icon
function CoffeeBeanIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "w-4 h-4"}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09.28.2.56.34.82 1.34 2.51 3.91 4.14 6.78 4.14.77 0 1.51-.12 2.22-.33-.55 3.01-2.92 5.09-2.55 5.09zm5.79-6.14c-.09-.28-.2-.56-.34-.82-1.34-2.51-3.91-4.14-6.78-4.14-.77 0-1.51.12-2.22.33.55-3.01 2.92-5.09 2.55-5.09 3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79z" />
    </svg>
  );
}

export default function SFCRewardsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as MainTab) || "my_rewards";

  const {
    userProfile,
    vouchers,
    redeemPointsForVoucher,
    claimStampReward,
    applyPromoCode,
  } = useOrder();

  const [activeTab, setActiveTab] = useState<MainTab>(initialTab);
  const [voucherFilter, setVoucherFilter] = useState<VoucherFilter>("active");

  // Selected Voucher Modal
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Selected Reward for Redeem Confirmation
  const [rewardToRedeem, setRewardToRedeem] = useState<RedeemableReward | null>(null);

  // Free Drink Detail Modal
  const [selectedFreeDrink, setSelectedFreeDrink] = useState<typeof FREE_DRINKS_LIST[0] | null>(null);

  // Points / Stamps History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const activeVouchers = vouchers.filter((v) => v.status === "active");
  const pastVouchers = vouchers.filter((v) => v.status === "used" || v.status === "expired");

  const handleApplyVoucher = (voucher: Voucher) => {
    applyPromoCode(voucher.code);
    toast.success(`${voucher.title} voucher activated and applied!`);
    setSelectedVoucher(null);
    navigate("/menu");
  };

  const handleConfirmRedeem = () => {
    if (!rewardToRedeem) return;

    if (userProfile.points < rewardToRedeem.points) {
      toast.error(`Insufficient points! You need ${rewardToRedeem.points} points.`);
      return;
    }

    const success = redeemPointsForVoucher({
      title: rewardToRedeem.title,
      categoryBadge: rewardToRedeem.categoryBadge,
      categorySub: rewardToRedeem.categorySub,
      points: rewardToRedeem.points,
      discountType: rewardToRedeem.discountType,
    });

    if (success) {
      toast.success(`Successfully redeemed ${rewardToRedeem.title}! Check "My Rewards".`);
      setRewardToRedeem(null);
      setActiveTab("my_rewards");
      setVoucherFilter("active");
    } else {
      toast.error("Unable to redeem voucher at this moment.");
    }
  };

  const handleClaimStamps = () => {
    if (userProfile.stamps < 10) {
      toast.info(`You have ${userProfile.stamps}/10 stamps. Collect ${10 - userProfile.stamps} more to unlock a free drink!`);
      return;
    }

    const success = claimStampReward();
    if (success) {
      toast.success("Congratulations! 1 Free Drink Voucher added to My Rewards!");
      setActiveTab("my_rewards");
      setVoucherFilter("active");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="bg-white px-5 pt-4 pb-3 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            SFC Rewards
          </h1>

          <button
            onClick={() => setShowHistoryModal(true)}
            aria-label="Rewards History"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all flex items-center justify-center text-stone-700"
          >
            <History className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* 3 Top Tabs: My Rewards | Stamps | Redeem */}
        <div className="flex items-center justify-between mt-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab("my_rewards")}
            className={cn(
              "flex-1 pb-2.5 text-xs font-bold transition-all relative text-center",
              activeTab === "my_rewards"
                ? "text-[#BA1C24]"
                : "text-stone-400 hover:text-stone-700"
            )}
          >
            My Rewards
            {activeTab === "my_rewards" && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#BA1C24] rounded-full"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("stamps")}
            className={cn(
              "flex-1 pb-2.5 text-xs font-bold transition-all relative text-center",
              activeTab === "stamps"
                ? "text-[#BA1C24]"
                : "text-stone-400 hover:text-stone-700"
            )}
          >
            Stamps
            {activeTab === "stamps" && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#BA1C24] rounded-full"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("redeem")}
            className={cn(
              "flex-1 pb-2.5 text-xs font-bold transition-all relative text-center",
              activeTab === "redeem"
                ? "text-[#BA1C24]"
                : "text-stone-400 hover:text-stone-700"
            )}
          >
            Redeem
            {activeTab === "redeem" && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#BA1C24] rounded-full"
              />
            )}
          </button>
        </div>
      </header>

      {/* Main Tab Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-none">
        {/* ========================================================= */}
        {/* TAB 1: MY REWARDS (Active vs Past Vouchers) */}
        {/* ========================================================= */}
        {activeTab === "my_rewards" && (
          <div className="space-y-4">
            {/* Sub-toggle Pill Switcher */}
            <div className="bg-[#EFEBE6] p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setVoucherFilter("active")}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center",
                  voucherFilter === "active"
                    ? "bg-[#BA1C24] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                Active Voucher
              </button>
              <button
                onClick={() => setVoucherFilter("past")}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center",
                  voucherFilter === "past"
                    ? "bg-[#BA1C24] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                Past Voucher
              </button>
            </div>

            {/* List Heading */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-sm font-bold text-stone-900">
                {voucherFilter === "active"
                  ? `Active Vouchers (${activeVouchers.length})`
                  : `Past Vouchers (${pastVouchers.length})`}
              </h2>
              {voucherFilter === "active" && (
                <button
                  onClick={() => setActiveTab("redeem")}
                  className="text-xs font-bold text-[#BA1C24] hover:underline flex items-center gap-1"
                >
                  Get More <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vouchers List */}
            <div className="space-y-3">
              {voucherFilter === "active" ? (
                activeVouchers.length > 0 ? (
                  activeVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      onClick={() => setSelectedVoucher(voucher)}
                      className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                    >
                      {/* Left Badge with category tag & point tag */}
                      <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-[#BA1C24] to-[#911218] text-white p-1.5 flex flex-col justify-between items-center text-center shrink-0 shadow-xs relative overflow-hidden">
                        <span className="text-[7.5px] font-extrabold uppercase tracking-tight leading-tight line-clamp-1">
                          {voucher.categoryBadge}
                        </span>

                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                          {voucher.discountType === "food" ? "🍰" : "🥤"}
                        </div>

                        <div className="w-full flex items-center justify-between text-[7px] font-black border-t border-white/20 pt-0.5">
                          <span className="text-[#FED7AA]">{voucher.categorySub}</span>
                          <span className="bg-white text-[#BA1C24] px-1 rounded-xs font-black">
                            SF
                          </span>
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-stone-900 leading-snug">
                          {voucher.title}
                        </h3>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Expires {voucher.expiryDate}
                        </p>
                        <p className="text-[9px] text-stone-400 mt-0.5">
                          T&C Apply
                        </p>
                      </div>

                      {/* Right Red Chevron */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#BA1C24] shrink-0">
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center mx-auto text-xl">
                      🎟️
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">No active vouchers</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Use your reward points to redeem handcrafted drinks and treats!
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("redeem")}
                      className="bg-[#BA1C24] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                    >
                      Redeem Vouchers
                    </button>
                  </div>
                )
              ) : (
                /* Past Vouchers List */
                pastVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="bg-white border border-stone-200/80 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-3 opacity-80"
                  >
                    {/* Left Muted Badge */}
                    <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-[#BA1C24]/80 to-[#911218]/80 text-white p-1.5 flex flex-col justify-between items-center text-center shrink-0">
                      <span className="text-[7.5px] font-extrabold uppercase tracking-tight leading-tight line-clamp-1">
                        {voucher.categoryBadge}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        {voucher.discountType === "food" ? "🍰" : "🥤"}
                      </div>
                      <div className="w-full flex items-center justify-between text-[7px] font-black border-t border-white/20 pt-0.5">
                        <span className="text-[#FED7AA]">{voucher.categorySub}</span>
                        <span className="bg-white text-[#BA1C24] px-1 rounded-xs font-black">
                          SF
                        </span>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-stone-800 leading-snug">
                        {voucher.title}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-1">
                        {voucher.usedDate || voucher.expiryDate}
                      </p>
                    </div>

                    {/* Right Status Badge */}
                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-1 rounded-md",
                          voucher.status === "used"
                            ? "text-stone-600 bg-stone-100"
                            : "text-stone-400 bg-stone-100"
                        )}
                      >
                        {voucher.status === "used" ? "Used" : "Expired"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STAMPS (Stamp Card + Free Drink List) */}
        {/* ========================================================= */}
        {activeTab === "stamps" && (
          <div className="space-y-4">
            {/* Deep Chocolate Brown Stamp Card */}
            <div className="bg-[#382618] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
              {/* Top Row: Stamp Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-wide text-white/90">
                  Stamp Card
                </span>
                <span className="text-xs font-bold text-[#E7C79A]">
                  {userProfile.stamps} / 10 Collected
                </span>
              </div>

              {/* 10 Stamps Grid (2 Rows of 5) */}
              <div className="grid grid-cols-5 gap-2.5 my-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isEarned = num <= userProfile.stamps;
                  return (
                    <div
                      key={num}
                      className={cn(
                        "aspect-square rounded-full flex items-center justify-center transition-all",
                        isEarned
                          ? "bg-[#C49A6C] text-[#382618] shadow-inner shadow-black/30 ring-2 ring-[#E7C79A]/60 scale-100"
                          : "bg-[#27190F] border border-white/10 text-white/40"
                      )}
                    >
                      {isEarned ? (
                        <CoffeeBeanIcon className="w-5 h-5 fill-[#382618]" />
                      ) : (
                        <span className="text-xs font-bold font-sans">{num}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress feedback */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-[#E7C79A]/90">
                  {userProfile.stamps >= 10
                    ? "🎉 Card complete! Claim your free drink below."
                    : `${10 - userProfile.stamps} stamps until your next reward`}
                </span>
                {userProfile.stamps >= 10 && (
                  <button
                    onClick={handleClaimStamps}
                    className="bg-[#BA1C24] hover:bg-[#A3161D] text-white font-bold px-3 py-1 rounded-full text-xs shadow-sm"
                  >
                    Claim Reward
                  </button>
                )}
              </div>
            </div>

            {/* Motivational Headline Banner */}
            <div className="text-center py-1">
              <h3 className="text-lg font-bold font-serif text-stone-900 tracking-tight">
                {userProfile.stamps >= 10
                  ? "Your Free Drink is Ready to Claim!"
                  : `Collect ${10 - userProfile.stamps} more for a FREE drink!`}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1">
                Stamp will reflect within 5 mins
              </p>
            </div>

            {/* Terms & Conditions Card */}
            <div className="bg-[#FAF3E9] border border-[#EEDFCB] rounded-2xl p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-1">
                Terms & Conditions
              </h4>
              <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside leading-relaxed">
                <li>
                  Drinks purchased must be at normal price. Not valid for any other sets, promotions and offers.
                </li>
                <li>
                  Completed stamp cards can be redeemed for any standard regular drink in the Free Drink List.
                </li>
              </ul>
            </div>

            {/* Free Drink List Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold font-serif text-stone-900">
                Free Drink List
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {FREE_DRINKS_LIST.map((drink) => (
                  <button
                    key={drink.id}
                    onClick={() => setSelectedFreeDrink(drink)}
                    className="bg-white border border-stone-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-md hover:border-[#BA1C24] transition-all group active:scale-95"
                  >
                    {/* Soft Cream Circular Container with Drink Art */}
                    <div className="w-16 h-16 rounded-full bg-[#FAF5F0] border border-stone-200/60 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-12 h-12 object-contain drop-shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-stone-900 leading-tight">
                      {drink.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REDEEM (Points Gauge & Rewards Catalog) */}
        {/* ========================================================= */}
        {activeTab === "redeem" && (
          <div className="space-y-4">
            {/* Big Circular Points Display */}
            <div className="flex justify-center pt-2">
              <div className="w-40 h-40 rounded-full border-4 border-stone-200/90 bg-white flex flex-col items-center justify-center shadow-sm relative">
                <span className="text-3xl font-extrabold font-serif text-stone-900 tracking-tight">
                  {userProfile.points.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-stone-500 mt-0.5">
                  Points
                </span>
              </div>
            </div>

            {/* Turn Your Points Into Rewards Headline */}
            <div className="text-center px-4 space-y-1.5">
              <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
                Turn Your Points Into Rewards
              </h2>
              <p className="text-xs text-stone-500 max-w-[320px] mx-auto leading-relaxed">
                Earn points with every purchase, then use your points to redeem exclusive vouchers!
              </p>
            </div>

            {/* Redeem Section Header */}
            <div className="pt-2">
              <h3 className="text-base font-bold font-serif text-stone-900 mb-3">
                Redeem
              </h3>

              {/* List of Redeemable Voucher Cards */}
              <div className="space-y-3">
                {REDEEMABLE_REWARDS.map((reward) => {
                  const canAfford = userProfile.points >= reward.points;

                  return (
                    <div
                      key={reward.id}
                      onClick={() => setRewardToRedeem(reward)}
                      className={cn(
                        "bg-white border rounded-2xl p-3 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]",
                        canAfford
                          ? "border-stone-200/90 hover:border-[#BA1C24] hover:shadow-md"
                          : "border-stone-200 opacity-75"
                      )}
                    >
                      {/* Left Badge */}
                      <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-[#BA1C24] to-[#911218] text-white p-1.5 flex flex-col justify-between items-center text-center shrink-0 shadow-xs">
                        <span className="text-[7.5px] font-extrabold uppercase tracking-tight leading-tight line-clamp-1">
                          {reward.categoryBadge}
                        </span>

                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                          {reward.imageType === "cake" ? "🍰" : reward.imageType === "merchandise" ? "☕" : "🥤"}
                        </div>

                        <div className="w-full flex items-center justify-between text-[7px] font-black border-t border-white/20 pt-0.5">
                          <span className="text-[#FED7AA]">{reward.categorySub}</span>
                          <span className="bg-white text-[#BA1C24] px-1 rounded-xs font-black">
                            SF
                          </span>
                        </div>
                      </div>

                      {/* Middle Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {reward.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Expires {reward.expiryDate}
                        </p>
                        <p className="text-[11px] font-bold text-[#BA1C24] mt-0.5">
                          {reward.points.toLocaleString()} Pts
                        </p>
                      </div>

                      {/* Right Chevron */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#BA1C24] shrink-0">
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Selected Voucher Detail / Barcode Modal */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedVoucher && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] font-bold bg-[#FFF0EB] text-[#BA1C24] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {selectedVoucher.categoryBadge}
                </span>
                <h3 className="text-lg font-bold font-serif text-stone-900 mt-2">
                  {selectedVoucher.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Valid until {selectedVoucher.expiryDate}
                </p>
              </div>

              {/* Barcode / QR Section */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center space-y-2">
                <div className="w-36 h-36 bg-white border border-stone-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-2xs">
                  <QrCode className="w-28 h-28 text-stone-800" />
                </div>
                <div className="font-mono text-sm font-bold text-stone-700 tracking-wider">
                  {selectedVoucher.code}
                </div>
                <p className="text-[10px] text-stone-400">
                  Scan at San Francisco Coffee counter before payment
                </p>
              </div>

              {/* Terms */}
              <div className="text-xs text-stone-600 bg-stone-50 rounded-xl p-3 space-y-1">
                <p className="font-bold text-stone-800">Terms & Conditions:</p>
                <p className="text-[11px] leading-relaxed text-stone-500">
                  {selectedVoucher.terms || "Valid at all San Francisco Coffee outlets in Malaysia. Cannot be combined with other ongoing promotions."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleApplyVoucher(selectedVoucher)}
                  className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Apply to Online Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-2xl text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: Confirm Redeem Reward with Points */}
      {/* ========================================================= */}
      <AnimatePresence>
        {rewardToRedeem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setRewardToRedeem(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <div className="w-12 h-12 rounded-full bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center mx-auto text-xl shadow-xs">
                  🎁
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900 mt-2">
                  Redeem {rewardToRedeem.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {rewardToRedeem.description}
                </p>
              </div>

              {/* Point Cost Breakdown */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Your Current Balance</span>
                  <span className="font-bold text-stone-800">
                    {userProfile.points.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Points Required</span>
                  <span className="font-bold text-[#BA1C24]">
                    -{rewardToRedeem.points.toLocaleString()} pts
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-700">Remaining Balance</span>
                  <span className="text-emerald-700">
                    {(userProfile.points - rewardToRedeem.points).toLocaleString()} pts
                  </span>
                </div>
              </div>

              {/* Confirm / Cancel */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setRewardToRedeem(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-2xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  disabled={userProfile.points < rewardToRedeem.points}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs font-bold shadow-md transition-all",
                    userProfile.points >= rewardToRedeem.points
                      ? "bg-[#BA1C24] hover:bg-[#A3161D] text-white active:scale-95"
                      : "bg-stone-300 text-stone-500 cursor-not-allowed"
                  )}
                >
                  Confirm Redeem
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: Free Drink Detail Modal */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedFreeDrink && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedFreeDrink(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <div className="w-20 h-20 rounded-full bg-[#FAF5F0] border border-stone-200 mx-auto flex items-center justify-center p-3 mb-2 shadow-xs">
                  <img
                    src={selectedFreeDrink.image}
                    alt={selectedFreeDrink.name}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Stamp Card Eligible
                </span>
                <h3 className="text-lg font-bold font-serif text-stone-900 mt-2">
                  {selectedFreeDrink.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedFreeDrink.subtitle}
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-3.5 text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-800">How to claim this drink:</p>
                <p className="text-[11px] leading-relaxed text-stone-500">
                  Collect 10 stamps on your SFC Stamp Card to redeem this drink for free at any store or in the online menu.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedFreeDrink(null);
                  navigate("/menu");
                }}
                className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Order & Collect Stamps
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 4: History Activity Modal */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowHistoryModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#BA1C24]" />
                <h3 className="text-base font-bold font-serif text-stone-900">
                  Rewards Activity History
                </h3>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: "Store Pickup at Suria KLCC",
                    points: "+270 pts",
                    date: "27 Aug 2026, 7:20 PM",
                    type: "earn",
                  },
                  {
                    title: "Dine-in at Pavilion KL",
                    points: "+300 pts",
                    date: "24 Aug 2026, 2:15 PM",
                    type: "earn",
                  },
                  {
                    title: "Redeemed Regular Frappe Drinks",
                    points: "-300 pts",
                    date: "18 Aug 2026, 11:30 AM",
                    type: "redeem",
                  },
                  {
                    title: "Stamp Card 1 Free Drink Claimed",
                    points: "10 Stamps",
                    date: "10 Aug 2026, 4:00 PM",
                    type: "stamp",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">{item.date}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-black",
                        item.type === "earn"
                          ? "text-emerald-600"
                          : item.type === "redeem"
                          ? "text-[#BA1C24]"
                          : "text-amber-700"
                      )}
                    >
                      {item.points}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-2xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
