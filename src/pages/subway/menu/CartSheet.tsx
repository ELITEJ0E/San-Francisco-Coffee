"use client";

import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    updateCartQuantity,
    clearCart,
    appliedPromo,
  } = useOrder();

  if (!isOpen) return null;

  const subtotal = cartTotal;
  let discount = 0;
  if (appliedPromo) {
    discount =
      appliedPromo.discount < 1
        ? subtotal * appliedPromo.discount
        : appliedPromo.discount;
  }
  const taxable = Math.max(0, subtotal - discount);
  const sst = Math.round(taxable * 0.06 * 100) / 100;
  const grandTotal = Math.max(0, taxable + sst - 0.02);

  const handleProceed = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center animate-in fade-in duration-200">
      <div className="w-full sm:max-w-[430px] bg-white h-full flex flex-col overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-stone-800 font-semibold text-sm hover:text-[#BA1C24]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>My Basket ({cartItems.length})</span>
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-stone-400 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-700">Basket is empty</p>
              <p className="text-xs text-stone-400 mt-1">Add items to place an order</p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="w-12 h-12 bg-[#FFF0EB] rounded-lg flex items-center justify-center p-1 shrink-0">
                      <img
                        src={item.image || "/menuImages/lemon-peach-frappe.svg"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      {item.detailsSummary && (
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {item.detailsSummary}
                        </p>
                      )}
                      <p className="text-xs font-bold text-[#BA1C24] mt-1">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#BA1C24]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 w-full sm:max-w-[430px] bg-white border-t border-stone-200 p-4 z-30 shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-stone-500">Estimated Total</span>
              <span className="text-base font-black text-[#BA1C24]">
                RM {grandTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleProceed}
              className="w-full bg-[#BA1C24] hover:bg-[#A3161D] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
