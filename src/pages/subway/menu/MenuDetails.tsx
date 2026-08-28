"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, Plus, Minus, Check } from "lucide-react";
import type { CartItem, BeverageCustomizations } from "@/app/context/OrderContext";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  badge?: string;
  hasVariations?: boolean;
}

interface MenuDetailsProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

const SIZE_OPTIONS: { id: "Small" | "Regular" | "Large"; label: string; extraPrice: number }[] = [
  { id: "Small", label: "Small", extraPrice: 0 },
  { id: "Regular", label: "Regular", extraPrice: 0 },
  { id: "Large", label: "Large (+ RM1.50)", extraPrice: 1.5 },
];

const TEMP_OPTIONS: { id: "Iced" | "Hot"; label: string; extraPrice: number }[] = [
  { id: "Iced", label: "Iced (+ RM1.50)", extraPrice: 1.5 },
  { id: "Hot", label: "Hot", extraPrice: 0 },
];

const MILK_OPTIONS: { id: "Fresh Milk" | "Low Fat Milk" | "Soy Milk" | "Oat Milk" | "Coconut Milk"; label: string; extraPrice: number }[] = [
  { id: "Fresh Milk", label: "Fresh Milk", extraPrice: 0 },
  { id: "Low Fat Milk", label: "Low Fat Milk", extraPrice: 0 },
  { id: "Soy Milk", label: "Soy Milk", extraPrice: 0 },
  { id: "Oat Milk", label: "Oat Milk (+ RM1.50)", extraPrice: 1.5 },
  { id: "Coconut Milk", label: "Coconut Milk", extraPrice: 0 },
];

const SWEETNESS_OPTIONS = [
  { id: "Normal Sweet", label: "Normal (100%)" },
  { id: "Less Sweet (50%)", label: "Less Sweet (50%)" },
  { id: "No Added Sugar", label: "No Sugar (0%)" },
];

const TREATS_PAIRING = [
  {
    id: "sp2",
    name: "Mango Peach Yogurt Frappe",
    price: 14.5,
    image: "/menuImages/mango-peach-frappe.svg",
  },
  {
    id: "bk1",
    name: "Creamy Cheese Bagel",
    price: 14.5,
    image: "/menuImages/creamy-cheese-bagel.svg",
  },
  {
    id: "ck1",
    name: "Burnt Cheesecake",
    price: 15.0,
    image: "/menuImages/burnt-cheesecake.svg",
  },
];

