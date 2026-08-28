import React from "react";
import { useTranslation } from "../context/LanguageContext/useTranslation";
import { TranslationKey } from "../context/LanguageContext/LanguageLabel";

interface NewMemberRewardsItemProps {
  label: string;
  completed: boolean;
}

export function MemberDetailsItem({
  label,
  completed,
}: NewMemberRewardsItemProps) {
  const { translate } = useTranslation();
  return (
    <div className="flex items-center justify-between w-full text-base font-semibold">
      <span className="text-primary">{translate(label as TranslationKey)}</span>
      <img
        src={
          completed
            ? "/images/ProfileCompletionUnticked.svg"
            : "/images/ProfileCompletionTicked.svg"
        }
        alt={completed ? "Completed" : "Not completed"}
        className="w-[38px] h-[38px]"
      />
    </div>
  );
}
