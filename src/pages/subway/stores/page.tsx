"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder, type Outlet, DEFAULT_OUTLETS } from "@/app/context/OrderContext";
import { cn } from "@/lib/utils";
import {
  Clock,
  Phone,
  Search,
  X,
  Navigation,
  Heart,
  ChevronRight,
  Store,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const STATES = ["All", "Kuala Lumpur", "Selangor", "Penang", "Johor"];

export default function SFStoresPage() {
  const navigate = useNavigate();
  const { selectedOutlet, setSelectedOutlet } = useOrder();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [favoriteStoreIds, setFavoriteStoreIds] = useState<number[]>([1]);
  const [activeStoreDetail, setActiveStoreDetail] = useState<Outlet | null>(null);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteStoreIds((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        toast.info("Removed from favorite stores");
        return prev.filter((item) => item !== id);
      } else {
        toast.success("Added to favorite stores!");
        return [...prev, id];
      }
    });
  };

  const filtered = useMemo(() => {
    let list = DEFAULT_OUTLETS;

    if (selectedState !== "All") {
      if (selectedState === "Kuala Lumpur") {
        list = list.filter((o) => o.address.includes("KL") || o.address.includes("Kuala Lumpur") || o.address.includes("Brickfields") || o.address.includes("Bangsar"));
      } else if (selectedState === "Selangor") {
        list = list.filter((o) => o.address.includes("Selangor") || o.address.includes("Petaling") || o.address.includes("Bandar Utama"));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, selectedState]);

  const handleSelectStore = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    toast.success(`Selected ${outlet.name} for your order!`);
    navigate("/menu");
  };

  const openNavigationApp = (outlet: Outlet, app: "google" | "waze") => {
    const query = encodeURIComponent(`San Francisco Coffee ${outlet.name} ${outlet.address}`);
    if (app === "waze") {
      window.open(`https://waze.com/ul?q=${query}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] overflow-hidden relative">
      {/* Header Bar */}
      <header className="bg-white px-5 pt-4 pb-3 border-b border-stone-200/80 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Find a Store
          </h1>

          {/* State Filter Pill Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-stone-200 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700">
            <span className="text-stone-400 text-[11px]">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-stone-900 font-bold focus:outline-hidden cursor-pointer"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar with Location Pin */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search store name, street, or mall..."
            className="w-full bg-[#FAF8F5] text-stone-800 placeholder:text-stone-400 text-xs pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200/90 focus:outline-hidden focus:ring-2 focus:ring-[#BA1C24]/30 focus:border-[#BA1C24] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 w-5 h-5 rounded-full flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Stores List Container with suppressed scrollbars */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 scrollbar-none">
        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span className="font-semibold">
            Showing {filtered.length} {filtered.length === 1 ? "store" : "stores"} near you
          </span>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Stores Open
          </span>
        </div>

        {/* Store Cards matching screenshot */}
        {filtered.length > 0 ? (
          filtered.map((outlet) => {
            const isCurrent = selectedOutlet.id === outlet.id;
            const isFav = favoriteStoreIds.includes(outlet.id);

            return (
              <div
                key={outlet.id}
                onClick={() => setActiveStoreDetail(outlet)}
                className={cn(
                  "bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 active:scale-[0.99] relative",
                  isCurrent
                    ? "border-[#BA1C24] ring-1 ring-[#BA1C24]/20"
                    : "border-stone-200/90 hover:border-stone-300"
                )}
              >
                {/* Top Row: Store Name + Distance + Heart */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                      {outlet.name}
                    </h3>
                    <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                      {outlet.distance || "1.0 km"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(outlet.id, e)}
                    aria-label="Toggle Favorite"
                    className="text-stone-300 hover:text-[#BA1C24] transition-colors p-1"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-all",
                        isFav
                          ? "fill-[#BA1C24] text-[#BA1C24]"
                          : "text-stone-300 hover:text-[#BA1C24]"
                      )}
                    />
                  </button>
                </div>

                {/* Subtitle: Open 10.00 am - 10.00 pm | +603-8966 2547 */}
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium">Open {outlet.hours}</span>
                  <span className="text-stone-300">|</span>
                  <a
                    href={`tel:${outlet.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-stone-600 hover:text-[#BA1C24] font-medium"
                  >
                    {outlet.phone}
                  </a>
                </div>

                {/* Address Line */}
                <p className="text-xs text-stone-600 leading-snug">
                  {outlet.address}
                </p>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openNavigationApp(outlet, "google");
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200/60 flex items-center gap-1 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-stone-500" />
                      <span>Directions</span>
                    </button>

                    <a
                      href={`tel:${outlet.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200/60 flex items-center gap-1 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Call</span>
                    </a>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStore(outlet);
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1",
                      isCurrent
                        ? "bg-stone-900 text-white"
                        : "bg-[#BA1C24] hover:bg-[#A3161D] text-white active:scale-95"
                    )}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <span>Order Here</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center mx-auto text-xl">
              🏪
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">No stores found</h4>
              <p className="text-[11px] text-stone-500 mt-1">
                Try searching for another neighborhood, mall, or state.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("All");
              }}
              className="text-xs font-bold text-[#BA1C24] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* Store Detail Bottom Sheet Modal */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeStoreDetail && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStoreDetail(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Open Now
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {activeStoreDetail.distance}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900 mt-1">
                  {activeStoreDetail.name}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  {activeStoreDetail.address}
                </p>
              </div>

              {/* Operating Hours & Phone */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-[#BA1C24]" />
                  <span className="font-semibold">{activeStoreDetail.hours} (Daily)</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#BA1C24]" />
                  <a href={`tel:${activeStoreDetail.phone}`} className="font-semibold hover:underline">
                    {activeStoreDetail.phone}
                  </a>
                </div>
              </div>

              {/* Store Amenities */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 mb-2">Store Features & Amenities</h4>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {["☕ Handcrafted Brews", "🥐 Fresh Bakery", "⚡ Free High-Speed Wi-Fi", "🔌 Power Plugs", "🛵 Mobile Pickup", "🪑 Dine-in Seating"].map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Open in Navigation Apps */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openNavigationApp(activeStoreDetail, "google")}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Maps</span>
                  </button>
                  <button
                    onClick={() => openNavigationApp(activeStoreDetail, "waze")}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Waze</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleSelectStore(activeStoreDetail);
                    setActiveStoreDetail(null);
                  }}
                  className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  <span>Start Order at This Store</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
