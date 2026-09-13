import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../utils/formatters";

const PortfolioDonutChart = ({
    title = "Sales by Category",
    defaultLabel = "Total Sales",
    data = [],
    totalValue
}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const formatPercentage = (value) => {
        if (value === null || value === undefined) return "0.0 %";
        return `${parseFloat(value).toFixed(1)} %`;
    };

    const computedTotal = useMemo(() => {
        if (totalValue !== undefined && totalValue !== null) return totalValue;
        return (data || []).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    }, [data, totalValue]);

    const centerValue = useMemo(() => {
        if (activeIndex !== null && data && data[activeIndex]) {
            return {
                amount: data[activeIndex].amount,
                label: data[activeIndex].name
            };
        }
        return {
            amount: computedTotal,
            label: defaultLabel
        };
    }, [activeIndex, data, computedTotal, defaultLabel]);

    return (
        <div className="card p-6 w-full flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 font-outfit">
                {title}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-1">
                {/* Chart Container */}
                <div className="relative w-full sm:w-1/2 flex items-center justify-center">
                    <div className="w-full h-72 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart onMouseLeave={() => setActiveIndex(null)}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={2}
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
                                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center px-4">
                            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-outfit tracking-tight drop-shadow-sm">
                                {formatCurrency(centerValue?.amount || 0)}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide">
                                {centerValue?.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full sm:w-1/2 pr-1">
                    <div className="space-y-1.5" onMouseLeave={() => setActiveIndex(null)}>
                        {data.map((entry, index) => (
                            <div
                                key={entry.name}
                                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 ease-out ${
                                    activeIndex === index
                                        ? 'bg-amber-500/10 dark:bg-white/10 ring-1 ring-amber-400/30 dark:ring-white/20 shadow-sm'
                                        : 'hover:bg-slate-100/70 dark:hover:bg-white/[0.03]'
                                }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                <div className="flex items-center min-w-0">
                                    <div
                                        className="w-3.5 h-3.5 rounded-full mr-3 flex-shrink-0 shadow-sm ring-1 ring-black/10 dark:ring-white/20"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {entry.name}
                                    </span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {formatPercentage(entry?.value || 0)}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
export { PortfolioDonutChart as CategoryDonutChart };
