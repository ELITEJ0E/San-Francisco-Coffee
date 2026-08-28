"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface AddedToBagSheetProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemImage?: string;
  customizations: {
    bread?: string;
    vegetables?: string[];
    sauce?: string;
    drink?: string;
    snacks?: string[];
    mealUpgrade?: string;
    specialRequest?: string;
  };
  totalPrice: number;
  onViewBag: () => void;
  onContinueShopping: () => void;
}

export default function AddedToBagSheet({
  isOpen,
  onClose,
  itemName,
  itemImage,
  customizations,
  totalPrice,
  onViewBag,
  onContinueShopping,
}: AddedToBagSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [imgError, setImgError] = useState(false);

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
      window.history.pushState({ sheet: "addedToBag" }, "");
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

  const handleViewBag = () => {
    handleClose();
    onViewBag();
  };

  const handleContinueShopping = () => {
    handleClose();
    onContinueShopping();
  };

  const customizationLines: string[] = [];

  if (customizations.bread) {
    customizationLines.push(customizations.bread);
  }

  if (customizations.vegetables && customizations.vegetables.length > 0) {
    customizationLines.push(customizations.vegetables.join(", "));
  }

  if (customizations.sauce) {
    customizationLines.push(customizations.sauce);
  }

  if (customizations.drink) {
    customizationLines.push(customizations.drink);
  }

  if (customizations.snacks && customizations.snacks.length > 0) {
    customizationLines.push(customizations.snacks.join(", "));
  }

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
          "fixed inset-x-0 bottom-0 mx-auto w-full max-w-md bg-primary rounded-t-3xl shadow-xl z-50 transition-transform duration-300 ease-out",
          isOpen && !isClosing ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="p-5">
          <h2 className="text-2xl text-center font-bold text-tertiary mb-4">
            Added to the bag!
          </h2>

          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {itemImage && !imgError ? (
                <img
                  src={itemImage}
                  alt={itemName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tertiary to-tertiary-foreground opacity-30">
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                    <rect
                      x="4"
                      y="16"
                      width="32"
                      height="14"
                      rx="7"
                      fill="primary"
                    />
                    <rect
                      x="10"
                      y="10"
                      width="20"
                      height="10"
                      rx="5"
                      fill="primary"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary-foreground text-sm mb-1">
                {itemName}
              </p>
              {customizationLines.map((line, index) => (
                <p
                  key={index}
                  className="text-xs text-primary-foreground/60 leading-relaxed"
                >
                  {line}
                </p>
              ))}
              {customizations.specialRequest && (
                <p className="text-xs text-primary-foreground/60 italic mt-1">
                  Note: {customizations.specialRequest}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="font-bold text-primary-foreground">Total</span>
            <span className="font-bold text-primary-foreground text-lg">
              RM {totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-5">
            <button
              onClick={handleViewBag}
              className="w-full py-3.5 rounded-full font-bold text-primary-foreground text-base transition-all shadow-md"
              style={{ background: "#FFC107" }}
            >
              View bag and checkout
            </button>
            <button
              onClick={handleContinueShopping}
              className="text-sm text-primary-foreground/60 underline underline-offset-4 hover:text-primary-foreground transition-colors"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
