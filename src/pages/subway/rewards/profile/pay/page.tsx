"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/context/ThemeContext";
import { useAppContext } from "@/app/context/AppContext";
import { api } from "@/trpc/react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

export default function Page() {
  const router = useRouter();
  const theme = useTheme();
  const [points, setPoints] = useState(0);
  const userProfile = {
    name: "Lucy Lim",
    points: 100,
    payment: "5000.00",
    profileCompletion: 20,
    avatar: theme.data?.brandRoundIcon ?? "/images/HomeProfileCharacter.png",
    barcode: "/images/FrameWallet.svg",
    qrcode: "/images/QrCodeWallet.svg",
  };
  const account = Cookies.get("accountId");
  const { translate } = useTranslation();

  const { data: accData } = api.loyalty.getLoyaltyAcc.useQuery(
    {
      accID: account ?? "",
      brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? ""
     },
    {
      enabled: !!account,
    },
  );

  const profile = accData?.account;
  const accPoints = accData?.account?.acc_value?.[0] || { pointsValue: 0 };

  useEffect(() => {
    setPoints(accPoints?.pointsValue || 0);
  }, [accPoints]);

  const getTierInfo = (points: number) => {
    if (points < 15000) {
      return {
        tier: "BRONZE",
        image: theme.data?.membershipBronzeIcon ?? "/images/RewardBronze.svg",
      };
    } else if (points < 30000) {
      return {
        tier: "SILVER",
        image: theme.data?.membershipSilverIcon ?? "/images/RewardSilver.svg",
      };
    } else {
      return {
        tier: "GOLD",
        image: theme.data?.membershipGoldIcon ?? "/images/RewardGold.svg",
      };
    }
  };

  const { tier, image } = getTierInfo(accPoints.pointsValue);

  return (
    <div className="flex flex-col mx-auto w-full min-h-screen bg-white max-w-md">
      <NavbarHeader title={translate("Pay")} backUrl="/profile/wallet" />
      <div
        className="h-60 bg-secondary bg-contain bg-bottom bg-no-repeat bg-[url('/images/QrBackgroundImage.svg')] rounded-b-[55px]"
        style={{
          // backgroundImage: `url(${theme?.data?.homeBackgroundImage ?? ""})`,
          backgroundImage: "/images/QrBackgroundImage.svg",
        }}
      />

      <div className="px-6 -mt-48">
        <div className="flex flex-col items-center bg-white rounded-xl shadow-xl shadow-black/20 p-8">
          <div className="flex flex-col items-center w-full gap-6">
            <img
              loading="lazy"
              src={userProfile.barcode}
              alt="User barcode"
              className="w-64"
            />

            <div className="flex justify-center w-full">
              <img
                loading="lazy"
                src={userProfile.qrcode}
                alt="User QR code"
                className="size-52"
              />
            </div>
          </div>

          <div className="w-full mt-8">
            <div className="border-b border-gray-300 w-full mb-6" />
            <div className="flex items-center justify-between w-full text-primary">
              <p className="font-base">eWallet Balance</p>
              <p className="font-bold">RM {userProfile.payment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
