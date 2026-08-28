"use client";

import { NavbarHeader } from "@/components/layout/NavbarHeader";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { setTheme } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";

const colorSelect = [
  {
    name: "DEMO",
    primary: "20 42.9% 95.9%",
    primaryFg: "180.0 56.8% 14.5%",
    secondary: "180.0 56.8% 14.5%",
    secondaryFg: "20 42.9% 95.9%",
    tertiary: "35.5 52.4% 91.8%",
    tertiaryFg: "156 100% 27%",
  },
  {
    name: "madamkwan2",
    primary: "20 42.9% 95.9%",
    primaryFg: "180.0 56.8% 14.5%",
    secondary: "180.0 56.8% 14.5%",
    secondaryFg: "20 42.9% 95.9%",
    tertiary: "35.5 52.4% 91.8%",
    tertiaryFg: "156 100% 27%",
  },
  {
    name: "madamkwan",
    primary: "180.0 56.8% 14.5%",
    primaryFg: "34.1 53.6% 59.4%",
    secondary: "34.1 53.6% 59.4%",
    secondaryFg: "180.0 56.8% 14.5%",
    tertiary: "35.5 52.4% 91.8%",
    tertiaryFg: "156 100% 27%",
  },
  {
    name: "eios",
    primary: "358 58% 25%",
    primaryFg: "34.1 53.6% 59.4%",
    secondary: "34.1 53.6% 59.4%",
    secondaryFg: "358 58% 25%",
    tertiary: "35.5 52.4% 91.8%",
    tertiaryFg: "156 100% 27%",
  },
  {
    name: "default",
    primary: "358 58% 25%",
    primaryFg: "34.1 53.6% 59.4%",
    secondary: "34.1 53.6% 59.4%",
    secondaryFg: "358 58% 25%",
    tertiary: "35.5 52.4% 91.8%",
    tertiaryFg: "156 100% 27%",
  },
];

export default function Page() {
  const handleColorSelect = (mode: string) => {
    const color = colorSelect.find((item) => item.name === mode);
    if (!color) return;

    const cssVariables = {
      "--primary": color.primary,
      "--primary-foreground": color.primaryFg,
      "--secondary": color.secondary,
      "--secondary-foreground": color.secondaryFg,
      "--tertiary": color.tertiary,
      "--tertiary-foreground": color.tertiaryFg,
    } as Record<string, string>;

    Object.entries(cssVariables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  const utils = api.useUtils();
  const router = useRouter();
  const { translate } = useTranslation();
  const { mutate } = useMutation({
    mutationFn: async ({ theme }: { theme: string }) => {
      setTheme(theme);
    },
    onSuccess: () => {
      // timeout 1 sec
      setTimeout(() => {
        utils.theme.getTheme.invalidate();
        toast.success(translate("ThemeUpdated"));
        router.push("/home");
      }, 1000);
    },
  });

  return (
    <div className="flex flex-col mx-auto w-full max-w-md overflow-y-auto bg-primary-foreground h-screen">
      <NavbarHeader title={translate("Theme")} backUrl="/profile/settings" />

      <nav className="divide-y divide-gray-200 text-primary font-medium bg-white">
        {colorSelect.map((item) => (
          <Button
            key={item.name}
            variant="link"
            onClick={() => {
              handleColorSelect(item.name);
              mutate({ theme: item.name });
            }}
            className="w-full px-4 py-8 flex items-center justify-between text-left text-base"
          >
            <span>{item.name}</span>
          </Button>
        ))}
      </nav>
    </div>
  );
}
