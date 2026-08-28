"use client";

import { useState } from "react";
import { X, Check, Plus, Gift, Flame, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CartItem } from "@/app/context/OrderContext";

interface FreeDrinkOption {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  originalPrice: number;
  badge?: string;
}

const FREE_DRINK_CATALOG: FreeDrinkOption[] = [
  {
    id: "fd_latte",
    name: "Caffe Latte",
    category: "Espresso & Coffee",
    description: "Freshly pulled signature espresso with steamed velvety milk and micro-foam.",
    image: "/menuImages/caffe-latte.svg",
    originalPrice: 12.0,
    badge: "Bestseller",
  },
  {
    id: "fd_peach",
    name: "Lemon Peach Yoghurt Frappe",
    category: "Special Promo",
    description: "Espresso, zesty lemon puree, and velvety peach yoghurt swirl. Sweet, refreshing, and creamy.",
    image: "/menuImages/lemon-peach-frappe.svg",
    originalPrice: 14.5,
    badge: "Seasonal Top Pick",
  },
  {
    id: "fd_coldbrew",
    name: "San Francisco Cold Brew",
    category: "SF Signatures",
    description: "Steeped for 18 hours with single-origin beans. Ultra-smooth with chocolate notes.",
    image: "/menuImages/lemon-peach-frappe.svg",
    originalPrice: 13.5,
    badge: "18h Steeped",
  },
  {
    id: "fd_americano",
    name: "Americano",
    category: "Espresso & Coffee",
    description: "Signature double espresso topped with hot water for a rich aromatic cup.",
    image: "/menuImages/caffe-latte.svg",
    originalPrice: 9.5,
  },
  {
    id: "fd_cappuccino",
    name: "Cappuccino",
    category: "Espresso & Coffee",
    description: "Rich espresso with deep textured milk foam and Belgian cocoa dusting.",
    image: "/menuImages/caffe-latte.svg",
    originalPrice: 12.0,
  },
  {
    id: "fd_mocha",
    name: "Ultimate Mocha Frisco Frappe",
    category: "Frisco Frappe",
    description: "Blended espresso with Dutch cocoa, dark chocolate chips, and whipped cream.",
    image: "/menuImages/mango-peach-frappe.svg",
    originalPrice: 16.5,
    badge: "Signature",
  },
  {
    id: "fd_choc",
    name: "Signature Hot Chocolate",
    category: "Chocolate & Tea",
    description: "Velvety smooth premium Belgian chocolate topped with fluffy marshmallows.",
    image: "/menuImages/caffe-latte.svg",
    originalPrice: 13.0,
  },
  {
    id: "fd_matcha",
    name: "Matcha Green Tea Latte",
    category: "Chocolate & Tea",
    description: "Authentic stone-ground Japanese Uji matcha with freshly steamed milk.",
    image: "/menuImages/yuzu-zesty.svg",
    originalPrice: 14.5,
  },
];

interface AddFreeDrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFreeDrink: (item: CartItem) => void;
}

