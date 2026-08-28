"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { ArrowLeft, Search, X, MapPin } from "lucide-react";
import { useOrder, type Outlet, DEFAULT_OUTLETS } from "@/app/context/OrderContext";
import { DateTimePicker } from "@/pages/subway/menu/DateTimePicker";

interface OpenStreetMapOutletPickerProps {
  onBack?: () => void;
  onSelectOutlet?: (outlet: Outlet) => void;
  isModal?: boolean;
}

export const OpenStreetMapOutletPicker: React.FC<OpenStreetMapOutletPickerProps> = ({
  onBack,
  onSelectOutlet,
}) => {
  const { selectedOutlet, setSelectedOutlet } = useOrder();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeOutlet, setActiveOutlet] = useState<Outlet>(selectedOutlet || DEFAULT_OUTLETS[0]);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Filter outlets based on search query
  const filteredOutlets = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_OUTLETS;
    const q = searchQuery.toLowerCase();
    return DEFAULT_OUTLETS.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Create custom marker icons
  const createSelectedIcon = () =>
    L.divIcon({
      className: "custom-sf-selected-marker",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
          <!-- Outer Circle Badge -->
          <div style="
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            background-color: #BA1C24;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(186, 28, 36, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <!-- White Inner Square with SF COFFEE Logo -->
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 6px;
              background-color: #FFFFFF;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 1px;
            ">
              <span style="color: #BA1C24; font-weight: 900; font-size: 9px; line-height: 1.1; font-family: sans-serif;">SF</span>
              <span style="color: #BA1C24; font-weight: 800; font-size: 5px; line-height: 1; letter-spacing: -0.5px; font-family: sans-serif;">COFFEE</span>
            </div>
          </div>
          <!-- Red Pointer Tail -->
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid #BA1C24;
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [0, 0],
    });

  const createNormalIcon = () =>
    L.divIcon({
      className: "custom-sf-normal-marker",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
          <!-- White Circle Badge with Red Outline -->
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            border-radius: 9999px;
            background-color: #FFFFFF;
            border: 2px solid #BA1C24;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <span style="color: #BA1C24; font-weight: 900; font-size: 8px; line-height: 1.1; font-family: sans-serif;">SF</span>
              <span style="color: #BA1C24; font-weight: 800; font-size: 5px; line-height: 1; letter-spacing: -0.4px; font-family: sans-serif;">COFFEE</span>
            </div>
          </div>
          <!-- White Pointer Tail -->
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #BA1C24;
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [0, 0],
    });

  const createUserLocationIcon = () =>
    L.divIcon({
      className: "custom-user-location-marker",
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <div style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background-color: rgba(59, 130, 246, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
          <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background-color: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [0, 0],
    });

  // Initialize Leaflet OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = activeOutlet?.lat || 3.1579;
      const initialLng = activeOutlet?.lng || 101.7118;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager tiles (OpenStreetMap styled in soft light/green tones matching Image 1)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Add User Location Marker (near KLCC/Bukit Bintang as shown in Image 1)
      const userLat = 3.1530;
      const userLng = 101.7085;
      L.marker([userLat, userLng], {
        icon: createUserLocationIcon(),
        interactive: false,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Force layout recalculation once loaded
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // Keep map alive unless unmounted
    };
  }, []);

  // Update Outlet Markers when activeOutlet changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Render markers for all default outlets
    DEFAULT_OUTLETS.forEach((outlet) => {
      if (!outlet.lat || !outlet.lng) return;

      const isSelected = outlet.id === activeOutlet.id;
      const marker = L.marker([outlet.lat, outlet.lng], {
        icon: isSelected ? createSelectedIcon() : createNormalIcon(),
        zIndexOffset: isSelected ? 1000 : 100,
      }).addTo(map);

      marker.on("click", () => {
        handleSelectOutlet(outlet);
      });

      markersRef.current[outlet.id] = marker;
    });
  }, [activeOutlet]);

  const handleSelectOutlet = (outlet: Outlet) => {
    setActiveOutlet(outlet);
    setSelectedOutlet(outlet);

    // Pan map smoothly to selected outlet
    if (mapInstanceRef.current && outlet.lat && outlet.lng) {
      mapInstanceRef.current.flyTo([outlet.lat, outlet.lng], 15, {
        duration: 0.8,
      });
    }

    // Scroll store card into view
    const cardEl = cardRefs.current[outlet.id];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleOpenDateTimePicker = (outlet: Outlet) => {
    setActiveOutlet(outlet);
    setSelectedOutlet(outlet);
    setIsTimePickerOpen(true);
  };

  const openGoogleMaps = (outlet: Outlet, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`San Francisco Coffee ${outlet.name} ${outlet.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const openWaze = (outlet: Outlet, e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`San Francisco Coffee ${outlet.name} ${outlet.address}`);
    window.open(`https://waze.com/ul?q=${query}`, "_blank");
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] overflow-hidden relative">
      {/* Navigation Bar Header (matching Image 1) */}
      <div className="bg-white px-4 py-3 flex items-center relative shrink-0 z-30 border-b border-stone-100">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-stone-900 hover:text-stone-600 active:scale-95 transition-all"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="flex-1 text-center font-serif font-bold text-base sm:text-lg text-stone-900 pr-4">
          Choose your restaurant
        </h1>
      </div>

      {/* Search Bar (matching Image 1) */}
      <div className="bg-white px-4 pb-3.5 shrink-0 z-30">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#BA1C24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, store name..."
            className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-[#BA1C24] focus:border-[#BA1C24] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* OpenStreetMap Container (matching Image 1) */}
      <div className="relative w-full h-[250px] sm:h-[280px] shrink-0 bg-stone-100 overflow-hidden z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Recenter Pin */}
        <button
          onClick={() => {
            if (mapInstanceRef.current && activeOutlet.lat && activeOutlet.lng) {
              mapInstanceRef.current.flyTo([activeOutlet.lat, activeOutlet.lng], 15);
            }
          }}
          className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-xs p-2 rounded-xl shadow-md border border-stone-200/80 text-stone-700 hover:text-[#BA1C24] active:scale-95 transition-all"
          title="Center on selected store"
        >
          <MapPin className="w-4 h-4 text-[#BA1C24]" />
        </button>
      </div>

      {/* Nearby Stores Section (matching Image 1) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
          Nearby Stores
        </h2>

        {filteredOutlets.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center text-stone-500 text-xs">
            No stores found matching &quot;{searchQuery}&quot;. Try another search term.
          </div>
        ) : (
          filteredOutlets.map((outlet) => {
            const isSelected = activeOutlet.id === outlet.id;

            return (
              <div
                key={outlet.id}
                ref={(el) => (cardRefs.current[outlet.id] = el)}
                onClick={() => handleSelectOutlet(outlet)}
                className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white border-2 border-[#BA1C24] shadow-sm"
                    : "bg-white border border-stone-200 hover:border-stone-300"
                }`}
              >
                {/* Store Name & Distance Row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-tight">
                    {outlet.name}
                  </h3>
                  <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                    {outlet.distance}
                  </span>
                </div>

                {/* Status Badge & Hours Row */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      outlet.isOpen
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {outlet.isOpen ? "Open" : "Close"}
                  </span>
                  <span className="text-xs text-stone-500 font-normal">
                    {outlet.hours} | {outlet.phone}
                  </span>
                </div>

                {/* Address Row */}
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                  {outlet.address}
                </p>

                {/* Action Buttons Row matching Image 1 */}
                <div className="flex items-center gap-2 mt-3.5 pt-1">
                  {/* Google Maps Button */}
                  <button
                    type="button"
                    onClick={(e) => openGoogleMaps(outlet, e)}
                    className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-2xs hover:bg-stone-50 active:scale-95 transition-all shrink-0"
                    title="Open in Google Maps"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill="#EA4335"
                      />
                      <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
                      <path
                        d="M12 2C9.5 2 7.3 3.3 6.1 5.3L9.6 8.8C10.2 8.3 11 8 12 8c.3 0 .7.1 1 .2l2.6-2.6C14.5 3.3 13.3 2 12 2z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 14c-.8 0-1.5-.3-2.1-.8L6.3 16.8C7.8 18.7 9.8 20.2 12 22v-8z"
                        fill="#34A853"
                      />
                      <path
                        d="M15.6 5.6L13 8.2c.6.5 1 1.2 1 2 0 .5-.1 1-.4 1.4l3.1 3.1C17.6 13.2 18 11.2 18 9c0-1.3-.3-2.5-.9-3.4z"
                        fill="#FBBC04"
                      />
                    </svg>
                  </button>

                  {/* Waze Button */}
                  <button
                    type="button"
                    onClick={(e) => openWaze(outlet, e)}
                    className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-2xs hover:bg-stone-50 active:scale-95 transition-all shrink-0"
                    title="Open in Waze"
                  >
                    <svg className="w-5 h-5 text-[#33CCFF]" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19.5 13.5c0-4.14-3.36-7.5-7.5-7.5S4.5 9.36 4.5 13.5c0 1.2.3 2.3.8 3.3l-.8 2.2a1 1 0 0 0 1.2 1.3l2.4-.7c1.1.6 2.4.9 3.9.9 4.14 0 7.5-3.36 7.5-7.5z"
                        fill="#33CCFF"
                        stroke="#2388AB"
                        strokeWidth="1.2"
                      />
                      <circle cx="9.5" cy="12.5" r="1.5" fill="#1E293B" />
                      <circle cx="14.5" cy="12.5" r="1.5" fill="#1E293B" />
                      <path
                        d="M9.5 15.5c.8.8 1.8 1.2 2.5 1.2s1.7-.4 2.5-1.2"
                        stroke="#1E293B"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <circle cx="7" cy="19.5" r="1.5" fill="#1E293B" />
                      <circle cx="16" cy="19.5" r="1.5" fill="#1E293B" />
                    </svg>
                  </button>

                  {/* Select this outlet Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDateTimePicker(outlet);
                      if (onSelectOutlet) {
                        onSelectOutlet(outlet);
                      }
                    }}
                    className="flex-1 ml-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all text-center tracking-tight"
                  >
                    Select this outlet
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DateTimePicker Bottom Sheet */}
      <DateTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        outletName={activeOutlet?.name}
        outletHours={activeOutlet?.hours}
        onConfirm={() => {
          setIsTimePickerOpen(false);
          if (onSelectOutlet) {
            onSelectOutlet(activeOutlet);
          }
        }}
      />
    </div>
  );
};
