import {
  LuArrowUpDown,
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
  FaArrowLeft,
  FaArrowRight,
  RiPencilFill,
  FaRegTrashCan,
} from "../../icons";
import { formatDate, formatCurrency } from "../../utils";

const MFTable = ({ mfs, sortConfig, onSort, onEdit, onDelete }) => {
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

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto m-5 rounded-2xl border border-gray-200 dark:border-gray-800 ">
        <table className="w-full">
          <thead className="text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">
                <button className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150">
                  <span>Date</span>
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("fund_name")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Name</span>
                  {getSortIcon("fund_name")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("invested_amount")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Invested</span>
                  {getSortIcon("invested_amount")}
                </button>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("current_amount")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>Current</span>
                  {getSortIcon("current_amount")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("gain_loss_amount")}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                >
                  <span>P/L</span>
                  {getSortIcon("gain_loss_amount")}
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {mfs.map((mf) => (
              <tr
                key={mf.id}
                onClick={() => handleRowClick(mf)}
                className="table-row-hover cursor-pointer"
              >
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {formatDate(mf.fund_date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {mf.fund_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {mf.invested_amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                  {mf.current_amount}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  {/* <div className="flex flex-col items-center justify-between"> */}
                  <span className={parseFloat(mf.gain_loss_amount) >= 0 ? "text-success-500" : "text-error-500"}>
                    {mf.gain_loss_amount}
                  </span>
                  <span className={parseFloat(mf.gain_loss_amount) >= 0 ? "text-success-500 text-[10px] ml-1" : "text-error-500 text-[10px] ml-1"}>
                    ({mf.abs_rate} %)
                  </span>
                  {/* </div> */}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(mf);
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
                        onDelete(mf);
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
        {mfs.map((mf) => (
          <div
            key={mf.id}
            onClick={() => handleRowClick(mf)}
            className="text-gray-800 dark:text-white/90 bg-surface border border-gray-200 dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                >
                  {formatDate(mf.fund_date)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(mf);
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
                    onDelete(mf);
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
                  Fund Name
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {mf.fund_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 dark:text-white/90">
                  Invested Amount
                </span>
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(mf.invested_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800 dark:text-white/90">
                  Current Amount
                </span>
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {formatCurrency(mf.current_amount)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-800 dark:text-white/90 truncate">
                  Gain/Loss Amount: <span className={parseFloat(mf.gain_loss_amount) >= 0 ? "text-success-500" : "text-error-500"}>{mf.gain_loss_amount}</span> ({mf.abs_rate}%)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination
      {totalPages > 1 && renderPagination()} */}
    </div>
  );
};

export default MFTable;
