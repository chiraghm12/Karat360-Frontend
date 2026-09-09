import Badge from "../ui/badge/Badge";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaChartLine,
    BiSolidBank,
    IoCash,
    FaBitcoin,
    AiFillGold,
    RiMoneyRupeeCircleFill,
    IoReceipt,
    GiReceiveMoney,
} from "../../icons";
import { formatCurrency } from "../../utils";

const MonthlyMetricsBottom = ({ data }) => {
    return (
        <div className="grid gap-4 md:gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                {/* Equity Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <FaChartLine className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.equity_invested_amount_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.equity_invested_amount_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.equity_invested_amount_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Equity
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.equity_invested_amount || 0))}
                        </h4>
                    </div>
                </div>

                {/* Mutual Fund Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <BiSolidBank className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.mf_invested_amount_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.mf_invested_amount_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.mf_invested_amount_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Mutual Fund
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.mf_invested_amount || 0))}
                        </h4>
                    </div>
                </div>

                {/* Crypto Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <FaBitcoin className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.crypto_invested_amount_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.crypto_invested_amount_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.crypto_invested_amount_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Crypto
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.crypto_invested_amount || 0))}
                        </h4>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
                {/* Commodity Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <AiFillGold className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.commodity_invested_amount_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.commodity_invested_amount_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.commodity_invested_amount_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Commodity
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.commodity_invested_amount || 0))}
                        </h4>
                    </div>
                </div>

                {/* Income Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <RiMoneyRupeeCircleFill className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.total_income_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.total_income_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.total_income_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Income
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.total_income || 0))}
                        </h4>
                    </div>
                </div>

                {/* Expense Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <IoReceipt className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <Badge
                            color={
                                parseFloat(data?.total_expense_change || 0) >= 0
                                    ? "success"
                                    : "error"
                            }
                            variant="light"
                        >
                            {parseFloat(data?.total_expense_change || 0) >= 0 ? (
                                <FaArrowUp />
                            ) : (
                                <FaArrowDown />
                            )}
                            {parseFloat(data?.total_expense_change || 0)}%
                        </Badge>
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Expense
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.total_expense || 0))}
                        </h4>
                    </div>
                </div>

                {/* Granted Metrics Item */}
                <div className="card">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <GiReceiveMoney className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        {/* <Badge color={-5.01 > 0 ? "success" : "error"} variant="light">
              {-5.01 > 0 ? <FaArrowUp /> : <FaArrowDown />}
              -5.01%
            </Badge> */}
                    </div>

                    <div>
                        <span className="text-md text-gray-500 dark:text-gray-400">
                            Granted
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {formatCurrency(parseFloat(data?.granted_amount || 0))}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyMetricsBottom;
