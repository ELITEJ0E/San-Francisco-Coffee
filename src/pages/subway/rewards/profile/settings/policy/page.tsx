"use client";

import { useRouter } from "next/navigation";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

export default function Page() {
  const router = useRouter();
  const { translate } = useTranslation();
  
  return (
    <div className="max-w-md mx-auto bg-primary-foreground h-full overflow-hidden flex flex-col">
      <div className="bg-[#008f52] text-white">
        <NavbarHeader 
          title={translate("Policy")} 
          backUrl="/profile/settings" 
          className="bg-[#008f52] text-white border-b-0" 
          iconClass="text-white" 
        />
      </div>
      <div className="flex-1 bg-white">
        <nav className="divide-y divide-gray-100 text-black px-4">
          <Button
            variant={"ghost"}
            onClick={() => router.push("/profile/settings/policy/privacy_policy")}
            className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/SettingPolicy.svg"
                alt="Privacy icon"
                className="w-5 h-5 flex-shrink-0"
              />
              <span className="text-[15px] font-bold">
                {translate("PrivacyPolicy")}
              </span>
            </div>
            <img
              src="/images/RightIcon.svg"
              alt="right"
              className="w-5 h-5 opacity-60"
            />
          </Button>

          {/* Refund policy button */}
          <Button
            variant={"ghost"}
            onClick={() => router.push("/profile/settings/policy/refund_policy")}
            className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/RefundPolicy.svg"
                alt="Refund icon"
                className="w-5 h-5 flex-shrink-0 opacity-80"
              />
              <span className="text-[15px] font-bold">
                {translate("RefundPolicy") || "Refund policy"}
              </span>
            </div>
            <img
              src="/images/RightIcon.svg"
              alt="right"
              className="w-5 h-5 opacity-60"
            />
          </Button>

          {/* Loyalty & rewards policy button */}
          <Button
            variant={"ghost"}
            onClick={() => router.push("/profile/settings/policy/reservation_policy")}
            className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
          >
            <div className="flex items-center gap-3">
              <img
                src="/images/SettingPolicy.svg"
                alt="Loyalty icon"
                className="w-5 h-5 flex-shrink-0 opacity-80"
              />
              <span className="text-[15px] font-bold">
                {"Loyalty & rewards policy"}
              </span>
            </div>
            <img
              src="/images/RightIcon.svg"
              alt="right"
              className="w-5 h-5 opacity-60"
            />
          </Button>
        </nav>
      </div>
    </div>
  );
}