"use client";

import { useState, useRef, useEffect } from "react";
import { X, Calendar } from "lucide-react";

interface BirthDatePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: { day: string; month: string; year: string }) => void;
  initialDate?: { day: string; month: string; year: string };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => String(currentYear - i));

export default function BirthDatePickerSheet({
  isOpen,
  onClose,
  onSelectDate,
  initialDate,
}: BirthDatePickerSheetProps) {
  const [selectedMonth, setSelectedMonth] = useState(initialDate?.month || "Feb");
  const [selectedDay, setSelectedDay] = useState(initialDate?.day || "01");
  const [selectedYear, setSelectedYear] = useState(initialDate?.year || "2000");

  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialDate) {
      if (initialDate.month) setSelectedMonth(initialDate.month);
      if (initialDate.day) setSelectedDay(initialDate.day);
      if (initialDate.year) setSelectedYear(initialDate.year);
    }
  }, [initialDate]);

  if (!isOpen) return null;

  const handleDone = () => {
    onSelectDate({
      month: selectedMonth,
      day: selectedDay,
      year: selectedYear,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Container */}
      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-in slide-in-from-bottom duration-250">
        {/* Top Handle Bar */}
        <div className="flex justify-center -mt-2 mb-1">
          <div className="w-10 h-1.2 bg-stone-300 rounded-full" />
        </div>

        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#BA1C24] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Select Birth Date
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Date Preview Tag */}
        <div className="text-center py-1.5 bg-[#FFF0EB] rounded-xl border border-[#FED7AA]">
          <span className="text-xs font-semibold text-[#BA1C24]">
            Selected: {selectedMonth} {selectedDay}, {selectedYear}
          </span>
        </div>

        {/* 3-Column Wheel Picker Container */}
        <div className="relative h-48 my-2 overflow-hidden select-none bg-stone-50 rounded-2xl border border-stone-200/80">
          {/* Active Center Highlight Ribbon */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-11 bg-[#BA1C24]/10 border-y-2 border-[#BA1C24] rounded-xl pointer-events-none z-10" />

          <div className="grid grid-cols-3 h-full divide-x divide-stone-200/60 relative z-0">
            {/* MONTH COLUMN */}
            <div
              ref={monthRef}
              className="h-full overflow-y-auto scrollbar-none snap-y snap-mandatory py-20 text-center"
            >
              {MONTHS.map((m) => (
                <div
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`h-11 flex items-center justify-center snap-center cursor-pointer transition-all ${
                    selectedMonth === m
                      ? "text-[#BA1C24] font-bold text-lg scale-105"
                      : "text-stone-500 text-sm hover:text-stone-800"
                  }`}
                >
                  {m}
                </div>
              ))}
            </div>

            {/* DAY COLUMN */}
            <div
              ref={dayRef}
              className="h-full overflow-y-auto scrollbar-none snap-y snap-mandatory py-20 text-center"
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`h-11 flex items-center justify-center snap-center cursor-pointer transition-all ${
                    selectedDay === d
                      ? "text-[#BA1C24] font-bold text-lg scale-105"
                      : "text-stone-500 text-sm hover:text-stone-800"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* YEAR COLUMN */}
            <div
              ref={yearRef}
              className="h-full overflow-y-auto scrollbar-none snap-y snap-mandatory py-20 text-center"
            >
              {YEARS.map((y) => (
                <div
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`h-11 flex items-center justify-center snap-center cursor-pointer transition-all ${
                    selectedYear === y
                      ? "text-[#BA1C24] font-bold text-lg scale-105"
                      : "text-stone-500 text-sm hover:text-stone-800"
                  }`}
                >
                  {y}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
