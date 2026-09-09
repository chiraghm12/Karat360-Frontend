import { useEffect, useRef, useState } from "react";
import {
    IoCalendarClear,
    FaAngleDown,
    FaAngleLeft,
    FaAngleRight,
} from "../../../icons";

const DateRangePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(startDate);
    const [selectedEndDate, setSelectedEndDate] = useState(endDate);
    const [isOpen, setIsOpen] = useState(false);

    const datepickerRef = useRef(null);

    useEffect(() => {
        setSelectedStartDate(startDate);
    }, [startDate]);

    useEffect(() => {
        setSelectedEndDate(endDate);
    }, [endDate]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 0; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            const dayString = day.toLocaleDateString("en-US");
            let className =
                "flex items-center justify-center cursor-pointer w-[46px] h-[46px] rounded-full text-gray-800 dark:text-white/90 hover:bg-brand-500";

            if (selectedStartDate && dayString === selectedStartDate) {
                className +=
                    " bg-brand-500 text-gray-800 dark:text-white/90 rounded-r-none";
            }

            if (selectedEndDate && dayString === selectedEndDate) {
                className +=
                    " bg-brand-500 text-gray-800 dark:text-white/90 rounded-l-none";
            }

            if (
                selectedStartDate &&
                selectedEndDate &&
                new Date(day) > new Date(selectedStartDate) &&
                new Date(day) < new Date(selectedEndDate)
            ) {
                className += " bg-gray-200 dark:bg-gray-800 rounded-none";
            }

            daysArray.push(
                <div
                    key={i}
                    className={className}
                    data-date={dayString}
                    onClick={() => handleDayClick(day)}
                >
                    {i}
                </div>
            );
        }
        return daysArray;
    };

    const handleDayClick = (selectedDay) => {
        const dayString = selectedDay.toLocaleDateString("en-US");
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(dayString);
            setSelectedEndDate(null);
        } else {
            if (new Date(selectedDay) < new Date(selectedStartDate)) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(dayString);
            } else {
                setSelectedEndDate(dayString);
            }
        }
    };

    const updateInput = () => {
        if (selectedStartDate && selectedEndDate) {
            return `${selectedStartDate} - ${selectedEndDate}`;
        } else if (selectedStartDate) {
            return selectedStartDate;
        } else {
            return "";
        }
    };

    const toggleDatepicker = () => {
        setIsOpen(!isOpen);
    };

    const handleApply = () => {
        console.log("Applied:", selectedStartDate, selectedEndDate);
        onStartDateChange(selectedStartDate);
        onEndDateChange(selectedEndDate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={datepickerRef}>
            <div className="flex items-center ">
                <span className="absolute left-0 pl-4 text-gray-800 dark:text-gray-400">
                    <IoCalendarClear className="h-6 w-6" />
                </span>

                <input
                    id="datepicker"
                    type="text"
                    placeholder="Pick a date"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white/90 bg-transparent py-3 pl-12 pr-8 shadow-theme-xs placeholder:text-gray-400 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors duration-150 appearance-none"
                    value={updateInput()}
                    onClick={toggleDatepicker}
                    readOnly
                />

                <span
                    className="absolute right-0 cursor-pointer pr-4"
                    onClick={toggleDatepicker}
                >
                    <FaAngleDown className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                </span>
            </div>

            {isOpen && (
                <div
                    id="datepicker-container"
                    className="shadow-theme-xs absolute mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white pt-5 dark:bg-gray-900"
                >
                    <div className="flex items-center justify-between px-5">
                        <button
                            id="prevMonth"
                            className="rounded-md px-2 py-2 text-gray-800 dark:text-white/90 hover:bg-gray-200 dark:hover:bg-gray-800"
                            onClick={() =>
                                setCurrentDate(
                                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                                )
                            }
                        >
                            <FaAngleLeft className="w-5 h-5 text-gray-800 dark:text-white/90" />
                        </button>

                        <div
                            id="currentMonth"
                            className="text-lg font-medium text-gray-800 dark:text-white/90"
                        >
                            {currentDate.toLocaleString("default", {
                                month: "long",
                            })}{" "}
                            {currentDate.getFullYear()}
                        </div>

                        <button
                            id="nextMonth"
                            className="rounded-md px-2 py-2 text-gray-800 dark:text-white/90 hover:bg-gray-200 dark:hover:bg-gray-800"
                            onClick={() =>
                                setCurrentDate(
                                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                                )
                            }
                        >
                            <FaAngleRight className="w-5 h-5 text-gray-800 dark:text-white/90" />
                        </button>
                    </div>

                    <div className="mb-4 mt-6 grid grid-cols-7 gap-2 px-5">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div
                                key={day}
                                className="text-center text-sm font-medium text-gray-800 dark:text-white/90"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div
                        id="days-container"
                        className="mt-2 grid grid-cols-7 gap-y-0.5 px-5"
                    >
                        {renderCalendar()}
                    </div>

                    <div className="mt-5 flex justify-end space-x-2.5 border-t border-gray-200 dark:border-gray-800 p-5">
                        <button
                            id="cancelButton"
                            className="rounded-lg border border-gray-200 dark:border-gray-800 px-5 py-2.5 text-base font-medium text-gray-800 dark:text-white/90 hover:bg-gray-200 dark:hover:bg-gray-950"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            id="applyButton"
                            className="rounded-lg bg-brand-500 px-5 py-2.5 text-base font-medium text-white hover:bg-brand-600"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
