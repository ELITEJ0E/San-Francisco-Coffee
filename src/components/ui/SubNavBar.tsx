"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import {
  Home,
  Gift,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

function DrinkCupIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Straw sticking out diagonally */}
      <path d="M14 2.5L12 7.5" strokeWidth="2" />
      {/* Cup lid */}
      <path d="M5.5 7.5h13" strokeWidth="2" />
      {/* Cup body tapering down */}
      <path d="M6.8 7.5l1.2 12a2 2 0 0 0 2 1.5h4a2 2 0 0 0 2-1.5l1.2-12" />
    </svg>
  );
}

interface SubNavBarProps {
  activePage?: string;
}

export default function SubNavBar({ activePage: propActivePage }: SubNavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useOrder();

  const isCheckoutOrStatus =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/order-status") ||
    location.pathname.startsWith("/orders/status");

  if (isCheckoutOrStatus) {
    return null;
  }

  const activeOrdersCount = orders.filter(
    (o) => o.status === "Received" || o.status === "Preparing" || o.status === "Ready"
  ).length;

  const getActivePage = () => {
    if (propActivePage) return propActivePage;
    const path = location.pathname;
    if (path.startsWith("/menu") || path.startsWith("/order")) return "Order";
    if (path.startsWith("/rewards")) return "Rewards";
    if (path.startsWith("/stores")) return "Stores";
    if (path.startsWith("/profile") || path.startsWith("/account")) return "Account";
    return "Home";
  };

  const activePage = getActivePage();

  const navItems = [
    {
      label: "Home",
      key: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Order",
      key: "Order",
      path: "/menu",
      icon: DrinkCupIcon,
    },
    {
      label: "Rewards",
      key: "Rewards",
      path: "/rewards",
      icon: Gift,
    },
    {
      label: "Stores",
      key: "Stores",
      path: "/stores",
      icon: Store,
    },
    {
      label: "Account",
      key: "Account",
      path: "/profile",
      icon: User,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full sm:max-w-[430px] bg-white border-t border-stone-200/90 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <nav className="flex items-center justify-around pt-2 pb-0.5 px-1">
        {navItems.map((item) => {
          const isActive = activePage === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center py-1 transition-all active:scale-95 relative"
            >
              {/* Icon Container */}
              <div className="relative w-6 h-6 flex items-center justify-center mb-0.5">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-[#BA1C24] stroke-[2.2]" : "text-stone-400 stroke-[1.6]"
                  )}
                />

                {/* Badge for active orders if on Account */}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#BA1C24] text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] transition-colors duration-200 tracking-tight",
                  isActive ? "text-[#BA1C24] font-bold" : "text-stone-400 font-medium"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-stone-900 rounded-full mx-auto mb-1 mt-0.5" />
    </footer>
  );
}
