import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';

// Mock data
const mockCustomers = [
  { id: 1, code: 'CUS-001', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@example.com', totalPurchases: 450000, outstanding: 0, lastPurchase: '2023-10-15' },
  { id: 2, code: 'CUS-002', name: 'Priya Patel', phone: '+91 98765 12345', email: 'priya@example.com', totalPurchases: 125000, outstanding: 25000, lastPurchase: '2023-11-02' },
  { id: 3, code: 'CUS-003', name: 'Amit Kumar', phone: '+91 91234 56789', email: 'amit@example.com', totalPurchases: 850000, outstanding: 150000, lastPurchase: '2023-10-28' },
  { id: 4, code: 'CUS-004', name: 'Neha Gupta', phone: '+91 99887 76655', email: 'neha@example.com', totalPurchases: 60000, outstanding: 0, lastPurchase: '2023-09-12' },
  { id: 5, code: 'CUS-005', name: 'Sanjay Singh', phone: '+91 98765 98765', email: 'sanjay@example.com', totalPurchases: 1200000, outstanding: 0, lastPurchase: '2023-11-05' },
];

import { formatCurrency, formatDate } from '../../utils/formatters';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customers</h1>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary">Export</button>
            <button className="btn-secondary">Filter</button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-right">Total Purchases</th>
                <th className="px-6 py-4 text-right">Outstanding</th>
                <th className="px-6 py-4">Last Purchase</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{customer.name}</div>
                    <div className="text-xs text-slate-500">{customer.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{customer.phone}</div>
                    <div className="text-xs">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(customer.totalPurchases)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${customer.outstanding > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {formatCurrency(customer.outstanding)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(customer.lastPurchase)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-slate-400 hover:text-amber-500 transition-colors" title="View">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
          <div className="text-slate-500">
            Showing <span className="font-medium text-slate-900 dark:text-slate-100">1</span> to <span className="font-medium text-slate-900 dark:text-slate-100">5</span> of <span className="font-medium text-slate-900 dark:text-slate-100">2845</span> results
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-amber-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">2</button>
            <button className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
