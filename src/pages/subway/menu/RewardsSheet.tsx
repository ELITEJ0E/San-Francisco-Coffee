"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface Reward {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
}

interface RewardsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  rewardsList: Reward[];
  selectedReward: number | null;
  onSelectReward: (id: number | null) => void;
  promoInput: string;
  onPromoInputChange: (value: string) => void;
  onApplyPromoCode: () => void;
  onApplyReward: () => void;
}

export default function RewardsSheet({
  isOpen,
  onClose,
  rewardsList,
  selectedReward,
  onSelectReward,
  promoInput,
  onPromoInputChange,
  onApplyPromoCode,
  onApplyReward,
}: RewardsSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;

    closingRef.current = true;
    setIsClosing(true);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      closingRef.current = false;
      closeTimeoutRef.current = null;
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      closingRef.current = false;
      setIsClosing(false);
      document.body.style.overflow = "hidden";
      window.history.pushState({ sheet: "rewards" }, "");
    } else {
      document.body.style.overflow = "";
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
    };
  }, [isOpen, handleClose]);

  const handleApplyRewardAndClose = () => {
    onApplyReward();
    handleClose();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300",
          isOpen && !isClosing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-primary shadow-xl z-50 transition-transform duration-300 ease-out",
          isOpen && !isClosing ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className="sticky top-0 z-10 bg-tertiary px-4 py-4 flex items-center">
            <button onClick={handleClose} className="mr-3">
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <h1 className="flex-1 text-center text-lg font-bold text-primary">
              My rewards
            </h1>
            <div className="w-6" />
          </div>

          <div className="flex-1 bg-primary">
            <div className="px-4 pt-4 pb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-4 border border-gray-300 rounded-full text-primary-foreground text-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  value={promoInput}
                  onChange={(e) => onPromoInputChange(e.target.value)}
                />
                <button
                  className="px-8 bg-tertiary hover:bg-tertiary text-primary font-semibold text-sm rounded-full whitespace-nowrap transition-colors"
                  onClick={onApplyPromoCode}
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="px-4 space-y-4 pb-24">
              {rewardsList.map((reward, index) => {
                const isSelected = selectedReward === reward.id;

                if (index === 0) {
                  return (
                    <div
                      key={reward.id}
                      className={cn(
                        "relative bg-primary border rounded-2xl overflow-hidden cursor-pointer transition-all",
                        isSelected
                          ? "border-tertiary border-2"
                          : "border-gray-200",
                      )}
                      onClick={() =>
                        onSelectReward(isSelected ? null : reward.id)
                      }
                    >
                      <div className="flex">
                        <div className="w-32 flex-shrink-0">
                          <img
                            src={reward.image}
                            alt={reward.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div>
                            <div className="bg-tertiary text-primary text-xs font-bold px-3 py-1 inline-block rounded mb-2">
                              SUBWAY CLUB FREE COOKIE
                            </div>
                            <h3 className="font-bold text-primary-foreground text-lg leading-tight pr-8">
                              {reward.title}
                            </h3>
                            <p className="text-sm text-primary-foreground/60 mt-1">
                              {reward.description}
                            </p>
                          </div>
                          <button className="text-tertiary text-sm font-semibold mt-4 block">
                            View T&Cs
                          </button>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-tertiary rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                }

                if (index === 1) {
                  return (
                    <div
                      key={reward.id}
                      className={cn(
                        "relative bg-primary border rounded-2xl overflow-hidden cursor-pointer transition-all",
                        isSelected
                          ? "border-tertiary border-2"
                          : "border-gray-200",
                      )}
                      onClick={() =>
                        onSelectReward(isSelected ? null : reward.id)
                      }
                    >
                      <div className="flex">
                        <div className="w-32 flex-shrink-0">
                          <img
                            src={reward.image}
                            alt={reward.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div>
                            <h3 className="font-bold text-primary-foreground text-xl pr-8">
                              {reward.title}
                            </h3>
                            <p className="text-sm text-primary-foreground/60 mt-2 leading-snug">
                              {reward.description}
                            </p>
                          </div>
                          <button className="text-tertiary text-sm font-semibold mt-6 block">
                            View T&Cs
                          </button>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-tertiary rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="h-2 bg-tertiary"></div>
                    </div>
                  );
                }

                return (
                  <div
                    key={reward.id}
                    className={cn(
                      "relative bg-primary border rounded-2xl overflow-hidden cursor-pointer transition-all",
                      isSelected
                        ? "border-tertiary border-2"
                        : "border-gray-200",
                    )}
                    onClick={() =>
                      onSelectReward(isSelected ? null : reward.id)
                    }
                  >
                    <div className="flex">
                      <div className="w-32 flex-shrink-0">
                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div>
                          <h3 className="font-bold text-primary-foreground text-lg leading-tight pr-8">
                            {reward.title}
                          </h3>
                          <p className="text-sm text-primary-foreground/60 mt-1">
                            {reward.description}
                          </p>
                        </div>
                        <button className="text-tertiary text-sm font-semibold mt-4 block">
                          View T&Cs
                        </button>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-tertiary rounded-full p-1">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 bg-primary border-t border-gray-200 px-4 py-4">
            <button
              className="w-full py-4 bg-tertiary-foreground hover:bg-tertiary-foreground/80 active:bg-tertiary-foreground text-primary-foreground font-bold text-lg rounded-full transition-all active:scale-[0.985]"
              onClick={handleApplyRewardAndClose}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
