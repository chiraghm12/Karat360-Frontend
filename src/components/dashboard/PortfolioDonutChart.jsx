import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../utils";

const PortfolioDonutChart = ({ data, totalValue }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const formatPercentage = (value) => {
        if (value === null || value === undefined) return "0.0 %";
        return `${parseFloat(value).toFixed(1)} %`;
    };

    const centerValue = useMemo(() => {
        if (activeIndex !== null && data[activeIndex]) {
            return {
                amount: data[activeIndex].amount,
                label: data[activeIndex].name
            };
        }
        return {
            amount: totalValue,
            label: 'Total Portfolio'
        };
    }, [activeIndex, data, totalValue]);

    return (
        <div className="chart-card w-full bg-white dark:bg-white/[0.03]">
            <h3 className="text-gray-800 dark:text-white/90 font-semibold mb-5.5 text-xl font-outfit">
                Portfolio Distribution
            </h3>
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8">
                {/* Chart Container */}
                <div className="relative w-full lg:w-2/3">
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart onMouseLeave={() => setActiveIndex(null)}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={100}
                                    outerRadius={150}
                                    paddingAngle={1}
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke={activeIndex === index ? entry.color : 'none'}
                                            strokeWidth={activeIndex === index ? 3 : 0}
                                            style={{
                                                filter: activeIndex !== null && activeIndex !== index ? 'opacity(0.35)' : 'none',
                                                transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transformBox: 'fill-box',
                                                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease-out, opacity 0.25s ease-out',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Center Value Display */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-800 text-title-sm dark:text-white/90">
                        <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-extrabold text-text-primary font-outfit">
                                {formatCurrency(centerValue?.amount || 0)}
                            </div>
                            <div className="text-sm text-text-secondary mt-1 font-medium">
                                {centerValue?.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full lg:w-1/3 pr-2">
                    <div className="space-y-0.5" onMouseLeave={() => setActiveIndex(null)}>
                        {data.map((entry, index) => (
                            <div
                                key={entry.name}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-gray-800 text-title-sm dark:text-white/90 transition-all duration-300 ease-out ${activeIndex === index
                                    ? 'bg-gray-100 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm font-semibold text-text-primary">
                                        {entry.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-text-primary">
                                        {formatPercentage(entry?.value || 0)}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                        {formatCurrency(entry?.amount || 0)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDonutChart;
