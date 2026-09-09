import React from 'react';
import { useAuth } from '../context/AuthContext';

const ShopOwnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.is_superuser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Admin Access Restricted</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The admin interface is not available in this application. Please login with a Shop Owner account to access the shop management system.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ShopOwnerRoute;
