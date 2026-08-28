"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Smartphone,
  Clock,
  Search,
  X,
  Navigation,
  MapPin,
  Check,
} from "lucide-react";
import { useOrder, type Outlet, DEFAULT_OUTLETS } from "@/app/context/OrderContext";

interface OutletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOutlet?: (outlet: Outlet) => void;
  title?: string;
}

export default function SelectOutletSheet({
  isOpen,
  onClose,
  onSelectOutlet,
  title = "Select Store",
}: OutletSheetProps) {
  const { selectedOutlet, setSelectedOutlet } = useOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [outlets, setOutlets] = useState<Outlet[]>(DEFAULT_OUTLETS);

  const filteredOutlets = useMemo(() => {
    if (!searchQuery.trim()) return outlets;
    const q = searchQuery.toLowerCase();
    return outlets.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }, [outlets, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    if (onSelectOutlet) {
      onSelectOutlet(outlet);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center animate-in fade-in duration-200">
      <div className="w-full sm:max-w-[430px] bg-white h-full flex flex-col overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-stone-800 font-semibold text-sm hover:text-[#BA1C24]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{title}</span>
          </button>
          <span className="text-xs font-bold text-[#BA1C24] bg-[#FFF0EB] px-2.5 py-1 rounded-full">
            {filteredOutlets.length} Stores Available
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by store name, mall or location..."
              className="w-full bg-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#BA1C24] placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Store List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {filteredOutlets.map((outlet) => {
            const isSelected = selectedOutlet.id === outlet.id;
            return (
              <div
                key={outlet.id}
                onClick={() => handleSelect(outlet)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer relative",
                  isSelected
                    ? "bg-[#FFF0EB] border-[#BA1C24] shadow-xs"
                    : "bg-white border-stone-200 hover:border-stone-300 shadow-2xs"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        isSelected ? "bg-[#BA1C24] text-white" : "bg-stone-100 text-stone-600"
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900">
                          {outlet.name}
                        </h4>
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded-sm">
                          Open
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                        {outlet.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {outlet.hours}
                        </span>
                        <span className="font-semibold text-stone-700">
                          {outlet.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#BA1C24] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    {outlet.phone}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(outlet);
                    }}
                    className={cn(
                      "text-[11px] font-bold px-3 py-1 rounded-lg transition-all",
                      isSelected
                        ? "bg-[#BA1C24] text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    )}
                  >
                    {isSelected ? "Selected" : "Select Store"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
