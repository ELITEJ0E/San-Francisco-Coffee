"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "@/trpc/react";
import { useAppContext } from "@/app/context/AppContext";
import { toast } from "sonner";
import { CheckCircle2, Wallet, ArrowRight } from "lucide-react";

export interface WalletTransaction {
  transId: string;
  transDate: string;
  loyaltyWalletCustomerId: string;
  loyaltyWalletTopUpValue: number;
  loyaltyWalletDeductValue: number;
  loyaltyWalletCurrency: string;
  loyaltyBrandId: string;
  loyaltyTransactionReference: string;
  lastUpdDate: string;
}

export default function Component() {
  const navigate = useNavigate();
  const account = Cookies.get("accountId");
  const { resetAllAppContext } = useAppContext();

  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery({
    accID: account ?? "",
    brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? ""
  });

  const { data: walletHistory } = api.loyalty.getWalletHistory.useQuery({
    accID: account ?? "",
  });

  const latestTransaction = walletHistory?.[0] as WalletTransaction | undefined;
  const currentBalance = accData?.account;

  const isEwalletPayment = JSON.parse(
    sessionStorage.getItem("isEwalletPayment") || "false",
  );
  const storedOrderPayload = JSON.parse(
    sessionStorage.getItem("orderPayload") || "{}",
  );

  const { mutate: submitOrder, isPending } = api.post.submitOrder.useMutation({
    onSuccess: (data: { result?: { url?: string } }) => {
      setTimeout(() => {
        resetAllAppContext();
        toast.success("Payment successful! E-Wallet Deducted");
        sessionStorage.clear();
        navigate(data?.result?.url || "/orders");
      }, 1000);
    },
    onError: () => {
      toast.error("Placing order failed");
    },
  });

  const handleEWalletPaymentClick = () => {
    if (isEwalletPayment) {
      if (storedOrderPayload != null) {
        submitOrder(storedOrderPayload);
      } else {
        toast.error("No order details available");
        return;
      }
    } else {
      navigate("/profile/wallet");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-between p-6 max-w-md mx-auto text-stone-900 select-none">
      <div className="w-full flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Checkmark Badge */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
        </div>

        {/* Success Header */}
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Top-Up Successful!
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed max-w-xs mb-6">
          Your wallet has been credited successfully. You can now use your SFC Wallet balance for orders & rewards.
        </p>

        {/* Balance Card */}
        <div className="w-full bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4 text-[#BA1C24]" />
            Updated Wallet Balance
          </div>
          <p className="text-3xl font-serif font-bold text-[#BA1C24]">
            RM {currentBalance?.acc_wallet?.[0]?.walletValue?.toFixed(2) ?? "50.00"}
          </p>
        </div>

        {/* Transaction Summary */}
        {latestTransaction && (
          <div className="w-full bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2.5 text-xs text-stone-600 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100 font-medium text-stone-900">
              <span>Transaction Receipt</span>
              <span className="text-[#BA1C24] font-bold">COMPLETED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Top-up amount</span>
              <span className="font-bold text-stone-900">
                {latestTransaction.loyaltyWalletCurrency}{" "}
                {latestTransaction.loyaltyWalletTopUpValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Transaction ID</span>
              <span className="font-mono text-stone-700">
                {latestTransaction.transId}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      <div className="w-full pt-4">
        <Button
          variant="default"
          className="w-full h-12 rounded-full font-bold bg-[#BA1C24] hover:bg-[#9E151C] text-white shadow-md flex items-center justify-center gap-2 text-sm"
          onClick={handleEWalletPaymentClick}
          disabled={isPending}
        >
          {isPending ? "Processing Order..." : isEwalletPayment ? "Pay Order Now" : "Back to Wallet"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
