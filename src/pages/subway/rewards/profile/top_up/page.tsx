"use client";

import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, use } from "react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import { useAppContext } from "@/app/context/AppContext";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import PaymentMethod from "./payment/page";

export default function TopUp() {
  const amounts = [20, 50, 100, 200, 300, 500];
  const [amount, setAmount] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const account = Cookies.get("accountId");
  const { phoneNumber, setIsEwalletPayment, isEwalletPayment } =
    useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("paymentmethod");
  const savedAmount = searchParams.get("amount"); // Get saved amount from URL
  const { translate } = useTranslation();
  console.log(account, "accID");
  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery({
    accID: account ?? "",
    brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? ""
  });

  const { mutate: topUp } = api.loyalty.topUpWallet.useMutation({
    onSuccess: async (data) => {
      console.log(data, "topUpData");
      const paymentURL = data?.points?.url;

      if (savedAmount) {
        setIsEwalletPayment(true);
      } else {
        setIsEwalletPayment(false);
      }

      sessionStorage.setItem(
        "isEwalletPayment",
        JSON.stringify(isEwalletPayment),
      );

      if (paymentURL) {
        console.log(paymentURL, "paymentUrl");
        window.location.href = paymentURL;
      } else {
        toast.error(translate("PaymentFailed"));
      }
    },
  });

  // Initialize amount from URL parameter when component mounts
  useEffect(() => {
    if (savedAmount && !amount) {
      setAmount(savedAmount);
    }
  }, [savedAmount]);

  // Handle quick amount selection
  const handleAmountSelect = (value: number) => {
    setAmount(value.toFixed(2));
  };
  // Handle manual input with 2 decimal places
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setAmount((numValue / 100).toFixed(2));
    } else {
      setAmount("");
    }
  };
  console.log(PaymentMethod, "paymentMethod");
  const handleTopUp = () => {
    // Perform top up logic here
    console.log("Top up amount:", amount);
    if (parseFloat(amount) < parseFloat(savedAmount ?? "")) {
      toast.error(translate("TopUpAmpuntNotEnough"));
      return;
    }
    console.log(account, "account");
    let sessionID;
    if (account) {
      if (process.env.NEXT_PUBLIC_DEV_IP == "true") {
        sessionID = `${account}` + "_DEV";
      } else {
        sessionID = `${account}` + "_STG";
      }
    }
    topUp({
      //accID: account ?? "",
      TxnAmount: amount,
      // brand: "MK",
      custName: accData?.account?.accName ?? "",
      custPhone: phoneNumber ?? "",
      serviceName: "wallettopup",
      orderId: sessionID ?? "",
      storeId: "hq",
      index: "",
    });
    console.log(topUp ?? "", "topUp");
  };
  //paymentMethod || ""
  // Handle key press to allow backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputRef.current) {
      const newValue = amount.slice(0, -1);
      setAmount(
        newValue === ""
          ? ""
          : (parseInt(newValue.replace(".", ""), 10) / 100).toFixed(2),
      );
      e.preventDefault();
    }
  };

  // Update cursor position
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [amount]);

  // Modified payment method navigation to include current amount
  // const handlePaymentMethodClick = () => {
  //   const currentParams = new URLSearchParams();
  //   if (amount) {
  //     currentParams.set('amount', amount);
  //   }
  //   router.push(`/profile/top_up/payment?${currentParams.toString()}`);
  // };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <NavbarHeader title={translate("TopUp")} backUrl="/profile/wallet" />

      {/* Main Content */}
      <div className="p-4 space-y-6 flex-1 pb-24">
        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-lg font-bold text-primary">
            {translate("TopUpAmount")}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              RM
            </span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-3 py-10 text-3xl font-semibold h-14 text-gray-400 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-primary">
            {translate("CurrentBalance")}
            {": "}
            {accData?.account.acc_wallet[0]?.walletValue?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        {/* Quick Amount Selection */}
        <div className="space-y-2">
          <p className="text-lg font-bold text-primary">
            {translate("SelectTopUpAmount")}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((value) => (
              <Button
                key={value}
                variant="default"
                className={cn(
                  "h-12 font-semibold border-gray-200 border text-primary/50 bg-gray-50",
                  {
                    "border-quaternary-foreground border text-quaternary-foreground bg-quaternary-foreground/15":
                      amount === value.toFixed(2),
                  },
                )}
                onClick={() => handleAmountSelect(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Payment Method */}

      {/* Top Up Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4">
        <Button
          variant="default"
          className="w-full h-12 rounded-full"
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={handleTopUp}
        >
          {translate("TopUp")}
        </Button>
      </div>
    </div>
  );
}
