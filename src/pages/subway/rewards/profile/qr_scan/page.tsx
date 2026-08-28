"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { SwitchCamera } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const scanner = useRef<QrScanner | undefined>(undefined);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string>("");
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string>("environment");
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately as QrScanner will handle it
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error("Camera permission denied:", error);
      setHasPermission(false);
      return false;
    }
  };

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log("Scanned result:", result);
    setScannedResult(result?.data);
  };

  const onScanFail = (err: string | Error) => {
    console.error("Scan failed:", err);
  };

  const switchCamera = async () => {
    if (scanner.current) {
      const newCamera =
        currentCamera === "environment" ? "user" : "environment";
      setCurrentCamera(newCamera);

      try {
        await scanner.current.setCamera(newCamera);
      } catch (error) {
        console.error("Failed to switch camera:", error);
      }
    }
  };

  useEffect(() => {
    const initializeScanner = async () => {
      // First, ensure we have camera permission
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setQrOn(false);
        return;
      }

      if (videoEl?.current && !scanner.current) {
        try {
          // List available cameras
          const availableCameras = await QrScanner.listCameras();
          console.log("Available cameras:", availableCameras);
          setCameras(availableCameras);

          // Create scanner instance
          const newScanner = new QrScanner(videoEl.current, onScanSuccess, {
            onDecodeError: onScanFail,
            preferredCamera: currentCamera,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            overlay: qrBoxEl?.current || undefined,
            returnDetailedScanResult: true,
          });

          scanner.current = newScanner;

          // Start scanning
          await newScanner.start();
          console.log("Scanner started successfully");
          setQrOn(true);
        } catch (err) {
          console.error("Scanner initialization failed:", err);
          setQrOn(false);
        }
      }
    };

    initializeScanner();

    // Cleanup function
    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current.destroy();
      }
    };
  }, [currentCamera]);

  // Handle permission status changes
  useEffect(() => {
    if (!hasPermission) {
      alert(
        "Please allow camera access in your browser permissions to use the QR scanner. After allowing access, reload the page.",
      );
    }
  }, [hasPermission]);

  return (
    <div className="flex flex-col mx-auto w-full min-h-screen bg-white max-w-md">
      <div className="mb-[-310px]">
        <NavbarHeader title={"Scan"} backUrl="/profile/wallet" />

        <div className="flex flex-col -mt-2 bg-primary bg-[url('/images/HomeHeaderDeco.png')] rounded-b-[55px]">
          <p className="flex justify-center items-end text-transparent text-5xl m-20"></p>
          <p className="flex justify-center items-end text-transparent text-5xl m-16"></p>
        </div>
      </div>

      <div className="">
        <div className="flex flex-col items-center w-[85%] mx-auto mt-20 pt-10 mb-20 border border-gray-300 rounded-xl shadow-2xl bg-white">
          <div className="relative w-full aspect-square max-w-[300px] mb-8 overflow-hidden">
            <video
              ref={videoEl}
              className="w-full h-full object-cover rounded-lg"
            />

            <div
              ref={qrBoxEl}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]"
            >
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary"></div>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-scan"></div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-300 w-full" />

          <div className="flex flex-row items-center justify-between w-full py-8 px-6 text-primary font-base">
            <p className="font-base">Scanned Result</p>
            <p className="font-bold">{scannedResult || "No result"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
