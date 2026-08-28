"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  UserCircle,
  UserPlus,
  Settings,
  HelpCircle,
  Ticket,
} from "lucide-react";
import SubNavBar from "@/components/ui/SubNavBar";

export default function ProfilePage() {
  const router = useRouter();

  const menuItems = [
    {
      icon: UserCircle,
      label: "My profile",
      path: "/profile/my_profile",
    },
    {
      icon: UserPlus,
      label: "Invite friends",
      path: "/profile/invite_friends",
    },
    { icon: Settings, label: "Settings", path: "/profile/settings" },
    { icon: HelpCircle, label: "FAQ", path: "/profile/faq" },
  ];

  const SubwayLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <div
      className={`${className} bg-tertiary rounded-full flex items-center justify-center text-white font-black text-[10px] italic`}
    >
      S
    </div>
  );

  return (
    <div className="flex flex-col mx-auto w-full max-w-md h-full bg-[#F7F7F7] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <header className="bg-tertiary py-4 flex items-center justify-center text-white sticky top-0 z-10">
          <h1 className="text-lg font-bold">Profile</h1>
        </header>

        <main className="flex-1 bg-white">
          <div className="px-6 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black italic text-3xl">
                    S
                  </span>
                  <span className="absolute text-[#F5C518] font-black italic text-3xl translate-x-[2px] translate-y-[2px] -z-10">
                    S
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm">Hello!</p>
                <h2 className="text-black font-black text-3xl tracking-tight">
                  Eva
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <SubwayLogo className="w-6 h-6" />
                <span className="text-black font-black text-lg">
                  100 Points
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-tertiary rounded flex items-center justify-center">
                  <Ticket size={14} className="text-white" />
                </div>
                <span className="text-black font-black text-lg">
                  0 Vouchers
                </span>
              </div>
            </div>

            <div
              // onClick={() => router.push("./profile/complete")}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A] font-medium">Profile 20%</span>
                <div className="flex items-center gap-1.5">
                  <SubwayLogo className="w-5 h-5" />
                  <span className="text-black font-bold text-xs">
                    Get 100 Points
                  </span>
                  <ChevronRight size={16} className="text-black" />
                </div>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#76D72F] to-tertiary w-[20%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => item.path !== "#" && router.push(item.path)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <item.icon size={24} className="text-black" strokeWidth={2} />
                  <span className="font-black text-lg text-black">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={20} className="text-black" />
              </button>
            ))}
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        <SubNavBar activePage="Profile" />
      </div>
    </div>
  );
}
