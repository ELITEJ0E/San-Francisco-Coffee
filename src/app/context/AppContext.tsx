import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>({});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [returnUrl, setReturnUrl] = useState('/');
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<any>(null);

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
