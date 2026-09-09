import { createContext, useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ToastMessage from '../components/common/ToastMessage';

 
const AuthContext = createContext();
let logoutFn = () => {};
 
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const navigate = useNavigate();
 
  const login = (token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('karat360-access-token', token);
    setIsAuthenticated(true);
  };
 
  const logout = (showToast = true) => {
    const hadToken = !!(localStorage.getItem('access_token') || localStorage.getItem('karat360-access-token'));
    localStorage.removeItem('access_token');
    localStorage.removeItem('karat360-access-token');
    setIsAuthenticated(false);
    if (showToast && hadToken) {
      ToastMessage.error('Session expired. Please login again.');
    }
  };

  // assign logout to global variable
  logoutFn = logout;
 
  const checkAuth = () => {
    const token = localStorage.getItem('karat360-access-token') || localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    return true;
  };
 
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// exportable function that can be called from anywhere
export const logoutFromAnywhere = () => {
  logoutFn();
};