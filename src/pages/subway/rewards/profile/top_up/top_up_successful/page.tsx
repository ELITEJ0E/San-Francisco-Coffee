"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/trpc/react";
import { useAppContext } from "@/app/context/AppContext";
import { toast } from "sonner";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
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

export interface Address {
  addressID: string;
  address: string;
  addressName: string;
  postcode: string;
  lat: number;
  lon: number;
  person: string;
  phone: string;
  addressUnitBlock: string;
  countryCode: string;
  defaul_address: boolean;
}

export interface Wallet {
  walletid: string;
  walletValue: number;
  accLastLogin: string;
}

export interface Value {
  id: string;
  pointsValue: number;
  lastUpdated: string;
}

export interface Account {
  accID: string;
  accPhone: string;
  accName: string;
  accTier: string;
  acc_Addresses: Address[];
  acc_wallet: Wallet[];
  acc_gender: string;
  acc_email: string;
  acc_dob: string;
  acc_value: Value[];
  accLastLogin: string;
  emailVerified: boolean;
  consentYN: boolean;
  accCountry: string;
  isComplete: boolean;
  acc_refcode: string;
}

export default function Component() {
  const router = useRouter();
  const account = Cookies.get("accountId");
  const { submitOrderResponse } = useAppContext();
  const { translate } = useTranslation();

  interface Address {
    addressID: string;
    address: string;
    addressName: string;
    postcode: string;
    lat: number;
    lon: number;
    person: string;
    phone: string;
    addressUnitBlock: string;
    countryCode: string;
    defaul_address: boolean;
  }

  interface Wallet {
    walletid: string;
    walletValue: number;
    accLastLogin: string;
  }

  interface Value {
    id: string;
    pointsValue: number;
    lastUpdated: string;
  }

  interface Account {
    accID: string;
    accPhone: string;
    accName: string;
    accTier: string;
    acc_Addresses: Address[];
    acc_wallet: Wallet[];
    acc_gender: string;
    acc_email: string;
    acc_dob: string;
    acc_value: Value[];
    accLastLogin: string;
    emailVerified: boolean;
    consentYN: boolean;
    accCountry: string;
    isComplete: boolean;
    acc_refcode: string;
  }
  console.log(account, "accID");
  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery({
    accID: account ?? "",
    brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? ""
  });
  console.log(accData, "accDataNow");
  const { data: walletHistory } = api.loyalty.getWalletHistory.useQuery({
    accID: account ?? "",
  });

  const { resetAllAppContext } = useAppContext();

  console.log("Full accData structure:", accData);
  console.log("Type of accData:", typeof accData);
  console.log(
    "Keys in accData:",
    accData ? Object.keys(accData) : "accData is null/undefined",
  );

  // Get the latest transaction (most recent top-up)
  const latestTransaction = walletHistory?.[0] as WalletTransaction | undefined;
  console.log(latestTransaction, "latestTransaction");
  // Get current wallet balance
  const currentBalance = accData?.account as Account | undefined;

  const isEwalletPayment = JSON.parse(
    sessionStorage.getItem("isEwalletPayment") || "false",
  );
  console.log(isEwalletPayment, "isEwalletPayment");
  const storedOrderPayload = JSON.parse(
    sessionStorage.getItem("orderPayload") || "{}",
  );

  const { mutate: submitOrder, isPending } = api.post.submitOrder.useMutation({
    onSuccess: (data) => {
      setTimeout(() => {
        resetAllAppContext();
        toast.success("Payment successful! E-Wallet Deducted");
        sessionStorage.clear();
        window.location.href = data.result.url;
      }, 1000);

      // const walletDeductionData = {
      //   accID: account ?? "",
      //   walletTranscationReference: "",
      //   walletValue: submitOrderResponse?.total.grandTotal.toFixed(2) ?? "0.00",
      //   brand: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
      // };

      // console.log("Processing wallet payment:", walletDeductionData);

      // // Show processing state

      // deductWallet(walletDeductionData);

      // return;
    },
    onError: (error) => {
      //console.error("Error submitting order:", error);
      toast.error("PlacingOrderFailed");
    },
  });

  const handleEWalletPaymentClick = () => {
    if (isEwalletPayment) {
      if (storedOrderPayload != null) {
        console.log("Stored order payload:", storedOrderPayload);
        submitOrder(storedOrderPayload);
      } else {
        toast.error("No order details available");
        return;
      }
    } else {
      router.push("/profile/wallet");
    }
  };

  const { mutate: deductWallet } = api.loyalty.deductWallet.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        resetAllAppContext();
        toast.success("Payment successful! E-Wallet Deducted");
      }, 1000);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
      {/* Coin Jar Illustration */}
      <div className="mb-8">
        <img
          src="/images/Top Up Successful.svg"
          alt="Coin jar with golden coins"
          className="w-40 h-40 mx-auto"
        />
      </div>

      {/* Success Content */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl  text-primary">Top Up Successful</h1>
        <p className="text-primary text-sm leading-relaxed">
          Thank you for using our service!
          <br />
          Your balance has been updated.
        </p>
      </div>

      {/* Balance Display */}
      <div className="w-full bg-gray-100 rounded-lg p-6 mb-8 text-center">
        <p className="text-primary text-sm mb-2">Updated Balance</p>
        <p className="text-2xl  text-primary ">
          {"RM"}{" "}
          {currentBalance?.acc_wallet?.[0]?.walletValue?.toFixed(2) ?? "0.00"}
        </p>
      </div>

      {latestTransaction && (
        <div className="bg-white rounded-lg p-4 mb-8 w-full max-w-sm shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-primary">Top-up amount</span>
              <span className="font-medium text-primary">
                {latestTransaction.loyaltyWalletCurrency}{" "}
                {latestTransaction.loyaltyWalletTopUpValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary">Transaction time</span>
              <span className="font-medium text-primary">
                {new Date(
                  new Date(latestTransaction.transDate).getTime() -
                    8 * 60 * 60 * 1000,
                ).toLocaleString("en-us", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary">Transaction ID</span>
              <span className="font-medium text-xs text-primary">
                {latestTransaction.transId}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Done Button */}
      <Button
        variant="default"
        className="w-full h-12 rounded-full"
        onClick={handleEWalletPaymentClick}
        disabled={isPending}
      >
        {isPending ? "Processing..." : isEwalletPayment ? "Pay Now" : "Done"}
      </Button>
    </div>
  );
}
