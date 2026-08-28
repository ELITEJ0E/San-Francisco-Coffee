"use client";
import React from "react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { useAppContext } from "@/app/context/AppContext";
import { NewAddress } from "./address";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

export default function Page() {
  const { returnUrl } = useAppContext();
  const { translate } = useTranslation();

  const backUrl =
    returnUrl === "/profile"
      ? "/profile/address"
      : returnUrl === "/menu"
      ? "/menu/delivery"
      : returnUrl ?? "/profile/address";

  return (
    <div className="flex flex-col h-screen max-w-md w-full mx-auto bg-white">
      <NavbarHeader title={translate("AddNewAddress")} backUrl={backUrl} />
      <NewAddress />
    </div>
  );
}
