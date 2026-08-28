"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type DiningMode = "eat-in" | "to-go";

export interface Outlet {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone: string;
  isOpen: boolean;
  distance?: string;
  lat?: number;
  lng?: number;
  image?: string;
}

export interface BeverageCustomizations {
  size?: "Small" | "Regular" | "Large";
  temperature?: "Iced" | "Hot";
  milk?: "Fresh Milk" | "Low Fat Milk" | "Soy Milk" | "Oat Milk" | "Coconut Milk";
  sweetness?: "Normal Sweet" | "Less Sweet (50%)" | "No Added Sugar";
  extraEspressoShots?: number; // +RM 2.00 each
  syrupCaramel?: number;       // +RM 2.00 each
  syrupHazelnut?: number;      // +RM 2.00 each
  syrupVanilla?: number;       // +RM 2.00 each
  treats?: string[];           // Paired treats e.g. ["Creamy Cheese Bagel"]
  remarks?: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  customizations?: BeverageCustomizations;
  // Sub-detail strings for quick display
  detailsSummary?: string;
  remarks?: string;
}

export type OrderStatus =
  | "Pending Payment"
  | "Order Confirmed"
  | "Preparing Order"
  | "Ready for Pickup"
  | "Order Completed"
  | "Cancelled – payment expired"
  | "Cancelled – by customer"
  | "Cancelled – by store"
  | "Received"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "To pay"
  | "Cancelled";

export interface Order {
  id: string;
  date: string;
  time: string;
  createdAt: number;
  status: OrderStatus;
  orderType: DiningMode;
  pickupTime: string;
  tableNumber?: string | null;
  outlet: Outlet;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  tax: number;
  rounding: number;
  total: number;
  paymentMethod: string;
  pointsEarned: number;
  stampsEarned: number;
  estimatedReadyMinutes: number;
  pickupCode: string;
  summary: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  categoryBadge: string;
  categorySub: string;
  points?: number;
  expiryDate: string;
  status: "active" | "used" | "expired";
  usedDate?: string;
  terms?: string;
  image?: string;
  discountType: "drink" | "food" | "discount";
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  points: number;
  stamps: number; // Max 10 stamps per card
  walletBalance: number; // RM 100.00
  tier: string;
  vouchersCount: number;
  isAuthenticated?: boolean;
}

