import React, { useRef, useEffect, useState, useMemo } from "react";

const ITEM_HEIGHT = 54;
const VISIBLE_ITEMS = 5;

interface Option {
  value: string;
  label: string;
}

interface ScrollPickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const ScrollPicker: React.FC<ScrollPickerProps> = ({
  options,
  value,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const isProgrammaticRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || containerHeight === 0) return;
    const index = options.findIndex((o) => o.value === value);
    if (index === -1) return;
    const targetTop = index * ITEM_HEIGHT;
    if (Math.abs(containerRef.current.scrollTop - targetTop) > 1) {
      isProgrammaticRef.current = true;
      containerRef.current.scrollTo({ top: targetTop, behavior: "instant" });
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 150);
    }
  }, [value, options, containerHeight]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticRef.current) return;
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const validIndex = Math.max(0, Math.min(index, options.length - 1));

    if (options[validIndex] && options[validIndex].value !== value) {
      onChange(options[validIndex].value);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  };

  const handleClick = (index: number) => {
    if (containerRef.current) {
      isProgrammaticRef.current = true;
      containerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
      onChange(options[index].value);
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 400);
    }
  };

  const padding =
    containerHeight > 0
      ? (containerHeight - ITEM_HEIGHT) / 2
      : (ITEM_HEIGHT * VISIBLE_ITEMS - ITEM_HEIGHT) / 2;

  return (
    <div ref={wrapperRef} className="relative w-full h-full overflow-hidden">
      {/* Top and Bottom Fade gradients */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden scrollbar-none snap-y snap-mandatory relative z-20"
        style={{ scrollBehavior: "auto" }}
      >
        <div style={{ height: padding }} />
        {options.map((option, index) => (
          <div
            key={option.value}
            onClick={() => handleClick(index)}
            className={`flex items-center justify-center snap-center cursor-pointer transition-all duration-200 text-base md:text-lg w-full ${
              value === option.value
                ? "text-stone-900 font-extrabold scale-105 z-30"
                : "text-stone-300 font-medium scale-95"
            }`}
            style={{ height: ITEM_HEIGHT }}
          >
            {option.label}
          </div>
        ))}
        <div style={{ height: padding }} />
      </div>
    </div>
  );
};

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (date: string, time: string) => void;
  onConfirm?: (formattedTime: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  outletName?: string;
  outletHours?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  onConfirm,
  selectedDate = "Today",
  selectedTime = "ASAP",
  outletName,
  outletHours,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [curDate, setCurDate] = useState(selectedDate);
  const [curTime, setCurTime] = useState(selectedTime);

  useEffect(() => {
    if (isOpen) {
      setCurDate(selectedDate || "Today");
      setCurTime(selectedTime || "ASAP");
    }
  }, [isOpen, selectedDate, selectedTime]);

  // Back button closes the sheet
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    window.history.pushState({ dateTimePicker: true }, "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const dateOptions = useMemo(() => {
    const opts: Option[] = [
      { value: "Today", label: "Today" },
      { value: "Tomorrow", label: "Tomorrow" },
    ];
    const today = new Date();
    for (let i = 2; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const label = d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      opts.push({ value: label, label });
    }
    return opts;
  }, []);

  const timeOptions = useMemo(() => {
    const opts: Option[] = [{ value: "ASAP", label: "ASAP" }];
    let hour = 8;
    let minute = 0;
    while (hour < 22 || (hour === 22 && minute === 0)) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const timeStr = `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm.toLowerCase()}`;
      opts.push({ value: timeStr, label: timeStr });
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
    }
    return opts;
  }, []);

  const handleConfirm = () => {
    onSelect?.(curDate, curTime);
    const resultString = curDate === "Today" && curTime === "ASAP" ? "ASAP" : `${curDate}, ${curTime}`;
    onConfirm?.(resultString);
    onClose();
  };

  return (
    <>
      {isMounted && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out pointer-events-auto ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
          />

          {/* Half-screen sheet */}
          <div
            className={`w-full max-w-md bg-white rounded-t-[32px] shadow-2xl pointer-events-auto flex flex-col transition-transform duration-500 pb-safe ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{
              maxHeight: "52%",
              minHeight: "410px",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            {/* Top Grab Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-16 h-1.5 bg-[#4A2E1B] rounded-full opacity-90" />
            </div>

            {/* Header Title */}
            <div className="text-center px-6 pt-2 pb-5">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Select Pickup Date & Time
              </h3>
              {outletName && (
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  {outletName} {outletHours ? `• ${outletHours}` : ""}
                </p>
              )}
            </div>

            {/* Pickers Container */}
            <div className="flex-1 flex flex-col px-6 pb-6 min-h-0 overflow-hidden relative">
              {/* Unified absolute highlight box centered over both scroll wheels */}
              <div
                className="absolute left-6 right-6 bg-[#FFF0EF] rounded-2xl pointer-events-none z-10 border border-[#BA1C24]"
                style={{
                  height: ITEM_HEIGHT,
                  top: "calc(50% - 27px)", // Perfectly center the ITEM_HEIGHT (54px) box vertically
                }}
              />

              <div className="flex gap-4 flex-1 min-h-0 relative z-20">
                {/* Date column */}
                <div className="flex-1 min-h-0">
                  <ScrollPicker
                    options={dateOptions}
                    value={curDate}
                    onChange={(date) => setCurDate(date)}
                  />
                </div>

                {/* Time column */}
                <div className="flex-1 min-h-0">
                  <ScrollPicker
                    options={timeOptions}
                    value={curTime}
                    onChange={(time) => setCurTime(time)}
                  />
                </div>
              </div>
            </div>

            {/* Sticky confirm button */}
            <div className="shrink-0 p-6 pt-0 bg-white">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[#BA1C24] hover:bg-[#9E141B] active:bg-[#801015] text-white font-bold text-base rounded-2xl shadow-xs transition-all active:scale-[0.985] cursor-pointer"
              >
                Ready to order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
