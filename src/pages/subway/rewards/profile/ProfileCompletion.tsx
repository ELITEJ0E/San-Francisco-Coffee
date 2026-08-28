import React from "react";
import { InfoIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as Progress from "@radix-ui/react-progress";
import { MemberDetailsItem } from "./MemberDetailsItem";
import { Button } from "@/components/ui/button";
import { profileCompleteCalculate } from "./ProfileCompletionCalculate";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "../context/LanguageContext/useTranslation";
import { api } from "@/trpc/react";

interface ProfileCompletionProps {
  accData?: Record<string, unknown>;
  fieldsCompletion?: string[];
}

export function ProfileCard({
  accData,
  fieldsCompletion,
}: ProfileCompletionProps) {
  const { completionPercentage } = profileCompleteCalculate(
    accData,
    fieldsCompletion,
  );
  const { translate } = useTranslation();

  return (
    <div className="w-full p-4 rounded-lg shadow-lg py-8 px-8 text-primary">
      <div className="flex justify-between items-center mb-2 -mt-20">
        <span className="font-normal">
          {translate("ProfileCompletion")} {completionPercentage}%
        </span>
        <ProfileCompletion
          accData={accData}
          fieldsCompletion={fieldsCompletion}
        />
      </div>
      <Progress.Root
        className="relative h-[10px] w-full overflow-hidden rounded-full bg-gray-200"
        style={{
          transform: "translateZ(0)",
        }}
        value={completionPercentage}
      >
        <Progress.Indicator
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-primary transition-transform duration-500"
          style={{
            transform: `translateX(-${100 - completionPercentage}%)`,
          }}
        />
      </Progress.Root>
    </div>
  );
}

export function ProfileCompletion({
  accData,
  fieldsCompletion,
}: ProfileCompletionProps) {
  const { completionPercentage, completedItems } = profileCompleteCalculate(
    accData,
    fieldsCompletion,
  );
  const { translate } = useTranslation();

  const account = Cookies.get("accountId");

  const router = useRouter();

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

  const onCheckCompleteProfile = () => {
    if (!account) {
      toast.error(translate("SignInToCompleteProfile"));
      router.push("/signup");
    } else {
      if (
        "MyProfileDetails" in completedItems &&
        completedItems.MyProfileDetails === false
      ) {
        router.push("profile/my_profile/edit_profile?accID=" + account);
      }
      else if (
        "ShippingDetails" in completedItems &&
        completedItems.ShippingDetails === false
      ) {
        router.push("/profile/address");
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">
          <InfoIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white text-primary overflow-auto">
        <div className="flex flex-col gap-6">
          <img
            src="/images/ProfileCompleteProfile.svg"
            alt="Complete Profile"
            className="w-full h-auto object-contain"
          />
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bold text-xl text-primary">
              {translate("CompleteYourProfile")}
            </h1>
            <p className="text-sm text-primary mt-2">
              {translate("FinishSettingUpProfile")}
              <br />
              {translate("ReceiveReward").replace(
                "{profileRewardPoints}",
                String(profileRewardsDetails?.profileConfig?.rewardPoints ?? 0),
              )}
            </p>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-primary">
                {translate("Profile")} {completionPercentage}%
              </span>
            </div>
            <Progress.Root
              className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
              style={{ transform: "translateZ(0)" }}
              value={completionPercentage}
            >
              <Progress.Indicator
                className="h-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.65, 0, 0.35, 1)] rounded-full"
                style={{
                  transform: `translateX(-${100 - completionPercentage}%)`,
                }}
              />
            </Progress.Root>
          </div>
          <div className="flex flex-col gap-4">
            {Object.entries(completedItems).map(([label, completed], index) => (
              <MemberDetailsItem
                key={index}
                label={label}
                completed={completed}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary">
              {translate("PointRewardUponCompletion")}
            </span>
            <span className="text-tertiary-foreground font-semibold">
              +{profileRewardsDetails?.profileConfig.rewardPoints ?? 0}
            </span>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            {completionPercentage === 100 ? (
              <Button
                variant="secondary"
                className="w-full rounded-full font-semibold mt-6 py-3"
              >
                {translate("Close")}
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full rounded-full font-semibold mt-6 py-3"
                onClick={onCheckCompleteProfile}
              >
                {translate("CompleteNow")}
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
