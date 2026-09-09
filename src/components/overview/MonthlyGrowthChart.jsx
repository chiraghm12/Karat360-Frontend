import Chart from "react-apexcharts";
import { useState, useMemo } from "react";
import { BiChart, FaChartLine } from "../../icons";
import { FaChartArea } from "react-icons/fa";
import { formatCurrency } from "../../utils";

const MonthlyGrowthChart = ({ summaries = [] }) => {
    const [chartType, setChartType] = useState("bar");
    // Extract month labels and growth data from summaries
    const { categories, data } = useMemo(() => {
        const monthNames = [
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar",
        ];

        // Create a map to store growth data by month (0-11)
        const dataByMonth = new Array(12).fill(0);

        // Populate the data for months that have summaries
        if (summaries && summaries.length > 0) {
            summaries.forEach((item) => {
                const date = new Date(item.summary_date);
                const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec

                // Map calendar month to financial year index (Apr=0, May=1, ..., Mar=11)
                let financialMonthIndex;
                if (monthIndex >= 3) {
                    // Apr-Dec
                    financialMonthIndex = monthIndex - 3;
                } else {
                    // Jan-Mar
                    financialMonthIndex = monthIndex + 9;
                }

                dataByMonth[financialMonthIndex] = item.total_growth;
            });
        }

        return {
            categories: monthNames,
            data: dataByMonth,
        };
    }, [summaries]);

    const options = useMemo(() => {
        const baseOptions = {
            colors: ["#3641f5"],
            chart: {
                fontFamily: "Outfit, sans-serif",
                type: chartType,
                height: 220,
                toolbar: {
                    show: false,
                },
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 600,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "39%",
                    borderRadius: 5,
                    borderRadiusApplication: "end",
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: categories,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            legend: {
                show: true,
                position: "top",
                horizontalAlign: "left",
                fontFamily: "Outfit",
            },
            yaxis: {
                title: {
                    text: undefined,
                },
                labels: {
                    formatter: (val) => {
                        if (Math.abs(val) >= 1000) {
                            return `${(val / 1000).toFixed(0)}k`;
                        }
                        return val;
                    }
                }
            },
            grid: {
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    formatter: (val) => formatCurrency(val),
                },
            },
        };

        if (chartType === "bar") {
            return {
                ...baseOptions,
                stroke: {
                    show: true,
                    width: 4,
                    colors: ["transparent"],
                },
                fill: {
                    type: "solid",
                    opacity: 1,
                },
            };
        } else if (chartType === "line") {
            return {
                ...baseOptions,
                stroke: {
                    show: true,
                    width: 3,
                    curve: "smooth",
                },
                markers: {
                    size: 4,
                    colors: ["#3641f5"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 6,
                    }
                },
                fill: {
                    type: "solid",
                    opacity: 1,
                },
            };
        } else if (chartType === "area") {
            return {
                ...baseOptions,
                stroke: {
                    show: true,
                    width: 3,
                    curve: "smooth",
                },
                markers: {
                    size: 4,
                    colors: ["#3641f5"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                    hover: {
                        size: 6,
                    }
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.5,
                        opacityTo: 0.1,
                        stops: [0, 90, 100]
                    }
                },
            };
        }

        return baseOptions;
    }, [chartType, categories]);

    const series = [
        {
            name: "Growth",
            data: data,
        },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="chart-card overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Monthly Growth
                </h3>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800/60 p-1 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
                    <button
                        onClick={() => setChartType("bar")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${chartType === "bar"
                            ? "bg-white dark:bg-slate-900 text-brand-500 dark:text-white shadow-sm border border-gray-200/50 dark:border-slate-800"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-slate-200"
                            }`}
                        title="Bar View"
                    >
                        <BiChart className="w-4 h-4" />
                        <span className="hidden sm:inline">Bar</span>
                    </button>
                    <button
                        onClick={() => setChartType("line")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${chartType === "line"
                            ? "bg-white dark:bg-slate-900 text-brand-500 dark:text-white shadow-sm border border-gray-200/50 dark:border-slate-800"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-slate-200"
                            }`}
                        title="Line View"
                    >
                        <FaChartLine className="w-4 h-4" />
                        <span className="hidden sm:inline">Line</span>
                    </button>
                    <button
                        onClick={() => setChartType("area")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${chartType === "area"
                            ? "bg-white dark:bg-slate-900 text-brand-500 dark:text-white shadow-sm border border-gray-200/50 dark:border-slate-800"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-slate-200"
                            }`}
                        title="Area View"
                    >
                        <FaChartArea className="w-4 h-4" />
                        <span className="hidden sm:inline">Area</span>
                    </button>
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <div className="-ml-5 pl-2">
                    <Chart key={chartType} options={options} series={series} type={chartType} height={220} width="100%" />
                </div>
            </div>
        </div>
    );
};

export default MonthlyGrowthChart;
