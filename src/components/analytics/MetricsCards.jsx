import Badge from "../ui/badge/Badge";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    RiMoneyRupeeCircleFill,
    IoReceipt,
    FaArrowTrendUp,
} from "../../icons";
import { formatCurrency } from "../../utils";

const MetricsCards = ({ data }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {/* TotalGrowth Metrics Item */}
            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <FaArrowTrendUp className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <Badge
                        color={data.growthChange >= 0 ? "success" : "error"}
                        variant="light"
                    >
                        {data.growthChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {data.growthChange}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md text-gray-500 dark:text-gray-400">
                        Growth
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {formatCurrency(data.totalGrowth)}
                    </h4>
                </div>
            </div>

            {/* Total Income Metrics Item */}
            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <RiMoneyRupeeCircleFill className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <Badge
                        color={data.incomeChange >= 0 ? "success" : "error"}
                        variant="light"
                    >
                        {data.incomeChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {data.incomeChange}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md text-gray-500 dark:text-gray-400">
                        Income
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {formatCurrency(data.totalIncome)}
                    </h4>
                </div>
            </div>

            {/* Total Expense Metrics Item */}
            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <IoReceipt className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <Badge
                        color={data.expenseChange >= 0 ? "success" : "error"}
                        variant="light"
                    >
                        {data.expenseChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {data.expenseChange}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md text-gray-500 dark:text-gray-400">
                        Expense
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {formatCurrency(data.totalExpense)}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default MetricsCards;
