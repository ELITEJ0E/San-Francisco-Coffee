"use client";

import React from "react";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { useNavigate } from "react-router-dom";

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

export default function WalletTransactionPage() {
  const navigate = useNavigate();
  const account = Cookies.get("accountId");

  const { data: walletHistory } = api.loyalty.getWalletHistory.useQuery({
    accID: account || "",
  });
  const { translate } = useTranslation();

  const groupedTransactions: Record<string, FormattedTransaction[]> =
    Array.isArray(walletHistory)
      ? walletHistory.reduce(
          (acc: Record<string, FormattedTransaction[]>, transaction: WalletTransaction) => {
            const date = new Date(transaction.transDate);
            const manualAdjust = new Date(date.getTime() - 8 * 60 * 60 * 1000);
            console.log(manualAdjust, "manualAdjust");
            const monthYear = `${manualAdjust.toLocaleString("default", {
              month: "long",
            })} ${date.getFullYear()}`;

            if (!acc[monthYear]) {
              acc[monthYear] = [];
            }

            acc[monthYear].push({
              id: transaction.transId,
              date: manualAdjust.toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kuala_Lumpur",
              }),

              type:
                transaction.loyaltyWalletTopUpValue > 0 ? "Top up" : "Payment",
              amount:
                transaction.loyaltyWalletTopUpValue ||
                transaction.loyaltyWalletDeductValue,
              details:
                transaction.loyaltyBrandId === "CREDIT_CARD"
                  ? "From Credit Card"
                  : transaction.loyaltyBrandId,
              isPositive: transaction.loyaltyWalletTopUpValue > 0,
            });

            return acc as Record<string, FormattedTransaction[]>;
          },
          {},
        )
      : {};

  return (
    <div className="flex flex-col mx-auto w-full h-full bg-white max-w-md">
      <div className="flex items-center justify-center relative py-5 w-full bg-secondary text-2xl shadow-xl z-10 sticky top-0">
        <button
          className="absolute left-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </button>
        <h1 className="text-xl font-semibold text-primary">
          {translate("WalletTransaction")}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-center items-center text-gray-500 text-sm bg-gray-200 rounded-full w-fit p-1 mx-auto px-6 my-4">
          <span className="mr-2 text-secondary ">⏱</span>
          {translate("TransactionInfo")}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedTransactions)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([month, transactions]) => (
              <div key={month} className="space-y-4">
                <h3 className="text-secondary ml-3.5 font-semibold">
                  {month}{" "}
                  {new Date().getFullYear() !==
                  new Date(Date.parse(month + " 1, 2024")).getFullYear()
                    ? ` ${new Date().getFullYear()}`
                    : ""}
                </h3>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-white p-3 rounded-lg shadow-sm space-y-2"
                    >
                      <div className="text-sm text-gray-500">
                        {transaction.date}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-600 my-1">
                            {transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.details}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "font-medium",
                            transaction.isPositive
                              ? "text-tertiary"
                              : "text-destructive",
                          )}
                        >
                          {transaction.isPositive ? "+" : "-"}RM{" "}
                          {transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
