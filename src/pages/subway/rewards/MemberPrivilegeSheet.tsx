"use client";

import { useEffect, useContext } from "react";
import { ChevronLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeContext } from "@/app/context/ThemeContext";

interface MembershipPrivilegeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipPrivilegeSheet({
  isOpen,
  onClose,
}: MembershipPrivilegeSheetProps) {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    window.history.pushState({ sheet: "privileges" }, "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  const privileges = [
    {
      title: "Collect Points to redeem rewards",
      image:
        "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/collect-points.png",
      description: "",
    },
    {
      title: "RM20 Off Birthday Voucher on your birthday month",
      image:
        "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/rm20-off.png",
      description: "T&C Applies",
    },
    {
      title: "RM5 Off Welcome Voucher",
      image:
        "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/rm5-off.png",
      description: "T&C Applies",
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-md p-0 bg-[#F7F7F7] mx-auto"
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-tertiary px-4 py-4 flex items-center">
            <button onClick={handleClose} className="mr-4">
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <SheetTitle className="flex-1 text-center text-lg font-bold text-primary">
              Membership privileges
            </SheetTitle>
            <div className="w-6" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-primary rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
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
                <h2 className="text-primary-foreground font-bold text-xl tracking-tight select-none">
                  RISING STAR
                </h2>
                <p className="text-primary-foreground/70 text-sm mt-1 select-none">
                  Collect 7,500 points to reach{" "}
                  <span className="font-bold text-tertiary">HOT SHOT</span>
                </p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-primary-foreground mb-3 select-none">
              Membership privileges
            </h3>
            <div className="space-y-3">
              {privileges.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-primary rounded-xl p-4 border border-primary-foreground/10"
                  style={{ minHeight: "90px" }}
                >
                  <div className="flex gap-6 items-center h-full">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary-foreground font-bold text-sm select-none">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-primary-foreground/50 text-xs mt-1 select-none">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
