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

const CryptoTable = ({ crypto, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto m-5 rounded-2xl border border-gray-200 dark:border-gray-800 ">
                <table className="w-full">
                    <thead className="text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <button
                                    //   onClick={() => onSort("sell_date")}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                >
                                    <span>Date</span>
                                    {/* {getSortIcon("sell_date")} */}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <button
                                    //   onClick={() => onSort("stock")}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                >
                                    <span>Crypto Name</span>
                                    {/* {getSortIcon("stock")} */}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <button
                                    //   onClick={() => onSort("quantity")}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                >
                                    <span>Invested</span>
                                    {/* {getSortIcon("quantity")} */}
                                </button>
                            </th>

                            <th className="px-6 py-4 text-left">
                                <button
                                    //   onClick={() => onSort("buy_avg")}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                >
                                    <span>Current</span>
                                    {/* {getSortIcon("buy_avg")} */}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <button
                                    //   onClick={() => onSort("amount")}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-800 dark:text-white/90 px-1 py-1 transition-all duration-150"
                                >
                                    <span>Profit/Loss</span>
                                    {/* {getSortIcon("amount")} */}
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
                        {crypto.map((cry) => (
                            <tr
                                key={cry.id}
                                onClick={() => handleRowClick(cry)}
                                className="table-row-hover cursor-pointer"
                            >
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                    {formatDate(cry.record_date)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                    {cry.crypto_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                    {cry.invested_amount}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">
                                    {cry.current_amount}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                    {/* <div className="flex flex-col items-center justify-between"> */}
                                    <span className={parseFloat(cry.profit_loss) >= 0 ? "text-success-500" : "text-error-500"}>
                                        {formatCurrency(cry.profit_loss)}
                                        <span className="text-[10px] ml-1">
                                            ({cry.profit_loss_percentage} %)
                                        </span>
                                    </span>
                                    {/* </div> */}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(cry);
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
                                                onDelete(cry);
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
                {crypto.map((cry) => (
                    <div
                        key={cry.id}
                        onClick={() => handleRowClick(cry)}
                        className="text-gray-800 dark:text-white/90 bg-surface border border-gray-200 dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
                    >
                        <div className="flex items-center justify-between mb-3 mx-1">
                            <div className="font-bold">{cry.crypto_name}</div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(cry);
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
                                        onDelete(cry);
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

                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Date
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {formatDate(cry.record_date)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Invested
                                </span>
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    {cry.invested_amount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Current
                                </span>
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    {cry.current_amount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Profit/Loss
                                </span>
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    <span className={parseFloat(cry.profit_loss) >= 0 ? "text-success-500" : "text-error-500"}>
                                        {cry.profit_loss}
                                        <span className="text-[10px] ml-1">({cry.profit_loss_percentage} %)</span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoTable;
