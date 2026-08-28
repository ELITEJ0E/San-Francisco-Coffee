import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './app/context/ThemeContext';
import { OrderProvider } from './app/context/OrderContext';
import SFHomePage from './pages/subway/home/page';
import SFMenuPage from './pages/subway/menu/page';
import CheckoutPage from './pages/subway/menu/CheckoutPage';
import CheckoutStatePage from './pages/subway/menu/CheckoutStatePage';
import OrderStatusPage from './pages/subway/orders/OrderStatusPage';
import RewardsPage from './pages/subway/rewards/page';
import OrdersPage from './pages/subway/orders/page';
import SFStoresPage from './pages/subway/stores/page';
import SFCProfilePage from './pages/subway/profile/page';
import RateOrderPage from './pages/subway/orders/rate';
import ProfilePage from './pages/subway/rewards/profile/page';
import MyProfilePage from './pages/subway/rewards/profile/my_profile/page';
import EditProfilePage from './pages/subway/rewards/profile/my_profile/edit_profile/page';
import AddressPage from './pages/subway/rewards/profile/address/page';
import BankAccountPage from './pages/subway/rewards/profile/bank_account/page';
import InviteFriendsPage from './pages/subway/rewards/profile/invite_friends/page';
import FAQPage from './pages/subway/rewards/profile/faq/page';
import SettingsPage from './pages/subway/rewards/profile/settings/page';
import WalletPage from './pages/subway/rewards/profile/wallet/page';
import TopUpPage from './pages/subway/rewards/profile/top_up/page';
import PayPage from './pages/subway/rewards/profile/pay/page';
import QRPage from './pages/subway/rewards/profile/qr/page';
import QRScanPage from './pages/subway/rewards/profile/qr_scan/page';
import ThemePage from './pages/subway/rewards/profile/settings/theme/page';

import TermsOfServicePage from './pages/subway/rewards/profile/settings/terms_of_service/page';
import PolicyPage from './pages/subway/rewards/profile/settings/policy/page';
import PrivacyPolicyPage from './pages/subway/rewards/profile/settings/policy/privacy_policy/page';
import RefundPolicyPage from './pages/subway/rewards/profile/settings/policy/refund_policy/page';
import ReservationPolicyPage from './pages/subway/rewards/profile/settings/policy/reservation_policy/page';
import CreditPolicyPage from './pages/subway/rewards/profile/settings/policy/credit_policy/page';

import NewAddressPage from './pages/subway/rewards/profile/address/new_address/page';
import EditAddressPage from './pages/subway/rewards/profile/address/edit_address/page';
import WalletSeeAllPage from './pages/subway/rewards/profile/wallet/see_all/page';
import TopUpPaymentPage from './pages/subway/rewards/profile/top_up/payment/page';
import TopUpSuccessPage from './pages/subway/rewards/profile/top_up/top_up_successful/page';
import ProfileCompletedPage from './pages/subway/rewards/profile/my_profile/edit_profile/profile_completed/page';

import SubNavBar from './components/ui/SubNavBar';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

function AppRoutes() {
  const location = useLocation();
  const isFullBleed =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/order-status") ||
    location.pathname.startsWith("/orders/status");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={`flex-1 flex flex-col overflow-hidden ${isFullBleed ? "pb-0" : "pb-[60px]"}`}
      >
        <Routes location={location}>
          <Route path="/" element={<SFHomePage />} />
          <Route path="/menu" element={<SFMenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/state" element={<CheckoutStatePage />} />
          <Route path="/checkout-state" element={<CheckoutStatePage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="/order-status/:id" element={<OrderStatusPage />} />
          <Route path="/orders/status/:id" element={<OrderStatusPage />} />
          <Route path="/stores" element={<SFStoresPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/rate" element={<RateOrderPage />} />
          <Route path="/profile" element={<SFCProfilePage />} />
          <Route path="/profile/my_profile" element={<MyProfilePage />} />
          <Route path="/profile/my_profile/edit_profile" element={<EditProfilePage />} />
          <Route path="/profile/address" element={<AddressPage />} />
          <Route path="/profile/bank_account" element={<BankAccountPage />} />
          <Route path="/profile/invite_friends" element={<InviteFriendsPage />} />
          <Route path="/profile/faq" element={<FAQPage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />
          <Route path="/profile/settings/theme" element={<ThemePage />} />
          <Route path="/profile/settings/terms_of_service" element={<TermsOfServicePage />} />
          <Route path="/profile/settings/policy" element={<PolicyPage />} />
          <Route path="/profile/settings/policy/privacy_policy" element={<PrivacyPolicyPage />} />
          <Route path="/profile/settings/policy/refund_policy" element={<RefundPolicyPage />} />
          <Route path="/profile/settings/policy/reservation_policy" element={<ReservationPolicyPage />} />
          <Route path="/profile/settings/policy/credit_policy" element={<CreditPolicyPage />} />

          <Route path="/profile/address/new_address" element={<NewAddressPage />} />
          <Route path="/profile/address/edit_address" element={<EditAddressPage />} />
          <Route path="/profile/wallet" element={<WalletPage />} />
          <Route path="/profile/wallet/see_all" element={<WalletSeeAllPage />} />
          <Route path="/profile/top_up" element={<TopUpPage />} />
          <Route path="/profile/top_up/payment" element={<TopUpPaymentPage />} />
          <Route path="/profile/top_up/top_up_successful" element={<TopUpSuccessPage />} />
          <Route path="/profile/my_profile/edit_profile/profile_completed" element={<ProfileCompletedPage />} />
          <Route path="/profile/pay" element={<PayPage />} />
          <Route path="/profile/qr" element={<QRPage />} />
          <Route path="/profile/qr_scan" element={<QRScanPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <div className="h-screen h-[100dvh] bg-stone-100 flex justify-center overflow-hidden font-sans">
          <div className="w-full sm:max-w-[430px] bg-white h-full shadow-2xl relative flex flex-col overflow-hidden">
            <BrowserRouter>
              <AppRoutes />
              <SubNavBar />
            </BrowserRouter>
            <Toaster position="top-center" richColors />
          </div>
        </div>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
