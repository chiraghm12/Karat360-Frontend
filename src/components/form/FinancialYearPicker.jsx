import React, { useState, useEffect } from 'react';
import { IoCalendarClear, FaAngleDown } from "../../icons";

const FinancialYearPicker = ({ onDateChange }) => {
  const now = new Date();
  const defaultStartYear = now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
  const [selectedFY, setSelectedFY] = useState(defaultStartYear);
  const [isOpen, setIsOpen] = useState(false);

  const financialYears = Array.from({ length: 11 }, (_, i) => defaultStartYear - 5 + i);

  useEffect(() => {
    const startDate = new Date(selectedFY, 3, 1);
    const endDate = new Date(selectedFY + 1, 2, 31);
    onDateChange?.({ startDate, endDate });
  }, [selectedFY]);

  const formatFinancialYear = (year) => `FY ${year}-${(year + 1).toString().slice(-2)}`;

  return (
    <div className="relative">
      {/* <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label> */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-800 dark:text-white">{formatFinancialYear(selectedFY)}</span>
          <FaAngleDown className={`ml-3 h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 text-gray-800 dark:text-white bg-white dark:bg-white/[0.1] rounded-lg shadow-lg max-h-48 overflow-y-auto no-scrollbar">
          {financialYears.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedFY(year);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-200/[0.2] transition-colors duration-150 ${selectedFY === year ? 'bg-blue-100 dark:bg-blue-100/[0.2] text-blue-800 dark:text-blue-400' : 'text-gray-800 dark:text-white bg-white dark:bg-white/[0.03]'
                }`}
            >
              {formatFinancialYear(year)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialYearPicker;