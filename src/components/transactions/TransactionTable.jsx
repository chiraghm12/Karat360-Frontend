import { useNavigate } from "react-router-dom";
import {
  LuArrowUpDown,
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
  FaArrowLeft,
  FaArrowRight,
  RiPencilFill,
  FaRegTrashCan,
} from "../../icons";
import { formatCurrency, formatDate } from "../../utils";

const TransactionTable = ({
  transactions,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalPages,
  totalTransactions,
  onPageChange,
  onPageSizeChange,
}) => {
  const navigate = useNavigate();

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <LuArrowUpDown
          name="ArrowUpDown"
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
        />
      );
    }
    return sortConfig.direction === "asc" ? (
      <HiOutlineArrowNarrowUp
        name="ArrowUp"
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
      />
    ) : (
      <HiOutlineArrowNarrowDown
        name="ArrowDown"
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
      />
    );
  };

  const getTypeColor = (type) => {
    return type === "Credit"
      ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
      : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Income:
        "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
      Expense:
        "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
      Dividend:
        "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
      "Bank Interest":
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
      Other: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
    };
    return colors[category] || "text-gray-800 dark:text-white/90";
  };

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
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalTransactions)} of{" "}
            {totalTransactions} results
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
            <FaArrowLeft
              name="ChevronLeft"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg text-gray-800 dark:text-white/90 bg-transparent dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 min-touch-target transition-colors duration-150"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700">
                  ...
                </span>
              )}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg min-touch-target transition-colors duration-150 ${currentPage === page
                ? "bg-brand-500/10 text-brand-500 border-0"
                : "text-gray-800 dark:text-white/90 hover:bg-brand-500/10 hover:text-brand-500 dark:hover:text-brand-500"
                }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-text-tertiary">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-gray-800 bg-transparent dark:bg-gray-900 dark:text-white/90 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 min-touch-target transition-colors duration-150"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-800 dark:text-white/90 border border-gray-200 dark:border-gray-800 bg-transparent dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed min-touch-target transition-colors duration-150"
          >
            <FaArrowRight
              name="ChevronRight"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("transaction_date")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Date</span>
                  {getSortIcon("transaction_date")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("amount")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Amount</span>
                  {getSortIcon("amount")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("transaction_type")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Type</span>
                  {getSortIcon("transaction_type")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("balance")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Balance</span>
                  {getSortIcon("balance")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("category")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Category</span>
                  {getSortIcon("category")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                  Description
                </span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                onClick={() => handleRowClick(transaction)}
                className="table-row-hover cursor-pointer"
              >
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {formatDate(transaction.transaction_date)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      transaction.transaction_type
                    )}`}
                  >
                    {transaction.transaction_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(transaction.balance)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                      transaction.category
                    )}`}
                  >
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90 max-w-xs truncate">
                  {/* {transaction.description} */}
                  {transaction.description.length > 25
                    ? `${transaction.description.slice(0, 25)}…`
                    : transaction.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(transaction);
                      }}
                      className="p-2 bg-blue-light-50 dark:bg-blue-light-500/15 rounded-full hover:bg-blue-light-100 dark:hover:bg-blue-light-500/25 min-touch-target transition-colors duration-150"
                      title="Edit transaction"
                    >
                      <RiPencilFill
                        name="Edit2"
                        className="m-1 w-4 h-4 text-brand-500 dark:text-brand-500"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(transaction);
                      }}
                      className="p-2 bg-error-50 dark:bg-error-500/15 hover:bg-error-100 dark:hover:bg-error-500/25 rounded-full min-touch-target transition-colors duration-150"
                      title="Delete transaction"
                    >
                      <FaRegTrashCan
                        name="Trash2"
                        className="m-1 w-4 h-4 text-error-600 dark:text-error-500"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => handleRowClick(transaction)}
            className="text-gray-800 dark:text-white/90 bg-surface border border-gray-200 dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                    transaction.transaction_type
                  )}`}
                >
                  {transaction.transaction_type}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                    transaction.category
                  )}`}
                >
                  {transaction.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(transaction);
                  }}
                  className="p-2 bg-blue-light-50 dark:bg-blue-light-500/15 rounded-full hover:bg-blue-light-100 dark:hover:bg-blue-light-500/25 min-touch-target transition-colors duration-150"
                >
                  <RiPencilFill
                    name="Edit2"
                    className="m-1 w-4 h-4 text-brand-500 dark:text-brand-500"
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(transaction);
                  }}
                  className="p-2 bg-error-50 dark:bg-error-500/15 hover:bg-error-100 dark:hover:bg-error-500/25 rounded-full min-touch-target transition-colors duration-150"
                >
                  <FaRegTrashCan
                    name="Trash2"
                    className="m-1 w-4 h-4 text-error-600 dark:text-error-500"
                  />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 dark:text-white/90">
                  Amount
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 dark:text-white/90">
                  Date
                </span>
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {formatDate(transaction.transaction_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 dark:text-white/90">
                  Balance
                </span>
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(transaction.balance)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-800 dark:text-white/90 truncate">
                  {transaction.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default TransactionTable;
