"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import MenuDetails, { type MenuItem } from "./MenuDetails";
import CartSheet from "./CartSheet";
import OutletSheet from "../home/SelectOutletSheet";
import { DateTimePicker } from "./DateTimePicker";
import { useOrder, type CartItem } from "@/app/context/OrderContext";
import {
  Search,
  X,
  Clock,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Plus,
  MapPin,
  ChevronDown,
  Gift,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

export const MENU_CATEGORIES = [
  "Special Promo",
  "Espresso & Coffee",
  "Chocolate & Tea",
  "Frisco Frappe",
  "Cakes",
  "SF Signatures",
  "Bakery & Savory",
  "Just Roasted Beans",
  "Merchandise",
];

export const CATEGORY_DISPLAY_LABELS: Record<string, string[]> = {
  "Special Promo": ["Special", "Promo"],
  "Espresso & Coffee": ["Espresso &", "Coffee"],
  "Chocolate & Tea": ["Chocolate &", "Tea"],
  "Frisco Frappe": ["Frisco", "Frappe"],
  "Cakes": ["Cakes"],
  "SF Signatures": ["SF", "Signatures"],
  "Bakery & Savory": ["Bakery &", "Savory"],
  "Just Roasted Beans": ["Just Roasted", "Beans"],
  "Merchandise": ["Merchandise"],
};

export const ALL_MENU_ITEMS: Record<string, MenuItem[]> = {
  "Special Promo": [
    {
      id: "sp1",
      name: "Lemon Peach Yoghurt Frappe",
      price: 14.5,
      description: "Espresso, butterscotch, and chocolate chips. Sweet, creamy, an...",
      image: "/menuImages/lemon-peach-frappe.svg",
      category: "Special Promo",
      hasVariations: true,
    },
    {
      id: "sp2",
      name: "Mango Peach Yogurt Frappe",
      price: 11.0,
      description: "Espresso, butterscotch, and chocolate chips. Sweet, creamy, an...",
      image: "/menuImages/mango-peach-frappe.svg",
      category: "Special Promo",
      hasVariations: true,
    },
    {
      id: "sp3",
      name: "Pink Guava Berry Yoghurt Frappe",
      price: 14.5,
      description: "Espresso, butterscotch, and chocolate chips. Sweet, creamy, an...",
      image: "/menuImages/pink-guava-frappe.svg",
      category: "Special Promo",
      hasVariations: true,
    },
    {
      id: "sp4",
      name: "Yuzu Zesty",
      price: 11.0,
      description: "Espresso, butterscotch, and chocolate chips. Sweet, creamy, an...",
      image: "/menuImages/yuzu-zesty.svg",
      category: "Special Promo",
      hasVariations: true,
    },
  ],
  "Espresso & Coffee": [
    {
      id: "ec1",
      name: "Caffe Latte",
      price: 12.0,
      description: "Freshly pulled rich espresso with steamed velvety milk and micro-foam.",
      image: "/menuImages/caffe-latte.svg",
      category: "Espresso & Coffee",
      badge: "Bestseller",
      hasVariations: true,
    },
    {
      id: "ec2",
      name: "Americano",
      price: 9.5,
      description: "Signature double espresso topped with pure hot water for a clean aromatic cup.",
      image: "/menuImages/caffe-latte.svg",
      category: "Espresso & Coffee",
      hasVariations: true,
    },
    {
      id: "ec3",
      name: "Cappuccino",
      price: 12.0,
      description: "Rich espresso topped with deep foamy textured milk and Belgian cocoa dusting.",
      image: "/menuImages/caffe-latte.svg",
      category: "Espresso & Coffee",
      hasVariations: true,
    },
    {
      id: "ec4",
      name: "Caramel Macchiato",
      price: 14.5,
      description: "Vanilla-infused steamed milk marked with espresso and rich caramel drizzle.",
      image: "/menuImages/lemon-peach-frappe.svg",
      category: "Espresso & Coffee",
      badge: "Popular",
      hasVariations: true,
    },
    {
      id: "ec5",
      name: "Caffe Mocha",
      price: 14.0,
      description: "Signature espresso blended with dark Dutch chocolate and steamed milk.",
      image: "/menuImages/caffe-latte.svg",
      category: "Espresso & Coffee",
      hasVariations: true,
    },
  ],
  "Chocolate & Tea": [
    {
      id: "ct1",
      name: "Signature Hot Chocolate",
      price: 13.0,
      description: "Velvety smooth premium Belgian chocolate topped with fluffy marshmallows.",
      image: "/menuImages/caffe-latte.svg",
      category: "Chocolate & Tea",
      badge: "Favorite",
      hasVariations: true,
    },
    {
      id: "ct2",
      name: "Matcha Green Tea Latte",
      price: 14.5,
      description: "Authentic stone-ground Japanese Uji matcha with freshly steamed milk.",
      image: "/menuImages/yuzu-zesty.svg",
      category: "Chocolate & Tea",
      hasVariations: true,
    },
    {
      id: "ct3",
      name: "Earl Grey Supreme Tea",
      price: 10.5,
      description: "Fragrant full-leaf black tea scented with high-grade Italian bergamot oil.",
      image: "/menuImages/caffe-latte.svg",
      category: "Chocolate & Tea",
      hasVariations: true,
    },
  ],
  "Frisco Frappe": [
    {
      id: "ff1",
      name: "Ultimate Mocha Frisco Frappe",
      price: 16.5,
      description: "Blended espresso with rich Dutch cocoa, dark chocolate chips, and whipped cream.",
      image: "/menuImages/lemon-peach-frappe.svg",
      category: "Frisco Frappe",
      badge: "Signature",
      hasVariations: true,
    },
    {
      id: "ff2",
      name: "Caramel Frisco Frappe",
      price: 16.5,
      description: "Creamy butterscotch coffee blend topped with whipped cream and golden caramel.",
      image: "/menuImages/mango-peach-frappe.svg",
      category: "Frisco Frappe",
      hasVariations: true,
    },
    {
      id: "ff3",
      name: "Cookies & Cream Frappe",
      price: 17.0,
      description: "Crunchy Oreo biscuit crumbles blended with sweet cream and chocolate fudge.",
      image: "/menuImages/pink-guava-frappe.svg",
      category: "Frisco Frappe",
      badge: "Kids Love It",
      hasVariations: true,
    },
  ],
  "Cakes": [
    {
      id: "ck1",
      name: "Burnt Cheesecake",
      price: 15.0,
      description: "Rich and creamy Basque-style cheesecake with a delightfully caramelized exterior.",
      image: "/menuImages/burnt-cheesecake.svg",
      category: "Cakes",
      badge: "Bestseller",
      hasVariations: false,
    },
    {
      id: "ck2",
      name: "Classic Red Velvet Cake",
      price: 14.5,
      description: "Layers of velvety ruby sponge with traditional cream cheese frosting.",
      image: "/menuImages/red-velvet-cake.svg",
      category: "Cakes",
      hasVariations: false,
    },
    {
      id: "ck3",
      name: "Belgian Chocolate Fudge Cake",
      price: 15.5,
      description: "Decadent dark chocolate ganache cake for true cocoa lovers.",
      image: "/menuImages/burnt-cheesecake.svg",
      category: "Cakes",
      hasVariations: false,
    },
  ],
  "SF Signatures": [
    {
      id: "sf1",
      name: "San Francisco Cold Brew",
      price: 13.5,
      description: "Steeped for 18 hours with single-origin beans. Ultra-smooth with chocolate notes.",
      image: "/menuImages/lemon-peach-frappe.svg",
      category: "SF Signatures",
      badge: "18h Steeped",
      hasVariations: true,
    },
    {
      id: "sf2",
      name: "Spanish Latte",
      price: 14.5,
      description: "Espresso with textured milk and a touch of sweet condensed milk.",
      image: "/menuImages/caffe-latte.svg",
      category: "SF Signatures",
      badge: "Top Pick",
      hasVariations: true,
    },
  ],
  "Bakery & Savory": [
    {
      id: "bk1",
      name: "Creamy Cheese Bagel",
      price: 14.5,
      description: "Toasted artisan sesame bagel served warm with Philadelphia cream cheese.",
      image: "/menuImages/creamy-cheese-bagel.svg",
      category: "Bakery & Savory",
      badge: "Must Try",
      hasVariations: false,
    },
    {
      id: "bk2",
      name: "Chicken Mushroom Pie",
      price: 13.5,
      description: "Flaky golden puff pastry filled with creamy diced chicken & button mushrooms.",
      image: "/menuImages/creamy-cheese-bagel.svg",
      category: "Bakery & Savory",
      hasVariations: false,
    },
    {
      id: "bk3",
      name: "Butter Croissant",
      price: 8.5,
      description: "Flaky, buttery French croissant baked fresh daily with Lescure butter.",
      image: "/menuImages/creamy-cheese-bagel.svg",
      category: "Bakery & Savory",
      hasVariations: false,
    },
  ],
  "Just Roasted Beans": [
    {
      id: "bn1",
      name: "SF House Blend Whole Beans (250g)",
      price: 38.0,
      description: "Medium-dark roast with tasting notes of milk chocolate, almond, and caramel.",
      image: "/menuImages/caffe-latte.svg",
      category: "Just Roasted Beans",
      hasVariations: false,
    },
    {
      id: "bn2",
      name: "Ethiopia Yirgacheffe Beans (250g)",
      price: 45.0,
      description: "Light roast single origin with vibrant floral jasmine and bergamot citrus notes.",
      image: "/menuImages/caffe-latte.svg",
      category: "Just Roasted Beans",
      hasVariations: false,
    },
  ],
  "Merchandise": [
    {
      id: "mc1",
      name: "SF Crimson Stainless Tumbler (16oz)",
      price: 79.0,
      description: "Double-wall vacuum insulated flask keeps your coffee hot for 12 hours.",
      image: "/menuImages/sf-cup-hero.svg",
      category: "Merchandise",
      badge: "Limited Edition",
      hasVariations: false,
    },
  ],
};

export default function SFMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    diningMode,
    setDiningMode,
    selectedOutlet,
    pickupTime,
    setPickupTime,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    applyPromoCode,
  } = useOrder();

  const [activeCategory, setActiveCategory] = useState("Special Promo");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isOutletSheetOpen, setIsOutletSheetOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Search filter
  const filteredItemsByCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_MENU_ITEMS;

    const result: Record<string, MenuItem[]> = {};
    for (const [cat, items] of Object.entries(ALL_MENU_ITEMS)) {
      const matched = items.filter(
        (it) =>
          it.name.toLowerCase().includes(query) ||
          it.description.toLowerCase().includes(query) ||
          it.category.toLowerCase().includes(query)
      );
      if (matched.length > 0) {
        result[cat] = matched;
      }
    }
    return result;
  }, [searchQuery]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.hasVariations !== false) {
      handleSelectItem(item);
    } else {
      // Add standard item directly
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        category: item.category,
        detailsSummary: item.category,
      };
      addToCart(cartItem);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden relative">
      {/* Top Crimson Header with Two White Cards (matching Image 3) */}
      <div className="bg-[#BA1C24] text-white px-3.5 pt-1 pb-3 space-y-2 shadow-md shrink-0 z-10">
        {/* iOS Status Bar in white */}
        <div className="px-1 pt-1 pb-1 flex items-center justify-between text-white text-xs font-semibold select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-2.5">
              <div className="w-0.5 h-1 bg-white rounded-2xs" />
              <div className="w-0.5 h-1.5 bg-white rounded-2xs" />
              <div className="w-0.5 h-2 bg-white rounded-2xs" />
              <div className="w-0.5 h-2.5 bg-white rounded-2xs" />
            </div>
            <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.5 0 6.7 1.3 9.1 3.5L12 19.3 2.9 11C5.3 8.8 8.5 7.5 12 7.5z"/>
            </svg>
            <div className="w-5 h-2.5 border border-white rounded-[3px] p-0.5 flex items-center">
              <div className="h-full w-full bg-white rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Card 1: Store selector + Segmented Dine In / Pickup toggle */}
        <div className="bg-white text-stone-900 rounded-[22px] px-3.5 py-2.5 flex items-center justify-between shadow-xs">
          <button
            onClick={() => setIsOutletSheetOpen(true)}
            className="flex items-center gap-2.5 text-left max-w-[56%] overflow-hidden"
          >
            {/* Black outline shopping bag icon */}
            <svg
              className="w-5 h-5 text-stone-800 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold truncate text-stone-900">
                  SFC {selectedOutlet.name.replace(/^SFC\s*/, "")}
                </span>
                <ChevronRight className="w-4 h-4 text-[#BA1C24] stroke-[2.5] shrink-0" />
              </div>
              <span className="text-xs text-stone-400 font-normal block truncate mt-0.5">
                {diningMode === "eat-in" ? "Table #10" : `Pickup · ${selectedOutlet.distance || "0.8 km"}`}
              </span>
            </div>
          </button>

          {/* Segmented Dine In / Pickup Toggle matching image.png exactly */}
          <div className="border border-stone-200 rounded-full p-0.5 flex items-center bg-white shrink-0">
            <button
              type="button"
              onClick={() => setDiningMode("to-go")}
              className={cn(
                "text-xs rounded-full transition-all duration-150",
                diningMode === "to-go"
                  ? "bg-[#BA1C24] text-white font-semibold px-3.5 py-1.5 shadow-xs"
                  : "text-stone-400 font-normal px-3 py-1.5 hover:text-stone-700"
              )}
            >
              Pickup
            </button>
            <button
              type="button"
              onClick={() => setDiningMode("eat-in")}
              className={cn(
                "text-xs rounded-full transition-all duration-150",
                diningMode === "eat-in"
                  ? "bg-[#BA1C24] text-white font-semibold px-3.5 py-1.5 shadow-xs"
                  : "text-stone-400 font-normal px-3 py-1.5 hover:text-stone-700"
              )}
            >
              Dine In
            </button>
          </div>
        </div>

        {/* Card 2: Pickup Time Selector */}
        <button
          onClick={() => setIsTimePickerOpen(true)}
          className="w-full bg-white text-stone-900 rounded-[22px] px-3.5 py-3 flex items-center justify-between shadow-xs hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-stone-800 stroke-[1.8] shrink-0" />
            <span className="text-sm font-bold text-stone-900 ml-0.5">
              {pickupTime.includes("(") ? pickupTime.split("(")[0].trim() : pickupTime || "Today, ASAP"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#BA1C24] stroke-[2.5]" />
        </button>
      </div>

      {/* Main Two-Column Layout: Sidebar Categories + Products List */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Categories) */}
        <div className="w-[88px] bg-white border-r border-stone-200/90 overflow-y-auto shrink-0 pb-28 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const lines = CATEGORY_DISPLAY_LABELS[cat] || [cat];
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const el = categoryRefs.current[cat];
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={cn(
                  "w-full text-center py-3.5 px-1.5 transition-all relative flex flex-col items-center justify-center border-b border-stone-100/60",
                  isActive
                    ? "bg-[#FDF2F0] text-[#BA1C24] font-bold border-r-2 border-[#BA1C24]"
                    : "text-stone-400 font-medium hover:text-stone-600"
                )}
              >
                {lines.map((line, idx) => (
                  <span key={idx} className="text-xs leading-tight block">
                    {line}
                  </span>
                ))}
              </button>
            );
          })}
        </div>

        {/* Right Menu Products Feed */}
        <div className="flex-1 bg-white overflow-y-auto p-3.5 pb-28 space-y-3 scrollbar-none">
          {/* Search Bar */}
          <div className="flex items-center gap-2 px-1 py-1">
            <Search className="w-4 h-4 text-[#BA1C24] stroke-[2.4] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, food, desserts..."
              className="w-full bg-transparent text-stone-800 placeholder:text-stone-400 text-xs py-1.5 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voucher Banners Carousel (Image 3) */}
          {!searchQuery && (
            <div className="overflow-x-auto scrollbar-none flex gap-2.5 -mx-3.5 px-3.5 shrink-0 pt-0.5 pb-1">
              {/* Free Drink Voucher 1 */}
              <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 flex items-center justify-between gap-2.5 shrink-0 shadow-2xs w-[215px]">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 text-[#BA1C24] flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M7 6l1.2 13a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L17 6" />
                        <path d="M6 6h12" strokeWidth="2" />
                        <circle cx="12" cy="13" r="2.5" fill="currentColor" />
                        <path d="M12 11.5c-.3.7.3 1.5 0 2.5" stroke="#FFF" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <span className="text-[6.5px] font-black text-[#BA1C24] tracking-tight -mt-0.5">FREE DRINK</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 leading-tight">Free Drink</p>
                    <p className="text-[10px] text-stone-400 mt-0.5 whitespace-nowrap">Valid until 30 Jul 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => applyPromoCode("FREEDRINK")}
                  className="bg-[#BA1C24] text-white text-xs font-semibold px-3 py-1 rounded-xl hover:bg-[#A3161D] shadow-xs active:scale-95 transition-all"
                >
                  Use
                </button>
              </div>

              {/* Free Drink Voucher 2 (peeking) */}
              <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 flex items-center justify-between gap-2.5 shrink-0 shadow-2xs w-[215px]">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 text-[#BA1C24] flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M7 6l1.2 13a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L17 6" />
                        <path d="M6 6h12" strokeWidth="2" />
                        <circle cx="12" cy="13" r="2.5" fill="currentColor" />
                        <path d="M12 11.5c-.3.7.3 1.5 0 2.5" stroke="#FFF" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <span className="text-[6.5px] font-black text-[#BA1C24] tracking-tight -mt-0.5">FREE DRINK</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 leading-tight">Free Drink</p>
                    <p className="text-[10px] text-stone-400 mt-0.5 whitespace-nowrap">Valid until 15 Aug 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => applyPromoCode("FREEDRINK")}
                  className="bg-[#BA1C24] text-white text-xs font-semibold px-3 py-1 rounded-xl hover:bg-[#A3161D] shadow-xs active:scale-95 transition-all"
                >
                  Use
                </button>
              </div>
            </div>
          )}

          {/* Categories & Products */}
          {Object.keys(filteredItemsByCategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-stone-700">No items found</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for "latte", "frappe", or "peach"
              </p>
            </div>
          ) : (
            Object.entries(filteredItemsByCategory).map(([catName, items]) => (
              <div
                key={catName}
                ref={(el) => {
                  categoryRefs.current[catName] = el;
                }}
                className="scroll-mt-4 pt-1"
              >
                {/* Category Header (Serif Red) */}
                <h2 className="font-serif font-bold text-[#BA1C24] text-xl tracking-tight mt-1 mb-2.5">
                  {catName}
                </h2>

                {/* Items List matching Image 3 */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="flex items-center gap-3 py-1 cursor-pointer group"
                    >
                      {/* Square Image with Rounded Corners */}
                      <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={item.image || "/menuImages/lemon-peach-frappe.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-stone-400 leading-tight line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-sm font-bold text-stone-900">
                            RM {item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => handleQuickAdd(e, item)}
                            className="w-6 h-6 rounded-full bg-[#BA1C24] text-white flex items-center justify-center shadow-xs active:scale-90 hover:bg-[#A3161D] transition-all shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Red Cart Basket Button (matching Image 3) */}
      <button
        onClick={() => {
          if (cartCount > 0) {
            navigate("/checkout");
          } else {
            toast.info("Your basket is empty. Select any handcrafted drink to begin!", {
              icon: "☕",
            });
          }
        }}
        className="fixed bottom-20 right-4 z-40 bg-[#BA1C24] text-white w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(186,28,36,0.45)] flex items-center justify-center hover:bg-[#A3161D] active:scale-95 transition-all group"
        title="View Cart & Checkout"
      >
        {/* Wire Shopping Basket Icon with handles and criss-cross mesh matching Image 3 */}
        <svg
          className="w-7 h-7 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Arched handles */}
          <path d="M8 8V5.5a4 4 0 0 1 8 0V8" strokeWidth="2" />
          {/* Rim */}
          <path d="M3.5 8.5h17" strokeWidth="2" />
          {/* Basket body */}
          <path d="M4.5 9l1.6 10.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.5L19.5 9" strokeWidth="1.8" />
          {/* Horizontal mesh */}
          <path d="M5.5 13h13" strokeWidth="1.4" opacity="0.9" />
          <path d="M6.5 17h11" strokeWidth="1.4" opacity="0.9" />
          {/* Vertical mesh */}
          <path d="M9 9v11" strokeWidth="1.4" opacity="0.9" />
          <path d="M12 9v11" strokeWidth="1.4" opacity="0.9" />
          <path d="M15 9v11" strokeWidth="1.4" opacity="0.9" />
        </svg>

        {/* White circle badge with count */}
        <span className="absolute -top-1 -right-0.5 bg-white text-stone-900 font-bold text-xs h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-md border border-stone-200/50">
          {cartCount > 0 ? cartCount : 1}
        </span>
      </button>

      {/* Customization Modal */}
      <MenuDetails
        item={selectedItem}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedItem(null);
        }}
        onAddToCart={(cartItem) => {
          addToCart(cartItem);
        }}
      />

      {/* Select Outlet Sheet */}
      <OutletSheet
        isOpen={isOutletSheetOpen}
        onClose={() => setIsOutletSheetOpen(false)}
      />

      {/* Date Time Picker Modal */}
      <DateTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(time) => setPickupTime(time)}
      />

      {/* Cart Sheet Drawer */}
      <CartSheet
        isOpen={isCartSheetOpen}
        onClose={() => setIsCartSheetOpen(false)}
      />
    </div>
  );
}
