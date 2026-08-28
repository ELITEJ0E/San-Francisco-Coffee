"use client";

// import { Scanner } from "@yudiel/react-qr-scanner";
import { useRef, useState } from "react";
import QrReader from "react-web-qr-reader";

export function QrScanner() {
  const [data, setData] = useState("Not Found");
  const videoElem = useRef<HTMLVideoElement>(null);
  return (
    <div>
      <p>{data}</p>
      <QrReader
        delay={1000}
        onScan={(result) => {
          alert(result);
        }}
        onError={(err) => {
          alert(err);
        }}
      />
    </div>
  );
}
