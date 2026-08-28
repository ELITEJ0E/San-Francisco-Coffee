"use client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

export default function ProfileCompleted() {
  const router = useRouter();
  const account = Cookies.get("accountId");

  const { data: profileRewardsDetails } =
    api.loyalty.getLoyaltyPointsRate.useQuery(
      {
        configId: "PROFILE",
        brand: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
      },
      {
        // Only enable the query when account is not null
        enabled: !!account,
      },
    );

  const { translate } = useTranslation();

  const handleAddPoints = () => {
    if (!account) return;
    // Add logic to handle adding points here
  };

  return (
    <div className="flex min-h-screen justify-center bg-white px-6 pt-20 max-w-md mx-auto">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex items-center justify-center">
          <img src="/images/ProfileCompleted.svg" alt="" className="size-52" />
        </div>
        <p className="text-3xl font-semibold text-primary">
          {translate("ProfileCompleted")}
        </p>
        <p className="text-primary px-10 pb-10 border-b border-gray-200">
          {translate("ProfileCompletedDesc")}
        </p>
        <div className="px-6">
          <p className="text-primary flex justify-between">
            {translate("PointsEarned")}{" "}
            <span className="text-tertiary-foreground text-xl font-bold">
              + {profileRewardsDetails?.profileConfig.rewardPoints ?? 0}
            </span>
          </p>
        </div>
        <button
          className="w-full rounded-full bg-secondary py-4 text-primary font-semibold transition-colors"
          onClick={() => {
            handleAddPoints();
            router.push("/profile");
          }}
        >
          {translate("Done")}
        </button>
      </div>
    </div>
  );
}
