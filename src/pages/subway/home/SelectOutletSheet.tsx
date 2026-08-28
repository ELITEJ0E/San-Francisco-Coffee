"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Outlet } from "@/app/context/OrderContext";
import { OpenStreetMapOutletPicker } from "@/components/map/OpenStreetMapOutletPicker";

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
}: OutletSheetProps) {
  const handleSelect = (outlet: Outlet) => {
    if (onSelectOutlet) {
      onSelectOutlet(outlet);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
          />

          {/* Right-aligned Sheet Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="w-full sm:max-w-[430px] bg-[#FAF8F5] h-full flex flex-col overflow-hidden relative shadow-2xl z-10 pointer-events-auto"
          >
            <OpenStreetMapOutletPicker
              onBack={onClose}
              onSelectOutlet={handleSelect}
              isModal={true}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

