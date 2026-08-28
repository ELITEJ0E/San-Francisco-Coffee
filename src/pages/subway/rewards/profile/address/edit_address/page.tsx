"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputPhone } from "@/components/ui/input-phone";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useAppContext } from "@/app/context/AppContext";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import LoadingAnimation from "@/components/loadingAnimation";

interface Place {
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface FormData {
  address: string;
  addressTitle: string;
  unitNumber: string;
  postCode: string;
  fullName: string;
  isDefault: boolean;
}

const NewAddress = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { translate } = useTranslation();

  // Get all URL parameters
  const addressId = searchParams.get("addressId");
  const addressName = searchParams.get("addressName");
  const initialPhone = searchParams.get("phone");
  const person = searchParams.get("person");
  const address = searchParams.get("address");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const addressUnitBlock = searchParams.get("addressUnitBlock");
  const countryCode = searchParams.get("countryCode");
  const defaultAddress = searchParams.get("defaul_address") === "true";
  const oldpostCode = searchParams.get("postcode");

  // Initialize coordinates from URL params
  const initialCoordinates =
    lat && lon
      ? {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        }
      : null;

  const [, setCurrentLocation] = useState<Coordinates | null>(
    initialCoordinates,
  );
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    initialCoordinates,
  );
  const [formData, setFormData] = useState<FormData>({
    address: address ?? "",
    addressTitle: addressName ?? "",
    unitNumber: addressUnitBlock ?? "",
    postCode: oldpostCode ?? "",
    fullName: person ?? "",
    isDefault: defaultAddress,
  });
  const [phoneNumber, setPhoneNumber] = useState(initialPhone ?? "");
  const [selectedAddress, setSelectedAddress] = useState(address ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  console.log("Map API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAP_API);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
    libraries: ["places"],
  });
  const utils = api.useContext();
  const { mutate: editAddress } = api.loyalty.editLoyaltyAddress.useMutation({
    onSuccess: async () => {
      if (formData.isDefault) {
        addDefaultAddress({
          addressId: addressId ?? "",
          accountId: account ?? "",
        });
      }
      // Invalidate and force refetch
      await utils.loyalty.getLoyaltyAddress.invalidate();
      await utils.loyalty.getLoyaltyAddress.refetch();

      setIsSaving(false);

      toast.success(translate("AddressUpdateSuccess"));
      router.back();
      // router.push("/profile/address");
    },
    onError: (error) => {
      toast.error(translate("AddressUpdateFailed"));
      console.error("Address update error:", error);
      setIsSaving(false);
    },
  });

  const { mutate: addDefaultAddress } =
    api.loyalty.addDefaultAddress.useMutation({
      onSuccess: async (responseData) => {
        try {
          if (responseData === "OK") {
            return;
          }
        } catch (error) {
          console.error("Error in onSuccess handler:", error);
        }
      },
    });

  const { returnUrl } = useAppContext();
  const account = Cookies.get("accountId");

  const [validationErrors, setValidationErrors] = useState({
    addressTitle: false,
    selectedAddress: false,
    address: false,
    unitNumber: false,
    postCode: false,
    fullName: false,
    phoneNumber: false,
  });

  // Update the handleSaveAddress function to include better error handling
  const handleSaveAddress = async () => {
    const errors = {
      addressTitle: false,
      selectedAddress: false,
      address: false,
      unitNumber: false,
      postCode: false,
      fullName: false,
      phoneNumber: false,
    };

    let errorCount = 0;
    let firstError = "";

    // Validation for address title
    if (!formData.addressTitle.trim()) {
      errors.addressTitle = true;
      errorCount++;
      if (!firstError) firstError = translate("AddressTitleRequired");
    }

    // Validation for address
    if (selectedLocation?.lat || selectedLocation?.lng) {
      if (!selectedAddress) {
        errors.selectedAddress = true;
        errorCount++;
        if (!firstError)
          firstError = "Please search for location to locate your address";
      }
    } else if (!formData.address.trim()) {
      errors.address = true;
      errorCount++;
      if (!firstError) firstError = translate("AddressRequired");
    }

    // Validation for unit number
    if (!formData.unitNumber.trim()) {
      errors.unitNumber = true;
      errorCount++;
      if (!firstError) firstError = translate("UnitNumberRequired");
    }

    // Validation for postcode
    if (!formData.postCode.trim()) {
      errors.postCode = true;
      errorCount++;
      if (!firstError) firstError = translate("PostalCodeRequired");
    }

    // Validation for full name
    if (!formData.fullName.trim()) {
      errors.fullName = true;
      errorCount++;
      if (!firstError) firstError = translate("EnterName");
    }

    // Validation for phone number
    if (!phoneNumber) {
      errors.phoneNumber = true;
      errorCount++;
      if (!firstError) firstError = translate("ValidPhoneNumber");
    } else {
      const formattedPhoneNumber = `+${phoneNumber}`;
      const phoneNo = parsePhoneNumber(phoneNumber);
      if (!isValidPhoneNumber(formattedPhoneNumber, phoneNo?.country)) {
        errors.phoneNumber = true;
        errorCount++;
        if (!firstError) firstError = translate("ValidPhoneNumber");
      }
    }

    // Update validation errors state
    setValidationErrors(errors);

    // Show appropriate error message
    if (errorCount > 1) {
      toast.error(translate("PleaseFillDetails"));
      return;
    } else if (errorCount === 1) {
      toast.error(firstError);
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      // check phone number country
      const formattedPhoneNumber = `+${phoneNumber}`;
      const phoneNo = parsePhoneNumber(formattedPhoneNumber);

      if (isValidPhoneNumber(formattedPhoneNumber || "", phoneNo?.country) === false) {
        toast.error(translate("ValidPhoneNumber"));
        return;
      }

      const finalAddress =
        selectedAddress && selectedAddress.trim() !== ""
          ? selectedAddress
          : formData.address;

      const requestBody = {
        accID: account ?? "",
        oldAddress: {
          address: address ?? "",
          addressID: addressId ?? "",
          addressName: addressName ?? "",
          postcode: oldpostCode ?? "",
          addressUnitBlock: addressUnitBlock ?? "",
          countryCode: countryCode ?? "",
          lat: lat ? parseFloat(lat) : 0,
          lon: lon ? parseFloat(lon) : 0,
          person: person ?? "",
          phone: initialPhone ?? "",
          defaul_address: defaultAddress,
        },
        newAddress: {
          address: finalAddress,
          addressID: addressId ?? "",
          addressName: formData.addressTitle.trim(),
          postcode: formData.postCode.trim(),
          addressUnitBlock: formData.unitNumber.trim(),
          countryCode: phoneNo?.country ?? "MY",
          lat: selectedLocation?.lat ?? 0,
          lon: selectedLocation?.lng ?? 0,
          person: formData.fullName.trim(),
          phone: phoneNumber,
          defaul_address: formData.isDefault,
        },
      };
      console.log("check", requestBody);
      editAddress(requestBody);
    } catch (error) {
      console.error("Error in handleSaveAddress:", error);
      toast.error(translate("AddressSaveFailed"));
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use URL coordinates if available, otherwise use current position
          const coords = initialCoordinates ?? {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(coords);
          setSelectedLocation(coords);

          // Only geocode if we don't have an address from URL params
          if (!address) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: coords }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
                setSelectedAddress(results[0].formatted_address);
              }
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
      );
    }
  }, [address, initialCoordinates]);

  useEffect(() => {
    if (isLoaded && !loadError) {
      getCurrentLocation();
    }
    if (phoneNumber) {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
      setPhoneNumber(cleanedPhoneNumber);
    }
  }, [isLoaded, loadError, phoneNumber, getCurrentLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error for the field being changed
    setValidationErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handlePlaceSelected = (place: Place) => {
    if (place.geometry?.location) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(newLocation);
      setSelectedAddress(place.formatted_address ?? "");
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setSelectedLocation(newLocation);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          setSelectedAddress(results[0].formatted_address);
        }
      });
    }
  };


  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || isLoading) return <LoadingAnimation />;

  const mapOptions = {
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const backUrl =
    returnUrl === "/profile"
      ? "/profile/address"
      : returnUrl ?? "/profile/address";
  console.log("returnUrl", returnUrl);
  console.log("backUrl", backUrl);

  return (
    <div className="flex flex-col h-screen max-w-md w-full mx-auto bg-white">
      {/* Rest of the JSX remains the same */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white max-w-md mx-auto">
        <NavbarHeader title={translate("EditAddress")} backUrl={backUrl} />
        <SearchBar
          onPlaceSelected={handlePlaceSelected}
          onResetLocation={getCurrentLocation}
          initialAddress={address ?? ""}
        />
      </div>

      <div
        className="flex-1 overflow-y-auto mt-36"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="h-auto w-full relative">
          {!selectedLocation?.lat || !selectedLocation?.lng ? ( // no open location
            <div></div>
          ) : (
            <div className="h-48 w-full relative">
              {selectedLocation && (
                <GoogleMap
                  mapContainerStyle={{ width: "100", height: "100%" }}
                  mapContainerClassName="map-container"
                  center={selectedLocation}
                  zoom={17}
                  options={mapOptions}
                >
                  <Marker
                    position={selectedLocation}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                  />
                </GoogleMap>
              )}
            </div>
          )}
          {/* {selectedLocation && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              mapContainerClassName="map-container"
              center={selectedLocation}
              zoom={17}
              options={mapOptions}
            >
              <Marker
                position={selectedLocation}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              />
            </GoogleMap>
          )} */}
        </div>

        {isSaving && <LoadingAnimation />}    
        <div className="p-4 space-y-4">
          <div className="flex flex-col">
             <label className="text-[#003828] font-bold text-base mb-1">
              {translate("Address")}
            </label>
            {!selectedLocation?.lat || !selectedLocation?.lng ? (
              <input
                type="text"
                name="address"
                value={selectedAddress || formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C69749] text-[#003828] bg-gray-100"
                placeholder="No.1, Jalan..."
                required
              />
            ) : (
                  <div className="flex items-center gap-3 bg-primary rounded-lg px-4 py-5">
                  {/* Location icon */}
                  <img
                    src="/images/AddressIcon.svg"
                    alt="Location"
                    className="size-9"
                  />

                  {/* Address text */}
                  <p className="text-secondary font-semibold text-base text-">
                    {selectedAddress}
                  </p>
                </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-[#003828] font-bold text-base mb-1">
              {translate("AddressTitle")}
            </label>
            <input
              type="text"
              name="addressTitle"
              value={formData.addressTitle}
              onChange={handleInputChange}
              className={cn(
                "w-full p-3 border rounded-lg focus:outline-none text-[#003828] bg-gray-100",
                validationErrors.addressTitle
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-[#C69749]",
              )}
              placeholder={translate("PH_AddressTitle")}
              required
            />
            {/* <div className="text-[#003828] text-sm">{selectedAddress}</div> */}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[#003828] font-bold text-base mb-1">
                {translate("UnitHouseNo")}
              </label>
              <input
                type="text"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                className={cn(
                  "w-full p-3 border rounded-lg focus:outline-none text-[#003828] bg-gray-100",
                  validationErrors.unitNumber
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C69749]",
                )}
                placeholder={translate("PH_UnitHouseNo")}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#003828] font-bold text-base mb-1">
                {translate("PostalCode")}
              </label>
              <input
                type="text"
                name="postCode"
                value={formData.postCode || ""}
                onChange={handleInputChange}
                className={cn(
                  "w-full p-3 border rounded-lg focus:outline-none text-[#003828] bg-gray-100",
                  validationErrors.postCode
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C69749]",
                )}
                placeholder="E.g. 43000"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#003828] font-bold text-base mb-1">
                {translate("FullName")}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={cn(
                  "w-full p-3 border rounded-lg focus:outline-none text-[#003828] bg-gray-100",
                  validationErrors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#C69749]",
                )}
                placeholder={translate("Name")}
                required
              />
            </div>

            <div className="flex flex-col">
              <Label
                className="text-[#003828] font-bold text-base mb-1"
                htmlFor="phone"
              >
                {translate("PhoneNumber")}
              </Label>
              <InputPhone
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder={translate("PH_PhoneNumber")}
                defaultCountry="MY"
                className={cn(
                  "bg-transparent mt-2 gap-2",
                  validationErrors.phoneNumber &&
                    "border-red-500 focus:border-red-500",
                )}
                international={false} //to hide +60
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#003828] font-medium text-sm">
                {translate("DefaultAddress")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
              </label>
            </div>
          </div>

          <Button
            variant="secondary"
            disabled={isSaving}
            className="w-full p-3 rounded-full"
            onClick={handleSaveAddress}
          >
            {isSaving ? translate("Saving") : translate("Save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({
  onPlaceSelected,
  onResetLocation,
  initialAddress,
}: {
  onPlaceSelected: (place: Place) => void;
  onResetLocation: () => void;
  initialAddress: string;
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { translate } = useTranslation();

  const handleInputClick = () => {
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
    autocomplete.setFields(["formatted_address", "geometry"]);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setSearchQuery(place.formatted_address ?? "");
      onPlaceSelected(place as Place);
      setIsEditing(false);
    }
  };

    const malaysiaBounds = {
     north: 7.5,
     south: 1.25,
     east: 119.5,
     west: 100.5,
  }

  return (
    <div className="flex sm:flex-row items-center gap-4 p-4 bg-white">
      <div className="relative flex-grow w-full sm:w-auto">
        <div className="relative flex items-center h-12 border border-gray-300 rounded-2xl">
          <Search className="absolute left-3 text-gray-400 z-10" size={20} />
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              bounds: malaysiaBounds,
              componentRestrictions: { country: 'my' },  
            }}           
             className="w-full"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={translate("SearchForLocation")}
              className={`w-full h-full pl-10 pr-4 rounded-full focus:outline-none text-gray-600 text-base leading-normal ${
                !isEditing ? "cursor-pointer" : ""
              }`}
              style={{
                textIndent: "0",
                boxSizing: "border-box",
                paddingInline: "2.5rem 1rem",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={handleInputClick}
              onBlur={handleBlur}
              readOnly={!isEditing}
            />
          </Autocomplete>
        </div>
      </div>
      <Button
        variant="default"
        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors p-0"
        onClick={onResetLocation}
      >
        <img
          src="/images/WhiteOutletLocationIcon.svg"
          alt="Reset to Current Location"
          width={30}
          height={30}
        />
      </Button>
    </div>
  );
};

export default NewAddress;
