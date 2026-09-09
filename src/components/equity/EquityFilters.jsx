import { CiSearch, FaAngleDown, IoCloseOutline, FaPlus } from "../../icons";
import Badge from "../ui/badge/Badge";
import DateRangePicker from "../form/input/DateRangePicker";
import Button from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router-dom";

const EquityFilters = ({
    searchTerm,
    onSearchChange,
    onStartDateChange,
    onEndDateChange,
    startDate,
    endDate,
    brockers,
    selectedBrocker,
    onChangeBrocker,
}) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 mb-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
                {/* Search */}
                <div className="relative col-span-6">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CiSearch
                            name="Search"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        />
                    </span>
                    <input
                        type="text"
                        placeholder="Search equity transaction..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-transparent text-gray-800 shadow-theme-xs placeholder:text-gray-400 rounded-lg text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-150"
                    />
                </div>

                {/* Brocker filter */}
                <div className="relative col-span-2">
                    <select
                        value={selectedBrocker}
                        onChange={(e) => onChangeBrocker(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-gray-800 shadow-theme-xs placeholder:text-gray-400 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-150 appearance-none"
                    >
                        {brockers.map((brocker) => (
                            <option key={brocker} value={brocker}>
                                {brocker === "All" ? "All Brockers" : brocker}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaAngleDown
                            name="ChevronDown"
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        />
                    </div>
                </div>

                {/* Date range picker */}
                <div className="relative col-span-4">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onEndDateChange={onEndDateChange}
                        onStartDateChange={onStartDateChange}
                    />
                </div>

                {/* Active Filters Display */}
                {(searchTerm ||
                    selectedBrocker !== "All" ||
                    startDate !== null ||
                    endDate !== null) && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700 col-span-12">
                            <div className="flex items-center space-x-2 flex-wrap">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Active filters:
                                </span>

                                {searchTerm && (
                                    <Badge color="info" variant="light" size="sm">
                                        Search: "{searchTerm}"
                                        <button
                                            onClick={() => onSearchChange("")}
                                            className="ml-1 hover:text-primary-700"
                                        >
                                            <IoCloseOutline name="X" size={12} />
                                        </button>
                                    </Badge>
                                )}

                                {selectedBrocker !== "All" && (
                                    <Badge color="success" variant="light" size="sm">
                                        Brocker: {selectedBrocker}
                                        <button
                                            onClick={() => onChangeBrocker("All")}
                                            className="ml-1 hover:text-accent-700"
                                        >
                                            <IoCloseOutline name="X" size={12} />
                                        </button>
                                    </Badge>
                                )}

                                {startDate !== null && (
                                    <Badge color="primary" variant="light" size="sm">
                                        Start Date: {startDate}
                                        <button
                                            onClick={() => onStartDateChange(null)}
                                            className="ml-1 hover:text-brand-500"
                                        >
                                            <IoCloseOutline name="X" size={12} />
                                        </button>
                                    </Badge>
                                )}
                                {endDate !== null && (
                                    <Badge color="primary" variant="light" size="sm">
                                        End Date: {endDate}
                                        <button
                                            onClick={() => onEndDateChange(null)}
                                            className="ml-1 hover:text-brand-500"
                                        >
                                            <IoCloseOutline name="X" size={12} />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default EquityFilters;
