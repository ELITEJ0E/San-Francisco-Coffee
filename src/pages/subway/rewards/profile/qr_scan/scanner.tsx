"use client";

import { useState } from "react";

export function QrScanner() {
  const [data] = useState("Scan QR Code");
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-stone-600">{data}</p>
    </div>
  );
}
