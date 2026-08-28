"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

interface PaymentOption {
  id: string;
  label: string;
  icon: string;
  methodCode?: string;
}

export default function PaymentMethod() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { translate } = useTranslation();
const savedAmount = searchParams.get("amount"); // Get the saved amount
  const paymentOptions: PaymentOption[] = [
    // {
    //   id: "ewallet",
    //   label: "E-Wallet",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   methodCode: "ewallet",
    // },
    // {
    //   id: "tng",
    //   label: "Touch 'n Go",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   methodCode: "TNG-EWALLET",
    // },
    // {
    //   id: "boost",
    //   label: "Boost",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   methodCode: "BOOST",
    // },
    // {
    //   id: "fiuu",
    //   label: "Fiuu Pay",
    //   icon: "/placeholder.svg?height=40&width=40",
    //   methodCode: "FiuuPay",
    // },
  ];

  const handlePaymentSelection = ( methodCode: string, methodLabel: string) => {
   // toast.message(translate("RedirectingToTopUp"));
    //console.log(methodCode,"methodCode");

     const params = new URLSearchParams();
    params.set('paymentmethod', methodLabel);
    // if (methodCode) {
    //   params.set('methodcode', methodCode);
    // }
    if (savedAmount) {
      params.set('amount', savedAmount); // Preserve the amount
    }
    router.push(`/profile/top_up?${params.toString()}`);
  };
}

//   return (
//     // <div className="flex flex-col mx-auto w-full max-w-md text-primary overflow-y-auto">
//     //   <div className="min-h-screen bg-gray-50">
//     //     {/* Header */}
//     //     <div className="flex items-center justify-center relative py-5 w-full bg-secondary text-2xl shadow-xl z-10">
//     //       <button
//     //         className="absolute left-4"
//     //         onClick={() => window.history.back()}
//     //       >
//     //         <ChevronLeft className="h-6 w-6" />
//     //       </button>
//     //       <h1 className="text-xl font-serif">{translate("PaymentMethod")}</h1>
//     //     </div>

//     //     {/* Payment Options */}
//     //     <div className="px-4 space-y-3 mt-4">
//     //       {paymentOptions.map((option) => (
//     //         <button
//     //           key={option.id}
//     //            onClick={() => handlePaymentSelection( option.methodCode || "",option.label)}
//     //           className="w-full p-4 rounded-xl bg-white shadow-sm border border-black flex items-center gap-4"
//     //         >
//     //           <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
//     //             <img
//     //               src={option.icon || "/placeholder.svg"}
//     //               alt={`${option.label} icon`}
//     //               className="w-6 h-6"
//     //             />
//     //           </div>
//     //           <span className="text-base font-medium text-gray-900">
//     //             {option.label}
//     //           </span>
//     //         </button>
//     //       ))}
//     //     </div>
//     //   </div>
//     // </div>
//   );
// }
