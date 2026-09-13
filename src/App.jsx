import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppLayout from "./layout/AppLayout";
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import OTPVerification from './pages/auth/OTPVerification';
import ResetPassword from './pages/auth/ResetPassword';
import ShopDashboard from './pages/shop/ShopDashboard';
import Customers from './pages/shop/Customers';
import Inventory from './pages/shop/Inventory';
import Invoices from './pages/shop/Invoices';
import UserProfile from './pages/profile/UserProfile';
import AccountSettings from './pages/settings/AccountSettings';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ style: { zIndex: 999999 } }}
      />
      <ThemeProvider>
        <Router>
          <Provider store={store}>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/shop/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Navigate to="/login" replace />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/otp-verification" element={<OTPVerification />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route element={<AppLayout />}>
                  <Route path="/shop/dashboard" element={<ShopDashboard />} />
                  <Route path="/shop/customers" element={<Customers />} />
                  <Route path="/shop/inventory" element={<Inventory />} />
                  <Route path="/shop/invoices" element={<Invoices />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/settings" element={<AccountSettings />} />
                  <Route path="/shop/profile" element={<UserProfile />} />
                  <Route path="/shop/settings" element={<AccountSettings />} />
                </Route>

                <Route path="*" element={<Navigate to="/shop/dashboard" replace />} />
              </Routes>
            </AuthProvider>
          </Provider>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
