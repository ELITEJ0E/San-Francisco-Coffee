"use client";

import { useState } from "react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff as EyeClosed, CircleArrowOutUpRight, Scan } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { Button } from "@/components/ui/button";
import SubNavBar from "@/components/ui/SubNavBar";

interface WalletTransaction {
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

interface FormattedTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  details: string;
  isPositive: boolean;
}

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const theme = useTheme();
  const router = useRouter();
  const account = Cookies.get("accountId");
  const { translate } = useTranslation();

  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery({
    accID: account ?? "",
    brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? ""
  });

  const EWallet = accData?.account?.acc_wallet[0];

  const { data: walletHistory } = api.loyalty.getWalletHistory.useQuery({
    accID: account ?? "",
  });

  const sortedTransactions = Array.isArray(walletHistory)
    ? walletHistory
        .sort(
          (a, b) =>
            new Date(b.transDate).getTime() - new Date(a.transDate).getTime(),
        )
        .slice(0, 10)
    : [];

  // Group transactions by month and year
  const groupedTransactions: Record<string, FormattedTransaction[]> =
    sortedTransactions.reduce(
      (
        acc: Record<string, FormattedTransaction[]>,
        transaction: WalletTransaction,
      ) => {
        const date = new Date(transaction.transDate);
        const manualAdjust = new Date(date.getTime() - 8 * 60 * 60 * 1000);
        console.log(manualAdjust, "manualAdjust");
        const monthYear = manualAdjust.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }

        acc[monthYear].push({
          id: transaction.transId,
          date: manualAdjust.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: transaction.loyaltyWalletTopUpValue > 0 ? "Top up" : "Payment",
          amount:
            transaction.loyaltyWalletTopUpValue ||
            transaction.loyaltyWalletDeductValue,
          details: `Brand: ${transaction.loyaltyBrandId}`,
          isPositive: transaction.loyaltyWalletTopUpValue > 0,
        });

        return acc;
      },
      {},
    );

  const toggleBalanceVisibility = () => {
    setShowBalance((prevState) => !prevState);
  };

  return (
    <div className="min-h-full bg-secondary pb-2">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <NavbarHeader
          title={translate("EWallet")}
          onClose={() => router.push("/profile")}
        ></NavbarHeader>
        <div className="pt-6 space-y-6 px-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Avatar className="border-2 border-secondary/60 size-16">
                <AvatarImage
                  src={
                    theme.data?.brandRoundIcon ??
                    "/images/HomeProfileCharacter.png"
                  }
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-row items-center gap-2 text-primary">
                  <p className="text-sm ">{translate("EWalletBalance")}</p>
                  <button onClick={toggleBalanceVisibility}>
                    {showBalance ? (
                      <Eye className="size-5" />
                    ) : (
                      <EyeClosed className="size-5" />
                    )}
                  </button>
                </div>
                <p className="pt-4 text-primary text-4xl font-semibold">
                  RM{" "}
                  {showBalance
                    ? (EWallet?.walletValue ?? 0)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "xxxx.xx"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10 mt-4">
          <Button
            variant={"secondary"}
            className="text-lg bg-secondary text-primary rounded-full w-full font-semibold shadow-xs hover:bg-[#BA1C24] hover:text-white transition-all border border-[#BA1C24]/20"
            onClick={() => router.push("/profile/pay")}
          >
            <Scan className="size-5 text-[#BA1C24] group-hover:text-white" />
            <span className="text-xs font-bold">{translate("Pay") || "QR Scan Pay"}</span>
          </Button>

          <Button
            variant={"secondary"}
            className="text-lg bg-secondary text-primary rounded-full w-full font-semibold shadow-xs hover:bg-[#BA1C24] hover:text-white transition-all border border-[#BA1C24]/20"
            onClick={() => router.push("/profile/top_up")}
          >
            <CircleArrowOutUpRight className="size-5 text-secondary-foreground" />
            <span className="text-xs font-bold">{translate("TopUp")}</span>
          </Button>
        </div>

        {/* Transactions */}
        <Card className="rounded-t-3xl p-6 bg-white min-h-screen -mt-6 pb-28">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-primary text-base">
              {translate("TransactionHistory")}
            </h2>
            <Link
              href="/profile/wallet/see_all"
              className="text-primary text-sm"
            >
              {translate("ViewAll")}
            </Link>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedTransactions)
              .sort(
                (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
              )
              .map(([monthYear, transactions]) => (
                <div key={monthYear}>
                  <div className="flex flex-row items-center mb-4">
                    <h3 className="w-auto text-quaternary-foreground font-bold whitespace-nowrap">
                      {monthYear}
                    </h3>
                    <div className="w-full border-gray-200 border ml-4"></div>
                  </div>
                  <div className="space-y-6">
                    {transactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-start"
                      >
                        <div className="flex flex-col w-full">
                          <p className="text-xs font-medium text-primary mb-1">
                            {transaction.date}
                          </p>
                          <div className="flex justify-between items-center w-full text-base text-primary">
                            <p className="font-medium mb-1">
                              {transaction.type}
                            </p>
                            <p
                              className={`font-medium ${
                                transaction.isPositive
                                  ? "text-tertiary"
                                  : "text-destructive"
                              }`}
                            >
                              {transaction.isPositive ? "+" : "-"}RM{" "}
                              {transaction.amount.toFixed(2)}
                            </p>
                          </div>

                          <p className="text-xs font-medium text-primary">
                            {transaction.details}
                          </p>
                          {index !== transactions.length - 1 && (
                            <div className="w-full border-gray-100 border mt-4"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full max-w-md z-50">
          <SubNavBar activePage="Profile" />
        </div>
      </div>
    </div>
  );
}
