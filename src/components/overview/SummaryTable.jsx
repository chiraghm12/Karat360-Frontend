import Badge from "../ui/badge/Badge";
import { RiPencilFill, FaRegTrashCan } from "../../icons";
import { formatCurrency, formatMonth } from "../../utils";
const SummaryTable = ({ summaries, onEdit, onDelete }) => {
  return (
    <>
      <div className="space-y-4 mt-4 w-full">
        {summaries.map((row) => (
          <div
            key={row.id}
            className="text-gray-800 dark:text-white/90 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4"
          >
            {/* month and action buttons */}
            <div className="flex justify-between items-center mb-3 px-2">
              <div className="flex items-center space-x-2">
                {/* <Badge variant="solid" color="primary" className="mx-2 my-1 p-2">
                  {formatMonth(row.summary_date)}
                </Badge> */}
                <span className={`px-2 py-1 font-semibold text-xl`}>
                  {formatMonth(row.summary_date)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
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
                    onDelete(row);
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
            {/* Summary Details */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 md:grid-cols-2 md:gap-x-8 md:gap-y-3 p-2">
              {/* left side sections */}
              <div className="flex flex-col gap-y-3">
                {/* Total Amount */}
                <div className="flex flex-col bg-brand-100 dark:bg-brand-500/20 rounded-lg px-5 py-7">
                  <span className="text-md text-brand-800 dark:text-brand-300">
                    Total
                  </span>
                  <span className="text-4xl font-bold text-brand-800 dark:text-brand-300">
                    {formatCurrency(row.final_total_amount)}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 md:grid-cols-2 gap-y-5">
                  {/* Total Cash Amount */}
                  <div className="flex flex-col bg-purple-100 dark:bg-purple-500/20 rounded-lg p-5">
                    <span className="text-sm text-purple-800 dark:text-purple-300">
                      Cash
                    </span>
                    <span className="text-3xl font-bold text-purple-800 dark:text-purple-300">
                      {formatCurrency(row.total_cash_amount)}
                    </span>
                  </div>
                  {/* Total Growth Amount */}
                  <div
                    className={`flex flex-col ${row.total_growth < 0
                      ? "bg-error-100 dark:bg-error-500/20"
                      : "bg-success-100 dark:bg-success-500/20"
                      } rounded-lg p-5`}
                  >
                    <span
                      className={`text-sm ${row.total_growth < 0
                        ? "text-error-800 dark:text-error-300"
                        : "text-success-800 dark:text-success-300"
                        }`}
                    >
                      Growth
                    </span>
                    <span
                      className={`text-3xl font-bold ${row.total_growth < 0
                        ? "text-error-800 dark:text-error-300"
                        : "text-success-800 dark:text-success-300"
                        }`}
                    >
                      {formatCurrency(row.total_growth)}
                    </span>
                  </div>
                </div>
              </div>
              {/* right side section */}
              <div className="flex flex-col gap-y-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white/90 rounded-lg px-6 py-4">
                {/* investment portfolio */}
                <div className="flex gap-x-2">
                  <span className="font-semibold">Investment Portfolio -</span>
                  <span className="font-bold">
                    {formatCurrency(row.total_invested_amount)}
                  </span>
                </div>
                {/* Invested Categories */}
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 md:grid-cols-2">
                  {/* Mutual Fund Invested Amount */}
                  <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg p-3 justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-white/90">
                      Mutual Fund
                    </span>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(row.mf_invested_amount)}
                    </span>
                  </div>
                  {/* Equity Invested Amount */}
                  <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg p-3 justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-white/90">
                      Equity
                    </span>
                    <span className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
                      {formatCurrency(row.equity_invested_amount)}
                    </span>
                  </div>
                  {/* Crypto Invested Amount */}
                  <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg p-3 justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-white/90">
                      Crypto
                    </span>
                    <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(row.crypto_invested_amount)}
                    </span>
                  </div>
                  {/* Commodity Invested Amount */}
                  <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg p-3 justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-white/90">
                      Commodity
                    </span>
                    <span className="text-lg font-bold text-lime-500 dark:text-lime-400">
                      {formatCurrency(row.commodity_invested_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-x-5 gap-y-4 p-2">
              {/* Total Income */}
              <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg p-3 justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-white/90">
                  Total Income
                </span>
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                  {formatCurrency(row.total_income)}
                </span>
              </div>
              {/* Total Expense */}
              <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg p-3 justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-white/90">
                  Total Expense
                </span>
                <span className="text-lg font-bold text-pink-700 dark:text-pink-400">
                  {formatCurrency(row.total_expense)}
                </span>
              </div>
              {/* Total Granted Amount */}
              <div className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg p-3 justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-white/90">
                  Total Granted
                </span>
                <span className="text-lg font-bold text-amber-500 dark:text-amber-400">
                  {formatCurrency(row.granted_amount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SummaryTable;