export const DEFAULT_OUTLETS: Outlet[] = [
  {
    id: 1,
    name: "SFC Suria KLCC",
    address: "Concourse Level, Suria KLCC, Kuala Lumpur",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "0.8 km",
    lat: 3.1579,
    lng: 101.7118,
  },
  {
    id: 2,
    name: "SFC Bukit Bintang",
    address: "Jalan Bukit Bintang, Kuala Lumpur",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: false,
    distance: "1.4 km",
    lat: 3.1472,
    lng: 101.7112,
  },
  {
    id: 3,
    name: "SFC Bangsar Baru",
    address: "Jalan Telawi 3, Bangsar, Kuala Lumpur",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "4.2 km",
    lat: 3.1310,
    lng: 101.6705,
  },
  {
    id: 4,
    name: "SFC The Gardens Mall",
    address: "LG-239, Lower Ground, The Gardens Mall",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "4.8 km",
    lat: 3.1182,
    lng: 101.6761,
  },
  {
    id: 5,
    name: "SFC Mid Valley Megamall",
    address: "LG-045, Lower Ground, Mid Valley Megamall, Lingkaran Syed Putra",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "4.9 km",
    lat: 3.1189,
    lng: 101.6775,
  },
  {
    id: 6,
    name: "SFC Nu Sentral",
    address: "LG-18, Nu Sentral, 201 Jalan Tun Sambanthan, Brickfields",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "5.1 km",
    lat: 3.1332,
    lng: 101.6872,
  },
  {
    id: 7,
    name: "SFC 1 Utama",
    address: "LG-112, Lower Ground, 1 Utama Shopping Centre, Bandar Utama",
    hours: "10.00 am - 10.00 pm",
    phone: "+603-8966 2547",
    isOpen: true,
    distance: "9.3 km",
    lat: 3.1502,
    lng: 101.6152,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "SFC-3082",
    date: "27 Aug 2026",
    time: "7:20 PM",
    createdAt: Date.now() - 10 * 60 * 1000,
    status: "Preparing",
    orderType: "to-go",
    pickupTime: "Today, ASAP",
    outlet: DEFAULT_OUTLETS[0],
    items: [
      {
        id: "init-1",
        menuItemId: "sp1",
        name: "Lemon Peach Yoghurt Frappe",
        price: 15.94,
        quantity: 1,
        image: "/menuImages/lemon-peach-frappe.svg",
        category: "Special Promo",
        detailsSummary: "Regular · Iced (+RM1.50) · Fresh Milk · Less Sweet",
        customizations: {
          size: "Regular",
          temperature: "Iced",
          milk: "Fresh Milk",
          sweetness: "Less Sweet (50%)",
        },
      },
      {
        id: "init-2",
        menuItemId: "bk1",
        name: "Creamy Cheese Bagel",
        price: 14.5,
        quantity: 1,
        image: "/menuImages/creamy-cheese-bagel.svg",
        category: "Bakery & Savory",
        detailsSummary: "Toasted with Cream Cheese",
      },
    ],
    subtotal: 30.44,
    discount: 5.0,
    promoCode: "RM5OFF",
    tax: 1.53,
    rounding: -0.02,
    total: 26.95,
    paymentMethod: "SFC Wallet (Balance: RM 100.00)",
    pointsEarned: 270,
    stampsEarned: 1,
    estimatedReadyMinutes: 7,
    pickupCode: "SF-14",
    summary: "Lemon Peach Yoghurt Frappe + Creamy Cheese Bagel",
  },
  {
    id: "SFC-2984",
    date: "24 Aug 2026",
    time: "2:15 PM",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: "Completed",
    orderType: "eat-in",
    pickupTime: "24 Aug 2026, 2:15 PM",
    outlet: DEFAULT_OUTLETS[1],
    items: [
      {
        id: "init-3",
        menuItemId: "ec1",
        name: "Caffe Latte",
        price: 13.5,
        quantity: 1,
        image: "/menuImages/caffe-latte.svg",
        category: "Espresso & Coffee",
        detailsSummary: "Regular · Hot · Oat Milk (+RM1.50)",
      },
      {
        id: "init-4",
        menuItemId: "ck1",
        name: "Burnt Cheesecake",
        price: 15.0,
        quantity: 1,
        image: "/menuImages/burnt-cheesecake.svg",
        category: "Cakes",
      },
    ],
    subtotal: 28.5,
    discount: 0,
    tax: 1.71,
    rounding: 0.04,
    total: 30.25,
    paymentMethod: "Touch 'n Go eWallet",
    pointsEarned: 300,
    stampsEarned: 1,
    estimatedReadyMinutes: 0,
    pickupCode: "SF-88",
    summary: "Caffe Latte + Burnt Cheesecake",
  },
];

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: "v-act-1",
    code: "FRAPPE300",
    title: "Regular Frappe Drinks",
    categoryBadge: "FRISCO FRAPPE'",
    categorySub: "300pts",
    points: 300,
    expiryDate: "30 Nov 2024",
    status: "active",
    discountType: "drink",
    terms: "Drinks purchased must be at normal price. Valid for 1 regular Frisco Frappe. Not valid for any other sets, promotions and offers.",
  },
  {
    id: "v-act-2",
    code: "CAKE350",
    title: "Cake",
    categoryBadge: "CAKE",
    categorySub: "350pts",
    points: 350,
    expiryDate: "30 Nov 2024",
    status: "active",
    discountType: "food",
    terms: "Valid for 1 slice of artisanal cake. Dine-in or takeaway at any participating San Francisco Coffee outlet.",
  },
  {
    id: "v-act-3",
    code: "BEV250",
    title: "Regular Hot/Iced Beverage",
    categoryBadge: "HANDCRAFTED BEVERAGE",
    categorySub: "250pts",
    points: 250,
    expiryDate: "30 Nov 2024",
    status: "active",
    discountType: "drink",
    terms: "Valid for any regular hot or iced handcrafted coffee/tea drink. Not exchangeable for cash.",
  },
  {
    id: "v-past-1",
    code: "FRAPPE-USED",
    title: "Regular Frappe Drinks",
    categoryBadge: "FRISCO FRAPPE'",
    categorySub: "300pts",
    points: 300,
    expiryDate: "30 Nov 2024",
    usedDate: "30 Nov 2024",
    status: "used",
    discountType: "drink",
  },
  {
    id: "v-past-2",
    code: "CAKE-USED",
    title: "Cake",
    categoryBadge: "CAKE",
    categorySub: "350pts",
    points: 350,
    expiryDate: "30 Nov 2024",
    usedDate: "30 Nov 2024",
    status: "used",
    discountType: "food",
  },
  {
    id: "v-past-3",
    code: "BEV-EXPIRED",
    title: "Regular Hot/Iced Beverage",
    categoryBadge: "HANDCRAFTED BEVERAGE",
    categorySub: "250pts",
    points: 250,
    expiryDate: "30 Nov 2024",
    usedDate: "30 Nov 2024",
    status: "expired",
    discountType: "drink",
  },
];

