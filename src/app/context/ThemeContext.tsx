"use client";
import React, {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
} from "react";

type ThemeResponse = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  tertiary: string;
  tertiaryForeground: string;
  quaternaryForeground: string;
  data?: {
    membershipBronzeIcon: string;
    pointIcon: string;
    dailyCheckinActiveIcon: string;
    pickUpIcon: string;
    mapPinIcon: string;
  };
};

type ThemeProps = ThemeResponse;

const defaultTheme: ThemeResponse = {
  primary: "#FFFFFF",
  primaryForeground: "#000000",
  secondary: "#A7A9B4",
  secondaryForeground: "#009A44",
  tertiary: "#009A44",
  tertiaryForeground: "#F5C518",
  quaternaryForeground: "#000000",
  data: {
    membershipBronzeIcon: "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_membership_bronze_icon.svg",
    pointIcon: "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_point_icon.svg",
    dailyCheckinActiveIcon: "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_point_icon.svg",
    pickUpIcon: "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_point_icon.svg",
    mapPinIcon: "https://storage.googleapis.com/emp-public/SUBWAY/emp_theme/subway_point_icon.svg",
  },
};

export const ThemeContext = createContext<ThemeProps>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const cssVariables = {
      "--primary": defaultTheme.primary,
      "--primary-foreground": defaultTheme.primaryForeground,
      "--secondary": defaultTheme.secondary,
      "--secondary-foreground": defaultTheme.secondaryForeground,
      "--tertiary": defaultTheme.tertiary,
      "--tertiary-foreground": defaultTheme.tertiaryForeground,
      "--quaternary-foreground": defaultTheme.quaternaryForeground,
    } as Record<string, string>;

    Object.entries(cssVariables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, []);

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
