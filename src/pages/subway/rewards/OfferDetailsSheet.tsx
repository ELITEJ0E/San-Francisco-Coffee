"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTheme } from "@/app/context/ThemeContext";
import { type Offer, type VoucherOffer, type RewardOffer } from "./OfferCard";

interface OfferDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

export const OfferDetailsSheet: React.FC<OfferDetailsSheetProps> = ({
  isOpen,
  onClose,
  offer,
}) => {
  const theme = useTheme();
  const [isOpened, setIsOpened] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    window.history.pushState({ sheet: "offerDetails" }, "");
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const handleImageError = () => {
    setImageError(true);
  };

  const isVoucher = offer.type === "voucher";
  const isReward = offer.type === "reward";
  const showGreenBackground = isReward && !offer.imageUrl;

  const getVoucher = (): VoucherOffer | null => {
    return isVoucher ? (offer) : null;
  };

  const getReward = (): RewardOffer | null => {
    return isReward ? (offer) : null;
  };

  const formatDateOnly = (dateStr?: string): string => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${datePart} | ${timePart}`;
  };

  const normalizeText = (text: string) =>
    text.replace(/\s*’\s*/g, "’").replace(/[’‘]/g, "'");

  const voucher = getVoucher();
  const reward = getReward();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-full p-0 bg-primary mx-auto w-full max-w-md rounded-t-3xl overflow-hidden"
      >
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="flex flex-col p-6">
            <div className="sticky top-0 z-10 bg-primary pt-2 pb-4 flex items-center">
              <button onClick={onClose} className="mr-4">
                <ChevronLeft className="h-6 w-6 text-primary-foreground" />
              </button>
              <SheetTitle className="flex-1 text-center text-lg font-bold text-primary-foreground">
                {isVoucher ? "Voucher Details" : "Reward Details"}
              </SheetTitle>
              <div className="w-6" />
            </div>

            <div className="border-b border-primary-foreground/10 mb-4" />

            <div className="bg-primary rounded-[24px] overflow-hidden border border-primary-foreground/10 flex h-36 mb-6">
              <div className="w-[45%] relative">
                {!imageError && offer.imageUrl ? (
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="w-full h-full object-cover select-none"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                ) : showGreenBackground ? (
                  <div className="w-full h-full bg-tertiary flex items-center justify-center">
                    <img
                      src={theme?.data?.pointIcon}
                      alt={offer.name}
                      className="w-16 h-16 object-contain select-none"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-tertiary/20 flex items-center justify-center">
                    <span className="text-tertiary font-bold text-lg select-none">
                      SUBWAY
                    </span>
                  </div>
                )}

                {reward?.isPopular && (
                  <div className="absolute top-2 left-2 bg-tertiary-foreground px-2 py-1 rounded-lg">
                    <p className="text-[8px] font-bold text-primary leading-tight select-none">
                      POPULAR
                    </p>
                  </div>
                )}

                {voucher && (
                  <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <p className="text-[8px] font-bold text-tertiary leading-tight select-none">
                      {voucher.valueType === "percentage"
                        ? `${voucher.value}% OFF`
                        : `RM${voucher.value} OFF`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-primary-foreground font-bold text-sm leading-tight select-none">
                    {offer.name}
                  </h4>
                  <p className="text-primary-foreground/50 text-xs mt-1 select-none">
                    {offer.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  {voucher && (
                    <span className="text-tertiary text-[10px] font-bold select-none">
                      View T&Cs
                    </span>
                  )}
                  {reward && (
                    <div className="flex items-center gap-1">
                      <img
                        src={theme?.data?.pointIcon}
                        alt="Points"
                        className="w-4 h-4 select-none"
                      />
                      <span className="text-tertiary text-xs font-bold select-none">
                        {reward.pointsRequired} Points
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reward && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Points Required
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <img
                      src={theme?.data?.pointIcon}
                      alt="Points"
                      className="w-5 h-5 select-none"
                    />
                    <span className="text-sm text-tertiary font-bold">
                      {reward.pointsRequired} Points
                    </span>
                  </div>
                </div>
              )}

              {reward?.validUntil && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Valid Until
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    {reward.validUntil}
                  </p>
                </div>
              )}

              {voucher && voucher.minSpendingAmount > 0 && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Min. Spend Amount
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    RM{voucher.minSpendingAmount}
                  </p>
                </div>
              )}

              <div>
                <p className="text-base text-primary-foreground font-semibold">
                  Discount
                </p>
                <p className="text-sm text-primary-foreground/70 font-normal">
                  {offer.valueType === "percentage"
                    ? `${offer.value}% off your order`
                    : `RM${offer.value} off your order`}
                </p>
              </div>

              {voucher && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Valid Period
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    {voucher.includeValidTime
                      ? `${formatDateTime(voucher.validityStartAt)} - ${formatDateTime(voucher.validityEndAt)}`
                      : `${formatDateOnly(voucher.validityStartAt)} - ${formatDateOnly(voucher.validityEndAt)}`}
                  </p>
                </div>
              )}

              {voucher && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Applicable Store
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    {voucher.isAllStore ? "All Stores" : voucher.storeName}
                  </p>
                </div>
              )}

              {voucher && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Order Type
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    {voucher.orderType?.join(", ").toUpperCase()}
                  </p>
                </div>
              )}

              {voucher && (
                <div>
                  <p className="text-base text-primary-foreground font-semibold">
                    Redemption Method
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-normal">
                    {voucher.redemptionMethod?.toUpperCase()}
                  </p>
                </div>
              )}

              {voucher?.termAndCondition?.length ||
              reward?.termsAndConditions?.length ? (
                <div>
                  <div className="border-b border-primary-foreground/10 my-4" />
                  <Collapsible open={isOpened} onOpenChange={setIsOpened}>
                    <div className="flex flex-row justify-between items-center">
                      <div className="text-base text-primary-foreground font-semibold">
                        Terms & Conditions
                      </div>
                      <CollapsibleTrigger className="text-primary-foreground">
                        {isOpened ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <ul className="text-sm text-primary-foreground/70 font-normal list-disc pl-6 space-y-2 mt-3">
                        {(
                          voucher?.termAndCondition ??
                          reward?.termsAndConditions ??
                          []
                        ).map((term: string, index: number) => (
                          <li key={index}>{normalizeText(term)}</li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ) : null}
            </div>

            {reward && (
              <Button
                onClick={() => {
                  console.log("Redeem reward:", offer);
                  onClose();
                }}
                className="w-full mt-8 py-3 rounded-full bg-tertiary-foreground text-primary font-bold hover:bg-tertiary-foreground/90"
              >
                Redeem Now
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
