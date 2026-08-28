"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/context/OrderContext";
import { cn } from "@/lib/utils";
import SelectOutletSheet from "../home/SelectOutletSheet";
import { DateTimePicker } from "./DateTimePicker";
import MenuDetails, { type MenuItem } from "./MenuDetails";
import AddFreeDrinkModal from "./AddFreeDrinkModal";
import VoucherSelectModal, { type Voucher } from "./VoucherSelectModal";
import { ALL_MENU_ITEMS } from "./page";
import {
  ChevronLeft,
  ShoppingBag,
  Plus,
  Minus,
  Clock,
  ChevronRight,
  Gift,
  Tag,
  Check,
  CreditCard,
  Wallet,
  Loader2,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    selectedOutlet,
    diningMode,
    pickupTime,
    setPickupTime,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    userProfile,
    createOrder,
    topUpWallet,
  } = useOrder();

  const [isOutletSheetOpen, setIsOutletSheetOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isFreeDrinkModalOpen, setIsFreeDrinkModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "wallet" | "online" | "card"
  >("wallet");
  const [sendInvoice, setSendInvoice] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Price & SST Calculations
  const subtotal = cartTotal;
  let discount = 0;
  if (appliedPromo) {
    discount =
      appliedPromo.discount < 1
        ? subtotal * appliedPromo.discount
        : appliedPromo.discount;
  }
  const taxableAmount = Math.max(0, subtotal - discount);
  const sstTax = Math.round(taxableAmount * 0.06 * 100) / 100;
  const rounding = -0.02;
  const grandTotal = Math.max(0, taxableAmount + sstTax + rounding);
  const pointsEarned = Math.floor(grandTotal * 10);

  const handleEditItem = (menuItemId: string) => {
    for (const items of Object.values(ALL_MENU_ITEMS)) {
      const found = items.find((it) => it.id === menuItemId);
      if (found) {
        setEditingItem(found);
        setIsEditModalOpen(true);
        return;
      }
    }
  };

  const handleSelectVoucher = (voucher: Voucher) => {
    if (voucher.isFreeDrink) {
      applyPromoCode("FREEDRINK");
      setIsFreeDrinkModalOpen(true);
    } else {
      applyPromoCode(voucher.code);
      toast.success(`${voucher.name} applied!`);
    }
  };

  const handlePay = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (
      selectedPaymentMethod === "wallet" &&
      userProfile.walletBalance < grandTotal
    ) {
      toast.error("Insufficient SFC Wallet balance. Please top up or choose online payment.");
      return;
    }

    setIsProcessing(true);

    const paymentMethodLabel =
      selectedPaymentMethod === "wallet"
        ? `SFC Wallet (RM ${userProfile.walletBalance.toFixed(2)})`
        : "Online Banking (FPX / Card)";

    const newOrder = createOrder({
      paymentMethod: paymentMethodLabel,
      subtotal,
      discount,
      tax: sstTax,
      rounding,
      total: Number(grandTotal.toFixed(2)),
    });

    // Navigate to animated Checkout State Page
    navigate("/checkout/state", { state: { order: newOrder } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-1 text-stone-800 font-bold text-sm hover:text-[#BA1C24]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Checkout</span>
          </button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-[#FFF0EB] rounded-full flex items-center justify-center mb-4 border-2 border-[#FED7AA]">
            <ShoppingBag className="w-10 h-10 text-[#BA1C24]" />
          </div>
          <h2 className="text-base font-black text-stone-900">Your basket is empty</h2>
          <p className="text-xs text-stone-500 max-w-xs mt-1 mb-6">
            Explore our specialty handcrafted coffees, seasonal frisco frappes, and bakery treats!
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#BA1C24] hover:bg-[#A3161D] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            Start Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-1 text-stone-900 font-bold text-sm hover:text-[#BA1C24] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-stone-800" />
          <span>Checkout</span>
        </button>
        <span className="text-xs font-black text-[#BA1C24] bg-[#FFF0EB] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#FED7AA]">
          {diningMode === "to-go" ? "Store Pickup" : "Dine In"}
        </span>
      </div>

      {/* Scrollable Checkout Body */}
      <div className="flex-1 overflow-y-auto p-4 pb-36 space-y-4">
        {/* Store Pickup Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider">
              Pickup From Store
            </span>
            <button
              onClick={() => setIsOutletSheetOpen(true)}
              className="text-xs font-bold text-[#BA1C24] hover:underline"
            >
              Change
            </button>
          </div>

          <div
            onClick={() => setIsOutletSheetOpen(true)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center shrink-0 border border-[#FED7AA]">
              <ShoppingBag className="w-5 h-5 text-[#BA1C24]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-stone-900 group-hover:text-[#BA1C24] transition-colors">
                  {selectedOutlet.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                {selectedOutlet.address}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 font-medium">
                <span className="text-emerald-700 font-bold">Open</span>
                <span>·</span>
                <span>{selectedOutlet.distance || "1.2 km"} away</span>
                <span>·</span>
                <span>{selectedOutlet.hours}</span>
              </div>
            </div>
          </div>

          {/* Time Picker */}
          <div
            onClick={() => setIsTimePickerOpen(true)}
            className="flex items-center justify-between pt-2.5 border-t border-stone-100 cursor-pointer text-xs group"
          >
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-[#BA1C24]" />
              <span className="font-bold">{pickupTime || "Today, ASAP (15 mins)"}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#BA1C24] group-hover:underline">
              <span>Change Time</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Order Items ({cartItems.length})
            </h2>
            <button
              onClick={() => navigate("/menu")}
              className="text-xs font-bold text-[#BA1C24] hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Items</span>
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-3 divide-y divide-stone-100">
            {cartItems.map((item) => {
              const isFreeItem = item.price === 0;
              return (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  {/* Item Thumbnail */}
                  <div className="w-16 h-16 bg-[#FFF5F0] rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border border-stone-100">
                    <img
                      src={item.image || "/menuImages/lemon-peach-frappe.svg"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info & Options */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h4>
                        {isFreeItem && (
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                            FREE REWARD
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-black text-stone-900 shrink-0">
                        {isFreeItem ? (
                          <span className="text-emerald-700 font-extrabold">RM 0.00</span>
                        ) : (
                          `RM ${(item.price * item.quantity).toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {item.detailsSummary && (
                      <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-tight">
                        {item.detailsSummary}
                      </p>
                    )}

                    {item.remarks && (
                      <p className="text-[9px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                        "{item.remarks}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-3">
                        {!isFreeItem && (
                          <button
                            onClick={() => handleEditItem(item.menuItemId)}
                            className="text-[11px] font-bold text-[#BA1C24] hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] font-bold text-stone-400 hover:text-red-600 flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Stepper */}
                      {!isFreeItem ? (
                        <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-2 py-0.5 border border-stone-200">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-bold bg-stone-100 px-2 py-0.5 rounded">
                          Qty: 1
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Free Food / Add Free Drink from Checkout Section */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#BA1C24]" />
              <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider">
                Available Free Food & Deals
              </span>
            </div>
            <span className="text-[10px] font-black text-[#BA1C24] bg-[#FFF0EB] px-2 py-0.5 rounded-full border border-[#FED7AA]">
              2 Rewards
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {/* Free Drink Reward Card */}
            <div className="min-w-[240px] bg-gradient-to-br from-[#FFF0EB] to-[#FFF5F0] border border-[#FED7AA] rounded-2xl p-3 flex flex-col justify-between gap-2.5 shrink-0 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#BA1C24] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    🎁
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900 leading-tight">
                      Free Handcrafted Drink
                    </p>
                    <p className="text-[9px] text-stone-500 mt-0.5">
                      Complimentary beverage reward
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#FED7AA]/60">
                <span className="text-[9px] text-stone-400 font-medium">
                  Valid till 30 Jul 2026
                </span>
                <button
                  onClick={() => setIsFreeDrinkModalOpen(true)}
                  className="bg-[#BA1C24] hover:bg-[#A3161D] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>Add Free Drink</span>
                </button>
              </div>
            </div>

            {/* RM 5 Off Voucher Card */}
            <div className="min-w-[240px] bg-[#FFF0EB] border border-[#FED7AA] rounded-2xl p-3 flex flex-col justify-between gap-2.5 shrink-0 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF7D54] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    🏷️
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900 leading-tight">
                      RM 5.00 Off Voucher
                    </p>
                    <p className="text-[9px] text-stone-500 mt-0.5">
                      Min spend RM 20.00
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#FED7AA]/60">
                <span className="text-[9px] text-stone-400 font-medium">
                  Valid till 15 Aug 2026
                </span>
                <button
                  onClick={() => {
                    applyPromoCode("RM5OFF");
                    toast.success("RM 5.00 discount voucher applied!");
                  }}
                  className={cn(
                    "text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs",
                    appliedPromo?.code === "RM5OFF"
                      ? "bg-emerald-600 text-white"
                      : "bg-[#BA1C24] hover:bg-[#A3161D] text-white active:scale-95"
                  )}
                >
                  {appliedPromo?.code === "RM5OFF" ? "Applied ✓" : "Apply Voucher"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vouchers Row Trigger */}
        <div
          onClick={() => setIsVoucherModalOpen(true)}
          className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-[#FED7AA] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-[#BA1C24]" />
            <span className="text-xs font-black text-stone-900">Vouchers</span>
          </div>
          <div className="flex items-center gap-1.5">
            {appliedPromo ? (
              <span className="text-xs font-bold text-[#BA1C24] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
                {appliedPromo.name || appliedPromo.code} (-RM{discount.toFixed(2)})
              </span>
            ) : (
              <span className="text-xs text-stone-400 font-medium">Select Voucher</span>
            )}
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Loyalty Points & Stamp Banner */}
        <div className="bg-[#FFF0EB] border border-[#FED7AA] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#BA1C24] text-white flex items-center justify-center text-sm shrink-0 shadow-xs">
            🎁
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-[#BA1C24]">
              You will get 1 Stamp and {pointsEarned} points!
            </p>
            <p className="text-[10px] text-stone-600 mt-0.5">
              Collect 8 stamps on your SFC Club card to redeem any complimentary handcrafted drink.
            </p>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Payment Method
            </h3>
            {selectedPaymentMethod === "wallet" && (
              <button
                onClick={() => {
                  topUpWallet(50);
                  toast.success("RM 50.00 added to your SFC Wallet!");
                }}
                className="text-[10px] font-bold text-[#BA1C24] hover:underline"
              >
                + Top Up Wallet
              </button>
            )}
          </div>

          <div className="space-y-2">
            {/* Option 1: SFC Wallet */}
            <div
              onClick={() => setSelectedPaymentMethod("wallet")}
              className={cn(
                "p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                selectedPaymentMethod === "wallet"
                  ? "bg-[#FFF0EB] border-[#BA1C24] shadow-xs ring-1 ring-[#BA1C24]"
                  : "bg-white border-stone-200 hover:border-stone-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#BA1C24] text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-stone-900">SFC E-Wallet</p>
                  <p className="text-[10px] text-stone-500">
                    Current Balance:{" "}
                    <span className="font-black text-stone-900">
                      RM {userProfile.walletBalance.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  selectedPaymentMethod === "wallet"
                    ? "border-[#BA1C24] bg-[#BA1C24]"
                    : "border-stone-300 bg-white"
                )}
              >
                {selectedPaymentMethod === "wallet" && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </div>
            </div>

            {/* Option 2: Pay online */}
            <div
              onClick={() => setSelectedPaymentMethod("online")}
              className={cn(
                "p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                selectedPaymentMethod === "online"
                  ? "bg-[#FFF0EB] border-[#BA1C24] shadow-xs ring-1 ring-[#BA1C24]"
                  : "bg-white border-stone-200 hover:border-stone-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-stone-900">Pay Online</p>
                  <p className="text-[10px] text-stone-500">
                    FPX, Touch 'n Go, GrabPay, Visa / Mastercard
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  selectedPaymentMethod === "online"
                    ? "border-[#BA1C24] bg-[#BA1C24]"
                    : "border-stone-300 bg-white"
                )}
              >
                {selectedPaymentMethod === "online" && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2.5">
          <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-1">
            Payment Summary
          </h3>

          <div className="flex justify-between text-xs text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">RM {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xs text-stone-600">
            <span>6% SST</span>
            <span className="font-semibold text-stone-900">RM {sstTax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-xs text-[#BA1C24]">
              <span>Discount ({appliedPromo?.name || "Voucher"})</span>
              <span className="font-bold">-RM {discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-stone-400">
            <span>Rounding adjustment</span>
            <span>-RM 0.02</span>
          </div>

          <div className="pt-2.5 border-t border-stone-100 flex justify-between items-center">
            <span className="text-xs font-black text-stone-900">Grand total</span>
            <span className="text-lg font-black text-[#BA1C24]">
              RM {grandTotal.toFixed(2)}
            </span>
          </div>

          {/* e-Invoice checkbox */}
          <div className="pt-2.5 border-t border-stone-100 flex items-center gap-2">
            <input
              type="checkbox"
              id="invoice"
              checked={sendInvoice}
              onChange={(e) => setSendInvoice(e.target.checked)}
              className="w-4 h-4 accent-[#BA1C24] rounded cursor-pointer"
            />
            <label htmlFor="invoice" className="text-[11px] text-stone-600 cursor-pointer font-medium">
              Send me an official e-invoice to {userProfile.email}
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Payment Bar */}
      <div className="fixed bottom-0 w-full sm:max-w-[430px] bg-white border-t border-stone-200 p-3.5 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Grand Total
          </span>
          <span className="text-lg font-black text-[#BA1C24]">
            RM {grandTotal.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="flex-1 bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-red-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authorizing Order...</span>
            </>
          ) : (
            <>
              <span>Ready to pay</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Add Free Drink Modal */}
      <AddFreeDrinkModal
        isOpen={isFreeDrinkModalOpen}
        onClose={() => setIsFreeDrinkModalOpen(false)}
        onAddFreeDrink={(freeItem) => {
          addToCart(freeItem);
          toast.success(`🎉 ${freeItem.name} added to your checkout order!`);
        }}
      />

      {/* Voucher Select Modal */}
      <VoucherSelectModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        appliedCode={appliedPromo?.code}
        onSelectVoucher={handleSelectVoucher}
        onRemoveVoucher={() => {
          removePromoCode();
          toast.success("Voucher removed");
        }}
        onOpenFreeDrinkModal={() => setIsFreeDrinkModalOpen(true)}
      />

      {/* Select Outlet Sheet */}
      <SelectOutletSheet
        isOpen={isOutletSheetOpen}
        onClose={() => setIsOutletSheetOpen(false)}
      />

      {/* Date Time Picker Modal */}
      <DateTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(time) => setPickupTime(time)}
      />

      {/* Customization Re-edit Modal */}
      <MenuDetails
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onAddToCart={(cartItem) => {
          addToCart(cartItem);
        }}
      />
    </div>
  );
}
