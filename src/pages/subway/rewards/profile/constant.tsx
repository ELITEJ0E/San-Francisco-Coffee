interface ProfileMenuItemData {
  icon: string;
  label: string;
  path: string;
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

interface Account {
  account: {
    accID: string;
    accPhone: string;
    accName: string;
    accTier: string;
    acc_Addresses: Address[];
    acc_wallet: EWallet[];
    acc_gender: string;
    acc_email: string;
    acc_dob: string;
    acc_value: AccPoint[];
    accLastLogin: string;
  };
}

interface AccPoint {
  id: string;
  pointsValue: number;
  lastUpdated: string;
}

interface EWallet {
  walletid: string;
  walletValue: number;
  accLastLogin: string;
}
