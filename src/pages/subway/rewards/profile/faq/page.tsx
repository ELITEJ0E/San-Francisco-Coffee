"use client";

import { useState } from "react";
import { ChevronLeft, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { api } from "@/trpc/react";
import LoadingAnimation from "@/components/loadingAnimation";

type FAQItem = {
  question: string;
  answer: string;
};

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const { translate } = useTranslation();

  const {
    data: policyData,
    isLoading,
    error,
  } = api.get.getPolicy.useQuery({
    storeBrand: process.env.NEXT_PUBLIC_BRAND_ID ?? "",
    policyName: "Frequently Asked Questions",
  });

  const parseFAQFromHTML = (htmlContent: string): FAQItem[] => {
    if (!htmlContent) return [];

    const faqItems: FAQItem[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const faqContainers = doc.querySelectorAll('.bg-gray-100.rounded-lg');
    
    faqContainers.forEach((container) => {
      let question = '';
      let answer = '';

      // Extract question
      const extractQuestion = (element: Element): string => {
        const questionSpans = element.querySelectorAll('span.font-medium.text-primary.block');
        
        for (const span of Array.from(questionSpans)) {
          let questionText = '';
          
          if (span.textContent?.trim() && span.children.length === 0) {
            questionText = span.textContent.trim();
          } 
          else if (span.children.length > 0) {
            const nestedSpans = span.querySelectorAll('span');
            for (const nestedSpan of Array.from(nestedSpans)) {
              const nestedText = nestedSpan.textContent?.trim();
              if (nestedText && nestedText.length > 0) {
                questionText = nestedText;
                break;
              }
            }
          }
          
          if (!questionText) {
            questionText = span.textContent?.trim() ?? "";
          }
          
          // Validate question
          if (questionText && 
              questionText.length > 0 && 
              questionText.length < 200 && 
              !questionText.includes('<') && 
              !questionText.startsWith('http')) {
            return questionText;
          }
        }
        
        return '';
      };

      question = extractQuestion(container);

      const extractAnswer = (element: Element): string => {
        const answerParagraphs = element.querySelectorAll('p.text-sm.font-normal.text-primary.whitespace-pre-line');
        
        for (const p of Array.from(answerParagraphs)) {
          const htmlContent = p.innerHTML.trim();
          if (htmlContent && htmlContent.length > 0) {
            return htmlContent;
          }
        }
        
        const allParagraphs = element.querySelectorAll('p');
        for (const p of Array.from(allParagraphs)) {
          const htmlContent = p.innerHTML.trim();
          const textContent = p.textContent?.trim();
          
          // Make sure not empty
          if (htmlContent && 
              htmlContent.length > 10 && 
              textContent && 
              textContent !== question && 
              textContent.length > 20) {
            return htmlContent;
          }
        }
        
        return '';
      };

      answer = extractAnswer(container);

      if (question && answer) {
        faqItems.push({ question, answer });
      }
    });

    return faqItems;
  };

  const faqData = policyData?.policy ? parseFAQFromHTML(policyData.policy.content) : [];

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleItem = (index: number): void => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div
      className="max-w-md mx-auto bg-white h-full overflow-hidden flex flex-col"
    >
      <div className="bg-[#008f52] text-white">
        <NavbarHeader 
          title={translate("FAQ")} 
          backUrl="/profile" 
          className="bg-[#008f52] text-white border-b-0 pb-2" 
          iconClass="text-white" 
        />

        <div className="px-4 pb-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={translate("SearchFAQs")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2.5 rounded-lg border-none text-black bg-white text-sm focus:outline-none placeholder:text-gray-400 font-medium"
            />
            {searchTerm && (
              <Button
                variant="link"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0 h-auto"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white p-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <h2 className="font-bold text-base text-black mb-4">
          {translate("HotQuestions") || "Hot questions"}
        </h2>

        {isLoading && (
         <LoadingAnimation />
        )}
        
        {error && (
          <div className="text-center py-4 text-red-500">
            Failed to load FAQs. Please try again.
          </div>
        )}

        {!isLoading && !error && filteredFAQ.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {faqData.length === 0 ? "No FAQs available" : "No FAQs found"}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-[#f5f5f5] rounded-md overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className="w-full p-4 h-auto focus:outline-none flex justify-between items-start rounded-none hover:bg-[#ebebeb] active:bg-[#ebebeb]"
                  onClick={() => toggleItem(index)}
                >
                  <div
                    className={`flex-1 text-left ${
                      expandedItem === index
                        ? "whitespace-normal"
                        : "whitespace-normal" /* always normal whitespace so questions wrap instead of truncate */
                    }`}
                  >
                    <span className="font-semibold text-sm text-black block leading-tight">
                      {item.question}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center justify-center h-4 mt-0.5">
                    {expandedItem === index ? (
                      <ChevronDown className="w-4 h-4 text-[#008f52] rotate-180 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#8f9a9a]" />
                    )}
                  </div>
                </Button>
                {expandedItem === index && (
                  <div className="px-4 pb-4 bg-[#f5f5f5]">
                    {/* Render HTML content */}
                    <div 
                      className="text-sm font-normal text-gray-700 whitespace-pre-line prose prose-sm max-w-none"
                      style={{
                        lineHeight: '1.5',
                      }}
                      dangerouslySetInnerHTML={renderHTML(item.answer)}
                    />
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