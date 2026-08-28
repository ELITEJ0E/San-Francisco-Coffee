"use client";

import { NavbarHeader } from "@/components/layout/NavbarHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import { api } from "@/trpc/react";
import { useAppContext } from "@/app/context/AppContext";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { useTheme } from "@/app/context/ThemeContext";
import { themeRouter } from "@/server/api/routers/theme";
import LoadingAnimation from "@/components/loadingAnimation";

interface Address {
  postcode: string;
  addressID: string;
  address: string;
  addressName: string;
  lat: number;
  lon: number;
  person: string;
  phone: string;
  addressUnitBlock: string;
  countryCode: string;
  defaul_address: boolean;
}

interface EmptyStateProps {
  deliveryIcon: string;
}

const AddressCard: React.FC<{
  address: Address;
  onEdit: (
    addressId: string,
    addressName: string,
    postcode: string,
    phone: string,
    person: string,
    address: string,
    lat: number,
    lon: number,
    addressUnitBlock: string,
    countryCode: string,
    defaul_address: boolean,
  ) => void;
}> = ({ address, onEdit }) => (
  <div className="bg-gray-100 border border-gray-300 p-4 rounded-xl mb-3 mx-4">
    <div className="flex gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary text-base truncate">
          {address.addressName}
        </h3>
        <p className="text-primary text-base truncate">{address.person}</p>
        <div className="flex flex-row gap-1 items-center">
          <img
            src="/images/AddressPhone.svg"
            alt="phone"
            className="w-5 flex-shrink-0"
          />
          <p className="text-primary text-base truncate">{address.phone}</p>
        </div>
        {address.addressUnitBlock && (
          <p className="text-primary font-normal text-base break-words">
            Unit no: {address.addressUnitBlock}
          </p>
        )}
        <p className="text-primary font-normal text-base break-words">
          {address.address}
        </p>
      </div>

      <SquarePen
        className="text-primary w-6 h-6 cursor-pointer flex-shrink-0 self-start"
        onClick={() =>
          onEdit(
            address.addressID,
            address.addressName,
            address.postcode,
            address.phone,
            address.person,
            address.address,
            address.lat,
            address.lon,
            address.addressUnitBlock,
            address.countryCode,
            address.defaul_address,
          )
        }
      />
    </div>
  </div>
);

const EmptyState: React.FC<EmptyStateProps> = ({ deliveryIcon }) => (
  <div className="flex flex-col items-center justify-center px-6 mt-20">
    <div className="mb-10">
      <img
        src={deliveryIcon}
        alt="No addresses"
        className="w-[257px] h-[182px] object-contain"
      />
    </div>
    <div className="text-center">
      <h2 className="text-primary text-3xl font-bold mb-4">Oppss!</h2>
      <p className="text-primary text-base font-normal">
        You don't have any saved addresses yet.
      </p>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <div className="w-full max-w-md p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();
  const account = Cookies.get("accountId");
  const { translate } = useTranslation();

  const { data, isLoading, error, refetch } =
    api.loyalty.getLoyaltyAddress.useQuery({
      accID: account ?? "",
    });
  const addresses = data?.account ?? [];
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refetch();
  });

  const handleEditAddress = (
    addressId: string,
    addressName: string,
    postcode: string,
    phone: string,
    person: string,
    address: string,
    lat: number,
    lon: number,
    addressUnitBlock: string,
    countryCode: string,
    defaultAddress: boolean,
  ) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("addressId", addressId);
    params.append("addressName", addressName);
    params.append("postcode", postcode);
    params.append("phone", phone);
    params.append("person", person);
    params.append("address", address);
    params.append("lat", lat.toString());
    params.append("lon", lon.toString());
    params.append("addressUnitBlock", addressUnitBlock);
    params.append("countryCode", countryCode);
    params.append("defaul_address", defaultAddress.toString());

    // Create the URL with properly formatted query string

    router.push(`/profile/address/edit_address?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col mx-auto w-full bg-white max-w-md min-h-screen">
        <NavbarHeader title={translate("Addresses")} backUrl="/profile" />
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mx-auto w-full bg-white max-w-md min-h-screen">
        <NavbarHeader title={translate("Addresses")} backUrl="/profile" />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <p className="text-red-500 text-center">
            {translate("FailedToLoadAddress")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto w-full bg-white max-w-md min-h-screen">
      {loading && <LoadingAnimation />}
      <NavbarHeader title={translate("Addresses")} backUrl="/profile" />

      {addresses.length > 0 ? (
        <div className="flex flex-col mt-4">
          <p className="text-primary text-lg font-medium px-4 mb-3">
            {translate("SavedAddress")}
          </p>
          {addresses.map((address: Address) => (
            <AddressCard
              key={address.addressID}
              address={address}
              onEdit={handleEditAddress}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          deliveryIcon={theme.data?.deliveryIcon ?? "/images/AddressMotor.svg"}
        />
      )}

      {/* Add New Address Button */}
      <div className="flex items-center justify-center pb-12 px-4 mt-8">
        <Button
          variant="secondary"
          onClick={() => {
            setLoading(true);
            if (!account) {
              toast.error(translate("LoginToAddAddress"));
              router.push("../signup");
            } else {
              router.push("/profile/address/new_address");
            }
          }}
          className="w-full h-14 bg-secondary text-lg text-primary rounded-full font-semibold border border-secondary"
        >
          <Plus className="mr-2" style={{ width: "24px", height: "24px" }} />
          {translate("AddNewAddress")}
        </Button>
      </div>
    </div>
  );
}
