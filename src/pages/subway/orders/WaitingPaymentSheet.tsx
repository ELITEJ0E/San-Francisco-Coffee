"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, Phone, Clock, MapPin } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { MapProvider } from "@/app/map/MapProvider";

interface WaitingPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  outlet: {
    name: string;
    address: string;
    hours: string;
    phone: string;
    distance?: string;
    lat?: number;
    lng?: number;
  };
  totalAmount: number;
  onPayNow: () => void;
}

const defaultMapContainerStyle = {
  width: "100%",
  height: "180px",
};

const defaultMapZoom = 15;

const defaultMapOptions = {
  zoomControl: false,
  tilt: 0,
  gestureHandling: "greedy",
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  scaleControl: false,
  rotateControl: false,
  clickableIcons: false,
  disableDefaultUI: true,
  draggable: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const MapSkeleton = () => (
  <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
      <div className="w-24 h-3 bg-gray-300 rounded animate-pulse" />
      <div className="w-32 h-2 bg-gray-300 rounded animate-pulse" />
    </div>
  </div>
);

export default function WaitingPaymentSheet({
  isOpen,
  onClose,
  outlet,
  totalAmount,
  onPayNow,
}: WaitingPaymentSheetProps) {
  const theme = useTheme();
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: outlet.lat ?? 3.1487,
    lng: outlet.lng ?? 101.6158,
  });
  const closingRef = useRef(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);

  const getFormattedDateTime = () => {
    const date = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${dayName} ${day} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleClose = useCallback(() => {
    if (closingRef.current) return;

    closingRef.current = true;
    setIsClosing(true);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mountTimeoutRef.current) {
      clearTimeout(mountTimeoutRef.current);
      mountTimeoutRef.current = null;
    }

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      closingRef.current = false;
      closeTimeoutRef.current = null;
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setMapCenter({
        lat: outlet.lat ?? 3.1487,
        lng: outlet.lng ?? 101.6158,
      });
    }
  }, [isOpen, outlet.lat, outlet.lng]);

  useEffect(() => {
    if (isOpen) {
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
      }

      setShouldRender(true);
      setIsClosing(true);

      mountTimeoutRef.current = setTimeout(() => {
        setIsClosing(false);
        mountTimeoutRef.current = null;
      }, 20);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(900);
      setMapLoaded(false);
      closingRef.current = false;
      document.body.style.overflow = "hidden";
      window.history.pushState({ sheet: "waitingPayment" }, "");

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      document.body.style.overflow = "";
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      if (isOpen && !closingRef.current) {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handlePopState);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, handleClose]);

  const handlePayNowClick = () => {
    if (closingRef.current) return;
    onPayNow();
    handleClose();
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300",
          !isClosing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-primary shadow-xl z-50 transition-transform duration-300 ease-out will-change-transform",
          !isClosing ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-tertiary px-4 py-4 flex items-center">
            <button onClick={handleClose} className="mr-4">
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <h1 className="flex-1 text-center text-lg font-bold text-primary select-none">
              Waiting for Payment
            </h1>
            <div className="w-6" />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="inline-flex items-center gap-2">
                <span className="text-6xl font-bold text-tertiary">
                  {String(mins).padStart(2, "0")}
                </span>
                <span className="text-5xl font-bold text-tertiary">:</span>
                <span className="text-6xl font-bold text-tertiary-foreground">
                  {String(secs).padStart(2, "0")}
                </span>
              </div>
              <p className="text-sm text-primary-foreground/60 mt-4 px-4">
                Please complete your payment before the timer expires to secure
                your order.
              </p>
            </div>

            <div className="px-6 flex gap-3 mb-6">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-full border-2 border-gray-300 text-primary-foreground font-semibold text-base hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayNowClick}
                className="flex-1 py-3 rounded-full text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity"
                style={{ background: "#FFC107" }}
              >
                Pay now
              </button>
            </div>

            <div className="px-4 mb-4">
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                {!mapLoaded && <MapSkeleton />}
                <div className={mapLoaded ? "block" : "hidden"}>
                  <MapProvider>
                    <GoogleMap
                      mapContainerStyle={defaultMapContainerStyle}
                      mapContainerClassName="w-full"
                      center={mapCenter}
                      zoom={defaultMapZoom}
                      options={defaultMapOptions}
                      onLoad={() => setMapLoaded(true)}
                      onDragEnd={function (this: google.maps.Map) {
                        const center = this.getCenter();
                        if (center) {
                          setMapCenter({
                            lat: center.lat(),
                            lng: center.lng(),
                          });
                        }
                      }}
                    >
                      <MarkerF
                        position={{
                          lat: outlet.lat ?? 3.1487,
                          lng: outlet.lng ?? 101.6158,
                        }}
                        title={outlet.name}
                        icon={theme?.data?.mapPinIcon ?? "/images/MapPin.svg"}
                      />
                    </GoogleMap>
                  </MapProvider>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 mx-4 rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-primary-foreground text-lg">
                    {outlet.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="bg-tertiary rounded-full px-2 py-0.5">
                  <span className="text-primary text-xs font-bold">Open</span>
                </div>
                {outlet.distance && (
                  <span className="text-sm text-primary-foreground/60">
                    {outlet.distance}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 mt-3">
                <Clock className="w-4 h-4 text-primary-foreground/40 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/60">
                  {outlet.hours}
                </span>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <Phone className="w-4 h-4 text-primary-foreground/40 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/60">
                  {outlet.phone}
                </span>
              </div>

              <p className="text-sm text-primary-foreground/50 mt-3 leading-relaxed">
                {outlet.address}
              </p>
            </div>

            <div className="px-4 pb-24">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-primary-foreground mb-2">
                  Date & Time
                </h4>
                <p className="text-lg font-bold text-tertiary">
                  {getFormattedDateTime()}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 flex-shrink-0 p-4 border-t border-gray-200 bg-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-primary-foreground">
                Total Amount
              </span>
              <span className="text-xl font-bold text-primary-foreground">
                RM {totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-primary-foreground/40 text-center">
              Your transaction is secured with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
