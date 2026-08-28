"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { OpenStreetMapOutletPicker } from "@/components/map/OpenStreetMapOutletPicker";

export default function SFStoresPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSelectOutlet = () => {
    // When an outlet is chosen and time confirmed in DateTimePicker, navigate to menu
    navigate("/menu");
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] overflow-hidden relative">
      <OpenStreetMapOutletPicker
        onBack={handleBack}
        onSelectOutlet={handleSelectOutlet}
        isModal={false}
      />
    </div>
  );
}
