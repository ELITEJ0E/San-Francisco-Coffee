"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();

  const SubwayLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <div className={`${className} bg-[#009A44] rounded-full flex items-center justify-center text-white font-black text-[10px] italic`}>
      S
    </div>
  );

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
          <h1 className="text-center text-3xl font-black text-black mb-4">Complete Your Profile</h1>
          <p className="text-center text-black font-medium text-lg leading-snug mb-8">
            Finish setting up your profile now to receive a 100 points reward!
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#1A1A1A] font-bold">Profile 20%</span>
              <div className="flex items-center gap-1.5">
                <SubwayLogo className="w-5 h-5" />
                <span className="text-black font-bold text-xs">Get 100 Points</span>
              </div>
            </div>
            <div className="h-2.5 w-full bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#76D72F] to-[#008938] w-[20%] rounded-full" />
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-black font-black text-lg mb-2">Gender *</label>
              <div className="relative">
                <select defaultValue="" className="w-full appearance-none bg-white border-2 border-[#008938] rounded-xl px-4 py-3.5 text-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#008938]/50">
                  <option value="" disabled>Choose your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-black font-black text-lg mb-2">Email*</label>
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#008938] focus:ring-1 focus:ring-[#008938]"
              />
            </div>

            <div>
              <label className="block text-black font-black text-lg mb-2">Where do you live? *</label>
              <div className="space-y-3">
                <div className="relative">
                  <select defaultValue="" className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-400 focus:outline-none focus:border-[#008938] focus:ring-1 focus:ring-[#008938]">
                    <option value="" disabled>State</option>
                    <option value="selangor">Selangor</option>
                    <option value="kl">Kuala Lumpur</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                </div>
                <div className="relative">
                  <select defaultValue="" className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-400 focus:outline-none focus:border-[#008938] focus:ring-1 focus:ring-[#008938]">
                    <option value="" disabled>District</option>
                    <option value="pj">Petaling Jaya</option>
                    <option value="subang">Subang Jaya</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-black font-black text-lg mb-2">Income range*</label>
              <div className="relative">
                <select defaultValue="" className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-400 focus:outline-none focus:border-[#008938] focus:ring-1 focus:ring-[#008938]">
                  <option value="" disabled>Your income range</option>
                  <option value="low">Below RM3,000</option>
                  <option value="mid">RM3,000 - RM5,000</option>
                  <option value="high">Above RM5,000</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              </div>
            </div>

            <div className="pt-4 pb-8">
              <button 
                type="button"
                className="w-full bg-[#F5C518] text-black font-black text-xl py-4 rounded-full active:scale-[0.98] transition-transform"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}