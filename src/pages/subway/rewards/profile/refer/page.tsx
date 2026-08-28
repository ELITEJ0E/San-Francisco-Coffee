"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";

export default function ReferAFriendPage() {
  const router = useRouter();

  const SubwayLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <div className={`${className} bg-[#009A44] rounded-full flex items-center justify-center text-white font-black text-[10px] italic`}>
      S
    </div>
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText("QXMB4Q");
    alert("Referral code copied!");
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-md h-screen bg-white relative overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <header className="bg-[#008938] px-4 py-4 flex items-center text-white sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-1 mr-4">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex justify-center pr-8">
            <div className="flex items-center">
              <span className="text-[#F5C518] font-black italic text-2xl tracking-tighter">SUBWAY</span>
              <span className="text-white font-black italic text-2xl tracking-tighter">®</span>
            </div>
          </div>
        </header>
        <div className="bg-[#008938] pb-6 flex justify-center">
          <span className="text-white font-medium tracking-[0.2em] text-sm">REWARDS</span>
        </div>

        <main className="flex-1 px-6 py-8">
          <h1 className="text-center text-3xl font-black text-black mb-4">Refer a Friend</h1>
          <p className="text-center text-black font-medium text-lg leading-snug mb-8">
            Share the experience, and earn 100 points as a thank you for every referral.
          </p>

          <div className="flex gap-3 mb-10">
            <div className="flex-1 bg-gray-50 rounded-full flex items-center justify-between px-6 py-4">
              <span className="text-black font-bold text-xl tracking-wider">QXMB4Q</span>
              <button onClick={handleCopyCode} className="text-black">
                <Copy size={20} />
              </button>
            </div>
            <button className="bg-[#F5C518] text-black font-bold text-xl px-8 rounded-full active:scale-95 transition-transform">
              Refer now
            </button>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-[15px] top-[30px] bottom-[30px] w-0.5 bg-gray-100 -z-10" />

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#008938] text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-black font-bold text-lg mb-1">Click on "Refer Now"</h3>
                <p className="text-gray-600 text-sm">Share your unique referral link with a friend.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#008938] text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-black font-bold text-lg mb-1">Friends signed up & made their 1st purchase</h3>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6" />

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#008938] flex items-center justify-center flex-shrink-0">
                <SubwayLogo className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-black font-bold text-base leading-tight">Points upon your friend's first purchase</h3>
              </div>
              <span className="text-[#008938] font-black text-2xl">+100</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}