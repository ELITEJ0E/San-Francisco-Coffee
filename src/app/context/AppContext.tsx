import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  returnUrl: string;
  setReturnUrl: React.Dispatch<React.SetStateAction<string>>;
  selectedDeliveryAddress: unknown;
  setSelectedDeliveryAddress: React.Dispatch<React.SetStateAction<unknown>>;
}

const AppContext = createContext<AppContextType>({
  returnUrl: '/',
  setReturnUrl: () => {},
  selectedDeliveryAddress: null,
  setSelectedDeliveryAddress: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [returnUrl, setReturnUrl] = useState('/');
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<unknown>(null);

  return (
    <AppContext.Provider value={{
      returnUrl, setReturnUrl,
      selectedDeliveryAddress, setSelectedDeliveryAddress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
