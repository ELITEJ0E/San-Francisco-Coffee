interface ProfileData {
  accID?: string;
  accPhone?: string;
  accName?: string;
  accTier?: string;
  acc_Addresses?: Array<unknown>;
  acc_wallet?: Array<unknown>;
  acc_gender?: string;
  acc_email?: string;
  acc_dob?: string;
  [key: string]: unknown;
}

export function profileCompleteCalculate(
  accData?: ProfileData,
  requiredFields?: string[],
) {
  if (!accData || !requiredFields) {
    return { completionPercentage: 0, completedItems: {} };
  }

  const completed = {
    MyProfileDetails: false,
    ShippingDetails: false,
  };

  // First, handle Shipping Details separately
  if (
    accData.acc_Addresses &&
    Array.isArray(accData.acc_Addresses) &&
    accData.acc_Addresses.length > 0
  ) {
    completed.ShippingDetails = true;
  }

  // Then handle other required fields
  requiredFields.forEach((field) => {
    const value = accData[field];

    // Skip acc_Addresses as it's already handled
    if (field !== "acc_Addresses") {
      if (value && value !== "" && value !== "NaN") {
        completedFieldsCount++;
      }
    }
  });

  // Check profile details completion
  const profileFields = ["accName", "acc_gender", "acc_email", "acc_dob"];
  const profileComplete = profileFields.every(
    (field) => accData[field] && accData[field] !== "",
  );
  completed.MyProfileDetails = profileComplete;

  // If both "My Profile Details" and "Shipping Details" are complete, set 100%
  if (completed.MyProfileDetails && completed.ShippingDetails) {
    return {
      completionPercentage: 100,
      completedItems: completed,
    };
  }

  // Calculate percentage based on completed fields
  const values = Object.values(completed);
  const total = values.length;
  const completedCount = values.filter(Boolean).length;

  const percentage = Math.round((completedCount / total) * 100);

  return {
    completionPercentage: Math.min(percentage, 100),
    completedItems: completed,
  };
}
