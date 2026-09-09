import {
    RiPencilFill,
    FaRegTrashCan,
} from "../../icons";
import { formatDate, formatCurrency } from "../../utils";

const CommodityTable = ({ commodities, onEdit, onDelete }) => {
    const getTypeColor = (type) => {
        return type === "GOLD"
            ? "bg-[#ffd700]/25 text-[#ffd700] dark:bg-[#ffd700]/15 dark:text-[#ffd700]"
            : "bg-[#c0c0c0]/25 text-[#c0c0c0] dark:bg-[#c0c0c0]/15 dark:text-[#c0c0c0]";
    };
    return (
        <>
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
                                        //   onClick={() => onSort("fund_name")}
                                        className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                    >
                                        <span>Type</span>
                                        {/* {getSortIcon("fund_name")} */}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <button
                                        //   onClick={() => onSort("invested_amount")}
                                        className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                    >
                                        <span>Weight(gm)</span>
                                        {/* {getSortIcon("invested_amount")} */}
                                    </button>
                                </th>

                                <th className="px-6 py-4 text-left">
                                    <button
                                        //   onClick={() => onSort("current_amount")}
                                        className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                    >
                                        <span>Price</span>
                                        {/* {getSortIcon("current_amount")} */}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <button
                                        //   onClick={() => onSort("gain_loss_amount")}
                                        className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                    >
                                        <span>Amount</span>
                                        {/* {getSortIcon("gain_loss_amount")} */}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <button className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150">
                                        <span>Status</span>
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <button className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150">
                                        <span>Profit/Loss</span>
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
                            {commodities.map((com) => (
                                <tr
                                    key={com.id}
                                    onClick={() => handleRowClick(com)}
                                    className="table-row-hover cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                        {formatDate(com.record_date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                                                com.type
                                            )}`}
                                        >
                                            {com.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                        {com.weight} gm
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                        {formatCurrency(com.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        <span>{formatCurrency(com.total)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${com.status === 'SOLD' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500' : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500'}`}>{com.status || "HOLD"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        <span>{com.status === 'SOLD' ? formatCurrency(com.profit_loss || 0) : "-"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(com);
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
                                                    onDelete(com);
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
                    {commodities.map((com) => (
                        <div
                            key={com.id}
                            onClick={() => handleRowClick(com)}
                            className="text-gray-800 dark:text-white/90 bg-surface border border-gray-200 dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                                    >
                                        {formatDate(com.fund_date)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(com);
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
                                            onDelete(com);
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
                                        Type
                                    </span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {com.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-800 dark:text-white/90">
                                        Weight
                                    </span>
                                    <span className="text-sm text-gray-800 dark:text-white/90">
                                        {com.weight}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-800 dark:text-white/90">
                                        Price
                                    </span>
                                    <span className="text-sm text-gray-800 dark:text-white/90">
                                        {formatCurrency(com.price)}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-800 dark:text-white/90 truncate">
                                        Amount: {formatCurrency(com.total)}
                                    </p>
                                    <p className="text-sm text-gray-800 dark:text-white/90 truncate mt-1">
                                        Status: <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${com.status === 'SOLD' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500' : 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500'}`}>{com.status || "HOLD"}</span>
                                    </p>
                                    {com.status === 'SOLD' && (
                                        <p className="text-sm text-gray-800 dark:text-white/90 truncate mt-1">
                                            Profit/Loss: {formatCurrency(com.profit_loss || 0)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination
      {totalPages > 1 && renderPagination()} */}
            </div>
        </>
    );
};

export default CommodityTable;
