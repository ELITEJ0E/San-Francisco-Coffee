"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { cn } from "@/lib/utils";

const RefundPolicy = () => {
  const { translate } = useTranslation();

  const {
    data: policyData,
    isLoading,
    error,
  } = api.get.getPolicy.useQuery({
    storeBrand: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
    policyName: "Refund Policy",
  });

  return (
    <div className="max-w-md mx-auto bg-secondary h-screen flex flex-col overflow-hidden">
      <NavbarHeader
        title={translate("RefundPolicy")}
        backUrl="/profile/settings/policy"
      />

      <div className="flex-1 bg-white overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {policyData?.policy?.policyName ?? "Refund Policy"}
        </h1>

        {isLoading && (
          <p className="text-gray-500 text-sm mt-4">Loading policy...</p>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-4">
            <p>Failed to load Refund Policy.</p>
            <p className="text-xs">Error: {error.message}</p>
          </div>
        )}

        {policyData?.policy ? (
          <div className="text-sm text-gray-700 mt-6 space-y-4 pb-6">
            <div className="text-xs text-gray-500 mb-2 space-y-1">
              <p>
                Last Modified:{" "}
                {new Date(policyData.policy.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>

            <div
              className={cn(
                "prose prose-sm sm:prose-base lg:prose-lg max-w-none",
                "text-gray-800 dark:text-gray-200",

                "[&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-1.5 [&>ul]:marker:text-gray-600 dark:[&>ul]:marker:text-gray-400",
                "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-1.5 [&>ol]:marker:text-gray-600 dark:[&>ol]:marker:text-gray-400",

                "[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-gray-900 dark:[&>h1]:text-gray-100",
                "[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-gray-200 dark:[&>h2]:border-gray-700 [&>h2]:pb-1",
                "[&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-3",
                "[&>p]:mb-4 [&>p]:leading-relaxed",

                "[&>p_a]:text-blue-600 [&>p_a]:underline [&>p_a:hover]:text-blue-800",
                "space-y-5",
              )}
              dangerouslySetInnerHTML={{
                __html: policyData?.policy?.content || "",
              }}
            />
          </div>
        ) : (
          !isLoading &&
          !error && (
            <p className="text-gray-500 text-sm mt-4">
              No Refund Policy content found.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default RefundPolicy;
