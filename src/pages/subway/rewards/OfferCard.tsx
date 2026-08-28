"use client";

import { useState } from "react";
import { OfferDetailsSheet } from "./OfferDetailsSheet";
import { useTheme } from "@/app/context/ThemeContext";

export type OfferType = "voucher" | "reward";

export interface BaseOffer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: OfferType;
}

export interface VoucherOffer extends BaseOffer {
  type: "voucher";
  value: number;
  valueType: "absolute" | "percentage";
  expiredAt: string;
  minSpendingAmount: number;
  orderType: string[];
  isAllStore: boolean;
  storeName: string;
  termAndCondition: string[];
  redemptionMethod: string;
  validityStartAt: string;
  validityEndAt: string;
  includeValidTime: boolean;
}

export interface RewardOffer extends BaseOffer {
  type: "reward";
  pointsRequired: number;
  value: number;
  valueType: "absolute" | "percentage";
  isPopular?: boolean;
  validUntil?: string;
  termsAndConditions?: string[];
}

export type Offer = VoucherOffer | RewardOffer;

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const theme = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const isVoucher = offer.type === "voucher";
  const isReward = offer.type === "reward";
  const showGreenBackground = isReward && !offer.imageUrl;

  const getVoucherValue = () => {
    if (isVoucher) {
      const voucher = offer;
      return voucher.value;
    }
    return 0;
  };

  const getVoucherValueType = () => {
    if (isVoucher) {
      const voucher = offer as VoucherOffer;
      return voucher.valueType;
    }
    return "absolute" as const;
  };

  const getPointsRequired = () => {
    if (isReward) {
      const reward = offer as RewardOffer;
      return reward.pointsRequired;
    }
    return 0;
  };

  const getIsPopular = () => {
    if (isReward) {
      const reward = offer as RewardOffer;
      return reward.isPopular || false;
    }
    return false;
  };

  const getMinSpendingAmount = () => {
    if (isVoucher) {
      const voucher = offer as VoucherOffer;
      return voucher.minSpendingAmount;
    }
    return 0;
  };

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="bg-primary rounded-[24px] overflow-hidden shadow-sm border border-primary-foreground/10 flex h-36 cursor-pointer active:scale-[0.98] transition-transform"
      >
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

          {isReward && getIsPopular() && (
            <div className="absolute top-2 left-2 bg-tertiary-foreground px-2 py-1 rounded-lg">
              <p className="text-[8px] font-bold text-primary leading-tight select-none">
                POPULAR
              </p>
            </div>
          )}

          {isVoucher && (
            <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <p className="text-[8px] font-bold text-tertiary leading-tight select-none">
                {getVoucherValueType() === "percentage"
                  ? `${getVoucherValue()}% OFF`
                  : `RM${getVoucherValue()} OFF`}
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
            {isVoucher && getMinSpendingAmount() > 0 && (
              <p className="text-primary-foreground/50 text-xs mt-1 select-none">
                Min spend RM{getMinSpendingAmount()}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center">
            {isVoucher && (
              <span className="text-tertiary text-[10px] font-bold select-none">
                View T&Cs
              </span>
            )}
            {isReward && (
              <div className="flex items-center gap-1">
                <img
                  src={theme?.data?.pointIcon}
                  alt="Points"
                  className="w-4 h-4 select-none"
                />
                <span className="text-tertiary text-xs font-bold select-none">
                  {getPointsRequired()} Points
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <OfferDetailsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        offer={offer}
      />
    </>
  );
};
