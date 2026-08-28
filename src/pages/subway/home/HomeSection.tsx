"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  MapPin,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  BadgePercent,
  CheckCircle2,
  Coffee,
  ShoppingBag,
  Gift,
  Plus,
} from "lucide-react";
import SelectOutletSheet from "./SelectOutletSheet";

type HomeSectionOption =
  | "ActiveOrderBanner"
  | "OutletSelector"
  | "OrderTypeBtns"
  | "HeroBanner"
  | "CategoryShortcuts"
  | "RecommendedDeal"
  | "ValueDeals";

interface SubwayHomeSectionsProps {
  sections?: HomeSectionOption[];
}

export function SubwayHomeSections({
  sections = [
    "ActiveOrderBanner",
    "OrderTypeBtns",
    "OutletSelector",
    "HeroBanner",
    "CategoryShortcuts",
    "RecommendedDeal",
    "ValueDeals",
  ],
}: SubwayHomeSectionsProps) {
  const navigate = useNavigate();
  const {
    diningMode,
    setDiningMode,
    selectedOutlet,
    activeOrder,
    addToCart,
  } = useOrder();

  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);

  const handleStartOrder = (mode: "eat-in" | "to-go") => {
    setDiningMode(mode);
    navigate(`/menu?orderType=${mode}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    addToCart({
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category,
      detailsSummary: "Regular · Handcrafted Fresh",
    });
    navigate(`/checkout`);
  };

  return (
    <div className="flex flex-col space-y-4 pb-8">
      {/* 1. Active Order Live Tracking Card */}
      {sections.includes("ActiveOrderBanner") && activeOrder && (
        <div className="mx-4 mt-1">
          <div
            onClick={() => navigate("/orders")}
            className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#FED7AA] cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BA1C24]"></span>
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#BA1C24]">
                    Active Order in Progress
                  </p>
                  <h4 className="text-xs font-bold text-stone-900 mt-0.5">
                    Order #{activeOrder.id} · {activeOrder.status === "Ready" ? "Ready for Pickup!" : "Brewing with Care"}
                  </h4>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-[#FFF0EB] text-[#BA1C24] px-2.5 py-1 rounded-full border border-[#FED7AA]">
                Pickup Code: {activeOrder.pickupCode}
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span className="truncate max-w-[200px] text-[11px]">{activeOrder.summary}</span>
              <span className="text-[#BA1C24] font-bold text-xs flex items-center gap-0.5 hover:underline">
                Track Order <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Order Mode Action Tiles (Pickup & Dine In) */}
      {sections.includes("OrderTypeBtns") && (
        <div className="grid grid-cols-2 gap-3 mx-4">
          <button
            onClick={() => handleStartOrder("to-go")}
            className="bg-white hover:bg-[#FFF5F0] border-2 border-[#FED7AA] hover:border-[#BA1C24] transition-all p-3.5 rounded-2xl shadow-xs text-left group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-[#BA1C24]" />
              </div>
              <span className="text-[10px] font-bold bg-[#FED7AA]/60 text-[#8C1017] px-2 py-0.5 rounded-full">
                Fast Pickup
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#BA1C24] transition-colors">
                Pickup Order
              </h3>
              <p className="text-[10px] text-stone-500 mt-0.5">Skip the queue & pick up at counter</p>
            </div>
          </button>

          <button
            onClick={() => handleStartOrder("eat-in")}
            className="bg-white hover:bg-[#FFF5F0] border-2 border-[#FED7AA] hover:border-[#BA1C24] transition-all p-3.5 rounded-2xl shadow-xs text-left group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-[#BA1C24]" />
              </div>
              <span className="text-[10px] font-bold bg-[#FED7AA]/60 text-[#8C1017] px-2 py-0.5 rounded-full">
                Dine-In
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#BA1C24] transition-colors">
                Dine In Table
              </h3>
              <p className="text-[10px] text-stone-500 mt-0.5">Enjoy your coffee fresh in store</p>
            </div>
          </button>
        </div>
      )}

      {/* 3. Outlet Selector Bar */}
      {sections.includes("OutletSelector") && (
        <div className="mx-4">
          <div
            onClick={() => setIsOutletModalOpen(true)}
            className="bg-white border border-stone-200 hover:border-[#FED7AA] rounded-2xl p-3 flex items-center justify-between shadow-2xs cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#BA1C24]" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    {selectedOutlet.name}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                    Open
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block truncate">
                  {selectedOutlet.distance || "1.2 km"} · {selectedOutlet.address}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </div>
        </div>
      )}

      {/* 4. Seasonal Hero Promo Banner */}
      {sections.includes("HeroBanner") && (
        <div className="mx-4">
          <div
            onClick={() => navigate("/menu?category=Special+Promo")}
            className="bg-gradient-to-r from-[#BA1C24] to-[#FF7D54] rounded-2xl p-4 text-white shadow-md cursor-pointer relative overflow-hidden group"
          >
            {/* Background Peach Glow */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/15 blur-lg pointer-events-none" />

            <div className="relative z-10 max-w-[65%]">
              <span className="bg-white/20 text-[#FED7AA] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block mb-1.5">
                Seasonal Sensation
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                Peach Frappe Season is Here!
              </h3>
              <p className="text-[11px] text-white/90 mt-1 leading-snug">
                Sip on Lemon Peach & Mango Peach Yoghurt Frappes with rich espresso swirls.
              </p>
              <button className="mt-3 bg-white text-[#BA1C24] text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 group-hover:bg-[#FFF0EB] transition-colors">
                Order Now <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Hero Image on Right */}
            <div className="absolute right-2 bottom-1 w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/menuImages/lemon-peach-frappe.svg"
                alt="Peach Frappe"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Category Quick Shortcuts */}
      {sections.includes("CategoryShortcuts") && (
        <div className="mx-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-extrabold text-stone-900 tracking-wider uppercase">
              Explore Menu
            </h3>
            <button
              onClick={() => navigate("/menu")}
              className="text-[11px] font-bold text-[#BA1C24] hover:underline flex items-center"
            >
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              {
                name: "Promo",
                image: "/menuImages/lemon-peach-frappe.svg",
                cat: "Special Promo",
              },
              {
                name: "Espresso",
                image: "/menuImages/caffe-latte.svg",
                cat: "Espresso & Coffee",
              },
              {
                name: "Frappes",
                image: "/menuImages/mango-peach-frappe.svg",
                cat: "Frisco Frappe",
              },
              {
                name: "Bakery",
                image: "/menuImages/creamy-cheese-bagel.svg",
                cat: "Bakery & Savory",
              },
            ].map((catItem) => (
              <button
                key={catItem.name}
                onClick={() => navigate(`/menu`)}
                className="bg-white border border-stone-200 hover:border-[#FED7AA] rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFF5F0] flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <img
                    src={catItem.image}
                    alt={catItem.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-[#BA1C24] transition-colors">
                  {catItem.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Barista's Seasonal Recommendations */}
      {sections.includes("RecommendedDeal") && (
        <div className="mx-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-stone-900 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BA1C24]" />
              Barista's Top Picks
            </h3>
            <span className="text-[10px] font-bold text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
              Handcrafted
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: "sp1",
                name: "Lemon Peach Yoghurt Frappe",
                category: "Special Promo",
                price: 14.5,
                desc: "Espresso, lemon zest & velvety peach yoghurt swirl.",
                image: "/menuImages/lemon-peach-frappe.svg",
                badge: "Limited Season",
              },
              {
                id: "bk1",
                name: "Creamy Cheese Bagel",
                category: "Bakery & Savory",
                price: 14.5,
                desc: "Toasted artisan sesame bagel with Philadelphia cream cheese.",
                image: "/menuImages/creamy-cheese-bagel.svg",
                badge: "Must Try",
              },
              {
                id: "ck1",
                name: "Burnt Cheesecake",
                category: "Cakes",
                price: 15.0,
                desc: "Basque-style caramelized cheesecake slice.",
                image: "/menuImages/burnt-cheesecake.svg",
                badge: "Bestseller",
              },
            ].map((deal) => (
              <div
                key={deal.id}
                onClick={() => navigate("/menu")}
                className="bg-white border border-stone-200 hover:border-[#FED7AA] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-xl bg-[#FFF5F0] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#BA1C24] transition-colors truncate">
                      {deal.name}
                    </h4>
                    {deal.badge && (
                      <span className="text-[9px] font-bold bg-[#FFF0EB] text-[#BA1C24] px-1.5 py-0.2 rounded-full shrink-0">
                        {deal.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                    {deal.desc}
                  </p>
                  <p className="text-xs font-extrabold text-[#BA1C24] mt-1.5">
                    RM {deal.price.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleQuickAdd(e, deal)}
                  className="w-7 h-7 rounded-full bg-[#BA1C24] text-white flex items-center justify-center shrink-0 hover:bg-[#A3161D] active:scale-95 shadow-xs"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outlet Selection Sheet */}
      <SelectOutletSheet
        isOpen={isOutletModalOpen}
        onClose={() => setIsOutletModalOpen(false)}
      />
    </div>
  );
}
