import Chart from "react-apexcharts";
import { useMemo } from "react";

const LineChart = ({ data = [] }) => {
    // Process data to fill all 12 months
    const { categories, total, cash } = useMemo(() => {
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

        // Create arrays filled with 0 for all 12 months
        const totalData = new Array(12).fill(0);
        const cashData = new Array(12).fill(0);

        // Populate data for months that exist
        if (data && data.length > 0) {
            data.forEach((item) => {
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

                totalData[financialMonthIndex] = parseFloat(
                    item?.final_total_amount || 0
                );
                cashData[financialMonthIndex] = parseFloat(
                    item?.total_cash_amount || 0
                );
            });
        }

        return {
            categories: monthNames,
            total: totalData,
            cash: cashData,
        };
    }, [data]);

    const options = {
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontSize: "14px",
            markers: { radius: 12 },
        },
        colors: ["#465FFF", "#9CB9FF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: [3, 2],
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            x: {
                format: "dd MMM yyyy",
            },
        },
        xaxis: {
            type: "category",
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
            },
            title: {
                text: "",
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    const series = [
        {
            name: "Total",
            data: total,
        },
        {
            name: "Cash",
            data: cash,
        },
    ];

    return (
        <div className="chart-card">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Total & Cash
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Total & Cash Flow for each month for FY
                    </p>
                </div>
                {/* <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div> */}
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    <Chart options={options} series={series} type="area" height={310} />
                </div>
            </div>
        </div>
    );
};

export default LineChart;