interface OrderContextType {
  diningMode: DiningMode;
  setDiningMode: (mode: DiningMode) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  selectedOutlet: Outlet;
  setSelectedOutlet: (outlet: Outlet) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  appliedPromo: { code: string; discount: number; name?: string } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  usePointsDiscount: boolean;
  setUsePointsDiscount: (use: boolean) => void;
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  cancelOrder: (orderId: string) => void;
  markOrderCompleted: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (phone: string, name?: string, email?: string) => void;
  logout: () => void;
  topUpWallet: (amount: number) => void;
  deductWalletBalance: (amount: number) => boolean;
  vouchers: Voucher[];
  redeemPointsForVoucher: (voucher: { title: string; categoryBadge: string; categorySub: string; points: number; discountType: "drink" | "food" | "discount" }) => boolean;
  claimStampReward: () => boolean;
  activeOrder: Order | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [diningMode, setDiningMode] = useState<DiningMode>(() => {
    return (localStorage.getItem("sfc_dining_mode") as DiningMode) || "eat-in";
  });

  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(() => {
    const saved = localStorage.getItem("sfc_selected_outlet");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_OUTLETS[0];
  });

  const [pickupTime, setPickupTime] = useState<string>("Today, ASAP");

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("sfc_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return [
      {
        id: "init-item-1",
        menuItemId: "sp1",
        name: "Lemon Peach Yoghurt Frappe",
        price: 14.5,
        quantity: 1,
        image: "/menuImages/lemon-peach-frappe.svg",
        category: "Special Promo",
        detailsSummary: "Regular · Iced · Fresh Milk · Less Sweet (50%)",
      },
    ];
  });

  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; name?: string } | null>({
    code: "RM5OFF",
    discount: 5.0,
    name: "RM 5 Off Voucher",
  });
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("sfc_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_ORDERS;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem("sfc_vouchers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_VOUCHERS;
  });

  const [tableNumber, setTableNumberState] = useState<string | null>(() => {
    return localStorage.getItem("sfc_table_number") || null;
  });

  const setTableNumber = (table: string | null) => {
    setTableNumberState(table);
    if (table) {
      localStorage.setItem("sfc_table_number", table);
    } else {
      localStorage.removeItem("sfc_table_number");
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("sfc_is_authenticated");
    if (saved !== null) {
      return saved === "true";
    }
    return true; // Default to authenticated for demo, can toggle to guest
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("sfc_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      name: "Sarah",
      email: "sarah@sfcoffee.com",
      phone: "+60 12-896 2547",
      points: 2450,
      stamps: 6,
      walletBalance: 100.0,
      tier: "SFC Club",
      vouchersCount: 3,
      isAuthenticated: true,
    };
  });

  const login = (phone: string, name?: string, email?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("sfc_is_authenticated", "true");
    setUserProfile((prev) => ({
      ...prev,
      phone,
      name: name || prev.name || "Member",
      email: email || prev.email,
      isAuthenticated: true,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("sfc_is_authenticated", "false");
    setUserProfile((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  useEffect(() => {
    localStorage.setItem("sfc_is_authenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("sfc_dining_mode", diningMode);
  }, [diningMode]);

  useEffect(() => {
    localStorage.setItem("sfc_selected_outlet", JSON.stringify(selectedOutlet));
  }, [selectedOutlet]);

  useEffect(() => {
    localStorage.setItem("sfc_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("sfc_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("sfc_vouchers", JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem("sfc_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if identical item already in cart
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.menuItemId === item.menuItemId &&
          ci.detailsSummary === item.detailsSummary &&
          ci.remarks === item.remarks
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "FREEDRINK" || trimmed === "FREE") {
      setAppliedPromo({ code: "FREEDRINK", discount: 14.5, name: "Free Handcrafted Drink" });
      return { success: true, message: "Free Drink reward voucher applied!" };
    }
    if (trimmed === "RM5OFF" || trimmed === "SFC5") {
      setAppliedPromo({ code: "RM5OFF", discount: 5.0, name: "RM 5 Off Voucher" });
      return { success: true, message: "RM 5.00 voucher discount applied!" };
    }
    if (trimmed === "SF10" || trimmed === "WELCOME10") {
      setAppliedPromo({ code: "SF10", discount: 0.1, name: "10% Welcome Discount" });
      return { success: true, message: "10% discount applied successfully!" };
    }
    return { success: false, message: "Invalid promo code. Try 'FREEDRINK' or 'RM5OFF'" };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const topUpWallet = (amount: number) => {
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
  };

  const deductWalletBalance = (amount: number): boolean => {
    if (userProfile.walletBalance >= amount) {
      setUserProfile((prev) => ({
        ...prev,
        walletBalance: Math.max(0, Number((prev.walletBalance - amount).toFixed(2))),
        points: prev.points + Math.floor(amount * 10),
      }));
      return true;
    }
    return false;
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const randomCodeNum = Math.floor(10 + Math.random() * 90);
    const letter = ["SF", "CL", "KL", "PR"][Math.floor(Math.random() * 4)];
    const pickupCode = `${letter}-${randomCodeNum}`;
    const orderId = `SFC-${Math.floor(1000 + Math.random() * 9000)}`;

    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const calculatedSubtotal = orderData.subtotal ?? cartTotal;
    let disc = 0;
    if (appliedPromo) {
      disc = appliedPromo.discount < 1 ? calculatedSubtotal * appliedPromo.discount : appliedPromo.discount;
    }
    if (usePointsDiscount) {
      disc += 5.0; // 50 points = RM 5 off
    }
    const afterDisc = Math.max(0, calculatedSubtotal - disc);
    const tax = Math.round(afterDisc * 0.06 * 100) / 100;
    const rounding = -0.02;
    const finalTotal = Math.max(0, afterDisc + tax + rounding);
    const pointsEarned = Math.floor(finalTotal * 10);
    const stampsEarned = cartItems.length > 0 ? 1 : 0;

    const summaryText =
      cartItems.length > 0
        ? `${cartItems[0].name}${cartItems.length > 1 ? ` + ${cartItems.length - 1} items` : ""}`
        : "San Francisco Coffee Order";

    const newOrder: Order = {
      id: orderId,
      date: dateStr,
      time: timeStr,
      createdAt: Date.now(),
      status: orderData.status || "Order Confirmed",
      orderType: diningMode,
      pickupTime: pickupTime || "Today, ASAP (15 mins)",
      tableNumber: diningMode === "eat-in" ? (tableNumber || "3") : null,
      outlet: selectedOutlet,
      items: [...cartItems],
      subtotal: calculatedSubtotal,
      discount: disc,
      promoCode: appliedPromo?.code,
      tax: tax,
      rounding: rounding,
      total: Number(finalTotal.toFixed(2)),
      paymentMethod: orderData.paymentMethod || "SFC Wallet (Balance: RM 100.00)",
      pointsEarned,
      stampsEarned,
      estimatedReadyMinutes: 10,
      pickupCode,
      summary: summaryText,
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Reward points and wallet balance deduction if paid with wallet
    setUserProfile((prev) => {
      const isWallet = newOrder.paymentMethod.includes("Wallet");
      const newBal = isWallet ? Math.max(0, prev.walletBalance - finalTotal) : prev.walletBalance;
      const newStamps = (prev.stamps + stampsEarned) % 10;
      return {
        ...prev,
        walletBalance: Number(newBal.toFixed(2)),
        points: prev.points + pointsEarned,
        stamps: newStamps,
      };
    });

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled – by customer" } : o))
    );
  };

  const markOrderCompleted = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Order Completed" } : o))
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const redeemPointsForVoucher = (voucherData: {
    title: string;
    categoryBadge: string;
    categorySub: string;
    points: number;
    discountType: "drink" | "food" | "discount";
  }): boolean => {
    if (userProfile.points < voucherData.points) {
      return false;
    }

    const newVoucher: Voucher = {
      id: `v-${Date.now()}`,
      code: `REDEEM-${Math.floor(1000 + Math.random() * 9000)}`,
      title: voucherData.title,
      categoryBadge: voucherData.categoryBadge,
      categorySub: voucherData.categorySub,
      points: voucherData.points,
      expiryDate: "30 Nov 2026",
      status: "active",
      discountType: voucherData.discountType,
      terms: "Redeemed with SFC Reward Points. Valid at all San Francisco Coffee outlets in Malaysia.",
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - voucherData.points,
      vouchersCount: prev.vouchersCount + 1,
    }));

    return true;
  };

  const claimStampReward = (): boolean => {
    if (userProfile.stamps < 10) {
      return false;
    }

    const freeDrinkVoucher: Voucher = {
      id: `v-stamp-${Date.now()}`,
      code: "STAMPFREE",
      title: "Complimentary Handcrafted Drink",
      categoryBadge: "HANDCRAFTED BEVERAGE",
      categorySub: "FREE",
      expiryDate: "30 Nov 2026",
      status: "active",
      discountType: "drink",
      terms: "Valid for any Regular handcrafted drink of your choice from the Free Drink menu.",
    };

    setVouchers((prev) => [freeDrinkVoucher, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      stamps: Math.max(0, prev.stamps - 10),
      vouchersCount: prev.vouchersCount + 1,
    }));

    return true;
  };

  // Find most recent active order
  const activeOrder =
    orders.find(
      (o) =>
        o.status === "Pending Payment" ||
        o.status === "Order Confirmed" ||
        o.status === "Preparing Order" ||
        o.status === "Ready for Pickup" ||
        o.status === "Received" ||
        o.status === "Preparing" ||
        o.status === "Ready" ||
        o.status === "To pay"
    ) || null;

  return (
    <OrderContext.Provider
      value={{
        diningMode,
        setDiningMode,
        tableNumber,
        setTableNumber,
        selectedOutlet,
        setSelectedOutlet,
        pickupTime,
        setPickupTime,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        usePointsDiscount,
        setUsePointsDiscount,
        orders,
        createOrder,
        cancelOrder,
        markOrderCompleted,
        updateOrderStatus,
        userProfile,
        setUserProfile,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        topUpWallet,
        deductWalletBalance,
        vouchers,
        redeemPointsForVoucher,
        claimStampReward,
        activeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
