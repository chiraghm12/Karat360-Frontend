import { useState } from "react";
import {formatCurrency} from "../../utils";

const MonthlyOverviewTable = ({
  data = [],
  currentPage,
  pageSize,
  totalPages,
  totalRows,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-800 dark:text-white/90">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRows)} of {totalRows} results
          </div>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-sm text-gray-800 dark:text-white/90 border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900 shadow-theme-xs rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-gray-800 dark:text-white/90 border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed min-touch-target transition-colors duration-150"
          >
            &lt;
          </button>
          {startPage > 1 && (
            <>
              <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg text-gray-800 dark:text-white/90 bg-transparent dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 min-touch-target transition-colors duration-150">1</button>
              {startPage > 2 && <span className="text-gray-800 dark:text-white/90">...</span>}
            </>
          )}
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg min-touch-target transition-colors duration-150 ${currentPage === page ? "bg-brand-500/10 text-brand-500 border-0" : "text-gray-800 dark:text-white/90 hover:bg-brand-500/10 hover:text-brand-500 dark:hover:text-brand-500"}`}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-text-tertiary">...</span>}
              <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-lg text-gray-800 bg-transparent dark:bg-gray-900 dark:text-white/90 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 min-touch-target transition-colors duration-150">{totalPages}</button>
            </>
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-800 dark:text-white/90 border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed min-touch-target transition-colors duration-150"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden">
      <div className="hidden md:block overflow-x-auto m-5 rounded-2xl border border-gray-200 dark:border-gray-800 ">
        <table className="w-full">
          <thead className="text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">Month</th>
              <th className="px-6 py-4 text-left">Total Income</th>
              <th className="px-6 py-4 text-left">Total Expense</th>
              <th className="px-6 py-4 text-left">Net Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((row, idx) => (
              <tr key={row.month}>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">{row.month}</td>
                <td className="px-6 py-4 text-sm text-green-700 dark:text-green-400">{formatCurrency(row.income)}</td>
                <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{formatCurrency(row.expense)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-white/90">{formatCurrency(row.savings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        {data.map((row) => (
          <div key={row.month} className="text-gray-800 dark:text-white/90 bg-surface border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{row.month}</span>
              <span className="font-bold">{formatCurrency(row.savings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-400">Income: {formatCurrency(row.income)}</span>
              <span className="text-red-600 dark:text-red-400">Expense: {formatCurrency(row.expense)}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default MonthlyOverviewTable;
