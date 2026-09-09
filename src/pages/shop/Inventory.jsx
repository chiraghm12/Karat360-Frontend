import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/formatters';

const mockInventory = [
  { id: 1, code: 'RNG-001', name: 'Gold Solitaire Ring', category: 'Rings', metal: 'Gold', purity: '22K', grossWeight: 5.500, netWeight: 5.250, sellingPrice: 38500, status: 'In Stock' },
  { id: 2, code: 'CHN-001', name: 'Heavy Link Chain', category: 'Chains', metal: 'Gold', purity: '24K', grossWeight: 15.200, netWeight: 15.200, sellingPrice: 105000, status: 'In Stock' },
  { id: 3, code: 'BGL-001', name: 'Diamond Bangle set', category: 'Bangles', metal: 'Gold', purity: '18K', grossWeight: 25.000, netWeight: 23.500, sellingPrice: 245000, status: 'Reserved' },
  { id: 4, code: 'SLV-001', name: 'Silver Anklet Pair', category: 'Anklets', metal: 'Silver', purity: '925', grossWeight: 45.000, netWeight: 45.000, sellingPrice: 4500, status: 'In Stock' },
  { id: 5, code: 'RNG-002', name: 'Platinum Band', category: 'Rings', metal: 'Platinum', purity: '950', grossWeight: 6.000, netWeight: 6.000, sellingPrice: 52000, status: 'Sold' },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'In Stock':
      return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-xs font-medium">In Stock</span>;
    case 'Reserved':
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-full text-xs font-medium">Reserved</span>;
    case 'Sold':
      return <span className="px-2 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">Sold</span>;
    default:
      return <span className="px-2 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">{status}</span>;
  }
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory</h1>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by Code, Name, or HUID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="input-field max-w-[150px] py-2 text-sm">
              <option value="">Category</option>
              <option value="Rings">Rings</option>
              <option value="Chains">Chains</option>
            </select>
            <select className="input-field max-w-[150px] py-2 text-sm">
              <option value="">Metal</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
            <select className="input-field max-w-[150px] py-2 text-sm">
              <option value="">Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Image</th>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Metal & Purity</th>
                <th className="px-6 py-4 text-right">Weights</th>
                <th className="px-6 py-4 text-right">Selling Price</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{item.name}</div>
                    <div className="text-xs text-slate-500">Code: <span className="font-medium">{item.code}</span> | {item.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.metal}</div>
                    <div className="text-xs">{item.purity}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div><span className="text-xs text-slate-500">Gross:</span> {formatWeight(item.grossWeight)}</div>
                    <div><span className="text-xs text-slate-500">Net:</span> <span className="font-medium text-slate-900 dark:text-slate-100">{formatWeight(item.netWeight)}</span></div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-amber-600 dark:text-amber-500">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-slate-400 hover:text-amber-500 transition-colors" title="View">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                        <Edit className="w-5 h-5" />
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
            Showing <span className="font-medium text-slate-900 dark:text-slate-100">1</span> to <span className="font-medium text-slate-900 dark:text-slate-100">5</span> of <span className="font-medium text-slate-900 dark:text-slate-100">4215</span> results
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

export default Inventory;
