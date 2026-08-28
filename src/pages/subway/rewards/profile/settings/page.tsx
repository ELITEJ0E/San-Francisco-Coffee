"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { PWAInstallDialog } from "@/components/ui/PWAInstallDialog";
import { useAppContext } from "@/app/context/AppContext";

export default function Page() {
  const router = useRouter();
  const { translate } = useTranslation();
  const [currentPage, setCurrentPage] = useState("settings");
  const lang = Cookies.get("lang");
  const [selectedLanguage, setSelectedLanguage] = useState(lang);

  const { deferredPrompt, setDeferredPrompt } = useAppContext();
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const languages = [
    { name: "English", code: "EN" },
    { name: "中文", code: "CN" },
    { name: "Bahasa Melayu", code: "BM" },
    { name: "한국어", code: "KR" },
  ];

  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const isDesktopDevice =
      !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent,
      );
    setIsDesktop(isDesktopDevice);

    // Check if already installed (running in standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);


  const handleInstallClick = () => {
    setShowInstallDialog(true);
  };

  const clearDeferredPrompt = () => {
    setDeferredPrompt(null);
  };

  const handleLanguageClick = () => {
    setCurrentPage("language");
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    Cookies.set("lang", language);
    setCurrentPage("settings");
    window.location.reload();
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-primary-foreground h-full overflow-hidden">
        {currentPage === "settings" ? (
          <div className="flex flex-col h-full bg-white">
            <div className="bg-[#008f52] text-white">
              <NavbarHeader 
                title={translate("Settings")} 
                backUrl="/profile" 
                className="bg-[#008f52] text-white border-b-0" 
                iconClass="text-white" 
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="divide-y divide-gray-100 text-black px-4">
                <Button
                  variant={"ghost"}
                  onClick={handleLanguageClick}
                  className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/SettingLanguage.svg"
                      alt="Language icon"
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="text-[15px] font-bold">{translate("Language")}</span>
                  </div>
                  <img
                    src="/images/RightIcon.svg"
                    alt="right"
                    className="w-5 h-5 opacity-60"
                  />
                </Button>
                {process.env.NEXT_PUBLIC_EMP_REF_URL !==
                  "https://emp.cmg.com.my" && (
                  <Button
                    variant={"ghost"}
                    onClick={() => router.push("/profile/settings/theme")}
                    className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/ThemeIcon.svg"
                        alt="Language icon"
                        className="w-5 h-5 flex-shrink-0"
                      />
                      <span className="text-[15px] font-bold">{translate("Theme")}</span>
                    </div>
                    <img
                      src="/images/RightIcon.svg"
                      alt="right"
                      className="w-5 h-5 opacity-60"
                    />
                  </Button>
                )}
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    router.push("/profile/settings/terms_of_service")
                  }
                  className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/SettingTerm.svg"
                      alt="Terms icon"
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="text-[15px] font-bold">
                      {translate("TermsOfService")}
                    </span>
                  </div>
                  <img
                    src="/images/RightIcon.svg"
                    alt="right"
                    className="w-5 h-5 opacity-60"
                  />
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => router.push("/profile/settings/policy")}
                  className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/SettingPolicy.svg"
                      alt="Privacy icon"
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="text-[15px] font-bold">{translate("Policy")}</span>
                  </div>
                  <img
                    src="/images/RightIcon.svg"
                    alt="right"
                    className="w-5 h-5 opacity-60"
                  />
                </Button>
                {!isStandalone && (
                  <Button
                    variant={"ghost"}
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-between py-6 px-0 h-auto hover:bg-transparent rounded-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/Download.svg"
                        alt="Install icon"
                        className="w-5 h-5 flex-shrink-0"
                      />
                      <span className="text-[15px] font-bold">{translate("InstallApp") || "Install App"}</span>
                    </div>
                    <img
                      src="/images/RightIcon.svg"
                      alt="right"
                      className="w-5 h-5 opacity-60"
                    />
                  </Button>
                )}
              </nav>
            </div>
          </div>
        ) : (
          <div className="bg-white">
            <NavbarHeader
              title={translate("ChooseLanguage")}
              backUrl="/profile/settings"
              onClose={() => setCurrentPage("settings")}
            />
            <nav className="divide-y divide-gray-200 text-primary font-medium">
              {languages.map((language) => (
                <Button
                  variant={"link"}
                  key={languages.indexOf(language)}
                  onClick={() => handleLanguageSelect(language.code)}
                  className="w-full px-4 py-8 flex items-center justify-between text-left text-[20px]"
                >
                  <span>{language.name}</span>
                  {selectedLanguage === language.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>

      <PWAInstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onInstall={clearDeferredPrompt}
        isIOS={isIOS}
        isDesktop={isDesktop}
        deferredPrompt={deferredPrompt}
      />
    </>
  );
}
