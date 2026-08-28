"use client";

import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const { translate } = useTranslation();

  // Get FAQ data from ThemeContext
  const theme = useTheme();
  const faqData =
    theme?.data?.faqs.map((f) => ({
      question: f.title,
      answer: f.content,
    })) ?? [];

  // Filter FAQ based on search term
  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleItem = (index: number): void => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div
      className="max-w-md mx-auto bg-white h-screen overflow-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <NavbarHeader title={translate("FAQ")} backUrl="/profile" />

      <div className="bg-[#103a3a] px-6 py-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="w-5 h-5 text-[#b1bebe]" />
          </div>
          <input
            type="text"
            placeholder={translate("SearchFAQs")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-3 rounded-xl border border-input text-primary bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchTerm && (
            <Button
              variant="link"
              onClick={() => setSearchTerm("")}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-0"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-t-3xl p-4 space-y-4 overflow-y-auto">
        <div className="relative"></div>
        <h2 className="font-semibold text-lg text-primary">
          {translate("HotQuestions")}
        </h2>

        {/* Show loading state if theme data is not yet available */}
        {!theme?.data?.faqs ? (
          <div className="text-center py-4 text-gray-500">Loading FAQs...</div>
        ) : filteredFAQ.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No FAQs found</div>
        ) : (
          <div className="space-y-2">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden p-2"
              >
                <Button
                  variant="link"
                  className="w-full p-2 focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex w-full items-start">
                    <div
                      className={`flex-1 text-left ${
                        expandedItem === index
                          ? "whitespace-normal"
                          : "truncate"
                      }`}
                    >
                      <span className="font-medium text-primary block">
                        {item.question}
                      </span>
                    </div>
                    <div className="ml-2 mt-1 flex-shrink-0">
                      {expandedItem === index ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </Button>
                {expandedItem === index && (
                  <div className="p-2">
                    <p className="text-sm font-normal text-primary whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
