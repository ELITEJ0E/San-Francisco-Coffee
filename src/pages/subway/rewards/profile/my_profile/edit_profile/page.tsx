//16/1/2025 edit profile with unsaved changes dialog

"use client";

import React, { useEffect, useState } from "react";
import EditProfileSheet from "./ChangeProfilePic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { InputPhone } from "@/components/ui/input-phone";
import { api } from "@/trpc/react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { isValidEmail } from "@/app/utils/email";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { profileCompleteCalculate } from "../../ProfileCompletionCalculate";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Make sure you have these components
import { getNoCacheImageUrl } from "@/lib/imageUtils";
import { useTheme } from "@/app/context/ThemeContext";
import LoadingAnimation from "@/components/loadingAnimation";

interface FormData {
  name: string;
  gender: string;
  email: string;
  birthDate: {
    month: string;
    day: string;
    year: string;
  };
}

interface Address {
  addressID: string;
  address: string;
  addressName: string;
  postcode: string;
  lat: number;
  lon: number;
  person: string;
  phone: string;
  addressUnitBlock: string;
  countryCode: string;
  defaul_address: boolean;
}

// Helper function to compare two form data objects INCLUDING profile picture
const hasChanges = (
  original: FormData,
  current: FormData,
  originalPhone: string,
  currentPhone: string,
  originalGender: string,
  currentGender: string,
  originalConfirmed: boolean,
  currentConfirmed: boolean,
  originalMarketing: boolean,
  currentMarketing: boolean,
  originalProfileImage: string, // Added profile image parameter
  currentProfileImage: string, // Added profile image parameter
) => {
  // Compare basic form fields
  if (original.name !== current.name) return true;
  if (original.email !== current.email) return true;
  if (originalPhone !== currentPhone) return true;
  if (originalGender !== currentGender) return true;
  if (originalConfirmed !== currentConfirmed) return true;
  if (originalMarketing !== currentMarketing) return true;

  // Compare birth date
  if (
    original.birthDate.month !== current.birthDate.month ||
    original.birthDate.day !== current.birthDate.day ||
    original.birthDate.year !== current.birthDate.year
  )
    return true;

  // Compare profile image - check if a new image has been uploaded
  if (originalProfileImage !== currentProfileImage) {
    return true;
  }

  return false;
};

