"use client";

import React, { useEffect, useState } from "react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { QRCodeSVG } from "qrcode.react";
import { api as Api } from "@/trpc/react";
import { useTheme } from "@/app/context/ThemeContext";
import { InactiveAccountDialog } from "@/components/ui/InactiveAccountDialog";
import LoadingAnimation from "@/components/loadingAnimation";

export default function QRPage() {
  const { translate } = useTranslation();
  const theme = useTheme();
  const [accountId, setAccountId] = useState<string>("");
  const [accIdForQr, setAccIdForQr] = useState<string>("");
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const account = Cookies.get("accountId");
    setAccountId(account ?? "");
  }, []);

  const {
    data: accData,
    // error: accountError,
    isLoading,
  } = Api.loyalty.getLoyaltyAcc.useQuery(
    { accID: accountId ?? "", brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "" },
    {
      enabled: !!accountId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // refetchInterval: 30000,
    },
  );

  const profile = accData?.account;

  useEffect(() => {
    if (profile?.accountStatus) {
      const isActive = profile.accountStatus.toLowerCase() === "active";
      if (!isActive) {
        console.log("Account is inactive:", profile.accountStatus);
        setShowInactiveDialog(true);
        setErrorMessage(`Account status: ${profile.accountStatus}`);
      }
    }
  }, [profile]);

  // useEffect(() => {
  //   if (accountError) {
  //     console.log("Account API error:", accountError);
  //     setShowInactiveDialog(true);
  //     setErrorMessage(
  //       accountError instanceof Error ? accountError.message : "Unknown error",
  //     );
  //   }
  // }, [accountError]);

  useEffect(() => {
    if (accData?.account?.accIdForQr) {
      setAccIdForQr(accData.account.accIdForQr);
    }
  }, [accData]);

  const renderCustomQRCode = () => (
    <div className="relative">
      <QRCodeSVG
        value={accIdForQr}
        size={220}
        level="H"
        includeMargin={true}
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-full">
          <img
            src={theme.data?.seoImage ?? "/images/MKLogo.svg"}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col mx-auto w-full min-h-screen bg-white max-w-md relative">
        <div className="absolute top-0 left-0 right-0 h-80">
          <NavbarHeader title={translate("MyQRCode")} backUrl="" />
          <div
            className="h-full bg-secondary rounded-b-[55px]"
            style={{
              backgroundImage: `url(${theme?.data?.homeBackgroundImage ?? ""})`,
            }}
          />
        </div>
       <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto w-full min-h-screen bg-white max-w-md relative">
      <div className="absolute top-0 left-0 right-0 h-80">
        <NavbarHeader title={translate("MyQRCode")} backUrl="" />

        <div
          className="h-full bg-secondary rounded-b-[55px]"
          style={{
            backgroundImage: `url(${theme?.data?.homeBackgroundImage ?? ""})`,
          }}
        />
      </div>

      <div className="relative mt-32 px-5 pb-12">
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 z-30">
          <div className="relative">
            <div className="absolute"></div>
            <img
              loading="lazy"
              src={
                profile?.acc_image
                  ? `${process.env.NEXT_PUBLIC_PROFILE_BUCKET}/${profile.acc_image}`
                  : theme.data?.brandRoundIcon ?? "/images/ProfileMyProfile.svg"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-tertiary-foreground shadow-lg"
            />
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden pt-14">
          <div className="flex flex-col items-center pb-8 px-2">
            <h2 className="text-2xl font-bold text-gray-800 mt-8">
              {profile?.accName ?? profile?.accPhone ?? "Guest"}
            </h2>

            <div className="mt-6 w-full max-w-xs">
              <div className="border-t border-gray-200"></div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2">
              {accIdForQr ? (
                <>
                  <div className="bg-white p-5 rounded-xl border-2 border-gray-100 shadow-sm">
                    {renderCustomQRCode()}
                  </div>
                  <p className="font-mono text-xs font-semibold text-gray-600 tracking-widest mt-1">
                    {formatAccountId(accIdForQr)}
                  </p>
                </>
              ) : (
                <div className="w-[220px] h-[220px] bg-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-center px-8">
                    {translate("NoQRCodeFound")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Account Dialog */}
      <InactiveAccountDialog
        isOpen={showInactiveDialog}
        onClose={() => setShowInactiveDialog(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}

function formatAccountId(accountId: string): string {
  if (!accountId) return "";
  const cleaned = accountId.replace(/\s/g, "");
  return cleaned.match(/.{1,4}/g)?.join(" ") ?? cleaned;
}