export default function AddFreeDrinkModal({
  isOpen,
  onClose,
  onAddFreeDrink,
}: AddFreeDrinkModalProps) {
  const [selectedDrink, setSelectedDrink] = useState<FreeDrinkOption>(
    FREE_DRINK_CATALOG[0]
  );
  const [size, setSize] = useState<"Regular" | "Large">("Regular");
  const [temperature, setTemperature] = useState<"Iced" | "Hot">("Iced");
  const [milk, setMilk] = useState<
    "Fresh Milk" | "Low Fat Milk" | "Soy Milk" | "Oat Milk"
  >("Fresh Milk");
  const [sweetness, setSweetness] = useState<
    "Normal Sweet" | "Less Sweet (50%)" | "No Added Sugar"
  >("Less Sweet (50%)");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const details = [
      size,
      temperature,
      milk,
      sweetness,
    ].join(" · ");

    const freeCartItem: CartItem = {
      id: `free-drink-${Date.now()}`,
      menuItemId: selectedDrink.id,
      name: selectedDrink.name,
      price: 0.0, // 100% Free
      quantity: 1,
      image: selectedDrink.image,
      category: selectedDrink.category,
      detailsSummary: `${details} · [FREE REWARD]`,
      remarks: remarks ? `${remarks} (Free Drink Reward)` : "Free Drink Reward Voucher",
      customizations: {
        size,
        temperature,
        milk,
        sweetness,
        remarks,
      },
    };

    onAddFreeDrink(freeCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-200">
        {/* Header with Crimson & Peach Branding */}
        <div className="bg-[#BA1C24] text-white p-4 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#FFF0EB] text-[#BA1C24] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Gift className="w-3 h-3" />
              SFC Reward Voucher
            </span>
            <span className="text-[#FED7AA] text-[11px] font-bold">
              100% Complimentary
            </span>
          </div>

          <h2 className="text-base font-black text-white">
            Claim Your Free Handcrafted Drink
          </h2>
          <p className="text-xs text-[#FED7AA]/90 mt-0.5">
            Select any beverage below and customize it for RM 0.00
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Drink Selector Section */}
          <div>
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block mb-2.5">
              1. Choose Your Beverage ({FREE_DRINK_CATALOG.length} Available)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {FREE_DRINK_CATALOG.map((drink) => {
                const isSelected = selectedDrink.id === drink.id;
                return (
                  <div
                    key={drink.id}
                    onClick={() => setSelectedDrink(drink)}
                    className={cn(
                      "border rounded-2xl p-2.5 cursor-pointer transition-all flex flex-col justify-between relative text-left group",
                      isSelected
                        ? "bg-[#FFF0EB] border-[#BA1C24] shadow-xs ring-1 ring-[#BA1C24]"
                        : "bg-white border-stone-200 hover:border-[#FED7AA]"
                    )}
                  >
                    {/* Badge */}
                    {drink.badge && (
                      <span className="absolute top-2 right-2 text-[8px] font-bold bg-[#BA1C24] text-white px-1.5 py-0.5 rounded-full">
                        {drink.badge}
                      </span>
                    )}

                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 mb-2 border border-stone-100">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#BA1C24] leading-tight">
                        {drink.name}
                      </h4>
                      <p className="text-[9px] text-stone-400 mt-0.5 line-clamp-1">
                        {drink.category}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs font-black text-[#BA1C24]">
                          RM 0.00
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          RM {drink.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#BA1C24] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customization 1: Temperature */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              2. Temperature
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemperature("Iced")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                  temperature === "Iced"
                    ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] shadow-2xs"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                )}
              >
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Iced (Cold)</span>
              </button>
              <button
                type="button"
                onClick={() => setTemperature("Hot")}
                className={cn(
                  "py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                  temperature === "Hot"
                    ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] shadow-2xs"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                )}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Hot</span>
              </button>
            </div>
          </div>

          {/* Customization 2: Size */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              3. Cup Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Regular", "Large"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all",
                    size === s
                      ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] shadow-2xs"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                  )}
                >
                  <span>{s}</span>
                  <span className="text-[10px] text-[#BA1C24] font-bold">
                    Free
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization 3: Milk Choice */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              4. Milk Choice
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "Fresh Milk",
                  "Oat Milk",
                  "Soy Milk",
                  "Low Fat Milk",
                ] as const
              ).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMilk(m)}
                  className={cn(
                    "py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all",
                    milk === m
                      ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold shadow-2xs"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                  )}
                >
                  <span className="truncate">{m}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    +RM 0
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization 4: Sweetness */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              5. Sweetness Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  "Normal Sweet",
                  "Less Sweet (50%)",
                  "No Added Sugar",
                ] as const
              ).map((sw) => (
                <button
                  key={sw}
                  type="button"
                  onClick={() => setSweetness(sw)}
                  className={cn(
                    "py-2 px-2 rounded-xl border text-[11px] font-semibold text-center transition-all",
                    sweetness === sw
                      ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold shadow-2xs"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                  )}
                >
                  {sw === "Normal Sweet"
                    ? "Normal"
                    : sw === "Less Sweet (50%)"
                    ? "Less Sweet"
                    : "No Sugar"}
                </button>
              ))}
            </div>
          </div>

          {/* Special Barista Remarks */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 uppercase tracking-wider block">
              Special Instructions
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Extra ice, cinnamon sprinkle..."
              className="w-full bg-stone-50 text-stone-800 text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#FED7AA]"
            />
          </div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0 shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Reward Total
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[#BA1C24]">
                RM 0.00
              </span>
              <span className="text-xs text-stone-400 line-through">
                RM {selectedDrink.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3.5 px-5 rounded-xl font-bold text-xs shadow-md shadow-red-900/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Free Drink to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
