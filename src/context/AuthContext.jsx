import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import ToastMessage from "../components/common/ToastMessage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/me/");
      setUser(response.data);
      console.log("User details fetched:", response.data);
      ToastMessage.success("User details fetched successfully");
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Add login function to store token and fetch user
  const login = async (accessToken) => {
    if (accessToken) {
      localStorage.setItem("karat360-access-token", accessToken);
      await fetchUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
