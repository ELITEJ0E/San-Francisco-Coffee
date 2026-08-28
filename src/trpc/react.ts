export const api = {
  useContext: () => ({
    loyalty: {
      getLoyaltyAddress: { invalidate: async () => {}, refetch: async () => {}, fetch: async () => ({ account: { isComplete: false, acc_Addresses: [] } }) },
      getLoyaltyAcc: { invalidate: async () => {}, refetch: async () => {}, fetch: async () => ({ account: { isComplete: false, acc_wallet: [] } }) },
    },
    theme: { getTheme: { invalidate: async () => {} } }
  }),
  useUtils: () => ({
    loyalty: { getLoyaltyAcc: { invalidate: async () => {} } },
    theme: { getTheme: { invalidate: async () => {} } }
  }),
  loyalty: {
    getLoyaltyAddress: {
      useQuery: () => ({ data: { account: { acc_Addresses: [] } }, isLoading: false })
    },
    getLoyaltyAcc: {
      useQuery: () => ({ data: { account: { isComplete: false, acc_wallet: [], acc_value: [] } }, isLoading: false })
    },
    profileCompletion: {
      useQuery: () => ({ data: { required: [] } })
    },
    addLoyaltyAddress: {
      useMutation: (opts) => ({ mutate: (data) => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    editLoyaltyAddress: {
      useMutation: (opts) => ({ mutate: (data) => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    addDefaultAddress: {
      useMutation: (opts) => ({ mutate: (data) => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    editLoyaltyAcc: {
      useMutation: (opts) => ({ mutate: (data) => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    getWalletHistory: {
      useQuery: () => ({ data: [], isLoading: false })
    },
    getReferralProgram: {
      useQuery: () => ({ 
        data: { 
          referralConfig: { 
            referrer: { 
              ruleTypes: [{ rulesId: "On Sign Up" }], 
              rewardPoints: 100 
            } 
          } 
        }, 
        isLoading: false 
      })
    },
    getReferralCode: {
      useMutation: () => ({ mutateAsync: async () => ({ referralCode: "QXMB4Q" }) })
    }
  }
};
