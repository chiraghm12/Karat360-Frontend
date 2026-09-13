import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
  Scale,
  CircleDot,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  IndianRupee
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import ConfirmModal from '../../components/common/ConfirmModal';
import { initialInventory } from '../../data/mockJewelleryData';
import toast from 'react-hot-toast';
import FilterDropdown from '../../components/common/FilterDropdown';

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMetal, setSelectedMetal] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sellingPrice', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Inventory Add/Edit Modal state
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryModalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [viewInventoryModalOpen, setViewInventoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [inventoryForm, setInventoryForm] = useState({
    id: null,
    code: '',
    name: '',
    category: 'Rings',
    metal: 'Gold',
    purity: '22K',
    grossWeight: 5.5,
    netWeight: 5.2,
    makingPerGram: 450,
    sellingPrice: 38500,
    status: 'In Stock',
    huid: '',
    notes: '',
  });

  const handleOpenAddInventory = () => {
    const nextId = Math.max(...inventory.map((i) => i.id), 0) + 1;
    const nextCode = `JWL-${String(nextId).padStart(3, '0')}`;
    const nextHuid = `HUID${Math.floor(100000 + Math.random() * 900000)}`;

    setModalMode('add');
    setInventoryForm({
      id: nextId,
      code: nextCode,
      name: '',
      category: 'Necklaces',
      metal: 'Gold',
      purity: '22K',
      grossWeight: 20.0,
      netWeight: 19.5,
      makingPerGram: 550,
      sellingPrice: 145000,
      status: 'In Stock',
      huid: nextHuid,
      notes: '',
    });
    setInventoryModalOpen(true);
  };

  const handleOpenEditInventory = (item) => {
    setModalMode('edit');
    setInventoryForm({
      id: item.id,
      code: item.code,
      name: item.name,
      category: item.category,
      metal: item.metal,
      purity: item.purity,
      grossWeight: item.grossWeight,
      netWeight: item.netWeight,
      makingPerGram: item.makingPerGram || 500,
      sellingPrice: item.sellingPrice,
      status: item.status,
      huid: item.huid || '',
      notes: item.notes || '',
    });
    setInventoryModalOpen(true);
  };

  const handleOpenViewInventory = (item) => {
    setSelectedItem(item);
    setViewInventoryModalOpen(true);
  };

  const handleInventorySubmit = (e) => {
    e.preventDefault();
    if (!inventoryForm.name.trim()) {
      toast.error('Please enter ornament / item name.');
      return;
    }
    if (Number(inventoryForm.netWeight) <= 0) {
      toast.error('Net weight must be greater than 0.');
      return;
    }

    const payload = {
      ...inventoryForm,
      grossWeight: Number(inventoryForm.grossWeight) || 0,
      netWeight: Number(inventoryForm.netWeight) || 0,
      makingPerGram: Number(inventoryForm.makingPerGram) || 0,
      sellingPrice: Number(inventoryForm.sellingPrice) || 0,
    };

    if (inventoryModalMode === 'add') {
      setInventory((prev) => [payload, ...prev]);
      toast.success(`Stock item ${payload.name} (${payload.code}) added!`, { icon: '💎' });
    } else {
      setInventory((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      toast.success(`Stock item ${payload.name} updated!`);
    }

    setInventoryModalOpen(false);
  };

  // Available filter options
  const categories = useMemo(() => {
    const unique = Array.from(new Set(initialInventory.map((i) => i.category)));
    return ['All', ...unique];
  }, []);

  const metals = ['All', 'Gold', 'Silver', 'Diamond', 'Platinum'];
  const statuses = ['All', 'In Stock', 'Reserved', 'Sold'];

  // Summary Metrics calculations (MoneyTracker style)
  const metrics = useMemo(() => {
    const totalItems = inventory.length;
    const totalStockValue = inventory.reduce((sum, item) => sum + item.sellingPrice, 0);
    const totalGoldWeight = inventory
      .filter((i) => i.metal === 'Gold')
      .reduce((sum, item) => sum + item.netWeight, 0);
    const inStockCount = inventory.filter((i) => i.status === 'In Stock').length;
    return { totalItems, totalStockValue, totalGoldWeight, inStockCount };
  }, [inventory]);

  // Sort handler
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

  // Metal color badge helper
  const getMetalBadge = (metal, purity) => {
    switch (metal) {
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-400/30">
            Gold • {purity}
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-400/15 text-slate-400 border border-slate-400/30">
            Silver • {purity}
          </span>
        );
      case 'Diamond':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-400/30">
            <Sparkles className="w-3 h-3 text-sky-400" />
            Diamond • {purity}
          </span>
        );
      case 'Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-400/30">
            Platinum • {purity}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400">
            {metal} • {purity}
          </span>
        );
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            In Stock
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-400/30">
            <Clock className="w-3 h-3 text-amber-500" />
            Reserved
          </span>
        );
      case 'Sold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <Archive className="w-3 h-3 text-slate-400" />
            Sold
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  // Filter & Sort Logic
  const filteredInventory = useMemo(() => {
    let result = [...inventory];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.huid.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.metal.toLowerCase().includes(q) ||
          i.purity.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    if (selectedMetal !== 'All') {
      result = result.filter((i) => i.metal === selectedMetal);
    }

    if (selectedStatus !== 'All') {
      result = result.filter((i) => i.status === selectedStatus);
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
  }, [inventory, searchTerm, selectedCategory, selectedMetal, selectedStatus, sortConfig]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / pageSize));
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInventory.slice(start, start + pageSize);
  }, [filteredInventory, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'Metal', 'Purity', 'HUID', 'Gross Weight (g)', 'Net Weight (g)', 'Making Per Gram', 'Selling Price', 'Status'];
    const rows = filteredInventory.map((i) => [
      i.code,
      `"${i.name}"`,
      i.category,
      i.metal,
      i.purity,
      i.huid,
      i.grossWeight,
      i.netWeight,
      i.makingPerGram,
      i.sellingPrice,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `karat360_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Inventory dataset exported successfully!');
  };

  // Delete Action
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setInventory((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success(`Item ${itemToDelete.name} (${itemToDelete.code}) deleted.`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMetal('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-outfit">
            Jewellery Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage bullion stock, diamond ornaments, net weights, HUIDs and pricing.
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
            onClick={handleOpenAddInventory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
          >
            <Plus className="w-4 h-4 text-gray-950" />
            Add Stock Item
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards (MoneyTracker style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Stock Items
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.totalItems} Pieces
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Valuation
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(metrics.totalStockValue)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gold Net Weight
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatWeight(metrics.totalGoldWeight)}
            </h4>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
            <CircleDot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              In Stock Ready
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.inStockCount} Items
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
              placeholder="Search code, name, category, purity, HUID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="w-44">
              <FilterDropdown
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 'All', label: 'All Categories' },
                  ...categories.filter((c) => c !== 'All').map((cat) => ({
                    value: cat,
                    label: cat,
                  })),
                ]}
                labelPrefix="Category"
                size="sm"
              />
            </div>

            {/* Metal Filter */}
            <div className="w-40">
              <FilterDropdown
                value={selectedMetal}
                onChange={(val) => {
                  setSelectedMetal(val);
                  setCurrentPage(1);
                }}
                options={metals.map((m) => ({
                  value: m,
                  label: m === 'All' ? 'All Metals' : m,
                }))}
                labelPrefix="Metal"
                size="sm"
              />
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <FilterDropdown
                value={selectedStatus}
                onChange={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
                options={statuses.map((s) => ({
                  value: s,
                  label: s === 'All' ? 'All Status' : s,
                }))}
                labelPrefix="Status"
                size="sm"
              />
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedCategory !== 'All' || selectedMetal !== 'All' || selectedStatus !== 'All') && (
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
        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition"
                  >
                    <span>Item & Code</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Metal & Purity
                  </span>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition"
                  >
                    <span>Category</span>
                    {getSortIcon('category')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('grossWeight')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition ml-auto"
                  >
                    <span>Gross Wt.</span>
                    {getSortIcon('grossWeight')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('netWeight')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition ml-auto"
                  >
                    <span>Net Wt.</span>
                    {getSortIcon('netWeight')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('sellingPrice')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider hover:text-amber-500 transition ml-auto"
                  >
                    <span>Price</span>
                    {getSortIcon('sellingPrice')}
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
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors duration-150 group"
                  >
                    {/* Item Name & Icon */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-center text-amber-500 flex-shrink-0 shadow-sm">
                          {item.metal === 'Diamond' ? (
                            <Sparkles className="w-5 h-5 text-sky-400" />
                          ) : (
                            <Layers className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="font-mono">{item.code}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-400">{item.huid}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Metal & Purity Badge */}
                    <td className="px-6 py-4">
                      {getMetalBadge(item.metal, item.purity)}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {item.category}
                    </td>

                    {/* Gross Weight */}
                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {formatWeight(item.grossWeight)}
                    </td>

                    {/* Net Weight */}
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-slate-100 font-mono text-xs">
                      {formatWeight(item.netWeight)}
                    </td>

                    {/* Selling Price */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-outfit text-base">
                        {formatCurrency(item.sellingPrice)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenViewInventory(item)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditInventory(item)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Item"
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
                    <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No inventory items found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your category, metal or keyword filters.
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

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
          {/* Left: Showing entries info + page size dropdown */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Showing{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredInventory.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {Math.min(currentPage * pageSize, filteredInventory.length)}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {filteredInventory.length}
              </span>{' '}
              items
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
        title="Remove Stock Item"
        message={`Are you sure you want to delete ${itemToDelete?.name} (${itemToDelete?.code})? This will remove the item and its HUID barcode from active stock.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />

      {/* ========================================================================= */}
      {/* ADD / EDIT INVENTORY MODAL */}
      {/* ========================================================================= */}
      {inventoryModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setInventoryModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl md:max-w-4xl w-full min-h-[640px] max-h-[92vh] overflow-y-auto shadow-2xl z-10 p-8 md:p-10 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-500 flex items-center justify-center shadow-xs">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {inventoryModalMode === 'add' ? 'Add Jewellery Stock' : `Edit Item: ${inventoryForm.name}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {inventoryForm.code} • {inventoryForm.huid || 'HUID-PENDING'} • Karat360 Jewellery Inventory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInventoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleInventorySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ornament / Item Title *
                </label>
                <input
                  type="text"
                  value={inventoryForm.name}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                  placeholder="e.g. 22K Royal Temple Choker Necklace"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Rings">Rings</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Chains">Chains</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Coins/Bars">Coins / Bars</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Silver Items">Silver Items</option>
                    <option value="Anklets">Anklets</option>
                    <option value="Utensils">Utensils</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Precious Metal
                  </label>
                  <select
                    value={inventoryForm.metal}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, metal: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  >
                    <option value="Gold">Gold</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Purity / Karat
                  </label>
                  <select
                    value={inventoryForm.purity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, purity: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  >
                    <option value="24K">24K (99.9% Pure)</option>
                    <option value="22K">22K (91.6% BIS)</option>
                    <option value="18K">18K (75.0% Gold)</option>
                    <option value="14K">14K (58.5% Gold)</option>
                    <option value="925">925 Sterling Silver</option>
                    <option value="999">999 Pure Silver</option>
                    <option value="950">950 Platinum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    BIS Hallmark HUID
                  </label>
                  <input
                    type="text"
                    value={inventoryForm.huid}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, huid: e.target.value })}
                    placeholder="e.g. HUID-736291"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stock Inventory Status
                  </label>
                  <select
                    value={inventoryForm.status}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, status: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  >
                    <option value="In Stock">In Stock (Available)</option>
                    <option value="Low Stock">Low Stock Alert</option>
                    <option value="Reserved">Reserved (Customer Hold)</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gross Weight (grams)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={inventoryForm.grossWeight}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, grossWeight: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Net Metal Weight (grams) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={inventoryForm.netWeight}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, netWeight: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Making Charges / gram (₹)
                  </label>
                  <input
                    type="number"
                    value={inventoryForm.makingPerGram}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, makingPerGram: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={inventoryForm.sellingPrice}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, sellingPrice: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 font-bold text-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition font-outfit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Item Specifications & Hallmark Notes
                </label>
                <textarea
                  rows={2}
                  value={inventoryForm.notes || ''}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, notes: e.target.value })}
                  placeholder="Craftsmanship style, stone details, hallmark lab certification, inventory notes..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-[0.99] transition"
                >
                  {inventoryModalMode === 'add' ? 'Add to Stock' : 'Update Stock Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW INVENTORY ITEM MODAL */}
      {/* ========================================================================= */}
      {viewInventoryModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setViewInventoryModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl z-10 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedItem.code} • {selectedItem.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewInventoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hallmark Details */}
            <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block uppercase tracking-wider">
                  BIS Hallmark HUID
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {selectedItem.huid || 'Unregistered'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {selectedItem.purity} {selectedItem.metal}
              </span>
            </div>

            {/* Weight and Financials */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Gross Weight</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {formatWeight(selectedItem.grossWeight)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Net Gold Weight</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {formatWeight(selectedItem.netWeight)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Making Charge / g</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  ₹{selectedItem.makingPerGram || 500} /g
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">Selling Price</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm font-outfit mt-0.5 block">
                  {formatCurrency(selectedItem.sellingPrice)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Stock Availability:</span>
              <div>{getStatusBadge(selectedItem.status)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setViewInventoryModalOpen(false);
                  handleOpenEditInventory(selectedItem);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-600 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
