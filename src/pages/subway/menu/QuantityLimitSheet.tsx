"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityLimitSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuantityLimitSheet({
  isOpen,
  onClose,
}: QuantityLimitSheetProps) {
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
      window.history.pushState({ sheet: "quantityLimit" }, "");
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

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300",
          isOpen && !isClosing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 mx-auto w-full max-w-md bg-primary rounded-t-3xl shadow-xl z-[61] transition-transform duration-300 ease-out",
          isOpen && !isClosing ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Whoa! Too many items...
            </h2>
            <button
              onClick={handleClose}
              className="text-primary-foreground/50 hover:text-primary-foreground transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-primary-foreground/60 mb-6 px-4">
              To provide you with the best ordering experience we&apos;ve restricted
              orders to limited items per order.
            </p>
            <Button
              variant="default"
              onClick={handleClose}
              className="w-full py-7 text-base rounded-full font-bold"
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