export default function EditProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accID = searchParams.get("accID");
  const [initialCompletionStatus, setInitialCompletionStatus] = useState(false);
  const { translate } = useTranslation();
  const [lastImageUpdate, setLastImageUpdate] = useState(Date.now());

  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for unsaved changes dialog
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    birthDate: false,
    phone: false,
    email: false,
    confirmInfo: false,
  });

  // Fetch profile data
  const { data: accData, isLoading } = api.loyalty.getLoyaltyAcc.useQuery({
    accID: accID ?? "",
    brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
  });
  const profile = accData?.account;
  const utils = api.useUtils();

  const { data: requiredFields } = api.loyalty.profileCompletion.useQuery({
    brandID: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
  });

  useEffect(() => {
    setInitialCompletionStatus(profile?.isComplete ?? false);
  }, [profile?.isComplete]);

  const { mutate: updateLoyaltyAcc } = api.loyalty.editLoyaltyAcc.useMutation({
    onSuccess: (_, variables) => {
      utils.loyalty.getLoyaltyAcc.invalidate({
        accID: accID ?? "",
        brandId: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
      });
      toast.success(translate("ProfileUpdatedSuccessfully"));

      // Reset dirty state after successful save
      setIsDirty(false);
      // Also reset uploadedFileName to current image after successful save
      if (profile) {
        setUploadedFileName(profile.acc_image || "");
      }

      const { completionPercentage } = profileCompleteCalculate(
        variables,
        requiredFields?.required,
      );
      const isNowComplete = completionPercentage === 100;

      // Reset submitting state
      setIsSubmitting(false);

      if (initialCompletionStatus) {
        router.push(`/profile/my_profile`);
      } else if (!initialCompletionStatus && !isNowComplete) {
        router.push("/profile");
      } else if (!initialCompletionStatus && isNowComplete) {
        router.push("/profile/my_profile/edit_profile/profile_completed");
      }
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error(translate("ProfileUpdateFailed"));

      setIsSubmitting(false);
    },
  });

  const theme = useTheme();

  const [gender, setGender] = useState("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    email: "",
    birthDate: {
      month: "",
      day: "",
      year: "",
    },
  });
  const [confirmedInfo, setConfirmedInfo] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // Store original values for comparison
  const [originalFormData, setOriginalFormData] = useState<FormData>({
    name: "",
    gender: "",
    email: "",
    birthDate: { month: "", day: "", year: "" },
  });
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalGender, setOriginalGender] = useState("male");
  const [originalConfirmedInfo, setOriginalConfirmedInfo] = useState(false);
  const [originalAcceptMarketing, setOriginalAcceptMarketing] = useState(false);
  const [originalProfileImage, setOriginalProfileImage] = useState<string>(""); // Store original profile image

  useEffect(() => {
    const dob = profile?.acc_dob;
    if (dob) {
      const [year, month, day] = dob.split("-");
      setFormData((prev) => ({
        ...prev,
        birthDate: { month, day, year },
      }));
      setOriginalFormData((prev) => ({
        ...prev,
        birthDate: { month, day, year },
      }));
    }
  }, [profile?.acc_dob]);

  useEffect(() => {
    if (profile) {
      setPhoneNumber(profile.accPhone || "");
      setOriginalPhone(profile.accPhone || "");

      const genderValue = profile.acc_gender?.toLowerCase() || "male";
      setGender(genderValue);
      setOriginalGender(genderValue);

      setFormData((prev) => ({
        ...prev,
        name: profile.accName || "",
        gender: profile.acc_gender || "",
        email: profile.acc_email || "",
      }));

      setOriginalFormData((prev) => ({
        name: profile.accName || "",
        gender: profile.acc_gender || "",
        email: profile.acc_email || "",
        birthDate: prev.birthDate,
      }));

      const confirmed = profile.emailVerified;
      setConfirmedInfo(confirmed);
      setOriginalConfirmedInfo(confirmed);

      const marketing = profile.consentYN;
      setAcceptMarketing(marketing);
      setOriginalAcceptMarketing(marketing);

      // Initialize uploadedFileName from existing profile image
      const currentImage = profile.acc_image || "";
      setUploadedFileName(currentImage);
      setOriginalProfileImage(currentImage); // Store original image for comparison
    }
  }, [profile]);

  // Check for changes whenever form values change INCLUDING profile picture
  useEffect(() => {
    const hasUnsavedChanges = hasChanges(
      originalFormData,
      formData,
      originalPhone,
      phoneNumber,
      originalGender,
      gender,
      originalConfirmedInfo,
      confirmedInfo,
      originalAcceptMarketing,
      acceptMarketing,
      originalProfileImage, // Pass original profile image
      uploadedFileName, // Pass current profile image
    );
    setIsDirty(hasUnsavedChanges);
  }, [
    formData,
    phoneNumber,
    gender,
    confirmedInfo,
    acceptMarketing,
    uploadedFileName, // Add uploadedFileName to dependencies
    originalFormData,
    originalPhone,
    originalGender,
    originalConfirmedInfo,
    originalAcceptMarketing,
    originalProfileImage,
  ]);

  // Handle navigation with unsaved changes check
  const handleNavigation = (path: string) => {
    if (isDirty) {
      setPendingNavigation(path);
      setShowUnsavedDialog(true);
    } else {
      router.push(path);
    }
  };

  // Handle dialog actions
  const handleSaveAndExit = async () => {
    setShowUnsavedDialog(false);
    await handleSubmit(); // This will trigger the save and then navigate
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);

    // Reset profile picture if changed
    if (uploadedFileName !== originalProfileImage) {
      setUploadedFileName(originalProfileImage);
      setPreviewImage(null);
    }

    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSubmit = async () => {
    const errors = {
      name: false,
      birthDate: false,
      phone: false,
      email: false,
      confirmInfo: false,
    };

    let hasErrors = false;
    let errorCount = 0;
    let firstError = "";

    if (formData.name.trim() === "" || null) {
      errors.name = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("EnterName");
    }

    if (
      formData.birthDate.day === "" ||
      formData.birthDate.month === "" ||
      formData.birthDate.year === ""
    ) {
      errors.birthDate = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("EnterDateOfBirth");
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      errors.phone = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("ValidPhoneNumber");
    } else {
      try {
        const phoneNo = parsePhoneNumber(`+${phoneNumber}`);
        const isValid = isValidPhoneNumber(phoneNumber || "", phoneNo?.country);

        if (!isValid) {
          hasErrors = true;
          errorCount++;
          if (!firstError) firstError = translate("ValidPhoneNumber");
        }
      } catch {
        errors.phone = true;
        hasErrors = true;
        errorCount++;
        if (!firstError) firstError = translate("ValidPhoneNumber");
      }
    }

    if (formData.email === "") {
      errors.email = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("ValidEmail");
    } else if (!isValidEmail(formData.email)) {
      errors.email = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("ValidEmail");
    }

    if (confirmedInfo === false) {
      errors.confirmInfo = true;
      hasErrors = true;
      errorCount++;
      if (!firstError) firstError = translate("ConfirmProvideInfoCheckbox");
    }

    if (errorCount > 1) {
      toast.error(translate("PleaseFillDetails"));
    } else if (errorCount === 1) {
      toast.error(firstError);
    }

    setValidationErrors(errors);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    if (!accID || !profile) {
      toast.error(translate("MissingProfileData"));
      return;
    }

    const { month, day, year } = formData.birthDate;
    const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0",
    )}`;

    if (!profile) {
      toast.error(translate("MissingProfileData"));
      return;
    }

    const processedAddresses =
      profile.acc_Addresses?.map((addr: Address) => ({
        addressID: addr.addressID || "NaN",
        address: addr.address || "",
        addressName: addr.addressName || "",
        postcode: addr.postcode || "",
        lat: addr.lat || 0,
        lon: addr.lon || 0,
        person: addr.person || "",
        phone: addr.phone || "",
        addressUnitBlock: addr.addressUnitBlock || "",
        countryCode: addr.countryCode || "MY",
        defaul_address: addr.defaul_address || false,
      })) || [];

    // Use uploadedFileName if exists, otherwise use existing profile image
    const finalImageName = uploadedFileName || profile.acc_image || "";

    const updatedData = {
      accID: accID,
      accPhone: phoneNumber,
      accName: formData.name,
      accTier: profile.accTier || "0",
      acc_Addresses: processedAddresses,
      acc_wallet: [],
      acc_gender: gender.toUpperCase(),
      acc_image: finalImageName,
      acc_email: formData.email,
      acc_dob: birthday,
      acc_value: [],
      accLastLogin: new Date().toISOString(),
      emailVerified: confirmedInfo,
      consentYN: acceptMarketing,
      accCountry: profile.accCountry || "",
      acc_refcode: profile.acc_refcode || "",
      isComplete: profile.isComplete || false,
      createdAt: profile.createdAt ?? "",
      updatedAt: new Date().toISOString(),
      storeBrand: profile.storeBrand ?? "",
      tierHistory: profile.tierHistory || [],
      verified: profile.verified || false,
      orderCount: profile.orderCount || 0,
      referralHistory: profile.referralHistory || [],
      accountStatus: profile.accountStatus || "",
      lastOrderDateTime: new Date(profile.lastOrderDateTime || new Date()),
      orderHistory: profile.orderHistory || [],
      firstOutlet: profile.firstOutlet || "",
      lastOutlet: profile.lastOutlet || "",
      segmentId: profile.segmentId || "",
      accIdForQr: profile.accIdForQr || "",
      referralStatus: profile.referralStatus || "",
      displayName: profile.displayName || "",
    };
    const { completionPercentage } = profileCompleteCalculate(
      updatedData,
      requiredFields?.required,
    );
    const finalData = {
      ...updatedData,
      isComplete: completionPercentage === 100,
    };

    try {
      updateLoyaltyAcc(finalData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(translate("ProfileUpdateFailed"));
      setIsSubmitting(false);
    }
  };

  const updateBirthDate = (field: "month" | "day" | "year", value: string) => {
    const updatedBirthDate = {
      ...formData.birthDate,
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      birthDate: updatedBirthDate,
    }));

    const allFieldsFilled =
      updatedBirthDate.month !== "" &&
      updatedBirthDate.day !== "" &&
      updatedBirthDate.year !== "";

    setValidationErrors((prev) => ({
      ...prev,
      birthDate: !allFieldsFilled,
    }));
  };

  const months = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  const selectedMonth =
    months.find((m) => m.value === formData.birthDate.month)?.label ?? "Month";

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen text-primary">
      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="max-w-xs bg-white rounded-[32px]">
          <DialogHeader className="text-center">
            <img
              src="/images/YellowExclamationMark.svg"
              alt="Unsaved Changes"
              className="w-auto h-auto mx-auto"
            />
          </DialogHeader>
          <DialogTitle className="text-primary mx-auto text-center font-bold text-2xl">
            {translate("UnsavedChanges")}
          </DialogTitle>
          <div className="mx-auto text-center text-primary">
            {translate("UnsavedChangesDesc")}
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              className="w-full h-12 rounded-full text-white bg-primary"
              onClick={handleSaveAndExit}
              disabled={isSubmitting}
            >
              {isSubmitting ? translate("Saving") : translate("SaveChanges")}
            </Button>
            <Button
              className="w-full h-12 rounded-full text-primary bg-white border border-primary"
              onClick={handleDiscardChanges}
            >
              {translate("LeaveAnyway")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Updated NavbarHeader to use handleNavigation */}
      <NavbarHeader
        title={translate("EditProfile")}
        onBack={() => handleNavigation("/profile/my_profile")}
      />

      {isSubmitting && <LoadingAnimation />}
      <div className="p-6 min-h-screen overflow-y-auto bg-white">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-24 h-24 rounded-full bg-tertiary-foreground">
            <img
              src={
                previewImage ??
                (profile?.acc_image
                  ? getNoCacheImageUrl(
                      `${process.env.NEXT_PUBLIC_PROFILE_BUCKET}/${profile?.acc_image}?lastUpdate=${lastImageUpdate}`,
                    )
                  : (theme.data?.brandRoundIcon ??
                    "/images/default_display_image.webp"))
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
              onError={() => {
                console.error("Failed to load profile image");
              }}
            />
          </div>
          <EditProfileSheet
            accountId={accID ?? ""}
            onPhotoCapture={(success, filename, fileData) => {
              if (success && filename) {
                // Create immediate preview from the captured file
                if (fileData) {
                  const previewUrl = URL.createObjectURL(fileData);
                  setPreviewImage(previewUrl);
                }

                setUploadedFileName(filename ?? "");

                // Update real image after delay
                setTimeout(() => {
                  setLastImageUpdate(Date.now());
                  if (previewImage) {
                    URL.revokeObjectURL(previewImage); // Clean up memory
                    setPreviewImage(null);
                  }
                }, 2000);

                toast.success(translate("ProfilePicUpdateSuccess"));
              } else {
                toast.error(translate("ProfilePicUpdateFailed"));
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold">
            {translate("Name")}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            placeholder={translate("WhatShouldWeCallYou")}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (validationErrors.name) {
                setValidationErrors((prev) => ({ ...prev, name: false }));
              }
            }}
            required
            className={cn(
              validationErrors.name && "border-red-500 focus:border-red-500",
            )}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-sm font-bold">{translate("Gender")}</Label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={cn(
                "flex-1 p-2 rounded-lg",
                gender === "male"
                  ? "bg-primary text-secondary"
                  : "bg-gray-100 text-gray-400 border border-gray-200",
              )}
              onClick={() => setGender("male")}
            >
              ♂ {translate("Male")}
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 p-2 rounded-lg",
                gender === "female"
                  ? "bg-primary text-secondary"
                  : "bg-gray-100 text-gray-400 border border-gray-200",
              )}
              onClick={() => setGender("female")}
            >
              ♀ {translate("Female")}
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-sm font-bold">{translate("DOB")}</Label>
          <div className="flex space-x-4">
            <Select
              name="month"
              defaultValue={formData.birthDate.month || ""}
              onValueChange={(value) => updateBirthDate("month", value)}
              required
              disabled={!!profile?.acc_dob}
            >
              <SelectTrigger
                className={cn(
                  "flex-1",
                  validationErrors.birthDate &&
                    "border-red-500 focus:border-red-500",
                )}
              >
                <SelectValue placeholder={selectedMonth || "Month"} />
              </SelectTrigger>
              <SelectContent>
                {months.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              name="day"
              defaultValue={formData.birthDate.day || ""}
              onValueChange={(value) => updateBirthDate("day", value)}
              required
              disabled={!!profile?.acc_dob}
            >
              <SelectTrigger
                className={cn(
                  "flex-1",
                  validationErrors.birthDate &&
                    "border-red-500 focus:border-red-500",
                )}
              >
                <SelectValue placeholder={formData.birthDate.day || "Day"} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString().padStart(2, "0")}>
                    {day.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              name="year"
              defaultValue={formData.birthDate.year || ""}
              onValueChange={(value) => updateBirthDate("year", value)}
              required
              disabled={!!profile?.acc_dob}
            >
              <SelectTrigger
                className={cn(
                  "flex-1",
                  validationErrors.birthDate &&
                    "border-red-500 focus:border-red-500",
                )}
              >
                <SelectValue placeholder={formData.birthDate.year || "Year"} />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="phone" className="text-sm font-bold ">
            {translate("PhoneNumber")}
          </Label>
          <InputPhone
            value={phoneNumber}
            onChange={(value) => {
              setPhoneNumber(value);
            }}
            placeholder={translate("PH_PhoneNumber")}
            defaultCountry="MY"
            className={cn("bg-transparent mt-2")}
            international={false}
            disabled={!!profile?.accPhone}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="email" className="text-sm font-bold">
            {translate("Email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: false }));
              }
            }}
            placeholder={translate("Email")}
            required
            className={cn(
              validationErrors.email && "border-red-500 focus:border-red-500",
            )}
          />
        </div>

        <div className="space-y-4 mb-8 mt-5">
          {profile?.emailVerified === false && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirm"
                checked={confirmedInfo}
                onCheckedChange={(checked) => {
                  setConfirmedInfo(checked as boolean);
                  if (validationErrors.confirmInfo) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      confirmInfo: false,
                    }));
                  }
                }}
                required
                className={cn(
                  "mt-1 border-gray-300",
                  validationErrors.confirmInfo && "border-red-500",
                )}
              />
              <label
                htmlFor="confirm"
                className="text-sm font-normal text-primary"
              >
                {translate("ConfirmInfo")}
              </label>
            </div>
          )}
          {profile?.consentYN === false && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={(checked) =>
                  setAcceptMarketing(checked as boolean)
                }
                required
                className="mt-1 border-gray-300"
              />
              <label
                htmlFor="marketing"
                className="text-sm font-normal text-primary"
              >
                {translate("ReceivedNewsletter")}
              </label>
            </div>
          )}
        </div>

        <Button
          variant={"default"}
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold text-lg rounded-full p-6 mt-10 disabled:opacity-70"
          onClick={handleSubmit}
        >
          {isSubmitting ? translate("Saving") : translate("Save")}
        </Button>
      </div>
    </div>
  );
}
