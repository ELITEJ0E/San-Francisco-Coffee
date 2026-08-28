import React from "react";
import { ChevronRight } from "lucide-react";

interface MenuItemProps {
  icon: string;
  label: string;
  disabled?: boolean;
}

const ProfileMenuItem: React.FC<MenuItemProps> = ({ icon, label, disabled = false }) => {
  return (
    <div 
      className={`flex flex-row pt-3 pr-2.5 pb-4 pl-5 w-full bg-white justify-between ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex overflow-hidden z-10 gap-2.5 items-center justify-start">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 self-stretch my-auto aspect-square"
        />
        <div className="self-stretch my-auto bg-blend-normal w-[300px]">
          {label}
        </div>
      </div>
      <ChevronRight className="object-contain self-end -mt-6 w-6" />
    </div>
  );
};

export default ProfileMenuItem;