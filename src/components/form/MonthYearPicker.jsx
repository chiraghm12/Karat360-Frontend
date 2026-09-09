import React, { useState, useEffect, useRef } from "react";
import { IoCalendarClear, FaAngleDown } from "../../icons";
const MonthYearPicker = ({ onDateChange }) => {
  // Default to previous month
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const prevYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(prevMonth);
  const [selectedYear, setSelectedYear] = useState(prevYear);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  useEffect(() => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    console.log("from month year picker");
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    onDateChange?.({ startDate, endDate });
  }, [selectedMonth, selectedYear]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setIsMonthOpen(false);
      }

      if (yearRef.current && !yearRef.current.contains(e.target)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Month Dropdown */}
      <div className="relative flex-1" ref={monthRef}>
        <button
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none  transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-white">
              {months[selectedMonth]}
            </span>
            <FaAngleDown
              className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isMonthOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isMonthOpen && (
          <div className="absolute z-10 w-36 mt-1 text-gray-800 dark:text-white bg-white dark:bg-white/[0.1] rounded-lg shadow-lg max-h-48 overflow-y-auto no-scrollbar">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => {
                  setSelectedMonth(index);
                  setIsMonthOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-200/[0.2] transition-colors duration-150 ${
                  selectedMonth === index
                    ? "bg-blue-100 dark:bg-blue-100/[0.2] text-blue-800 dark:text-blue-400"
                    : "text-gray-800 dark:text-white bg-white dark:bg-white/[0.03]"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="relative flex-1" ref={yearRef}>
        <button
          onClick={() => setIsYearOpen(!isYearOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none  transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-white">
              {selectedYear}
            </span>
            <FaAngleDown
              className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isYearOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isYearOpen && (
          <div className="absolute z-10 w-full mt-1 text-gray-800 dark:text-white bg-white dark:bg-white/[0.1] rounded-lg shadow-lg max-h-48 overflow-y-auto no-scrollbar">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setIsYearOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-200/[0.2] transition-colors duration-150 ${
                  selectedYear === year
                    ? "bg-blue-100 dark:bg-blue-100/[0.2] text-blue-800 dark:text-blue-400"
                    : "text-gray-800 dark:text-white bg-white dark:bg-white/[0.03]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthYearPicker;
