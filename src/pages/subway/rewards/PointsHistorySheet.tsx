"use client";

import { useEffect, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, InfoIcon, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeContext } from "@/app/context/ThemeContext";

interface PointsHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "in-progress" | "completed";

export default function PointsHistorySheet({
  isOpen,
  onClose,
}: PointsHistorySheetProps) {
  const theme = useContext(ThemeContext);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    window.history.pushState({ sheet: "pointsHistory" }, "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  const allTransactions = [
    {
      id: "1",
      date: "7 Sep 2025, 22:10",
      description: "Order",
      points: 100,
      isPositive: true,
    },
    {
      id: "2",
      date: "6 Sep 2025, 17:10",
      description: "Redeem rewards",
      points: 75,
      isPositive: false,
    },
    {
      id: "3",
      date: "5 Sep 2025, 07:10",
      description: "Order",
      points: 50,
      isPositive: true,
    },
    {
      id: "4",
      date: "12 Aug 2025, 22:12",
      description: "Redeem rewards",
      points: 9,
      isPositive: false,
    },
    {
      id: "5",
      date: "11 Aug 2025, 10:10",
      description: "Redeem rewards",
      points: 6,
      isPositive: false,
    },
    {
      id: "6",
      date: "10 Aug 2025, 15:30",
      description: "Order",
      points: 9,
      isPositive: false,
    },
  ];

  const getFilteredTransactions = () => {
    switch (filter) {
      case "in-progress":
        return allTransactions.filter((t) => t.isPositive);
      case "completed":
        return allTransactions.filter((t) => !t.isPositive);
      default:
        return allTransactions;
    }
  };

  const groupTransactionsByMonth = () => {
    const filtered = getFilteredTransactions();
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "long",
      });
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByMonth();

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  const currentPoints = 7500;
  const targetPoints = 12500;
  const progress = (currentPoints / targetPoints) * 100;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full max-w-md p-0 bg-primary mx-auto"
        >
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-tertiary px-4 py-4 flex items-center">
              <button onClick={handleClose} className="mr-4">
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
              <SheetTitle className="flex-1 text-center text-lg font-bold text-primary">
                Points history
              </SheetTitle>
              <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="rounded-2xl p-2 mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        theme?.data?.membershipBronzeIcon ??
                        "/images/RewardBronze.svg"
                      }
                      alt="Tier Badge"
                      className="w-28 h-28 rounded-full object-cover select-none"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-tertiary font-bold text-2xl tracking-tight select-none">
                      7,500 Points
                    </h2>
                    <p className="text-primary-foreground/50 text-xs mt-1 select-none">
                      100 points expiring on 24 Dec 2026
                    </p>

                    <div className="mt-3">
                      <div className="h-2 w-full bg-tertiary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#76D72F] to-tertiary"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <img
                          src={
                            theme?.data?.pointIcon ??
                            "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_point_icon.svg"
                          }
                          alt="Subway Point"
                          className="w-5 h-5 select-none"
                        />
                        <span className="text-primary-foreground text-sm font-medium select-none">
                          500 points to{" "}
                          <span className="font-bold text-tertiary">
                            HOT SHOT
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-primary-foreground select-none">
                  Transaction History
                </h3>
                <button
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="p-1"
                >
                  <img
                    src="https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/filter_icon.svg"
                    alt="Filter Icon"
                  />
                </button>
              </div>

              <p className="text-sm text-primary-foreground text-center font-medium border-none bg-primary-foreground/10 rounded-full py-3 mb-4 select-none">
                <InfoIcon className="w-5 h-5 inline-block mr-2" />
                Transaction history up to 90 days only
              </p>

              {Object.entries(groupedTransactions).map(
                ([month, transactions]) => (
                  <div key={month} className="mb-6">
                    <h4 className="font-bold text-tertiary mb-3 select-none">
                      {month}
                    </h4>
                    <div className="space-y-3">
                      {transactions.map((transaction, tIdx) => (
                        <div key={transaction.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs text-primary-foreground/50 select-none">
                                {transaction.date}
                              </div>
                              <div className="text-sm text-primary-foreground font-medium mt-0.5 select-none">
                                {transaction.description}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "text-sm font-medium select-none",
                                transaction.isPositive
                                  ? "text-tertiary"
                                  : "text-tertiary-foreground",
                              )}
                            >
                              {transaction.isPositive ? "+" : "-"}
                              {transaction.points} Points
                            </span>
                          </div>
                          {tIdx < transactions.length - 1 && (
                            <div className="border-b border-primary-foreground/10 mt-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}

              {getFilteredTransactions().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-primary-foreground/50 select-none">
                    No transactions found
                  </p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent
          side="bottom"
          className="w-full max-w-md mx-auto rounded-t-3xl p-0 bg-primary"
        >
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-primary px-4 py-4 flex items-center border-b border-primary">
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="mr-4"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-primary-foreground">
                Filter Orders
              </h2>
              <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setFilter(option.id as FilterType);
                      setIsFilterSheetOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-all",
                      filter === option.id
                        ? "bg-tertiary text-primary font-semibold"
                        : "bg-gray-50 text-primary-foreground hover:bg-gray-100",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
