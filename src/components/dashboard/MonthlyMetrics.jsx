import Badge from "../ui/badge/Badge";
import {
    FaWallet,
    FaArrowUp,
    IoCash,
    FaArrowTrendUp,
    FaArrowDown,
} from "../../icons";
import { formatCurrency } from "../../utils";

const MonthlyMetrics = ({ data }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {/* Total Metrics Item */}
            <div className="total-card bg-gradient-to-br from-brand-500 to-brand-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100/20 rounded-xl">
                        <FaWallet className="text-white size-6" />
                    </div>

                    <Badge
                        color={
                            parseFloat(data?.final_total_amount_change || 0) >= 0
                                ? "success"
                                : "error"
                        }
                        variant="solid"
                    >
                        {parseFloat(data?.final_total_amount_change || 0) >= 0 ? (
                            <FaArrowUp />
                        ) : (
                            <FaArrowDown />
                        )}
                        {parseFloat(data?.final_total_amount_change || 0)}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md font-semibold text-white/80">
                        Total
                    </span>
                    <h4 className="mt-2 font-bold text-white text-title-sm">
                        {formatCurrency(parseFloat(data?.final_total_amount || 0))}
                    </h4>
                </div>
            </div>

            {/* Cash Metrics Item */}
            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <IoCash className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <Badge
                        color={
                            parseFloat(data?.total_cash_amount_change || 0) >= 0
                                ? "success"
                                : "error"
                        }
                        variant="light"
                    >
                        {parseFloat(data?.total_cash_amount_change || 0) >= 0 ? (
                            <FaArrowUp />
                        ) : (
                            <FaArrowDown />
                        )}
                        {parseFloat(data?.total_cash_amount_change || 0)}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md text-gray-500 dark:text-gray-400">Cash</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {formatCurrency(parseFloat(data?.total_cash_amount || 0))}
                    </h4>
                </div>
            </div>

            {/* Growth Metrics Item */}
            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <FaArrowTrendUp className="text-gray-800 size-6 dark:text-white/90" />
                    </div>

                    <Badge
                        color={
                            parseFloat(data?.total_growth_percentage || 0) >= 0
                                ? "success"
                                : "error"
                        }
                        variant="light"
                    >
                        {parseFloat(data?.total_growth_percentage || 0) >= 0 ? (
                            <FaArrowUp />
                        ) : (
                            <FaArrowDown />
                        )}
                        {parseFloat(data?.total_growth_percentage || 0)}%
                    </Badge>
                </div>

                <div>
                    <span className="text-md text-gray-500 dark:text-gray-400">
                        Growth
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {formatCurrency(parseFloat(data?.total_growth || 0))}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default MonthlyMetrics;
