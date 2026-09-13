import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Users,
  AlertCircle,
  Crown
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfirmModal from '../../components/common/ConfirmModal';
import { initialCustomers } from '../../data/mockJewelleryData';
import toast from 'react-hot-toast';
import FilterDropdown from '../../components/common/FilterDropdown';

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'totalPurchases', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Customer Add/Edit Modal state
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState('add'); // 'add' | 'edit'
  const [viewCustomerModalOpen, setViewCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    id: null,
    code: '',
    name: '',
    phone: '',
    email: '',
    city: 'Mumbai',
    totalPurchases: 0,
    outstanding: 0,
    status: 'Active',
    lastPurchase: new Date().toISOString().slice(0, 10),
  });

  const handleOpenAddCustomer = () => {
    const nextId = Math.max(...customers.map((c) => c.id), 0) + 1;
    const nextCode = `CUS-${String(nextId).padStart(3, '0')}`;
    setCustomerModalMode('add');
    setCustomerForm({
      id: nextId,
      code: nextCode,
      name: '',
      phone: '',
      email: '',
      city: 'Mumbai',
      totalPurchases: 0,
      outstanding: 0,
      status: 'Active',
      lastPurchase: new Date().toISOString().slice(0, 10),
    });
    setCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (customer) => {
    setCustomerModalMode('edit');
    setCustomerForm({
      id: customer.id,
      code: customer.code,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      city: customer.city,
      totalPurchases: customer.totalPurchases,
      outstanding: customer.outstanding,
      status: customer.status,
      lastPurchase: customer.lastPurchase,
    });
    setCustomerModalOpen(true);
  };

  const handleOpenViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewCustomerModalOpen(true);
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.name.trim()) {
      toast.error('Please enter customer full name.');
      return;
    }
    if (!customerForm.phone.trim()) {
      toast.error('Please enter contact phone number.');
      return;
    }

    const payload = {
      ...customerForm,
      totalPurchases: Number(customerForm.totalPurchases) || 0,
      outstanding: Number(customerForm.outstanding) || 0,
    };

    if (customerModalMode === 'add') {
      setCustomers((prev) => [payload, ...prev]);
      toast.success(`Client ${payload.name} (${payload.code}) registered successfully!`, { icon: '👤' });
    } else {
      setCustomers((prev) => prev.map((c) => (c.id === payload.id ? payload : c)));
      toast.success(`Customer profile for ${payload.name} updated!`);
    }

    setCustomerModalOpen(false);
  };

  // Available cities from dataset
  const cities = useMemo(() => {
    const unique = Array.from(new Set(initialCustomers.map((c) => c.city)));
    return ['All', ...unique];
  }, []);

  // Summary Metrics calculations
  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const totalPurchases = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
    const totalOutstanding = customers.reduce((sum, c) => sum + c.outstanding, 0);
    const vipCount = customers.filter((c) => c.status === 'VIP').length;
    return { totalCustomers, totalPurchases, totalOutstanding, vipCount };
  }, [customers]);

  // Handle Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-500" />
    );
  };

  // Filter and Sort Data
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter((c) => c.status === selectedStatus);
    }

    if (selectedCity !== 'All') {
      result = result.filter((c) => c.city === selectedCity);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [customers, searchTerm, selectedStatus, selectedCity, sortConfig]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Customer Code', 'Name', 'Phone', 'Email', 'City', 'Total Purchases', 'Outstanding', 'Status', 'Last Purchase'];
    const rows = filteredCustomers.map((c) => [
      c.code,
      `"${c.name}"`,
      c.phone,
      c.email,
      c.city,
      c.totalPurchases,
      c.outstanding,
      c.status,
      c.lastPurchase
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karat360_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer directory exported successfully!');
  };

  // Delete Action
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success(`Customer ${customerToDelete.name} deleted.`);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedCity('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-outfit">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track client purchase histories, outstanding balances, and VIP jewellery profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition shadow-theme-xs"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Export CSV
          </button>
          <button
            onClick={handleOpenAddCustomer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
          >
            <Plus className="w-4 h-4 text-gray-950" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards (MoneyTracker style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Clients
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.totalCustomers.toLocaleString('en-IN')}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Purchases
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(metrics.totalPurchases)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">
              {formatCurrency(metrics.totalOutstanding)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              VIP Tier
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.vipCount} Clients
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar (Matching Invoices layout) */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, code, phone, email, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="w-44">
              <FilterDropdown
                value={selectedStatus}
                onChange={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'VIP', label: 'VIP Gold Club', badge: 'VIP' },
                  { value: 'Active', label: 'Active Clients' },
                  { value: 'Due', label: 'Outstanding Due', badge: 'Due' },
                ]}
                labelPrefix="Status"
                size="sm"
              />
            </div>

            {/* City Filter */}
            <div className="w-44">
              <FilterDropdown
                value={selectedCity}
                onChange={(val) => {
                  setSelectedCity(val);
                  setCurrentPage(1);
                }}
                options={cities.map((city) => ({
                  value: city,
                  label: city === 'All' ? 'All Cities' : city,
                }))}
                labelPrefix="City"
                icon={MapPin}
                size="sm"
              />
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedStatus !== 'All' || selectedCity !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-amber-500 hover:text-amber-600 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition"
                  >
                    <span>Customer</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Contact Details
                  </span>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('city')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition"
                  >
                    <span>City</span>
                    {getSortIcon('city')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('totalPurchases')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition ml-auto"
                  >
                    <span>Total Purchases</span>
                    {getSortIcon('totalPurchases')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('outstanding')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition ml-auto"
                  >
                    <span>Outstanding</span>
                    {getSortIcon('outstanding')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('lastPurchase')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition"
                  >
                    <span>Last Purchase</span>
                    {getSortIcon('lastPurchase')}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors duration-150 group"
                  >
                    {/* Customer Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                            {customer.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {customer.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.city}</span>
                      </div>
                    </td>

                    {/* Total Purchases */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-outfit">
                        {formatCurrency(customer.totalPurchases)}
                      </span>
                    </td>

                    {/* Outstanding */}
                    <td className="px-6 py-4 text-right">
                      {customer.outstanding > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md font-outfit">
                          {formatCurrency(customer.outstanding)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">
                          Nil
                        </span>
                      )}
                    </td>

                    {/* Last Purchase Date */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-medium">
                      {formatDate(customer.lastPurchase)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'VIP'
                            ? 'bg-amber-500/15 text-amber-500 border border-amber-400/30'
                            : customer.status === 'Due'
                            ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                            : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        }`}
                      >
                        {customer.status === 'VIP' && <Crown className="w-3 h-3 text-amber-500" />}
                        {customer.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenViewCustomer(customer)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditCustomer(customer)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <User className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No matching customers found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-amber-500 text-gray-950 font-semibold text-xs rounded-xl hover:bg-amber-400 transition"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MoneyTracker-style Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
          {/* Left: Showing entries info + page size dropdown */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Showing{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {Math.min(currentPage * pageSize, filteredCustomers.length)}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredCustomers.length}
              </span>{' '}
              results
            </span>

            <div className="w-32">
              <FilterDropdown
                value={pageSize}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
                options={[
                  { value: 5, label: '5 per page' },
                  { value: 10, label: '10 per page' },
                  { value: 25, label: '25 per page' },
                ]}
                size="sm"
              />
            </div>
          </div>

          {/* Right: Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  currentPage === pageNum
                    ? 'bg-amber-500 text-gray-950 shadow-sm shadow-amber-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Customer Profile"
        message={`Are you sure you want to delete ${customerToDelete?.name} (${customerToDelete?.code})? This will remove all associated billing and ledger records.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
        }}
      />

      {/* ========================================================================= */}
      {/* ADD / EDIT CUSTOMER MODAL */}
      {/* ========================================================================= */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setCustomerModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl md:max-w-4xl w-full min-h-[640px] max-h-[92vh] overflow-y-auto shadow-2xl z-10 p-8 md:p-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-500 flex items-center justify-center shadow-xs">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {customerModalMode === 'add' ? 'Register New Client' : `Edit Client: ${customerForm.name}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {customerForm.code} • Karat360 Customer Directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCustomerModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="vikram.m@example.com"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                    placeholder="Delhi / Mumbai / Surat"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Membership Status
                  </label>
                  <select
                    value={customerForm.status}
                    onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  >
                    <option value="Active">Active</option>
                    <option value="VIP">VIP Gold Club</option>
                    <option value="Due">Outstanding Due</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Purchases (₹)
                  </label>
                  <input
                    type="number"
                    value={customerForm.totalPurchases}
                    onChange={(e) => setCustomerForm({ ...customerForm, totalPurchases: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Outstanding Due (₹)
                  </label>
                  <input
                    type="number"
                    value={customerForm.outstanding}
                    onChange={(e) => setCustomerForm({ ...customerForm, outstanding: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Client Notes & Jewellery Preferences
                </label>
                <textarea
                  rows={2}
                  value={customerForm.notes || ''}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  placeholder="Special jewellery preferences, anniversary reminder, preferred karatage..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
                >
                  {customerModalMode === 'add' ? 'Register Client' : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW CUSTOMER MODAL */}
      {/* ========================================================================= */}
      {viewCustomerModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setViewCustomerModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl z-10 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 font-bold text-base flex items-center justify-center flex-shrink-0">
                  {selectedCustomer.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedCustomer.code} • {selectedCustomer.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewCustomerModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>{selectedCustomer.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{selectedCustomer.city}</span>
              </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Spent</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-outfit mt-0.5 block">
                  {formatCurrency(selectedCustomer.totalPurchases)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Outstanding</span>
                <span className={`text-base font-bold font-outfit mt-0.5 block ${selectedCustomer.outstanding > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {formatCurrency(selectedCustomer.outstanding)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setViewCustomerModalOpen(false);
                  handleOpenEditCustomer(selectedCustomer);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-600 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
