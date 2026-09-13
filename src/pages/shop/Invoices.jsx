import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  FileText,
  IndianRupee,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { initialInvoices, initialCustomers, initialInventory } from '../../data/mockJewelleryData';
import { downloadInvoicePDF } from '../../utils/invoicePdfGenerator';
import FilterDropdown from '../../components/common/FilterDropdown';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const Invoices = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [customers] = useState(initialCustomers);
  const [inventory] = useState(initialInventory);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modals
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    id: null,
    invoiceNumber: '',
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerCity: '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    status: 'Paid',
    paymentMethod: 'UPI',
    notes: '',
    discount: 0,
    items: [
      {
        id: 1,
        name: '',
        purity: '22K (91.6%)',
        huid: '',
        grossWeight: 0,
        netWeight: 0,
        rate: 6950,
        makingCharges: 5000,
        total: 0,
      },
    ],
  });

  // Calculate Summary Metrics
  const metrics = useMemo(() => {
    const totalCount = invoices.length;
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalPaid = invoices
      .filter((inv) => inv.status === 'Paid')
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalPending = invoices
      .filter((inv) => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    return { totalCount, totalBilled, totalPaid, totalPending };
  }, [invoices]);

  // Payment methods list for filter
  const paymentMethods = ['All', 'UPI', 'Cash', 'Card', 'Bank Transfer', 'RTGS'];
  const statuses = ['All', 'Paid', 'Pending', 'Partially Paid', 'Overdue'];

  // Handle Sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
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

  // Filter & Sort Invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customer?.name?.toLowerCase().includes(q) ||
          inv.customer?.phone?.includes(q) ||
          inv.customer?.code?.toLowerCase().includes(q) ||
          inv.items?.some((i) => i.name?.toLowerCase().includes(q))
      );
    }

    if (selectedStatus !== 'All') {
      result = result.filter((inv) => inv.status === selectedStatus);
    }

    if (selectedPaymentMethod !== 'All') {
      result = result.filter((inv) => inv.paymentMethod === selectedPaymentMethod);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'customerName') {
          aVal = a.customer?.name || '';
          bVal = b.customer?.name || '';
        }

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
      });
    }

    return result;
  }, [invoices, searchTerm, selectedStatus, selectedPaymentMethod, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  // Handle PDF Download
  const handleDownloadPDF = (invoice) => {
    try {
      toast.loading(`Generating invoice PDF for ${invoice.invoiceNumber}...`, { id: 'pdf-toast' });
      downloadInvoicePDF(invoice);
      toast.success(`Invoice ${invoice.invoiceNumber} downloaded successfully!`, { id: 'pdf-toast' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF invoice.', { id: 'pdf-toast' });
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextId = Math.max(...invoices.map((i) => i.id), 0) + 1;
    const nextNum = `INV-2024-${String(nextId).padStart(3, '0')}`;
    const defaultCustomer = customers[0] || {};

    setModalMode('add');
    setFormData({
      id: nextId,
      invoiceNumber: nextNum,
      customerId: defaultCustomer.id || '',
      customerName: defaultCustomer.name || '',
      customerPhone: defaultCustomer.phone || '',
      customerEmail: defaultCustomer.email || '',
      customerCity: defaultCustomer.city || 'Mumbai',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      status: 'Paid',
      paymentMethod: 'UPI',
      notes: 'Certified 100% BIS Hallmarked jewellery purchase.',
      discount: 0,
      items: [
        {
          id: 1,
          name: inventory[0]?.name || '22K Royal Temple Choker Necklace',
          purity: inventory[0]?.purity || '22K (91.6%)',
          huid: inventory[0]?.huid || 'HUID-91823',
          grossWeight: inventory[0]?.grossWeight || 30.50,
          netWeight: inventory[0]?.netWeight || 30.00,
          rate: 6950,
          makingCharges: 12000,
          total: Math.round(30.00 * 6950 + 12000),
        },
      ],
    });
    setInvoiceModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (inv) => {
    setModalMode('edit');
    setFormData({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      customerId: inv.customer?.id || '',
      customerName: inv.customer?.name || '',
      customerPhone: inv.customer?.phone || '',
      customerEmail: inv.customer?.email || '',
      customerCity: inv.customer?.city || '',
      date: inv.date,
      dueDate: inv.dueDate,
      status: inv.status,
      paymentMethod: inv.paymentMethod,
      notes: inv.notes || '',
      discount: inv.discount || 0,
      items: inv.items ? JSON.parse(JSON.stringify(inv.items)) : [],
    });
    setInvoiceModalOpen(true);
  };

  // Open View Details Modal
  const handleOpenViewModal = (inv) => {
    setSelectedInvoice(inv);
    setViewModalOpen(true);
  };

  // Delete Action
  const handleDeleteClick = (inv) => {
    setInvoiceToDelete(inv);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceToDelete.id));
      toast.success(`Invoice ${invoiceToDelete.invoiceNumber} removed.`);
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
    }
  };

  // Customer dropdown change in form
  const handleCustomerSelect = (customerId) => {
    const c = customers.find((cust) => cust.id === Number(customerId));
    if (c) {
      setFormData((prev) => ({
        ...prev,
        customerId: c.id,
        customerName: c.name,
        customerPhone: c.phone,
        customerEmail: c.email,
        customerCity: c.city,
      }));
    }
  };

  // Quick fill item from inventory
  const handleInventorySelect = (index, invItemName) => {
    const item = inventory.find((inv) => inv.name === invItemName);
    if (item) {
      const netWeight = item.netWeight || 10;
      const rate = 6950;
      const makingCharges = item.makingCharges || 5000;
      const total = Math.round(netWeight * rate + makingCharges);

      setFormData((prev) => {
        const newItems = [...prev.items];
        newItems[index] = {
          ...newItems[index],
          name: item.name,
          purity: item.purity,
          huid: item.huid,
          grossWeight: item.grossWeight,
          netWeight: item.netWeight,
          rate: rate,
          makingCharges: makingCharges,
          total: total,
        };
        return { ...prev, items: newItems };
      });
    }
  };

  // Line item change
  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      const currentItem = { ...newItems[index], [field]: value };

      if (field === 'netWeight' || field === 'rate' || field === 'makingCharges') {
        const wt = field === 'netWeight' ? Number(value) || 0 : Number(currentItem.netWeight) || 0;
        const rt = field === 'rate' ? Number(value) || 0 : Number(currentItem.rate) || 0;
        const mc = field === 'makingCharges' ? Number(value) || 0 : Number(currentItem.makingCharges) || 0;
        currentItem.total = Math.round(wt * rt + mc);
      }

      newItems[index] = currentItem;
      return { ...prev, items: newItems };
    });
  };

  // Add Line Item
  const handleAddLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          name: '',
          purity: '22K (91.6%)',
          huid: `HUID-${Math.floor(10000 + Math.random() * 90000)}`,
          grossWeight: 10,
          netWeight: 10,
          rate: 6950,
          makingCharges: 3500,
          total: Math.round(10 * 6950 + 3500),
        },
      ],
    }));
  };

  // Remove Line Item
  const handleRemoveLineItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('At least one item is required on an invoice.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Computed totals for the form
  const formSubtotal = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  }, [formData.items]);

  const formGstAmount = useMemo(() => {
    return Math.round((formSubtotal * 3) / 100);
  }, [formSubtotal]);

  const formGrandTotal = useMemo(() => {
    return Math.max(0, formSubtotal + formGstAmount - (Number(formData.discount) || 0));
  }, [formSubtotal, formGstAmount, formData.discount]);

  // Submit Invoice Form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error('Customer name is required.');
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].name.trim()) {
      toast.error('Please specify at least one jewellery line item.');
      return;
    }

    const compiledInvoice = {
      id: formData.id,
      invoiceNumber: formData.invoiceNumber,
      customer: {
        id: formData.customerId,
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
        city: formData.customerCity,
        code: `CUS-${String(formData.customerId).padStart(3, '0')}`,
      },
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal: formSubtotal,
      gstRate: 3,
      gstAmount: formGstAmount,
      discount: Number(formData.discount) || 0,
      grandTotal: formGrandTotal,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      notes: formData.notes,
    };

    if (modalMode === 'add') {
      setInvoices((prev) => [compiledInvoice, ...prev]);
      toast.success(`Invoice ${formData.invoiceNumber} created successfully!`, { icon: '🧾' });
    } else {
      setInvoices((prev) => prev.map((inv) => (inv.id === formData.id ? compiledInvoice : inv)));
      toast.success(`Invoice ${formData.invoiceNumber} updated!`);
    }

    setInvoiceModalOpen(false);
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Partially Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 font-outfit">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-amber-500" />
            Jewellery Invoices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create hallmarked GST invoices, track buyer balances, and download certified PDF bills.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
          >
            <Plus className="w-4 h-4 text-gray-950" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Invoices
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.totalCount}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Billed
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(metrics.totalBilled)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Amount Collected
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(metrics.totalPaid)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Dues
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(metrics.totalPending)}
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
              placeholder="Search by invoice number, customer name, phone, or item..."
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
                options={statuses.map((st) => ({
                  value: st,
                  label: st === 'All' ? 'All Statuses' : st,
                  badge: st !== 'All' ? st : null,
                }))}
                labelPrefix="Status"
                size="sm"
              />
            </div>

            {/* Payment Method Filter */}
            <div className="w-48">
              <FilterDropdown
                value={selectedPaymentMethod}
                onChange={(val) => {
                  setSelectedPaymentMethod(val);
                  setCurrentPage(1);
                }}
                options={paymentMethods.map((pm) => ({
                  value: pm,
                  label: pm === 'All' ? 'All Payment Modes' : pm,
                }))}
                labelPrefix="Method"
                size="sm"
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedStatus !== 'All' || selectedPaymentMethod !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                  setSelectedPaymentMethod('All');
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold text-amber-500 hover:text-amber-600 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('invoiceNumber')}
                  className="px-5 py-4 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>Invoice No</span>
                    {getSortIcon('invoiceNumber')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerName')}
                  className="px-5 py-4 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>Customer</span>
                    {getSortIcon('customerName')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-5 py-4 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                </th>
                <th className="px-5 py-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Items
                  </span>
                </th>
                <th
                  onClick={() => handleSort('grandTotal')}
                  className="px-5 py-4 text-right cursor-pointer hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <span>Amount (Inc. GST)</span>
                    {getSortIcon('grandTotal')}
                  </div>
                </th>
                <th className="px-5 py-4 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Payment
                  </span>
                </th>
                <th className="px-5 py-4 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-5 py-4 text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors duration-150 group"
                  >
                    {/* Invoice Number */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                          {invoice.customer?.name || 'Walk-in Customer'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {invoice.customer?.phone || invoice.customer?.email || 'N/A'}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <div>{formatDate(invoice.date)}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Due: {formatDate(invoice.dueDate)}</div>
                    </td>

                    {/* Items Summary */}
                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {invoice.items?.[0]?.name || 'Jewellery Item'}
                      </div>
                      {invoice.items?.length > 1 && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400">
                          +{invoice.items.length - 1} more items
                        </span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-slate-100 font-outfit text-base">
                      {formatCurrency(invoice.grandTotal)}
                    </td>

                    {/* Payment Mode */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        {invoice.paymentMethod}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">{getStatusBadge(invoice.status)}</td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download PDF */}
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Download PDF Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* View Invoice */}
                        <button
                          onClick={() => handleOpenViewModal(invoice)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="View Invoice Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Invoice */}
                        <button
                          onClick={() => handleOpenEditModal(invoice)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Invoice */}
                        <button
                          onClick={() => handleDeleteClick(invoice)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Invoice"
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
                    <Receipt className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                      No invoices found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or create a new invoice.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {Math.min(currentPage * pageSize, filteredInvoices.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredInvoices.length}
              </span>{' '}
              invoices
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition ${
                    currentPage === page
                      ? 'bg-amber-500 text-gray-950 font-bold shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/5 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT INVOICE MODAL */}
      {/* ========================================================================= */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setInvoiceModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {modalMode === 'add' ? 'Create New Tax Invoice' : `Edit Invoice: ${formData.invoiceNumber}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Karat360 Hallmarked Jewellery Invoice with automatic 3% GST calculation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="mt-5 space-y-6">
              {/* Top Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Customer
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="">-- Choose Existing Client --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code} - {c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Customer Quick Fields */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Customer full name"
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    value={formData.customerCity}
                    onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })}
                    placeholder="City / State"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Jewellery Items Specification
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Item
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/[0.01] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                          Item #{index + 1}
                        </span>

                        {/* Quick stock item picker */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Quick-pick from stock:</span>
                          <select
                            onChange={(e) => handleInventorySelect(index, e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 max-w-[200px]"
                          >
                            <option value="">-- Choose Stock Item --</option>
                            {inventory.map((inv) => (
                              <option key={inv.id} value={inv.name}>
                                {inv.name} ({inv.purity})
                              </option>
                            ))}
                          </select>

                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(index)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md transition"
                              title="Remove Item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Line Item Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Ornament Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            placeholder="e.g. 22K Traditional Bridal Necklace"
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Purity / Karat
                          </label>
                          <select
                            value={item.purity}
                            onChange={(e) => handleItemChange(index, 'purity', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          >
                            <option value="24K (99.9%)">24K (99.9% Pure)</option>
                            <option value="22K (91.6%)">22K (91.6% BIS)</option>
                            <option value="18K (75.0%)">18K (75.0% Gold)</option>
                            <option value="14K (58.5%)">14K (58.5% Gold)</option>
                            <option value="92.5% Sterling">92.5% Sterling Silver</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            HUID / Hallmark No.
                          </label>
                          <input
                            type="text"
                            value={item.huid}
                            onChange={(e) => handleItemChange(index, 'huid', e.target.value)}
                            placeholder="HUID-XXXXX"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Net Weight (g)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.netWeight}
                            onChange={(e) => handleItemChange(index, 'netWeight', e.target.value)}
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Rate / gram (₹)
                          </label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Making Charges (₹)
                          </label>
                          <input
                            type="number"
                            value={item.makingCharges}
                            onChange={(e) => handleItemChange(index, 'makingCharges', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Item Total (₹)
                          </label>
                          <div className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-white/5 rounded-lg">
                            {formatCurrency(item.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status, Payment, Notes & Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* Left Side: Status & Notes */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                      >
                        <option value="UPI">UPI (GooglePay / PhonePe)</option>
                        <option value="Cash">Cash at Counter</option>
                        <option value="Card">Credit / Debit Card</option>
                        <option value="Bank Transfer">NEFT / IMPS</option>
                        <option value="RTGS">RTGS Bullion Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Customer / Invoice Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Special instructions, warranty details, box packing notes..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Right Side: Totals Summary Card */}
                <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(formSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>GST @ 3% (1.5% CGST + 1.5% SGST):</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(formGstAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Discount / Rebate:</span>
                    <div className="flex items-center gap-1">
                      <span>₹</span>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className="w-24 px-2 py-1 text-right text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 font-semibold text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Grand Total:
                    </span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-outfit">
                      {formatCurrency(formGrandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setInvoiceModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
                >
                  {modalMode === 'add' ? 'Save & Generate Invoice' : 'Update Invoice Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW INVOICE MODAL */}
      {/* ========================================================================= */}
      {viewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setViewModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Tax Invoice Preview
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                  {selectedInvoice.invoiceNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs shadow-xs hover:bg-amber-600 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buyer & Metadata Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                  Billed To
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedInvoice.customer?.name}
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedInvoice.customer?.phone}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {selectedInvoice.customer?.city}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                  Invoice Details
                </span>
                <div>
                  <span className="text-slate-400">Date: </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(selectedInvoice.date)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Payment: </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedInvoice.paymentMethod}
                  </span>
                </div>
                <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
              </div>
            </div>

            {/* Items Table Preview */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-white/5 font-semibold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Purity</th>
                    <th className="p-3 text-right">Net Wt</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {(selectedInvoice.items || []).map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{it.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{it.huid}</div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{it.purity}</td>
                      <td className="p-3 text-right font-mono">{Number(it.netWeight).toFixed(2)}g</td>
                      <td className="p-3 text-right">{formatCurrency(it.rate)}</td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(it.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(selectedInvoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST (3%):</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(selectedInvoice.gstAmount)}
                </span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedInvoice.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-amber-500/20 flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
                <span>Total Amount:</span>
                <span className="text-amber-600 dark:text-amber-400 text-base font-outfit">
                  {formatCurrency(selectedInvoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Invoice Record"
        message={`Are you sure you want to permanently delete invoice ${invoiceToDelete?.invoiceNumber}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Invoices;
