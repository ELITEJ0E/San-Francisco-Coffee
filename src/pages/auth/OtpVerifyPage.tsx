"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") || "+6012-3456789";
  const returnUrl = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(28);
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

  const verifyCode = (code: string) => {
    setIsVerifying(true);
    setHasError(false);

    setTimeout(() => {
      setIsVerifying(false);

      if (code === "000000") {
        setHasError(true);
        setErrorMessage("Invalid OTP code. Please check your messages and try again.");
        return;
      }

      toast.success("Mobile number verified!");
      navigate(`/auth/profile-setup?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(returnUrl)}`);
    }, 400);
  };

  // Auto-trigger verification once all 6 digits are entered
  useEffect(() => {
    const fullCode = otp.join("");
    if (fullCode.length === 6 && !isVerifying) {
      verifyCode(fullCode);
    }
  }, [otp, isVerifying, phone, returnUrl, navigate]);

  const handleChange = (index: number, value: string) => {
    if (hasError) setHasError(false);

    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

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

    const newOtp = [...otp];
    newOtp[index] = cleaned[0];
    setOtp(newOtp);

    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
    setHasError(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    toast.success("New 6-digit OTP code sent!");
  };

  const handleFillTestOtp = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAF8F5] text-stone-900 overflow-y-auto">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-[#FAF8F5]/90 backdrop-blur-xs">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <div className="w-8" />
      </header>

      {/* Main Body */}
      <div className="flex-1 px-5 pb-6 flex flex-col justify-between max-w-md mx-auto w-full text-center">
        <div className="space-y-6 pt-2">
          {/* Centered Brand Logo */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#BA1C24] rounded-2xl p-2 shadow-md flex items-center justify-center mb-3">
              <img
                src="/assets/sf-logo.svg"
                alt="San Francisco Coffee"
                className="w-full h-full object-contain filter invert drop-shadow-xs"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Verify OTP
            </h1>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed max-w-xs">
              We've send you a 6-digit code to{" "}
              <strong className="text-[#BA1C24] font-bold">{phone}</strong> via WhatsApp.
            </p>
          </div>

          {/* 6 Square OTP Digit Boxes */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-2">
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
                  className={`w-11 h-13 text-center text-xl font-bold rounded-2xl bg-white border-2 shadow-2xs focus:outline-none transition-all ${
                    hasError
                      ? "border-red-500 text-red-600 bg-red-50/20"
                      : digit
                      ? "border-[#BA1C24] text-stone-900 ring-2 ring-[#BA1C24]/10"
                      : "border-stone-200 text-stone-900 focus:border-[#BA1C24]"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 mt-3 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Resend Link */}
          <div className="flex items-center justify-center gap-1.5 text-xs">
            <span className="text-stone-500 font-medium">Didn't receive code?</span>
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#BA1C24] font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-[#BA1C24] font-bold">
                Resend in 00:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            )}
          </div>

          {/* Demo Shortcut */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFillTestOtp}
              className="bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#BA1C24] border border-[#FED7AA] font-bold text-xs px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Fill Test OTP (123456)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
