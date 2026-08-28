"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import ErrorPage from "@/components/layout/ErrorPage";
import { useRouter } from "next/navigation";

export default function ReferralProgram() {
  const [open, setOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const account = Cookies.get("accountId") ?? "";
  const { translate } = useTranslation();
  const router = useRouter();

  // Keep getLoyaltyAcc as a query
  const { data: accData, isLoading: isLoadingAcc } =
    api.loyalty.getLoyaltyAcc.useQuery({
      accID: account,
      brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
    });

  // Convert getReferralCode to mutation
  const { mutateAsync: getReferralCode } =
    api.loyalty.getReferralCode.useMutation();

  const { data: referralDetails } = api.loyalty.getReferralProgram.useQuery(
    {
      brand: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
    },
    {
      // Only enable the query when account is not null
      enabled: !!account,
    },
  );

  const referralSteps = [
    {
      number: 1,
      image: "/images/ReferralStep1.svg",
      title: translate("ClickOnReferNow"),
      description: translate("ShareUniqueLink"),
    },
    // Conditionally add step 2 based on rulesId
    ...(referralDetails?.referralConfig.referrer.ruleTypes[0].rulesId.includes(
      "On Sign Up",
    )
      ? [
          {
            number: 2,
            image: "/images/ReferralStep2.svg",
            title: translate("YourFriendCompleteRegistration"),
            description: translate("YouWillGetPointsAsReward").replace(
              "{rewardPoints}",
              referralDetails?.referralConfig.referrer.rewardPoints.toString(),
            ),
          },
        ]
      : referralDetails?.referralConfig.referrer.ruleTypes[0].rulesId.includes(
            "On First Purchase",
          )
        ? [
            {
              number: 2,
              image: "/images/ReferralStep2.svg",
              title: translate("GetPointsReward").replace(
                "{rewardPoints}",
                referralDetails?.referralConfig.referrer.rewardPoints.toString(),
              ),
              description: translate("OncePurchaseGetPoints").replace(
                "{rewardPoints}",
                referralDetails?.referralConfig.referrer.rewardPoints.toString(),
              ),
            },
          ]
        : []),
  ];

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (accData?.account?.acc_refcode) {
        setReferralCode(accData.account.acc_refcode);
        setReferralLink(
          `${process.env.NEXT_PUBLIC_EMP_REF_URL}/signup?ref=${accData.account.acc_refcode}&accID=${account}`,
        );
      } else if (accData) {
        // Only fetch referral code if we have accData but no acc_refcode
        try {
          const loyaltyData = await getReferralCode({
            accID: account,
            brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
          });
          if (loyaltyData?.referralCode) {
            setReferralCode(loyaltyData.referralCode);
            setReferralLink(
              `${process.env.NEXT_PUBLIC_EMP_REF_URL}/signup?ref=${loyaltyData.referralCode}&accID=${account}`,
            );
          }
        } catch (error) {
          toast.error(translate("ReferralCodeFetchFailed"));
          console.error("Error fetching referral code:", error);
        }
      }
    };

    fetchReferralCode();
  }, [accData, account, getReferralCode]);

  // Share options with dynamic WhatsApp share
  const shareOptions = [
    // {
    //   name: "Facebook",
    //   icon: "/images/Facebook.svg",
    //   shareAction: () => {
    //     toast.error("Facebook sharing not implemented");
    //   },
    // },
    // {
    //   name: "Messenger",
    //   icon: "/images/Messenger.svg",
    //   shareAction: () => {
    //     toast.error("Messenger sharing not implemented");
    //   },
    // },
    {
      name: "Whatsapp",
      icon: "/images/whatsapp.svg",
      shareAction: () => {
        if (!referralCode || !referralLink) {
          toast.error(translate("ReferralInfoUnavailable"));
          return;
        }

        const message = translate("ReferralMessage")
          .replace("{referralCode}", referralCode)
          .replace("{referralLink}", referralLink)
          .replace(
            "{rewardPoints}",
            referralDetails?.referralConfig.referrer.rewardPoints.toString() ??
              "",
          );

        // Encode the message for WhatsApp share URL
        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
      },
    },
    // {
    //   name: "Wechat",
    //   icon: "/images/Wechat.svg",
    //   shareAction: () => {
    //     toast.error("Wechat sharing not implemented");
    //   },
    // },
  ];

  if (!referralDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <ErrorPage
            type={"something-went-wrong"}
            onRetry={() => router.refresh()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-full flex flex-col overflow-hidden">
      <div className="bg-[#008f52] text-white flex flex-col items-center pb-8 border-b-8 border-gray-100">
        <div className="w-full flex items-center p-4">
          <button onClick={() => router.back()} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center -mt-6">
          <div className="flex items-center text-4xl font-black italic tracking-tighter">
            <span className="text-[#F5C518]">SUB</span>
            <span className="text-white">WAY</span>
          </div>
          <span className="text-white text-lg font-bold tracking-[0.3em] mt-1">REWARDS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-4">
          <h1 className="font-bold text-2xl text-black mb-3">
            {translate("ReferAFriend") || "Refer a Friend"}
          </h1>
          <p className="text-sm text-black font-medium px-4">
            {translate("ReferralDescription") || "Share the experience, and earn 100 points as a thank you for every referral."}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-3 px-6 mt-4 pb-10 border-b border-gray-100">
          <div className="bg-[#F5F5F5] rounded-full flex items-center justify-between px-5 py-3.5 flex-1 max-w-[200px]">
            <span className="text-black font-bold text-base">{referralCode || "QXMB4Q"}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralCode || "QXMB4Q");
                toast.success("Code copied!");
              }}
              className="text-gray-500 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="rounded-full bg-[#fbbc04] hover:bg-[#eab308] text-black font-bold text-base px-6 py-6 h-auto max-w-[140px]"
                disabled={isLoadingAcc}
              >
                {isLoadingAcc ? translate("Loading") : (translate("ReferNow") || "Refer now")}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-48 bg-white rounded-t-[40px] max-w-md mx-auto"
            >
              <SheetTitle className="hidden">Share</SheetTitle>
              <div className="mt-10">
                <div className="flex flex-row justify-between px-4">
                  {shareOptions.map((option) => (
                    <div
                      key={option.name}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                      onClick={() => {
                        if (referralCode) {
                          option.shareAction();
                        } else {
                          toast.error(
                            "Referral Code is not available for this account.",
                          );
                        }
                      }}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <Image
                          src={option.icon}
                          alt={option.name}
                          width={24}
                          height={24}
                          className="size-8"
                        />
                      </div>
                      <span className="text-sm text-primary">{option.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col gap-8 px-6 py-8">
          {referralSteps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0 size-7 bg-[#008f52] text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                {step.number}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-black text-sm">{step.title}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[#008f52] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-none tracking-tighter italic">S</span>
            </div>
            <span className="text-black font-medium text-sm max-w-[200px]">
              {referralDetails?.referralConfig?.referrer?.ruleTypes?.[0]?.rulesId?.includes("On First Purchase") 
                ? "Points upon your friend's first purchase" 
                : "Points upon your friend's sign up"}
            </span>
          </div>
          <span className="text-[#008f52] font-black text-xl">
            +{referralDetails?.referralConfig?.referrer?.rewardPoints || "100"}
          </span>
        </div>
      </div>
    </div>
  );
}
