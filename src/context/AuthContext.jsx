import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import ToastMessage from "../components/common/ToastMessage";

export const DEFAULT_USER = {
  first_name: "Chirag",
  last_name: "Mehta",
  email: "chirag.m@karat360.com",
  phone_number: "+91 98200 11223",
  bio: "Managing Director & Certified Gemologist at Karat360 Fine Jewellery. Overseeing showroom inventory, high-value diamond transactions, and BIS hallmarking compliance.",
  role: "Shop Owner & Administrator",
  store_name: "Karat360 Fine Jewellery",
  store_code: "K360-MUM-01",
  city: "Mumbai",
  state: "Maharashtra",
  address: "Showroom 12, Gold Souk, Zaveri Bazaar, Kalbadevi, Mumbai - 400002",
  gstin: "27AABCK3601M1ZP",
  bis_license: "HM/C-7821903",
  profile_photo: null,
  currency: "INR (₹)",
  timezone: "Asia/Kolkata (IST)",
  date_format: "DD/MM/YYYY",
  default_karat: "22K",
  invoice_prefix: "INV-2026-",
  two_factor: true,
  email_notifications: true,
  sms_alerts: true,
  huid_tracking: true,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("karat360_user");
      return saved ? { ...DEFAULT_USER, ...JSON.parse(saved) } : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!(localStorage.getItem("karat360-access-token") || localStorage.getItem("access_token"))
  );

  const fetchUser = async () => {
    const token = localStorage.getItem("karat360-access-token") || localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/user/me/");
      if (response.data) {
        const merged = { ...DEFAULT_USER, ...response.data };
        setUser(merged);
        localStorage.setItem("karat360_user", JSON.stringify(merged));
      }
    } catch (error) {
      // Keep existing local user state so UI stays responsive and functional
      console.warn("Backend user fetch skipped, using cached profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...(prev || DEFAULT_USER), ...updatedFields };
      try {
        localStorage.setItem("karat360_user", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save updated user profile", err);
      }
      return next;
    });
  };

  const login = async (accessToken) => {
    if (accessToken) {
      localStorage.setItem("karat360-access-token", accessToken);
      localStorage.setItem("access_token", accessToken);
      setIsAuthenticated(true);
      await fetchUser();
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("karat360-access-token");
    setIsAuthenticated(false);
    if (showToast) {
      ToastMessage.success("Logged out successfully");
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("karat360-access-token") || localStorage.getItem("access_token");
    const authed = !!token;
    setIsAuthenticated(authed);
    return authed;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        loading,
        fetchUser,
        login,
        logout,
        isAuthenticated,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
