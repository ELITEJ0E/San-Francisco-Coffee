import React, { useRef, useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 7;

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
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [containerHeight, setContainerHeight] = useState(
    ITEM_HEIGHT * VISIBLE_ITEMS,
  );

  // Measure actual rendered height and update on resize
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
    if (containerRef.current && !isScrollingRef.current) {
      const index = options.findIndex((o) => o.value === value);
      if (index !== -1) {
        const targetTop = index * ITEM_HEIGHT;
        if (Math.abs(containerRef.current.scrollTop - targetTop) > 1) {
          containerRef.current.scrollTo({
            top: targetTop,
            behavior: "instant",
          });
        }
      }
    }
  }, [value, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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
    }, 100);
  };

  const handleClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
      onChange(options[index].value);
    }
  };

  const padding = (containerHeight - ITEM_HEIGHT) / 2;

  return (
    // h-full so it fills whatever flex space the parent gives it
    <div ref={wrapperRef} className="relative w-full h-full">
      {/* Highlight — always perfectly centered using measured height */}
      <div
        className="absolute left-0 right-0 bg-green-50 rounded-xl pointer-events-none z-0 border border-green-200"
        style={{
          height: ITEM_HEIGHT,
          top: padding,
        }}
      />

      {/* Fade gradients */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory relative z-20"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Dynamic top padding so first item scrolls to center */}
        <div style={{ height: padding }} />

        {options.map((option, index) => (
          <div
            key={option.value}
            onClick={() => handleClick(index)}
            className={`flex items-center justify-center snap-center cursor-pointer transition-all duration-200 text-lg ${
              value === option.value
                ? "text-green-600 font-bold scale-110"
                : "text-gray-400 scale-95"
            }`}
            style={{ height: ITEM_HEIGHT }}
          >
            {option.label}
          </div>
        ))}

        {/* Dynamic bottom padding so last item scrolls to center */}
        <div style={{ height: padding }} />
      </div>
    </div>
  );
};

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string, time: string) => void;
  selectedDate: string;
  selectedTime: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedDate,
  selectedTime,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
      const timeStr = `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
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
    onSelect(selectedDate, selectedTime);
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
            className={`w-full max-w-md bg-white rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col transition-transform duration-500 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{
              maxHeight: "56%",
              minHeight: "420px",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            {/*
              flex-1 + min-h-0 on this div is critical:
              - flex-1 makes it grow to fill the sheet above the sticky button
              - min-h-0 overrides the default min-height:auto so flex children
                can actually shrink and not overflow the sheet
            */}
            <div className="flex-1 flex flex-col p-6 pb-4 min-h-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Order ahead, skip the queue
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Select pickup date and time
              </p>

              {/* Pickers — flex-1 + min-h-0 so they fill remaining space */}
              <div className="flex gap-3 flex-1 min-h-0">
                {/* Date column */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="text-xs font-semibold text-center text-gray-400 uppercase tracking-wider mb-2">
                    DATE
                  </div>
                  {/*
                    flex-1 + min-h-0 here lets ScrollPicker's h-full resolve
                    to the actual available space, which ResizeObserver then
                    measures to position the green highlight correctly
                  */}
                  <div className="flex-1 min-h-0">
                    <ScrollPicker
                      options={dateOptions}
                      value={selectedDate}
                      onChange={(date) => onSelect(date, selectedTime)}
                    />
                  </div>
                </div>

                {/* Time column */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="text-xs font-semibold text-center text-gray-400 uppercase tracking-wider mb-2">
                    TIME
                  </div>
                  <div className="flex-1 min-h-0">
                    <ScrollPicker
                      options={timeOptions}
                      value={selectedTime}
                      onChange={(time) => onSelect(selectedDate, time)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky confirm button — never moves, never gets covered */}
            <div className="shrink-0 p-6 pt-0 border-t border-gray-100 bg-white rounded-b-3xl">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[#FFC107] hover:bg-[#F9B500] active:bg-[#E6A100] text-black font-bold text-lg rounded-full transition-all active:scale-[0.985]"
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
