interface MutationOpts<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api: any = {
  post: {
    submitOrder: {
      useMutation: (opts?: MutationOpts<{ result: { url: string } }>) => ({
        mutate: () => { if (opts?.onSuccess) opts.onSuccess({ result: { url: '/orders' } }); },
        isPending: false
      })
    }
  },
  get: {
    getPolicy: {
      useQuery: ({ policyName }: { storeBrand?: string; policyName: string }) => ({
        data: {
          policy: {
            policyName: policyName || "Policy",
            updatedAt: "2026-01-01T00:00:00.000Z",
            content: `<h3>${policyName || "San Francisco Coffee Policy"}</h3><p>At San Francisco Coffee, we value your trust and privacy. This policy outlines our standards regarding data collection, wallet usage, refunds, reservations, and service credits.</p><p>For any inquiries, please contact support@sfcoffee.com.my or visit any of our outlets across Malaysia.</p>`
          }
        },
        isLoading: false,
        error: null
      })
    }
  },
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
      useMutation: (opts?: MutationOpts<string>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    editLoyaltyAddress: {
      useMutation: (opts?: MutationOpts<string>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    addDefaultAddress: {
      useMutation: (opts?: MutationOpts<string>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    editLoyaltyAcc: {
      useMutation: (opts?: MutationOpts<string>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
    },
    topUpWallet: {
      useMutation: (opts?: MutationOpts<{ points: { url: string } }>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess({ points: { url: '/profile/top_up/top_up_successful' } }); } })
    },
    deductWallet: {
      useMutation: (opts?: MutationOpts<string>) => ({ mutate: () => { if (opts?.onSuccess) opts.onSuccess('OK'); } })
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
