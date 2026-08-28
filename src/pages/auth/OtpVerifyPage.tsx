"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, RefreshCw, MessageSquare, Phone, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "+60 12-896 2547";
  const channel = (searchParams.get("channel") as "sms" | "whatsapp") || "sms";
  const returnUrl = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeChannel, setActiveChannel] = useState<"sms" | "whatsapp">(channel);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (hasError) setHasError(false);

    // Only allow digits
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Handle paste or multi-character entry
    if (cleaned.length > 1) {
      const pasteValues = cleaned.slice(0, 6).split("");
      const newOtp = [...otp];
      pasteValues.forEach((char, idx) => {
        if (index + idx < 6) {
          newOtp[index + idx] = char;
        }
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + pasteValues.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single character entry
    const newOtp = [...otp];
    newOtp[index] = cleaned[0];
    setOtp(newOtp);

    // Auto-advance to next box
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = (newChannel?: "sms" | "whatsapp") => {
    if (newChannel) setActiveChannel(newChannel);
    setCountdown(60);
    setCanResend(false);
    setHasError(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    toast.success(`New 6-digit OTP sent via ${newChannel || activeChannel}`);
  };

  const handleFillTestOtp = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setHasError(false);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otp.join("");

    if (fullCode.length < 6) {
      setHasError(true);
      setErrorMessage("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Simulate error if code is '000000'
      if (fullCode === "000000") {
        setHasError(true);
        setErrorMessage("Invalid OTP code. Please check your messages and try again.");
        return;
      }

      toast.success("Mobile number verified successfully!");
      // Proceed to profile setup screen
      navigate(`/auth/profile-setup?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(returnUrl)}`);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] text-stone-900 overflow-y-auto">
      {/* Header */}
      <header className="px-4 py-3.5 flex items-center justify-between border-b border-stone-200/70 bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-serif font-bold text-base text-stone-900">
          Verify Mobile
        </span>
        <div className="w-8" />
      </header>

      {/* Body */}
      <div className="flex-1 px-5 py-6 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FED7AA]">
                Step 2 of 3
              </span>
              <span className="text-xs text-stone-400 font-medium">OTP Verification</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Enter 6-Digit Code
            </h1>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              We sent a verification code to{" "}
              <strong className="text-stone-900">{phone}</strong> via{" "}
              <span className="font-bold text-[#BA1C24]">
                {activeChannel === "whatsapp" ? "WhatsApp" : "SMS"}
              </span>.
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="py-2">
            <div className="flex items-center justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-2xl bg-white border-2 shadow-xs focus:outline-none transition-all ${
                    hasError
                      ? "border-red-500 text-red-600 bg-red-50/20 ring-1 ring-red-500"
                      : digit
                      ? "border-[#BA1C24] text-stone-900 ring-1 ring-[#BA1C24]/20"
                      : "border-stone-200 text-stone-900 focus:border-[#BA1C24]"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Resend & Channel Switcher */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Didn't receive code?</span>
              {canResend ? (
                <button
                  onClick={() => handleResend()}
                  className="text-[#BA1C24] font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              ) : (
                <span className="text-stone-400 font-medium font-mono">
                  Resend in 0:{countdown < 10 ? `0${countdown}` : countdown}
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Switch Delivery:</span>
              <div className="flex gap-2">
                {activeChannel === "sms" ? (
                  <button
                    onClick={() => handleResend("whatsapp")}
                    className="text-[#128C7E] font-bold flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>Send via WhatsApp</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleResend("sms")}
                    className="text-[#BA1C24] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send via SMS</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test OTP Helper Chip */}
          <div className="flex items-center justify-between bg-[#FFF0EB] border border-[#FED7AA] rounded-xl px-3.5 py-2 text-xs">
            <span className="text-stone-600 font-medium">Demo Shortcut:</span>
            <button
              type="button"
              onClick={handleFillTestOtp}
              className="text-[#BA1C24] font-bold hover:underline"
            >
              Fill Test OTP (123456)
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 pb-4">
          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={isVerifying}
            className="w-full bg-[#BA1C24] hover:bg-[#9E141B] active:scale-98 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            {isVerifying ? (
              <span>Verifying code...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Verify & Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