export default function MenuDetails({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: MenuDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<"Small" | "Regular" | "Large">("Regular");
  const [temperature, setTemperature] = useState<"Iced" | "Hot">("Iced");
  const [milk, setMilk] = useState<"Fresh Milk" | "Low Fat Milk" | "Soy Milk" | "Oat Milk" | "Coconut Milk">("Fresh Milk");
  const [sweetness, setSweetness] = useState("Less Sweet (50%)");
  const [extraEspressoShots, setExtraEspressoShots] = useState(0);
  const [syrupCaramel, setSyrupCaramel] = useState(0);
  const [syrupHazelnut, setSyrupHazelnut] = useState(0);
  const [syrupVanilla, setSyrupVanilla] = useState(0);
  const [selectedTreats, setSelectedTreats] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  // Reset defaults when opening a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSize("Regular");
      setTemperature(item.category.includes("Frappe") ? "Iced" : "Hot");
      setMilk("Fresh Milk");
      setSweetness("Less Sweet (50%)");
      setExtraEspressoShots(0);
      setSyrupCaramel(0);
      setSyrupHazelnut(0);
      setSyrupVanilla(0);
      setSelectedTreats([]);
      setRemarks("");
    }
  }, [isOpen, item]);

  const isBeverage = Boolean(item?.hasVariations !== false && (
    item?.category === "Special Promo" ||
    item?.category === "Espresso & Coffee" ||
    item?.category === "Chocolate & Tea" ||
    item?.category === "Frisco Frappe" ||
    item?.category === "SF Signatures"
  ));

  // Calculate unit price based on selections
  const unitPrice = useMemo(() => {
    let price = item?.price || 0;
    if (isBeverage) {
      if (size === "Large") price += 1.5;
      if (temperature === "Iced") price += 1.5;
      if (milk === "Oat Milk") price += 1.5;
      price += extraEspressoShots * 2.0;
      price += syrupCaramel * 2.0;
      price += syrupHazelnut * 2.0;
      price += syrupVanilla * 2.0;
    }
    return price;
  }, [item?.price, isBeverage, size, temperature, milk, extraEspressoShots, syrupCaramel, syrupHazelnut, syrupVanilla]);

  if (!isOpen || !item) return null;

  const totalPrice = unitPrice * quantity;
  const totalPriceIncTax = totalPrice * 1.06;

  const toggleTreat = (treatName: string) => {
    setSelectedTreats((prev) =>
      prev.includes(treatName)
        ? prev.filter((t) => t !== treatName)
        : [...prev, treatName]
    );
  };

  const handleAdd = () => {
    const summary = isBeverage
      ? `${size} · ${temperature} · ${milk}${sweetness ? ` · ${sweetness}` : ""}${extraEspressoShots > 0 ? ` · +${extraEspressoShots} Shot` : ""}`
      : item.category;

    const customizations: BeverageCustomizations = {
      size: isBeverage ? size : undefined,
      temperature: isBeverage ? temperature : undefined,
      milk: isBeverage ? milk : undefined,
      sweetness: isBeverage ? sweetness : undefined,
      extraEspressoShots: extraEspressoShots || undefined,
      syrupCaramel: syrupCaramel || undefined,
      syrupHazelnut: syrupHazelnut || undefined,
      syrupVanilla: syrupVanilla || undefined,
      treats: selectedTreats.length > 0 ? selectedTreats : undefined,
      remarks: remarks.trim() || undefined,
    };

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: Number(unitPrice.toFixed(2)),
      quantity,
      image: item.image || "/menuImages/lemon-peach-frappe.svg",
      category: item.category,
      customizations,
      detailsSummary: summary,
      remarks: remarks.trim() || undefined,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center animate-in fade-in duration-200">
      <div className="w-full sm:max-w-[430px] bg-white h-full flex flex-col overflow-hidden relative shadow-2xl">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-stone-100 px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-stone-800 font-semibold text-sm hover:text-[#BA1C24] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
            <span>Customize</span>
          </button>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Hero Image */}
          <div className="w-full bg-[#FFF5F0] p-6 flex justify-center items-center border-b border-stone-100">
            <div className="w-56 h-56 rounded-2xl overflow-hidden flex items-center justify-center p-2">
              <img
                src={item.image || "/menuImages/lemon-peach-frappe.svg"}
                alt={item.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Product Header */}
          <div className="p-4 bg-white border-b border-stone-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-stone-900 leading-snug">
                  {item.name}
                </h1>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {item.description ||
                    "A decadent handcrafted San Francisco specialty balanced perfectly with premium ingredients."}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-extrabold text-[#BA1C24]">
                  RM {item.price.toFixed(2)}
                </span>
                {item.badge && (
                  <span className="block mt-1 text-[10px] font-bold bg-[#FFF0EB] text-[#BA1C24] px-2 py-0.5 rounded-full text-center">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Beverage Customization Options */}
          {isBeverage && (
            <div className="p-4 space-y-6">
              {/* Select Size */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase">
                    Select Size <span className="text-[#BA1C24] font-medium">(Pick 1)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SIZE_OPTIONS.map((opt) => {
                    const isSelected = size === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSize(opt.id)}
                        className={cn(
                          "py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all flex flex-col items-center justify-center gap-0.5",
                          isSelected
                            ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                        )}
                      >
                        <span>{opt.label.split(" ")[0]}</span>
                        {opt.extraPrice > 0 && (
                          <span className="text-[10px] font-normal text-stone-500">
                            +RM{opt.extraPrice.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase">
                    Temperature <span className="text-[#BA1C24] font-medium">(Pick 1)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TEMP_OPTIONS.map((opt) => {
                    const isSelected = temperature === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setTemperature(opt.id)}
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all flex items-center justify-center gap-1.5",
                          isSelected
                            ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold shadow-xs"
                            : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#BA1C24]" />}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Milk Selection */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase">
                    Milk Selection <span className="text-[#BA1C24] font-medium">(Pick 1)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MILK_OPTIONS.map((opt) => {
                    const isSelected = milk === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setMilk(opt.id)}
                        className={cn(
                          "w-full py-2.5 px-3.5 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between",
                          isSelected
                            ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold"
                            : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                        )}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center",
                            isSelected
                              ? "border-[#BA1C24] bg-[#BA1C24]"
                              : "border-stone-300 bg-white"
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase mb-2.5">
                  Sweetness Level
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {SWEETNESS_OPTIONS.map((opt) => {
                    const isSelected = sweetness === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSweetness(opt.id)}
                        className={cn(
                          "py-2 px-1 rounded-xl text-[11px] font-medium border text-center transition-all",
                          isSelected
                            ? "bg-[#FFF0EB] border-[#BA1C24] text-[#BA1C24] font-bold"
                            : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add-on Espresso Shot */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase mb-2.5">
                  Add-on Espresso Shot
                </h3>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-800">Extra Shot</span>
                    <span className="text-xs text-stone-500 ml-1.5">(+RM 2.00)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-1 py-0.5">
                    <button
                      onClick={() => setExtraEspressoShots((prev) => Math.max(0, prev - 1))}
                      disabled={extraEspressoShots === 0}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 disabled:text-stone-300 hover:text-[#BA1C24]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-stone-800">
                      {extraEspressoShots}
                    </span>
                    <button
                      onClick={() => setExtraEspressoShots((prev) => prev + 1)}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add-on Syrups */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase mb-2.5">
                  Add-on Syrup (+RM 2.00 each)
                </h3>
                <div className="space-y-2 bg-stone-50 border border-stone-200 rounded-xl p-3">
                  {/* Caramel */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-800">Caramel Syrup</span>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-1 py-0.5">
                      <button
                        onClick={() => setSyrupCaramel((prev) => Math.max(0, prev - 1))}
                        disabled={syrupCaramel === 0}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 disabled:text-stone-300 hover:text-[#BA1C24]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800">{syrupCaramel}</span>
                      <button
                        onClick={() => setSyrupCaramel((prev) => prev + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Hazelnut */}
                  <div className="flex items-center justify-between border-t border-stone-200/60 pt-2">
                    <span className="text-xs font-medium text-stone-800">Hazelnut Syrup</span>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-1 py-0.5">
                      <button
                        onClick={() => setSyrupHazelnut((prev) => Math.max(0, prev - 1))}
                        disabled={syrupHazelnut === 0}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 disabled:text-stone-300 hover:text-[#BA1C24]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800">{syrupHazelnut}</span>
                      <button
                        onClick={() => setSyrupHazelnut((prev) => prev + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Vanilla */}
                  <div className="flex items-center justify-between border-t border-stone-200/60 pt-2">
                    <span className="text-xs font-medium text-stone-800">Vanilla Syrup</span>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-1 py-0.5">
                      <button
                        onClick={() => setSyrupVanilla((prev) => Math.max(0, prev - 1))}
                        disabled={syrupVanilla === 0}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 disabled:text-stone-300 hover:text-[#BA1C24]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800">{syrupVanilla}</span>
                      <button
                        onClick={() => setSyrupVanilla((prev) => prev + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pair it with your favourite treats! */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase mb-2.5">
                  Pair it with your favourite treats!
                </h3>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  {TREATS_PAIRING.map((treat) => {
                    const isAdded = selectedTreats.includes(treat.name);
                    return (
                      <div
                        key={treat.id}
                        onClick={() => toggleTreat(treat.name)}
                        className={cn(
                          "min-w-[130px] w-[130px] p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shrink-0",
                          isAdded
                            ? "bg-[#FFF0EB] border-[#BA1C24] shadow-xs"
                            : "bg-white border-stone-200 hover:border-stone-300"
                        )}
                      >
                        <div className="w-full h-20 bg-stone-50 rounded-lg flex items-center justify-center p-1 mb-2">
                          <img
                            src={treat.image}
                            alt={treat.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-stone-900 line-clamp-2 leading-tight">
                          {treat.name}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                          <span className="text-[11px] font-extrabold text-[#BA1C24]">
                            RM{treat.price.toFixed(2)}
                          </span>
                          <span
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                              isAdded
                                ? "bg-[#BA1C24] text-white"
                                : "bg-stone-100 text-stone-600"
                            )}
                          >
                            {isAdded ? "✓" : "+"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Remarks Section */}
          <div className="p-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-900 tracking-wide uppercase mb-2">
              Remarks To Barista
            </h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Feel free to share your thoughts or remarks for the barista here! (Subject to store's discretion)."
              rows={3}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#BA1C24] bg-stone-50/50 resize-none placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 w-full sm:max-w-[430px] bg-white border-t border-stone-200 p-3.5 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-2 py-1.5 border border-stone-200">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-stone-700 disabled:opacity-40 hover:text-[#BA1C24]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-stone-700 hover:text-[#BA1C24]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Price & Add to Cart Button */}
            <button
              onClick={handleAdd}
              className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md shadow-red-900/10 flex items-center justify-between transition-all active:scale-[0.98]"
            >
              <span>Add to Cart</span>
              <span className="bg-black/15 px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wide">
                RM {totalPriceIncTax.toFixed(2)} (inc. tax)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
