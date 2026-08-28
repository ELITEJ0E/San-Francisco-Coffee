"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrder } from "@/app/context/OrderContext";

export default function SubwayRatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "SUB-4821";
  const { userProfile } = useOrder();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Fresh Ingredients",
    "Fast Service",
  ]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tags = [
    "Fresh Ingredients",
    "Fast Service",
    "Warm Crispy Bread",
    "Friendly Artists",
    "Generous Portions",
    "Clean Outlet",
    "Delicious Sauces",
    "Great Value",
  ];

  const sentimentLabels: Record<number, string> = {
    1: "Needs Improvement 😕",
    2: "Fair 😐",
    3: "Good 🙂",
    4: "Very Good! 😋",
    5: "Subway Perfection! ⭐⭐⭐⭐⭐",
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/orders?tab=past");
    }, 2000);
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-md h-full bg-gray-50 select-none overflow-hidden relative">
      {/* Header */}
      <header className="bg-[#008938] px-4 py-4 flex items-center justify-between text-white shadow-md z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-base font-black text-white">Rate Your Experience</h1>
        <div className="w-8" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-16">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-md my-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-[#008938] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Thank You!</h2>
            <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
              Your feedback helps our Sandwich Artists craft better subs every day!
            </p>
            <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5C518]" />
              <span className="text-xs font-black text-amber-900">
                +20 Subway Reward Points Awarded!
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-4">
              Returning to your orders...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-5">
            {/* Order Card info */}
            <div className="text-center pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-[#008938] bg-emerald-50 px-2.5 py-1 rounded-full">
                Order #{orderId}
              </span>
              <h2 className="text-lg font-black text-gray-900 mt-2">
                How was your meal?
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Subway One Utama (LG Floor)
              </p>
            </div>

            {/* Star Rating */}
            <div className="text-center py-2">
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={cn(
                        "w-9 h-9 transition-colors",
                        (hoverRating || rating) >= star
                          ? "text-[#F5C518] fill-[#F5C518]"
                          : "text-gray-200 fill-gray-100"
                      )}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-extrabold text-gray-700 block">
                {sentimentLabels[hoverRating || rating]}
              </span>
            </div>

            {/* Compliments Tags */}
            <div>
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider block mb-2">
                What did you like the most?
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "text-xs px-3 py-2 rounded-xl font-bold transition-all border",
                        isSelected
                          ? "bg-[#008938] text-white border-[#008938] shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment field */}
            <div>
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider block mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about the freshness, bread crunch, or how the team treated you..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#008938]"
              />
            </div>

            {/* Reward incentive banner */}
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#F5C518] shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Earn 20 Subway Points
                </p>
                <p className="text-[10px] text-amber-700">
                  Points will be added directly to {userProfile.name}'s account.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-full font-black text-gray-900 text-sm active:scale-95 transition-all shadow-md bg-[#F5C518] hover:bg-amber-400 border border-amber-500"
            >
              Submit Review & Earn Points
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
