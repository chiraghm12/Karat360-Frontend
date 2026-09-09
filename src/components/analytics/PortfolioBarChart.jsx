import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatCurrency } from "../../utils";


const PortfolioBarChart = ({ data, categories }) => {
    const [hoveredLegend, setHoveredLegend] = useState(null);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum, entry) => sum + entry.value, 0);

            return (
                <div className="bg-gray-100 dark:bg-gray-700 dark:text-white/90 text-gray-900 rounded-lg shadow-md p-4 min-w-48">
                    <p className="font-medium text-text-primary mb-3">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => {
                            const percentage = ((entry.value / total) * 100).toFixed(1);
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-sm text-text-secondary">
                                            {entry.dataKey}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-text-primary">
                                            {formatCurrency(entry.value)}
                                        </div>
                                        <div className="text-xs text-text-tertiary">
                                            {percentage}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="border-t border-border mt-3 pt-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-text-primary">
                                Total
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center mt-6">
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className={`flex items-center cursor-pointer px-3 py-2 rounded-lg text-gray-800 text-title-sm dark:text-white/90 transition-all duration-200 ${hoveredLegend === entry.dataKey
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-gray-200 dark:hover:bg-gray-100"
                            }`}
                        onMouseEnter={() => setHoveredLegend(entry.dataKey)}
                        onMouseLeave={() => setHoveredLegend(null)}
                    >
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const getBarOpacity = (dataKey) => {
        if (hoveredLegend === null) return 1;
        return hoveredLegend === dataKey ? 1 : 0.2;
    };

    return (
        <div className="chart-card">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Portfolio Trends
            </h2>
            <div className="w-full">
                <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 30,
                                right: 20,
                                left: 0,
                                bottom: 5,
                            }}
                            barCategoryGap="20%"
                        >

                            {/* <CartesianGrid strokeDasharray="3 0" stroke="#E2E8F0" /> */}
                            {/* <CartesianGrid stroke="#E2E8F0" strokeOpacity={0.3} horizontal={true} vertical={false} /> */}
                            <CartesianGrid
                                stroke="#E2E8F0"
                                strokeOpacity={0.1}
                                horizontal={true}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#9ca3af", fontSize: 12, }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 550 }}
                                // tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                                tickFormatter={(value) => `${(value / 1).toFixed(0)}`}
                                tickCount={6}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />

                            {categories.map((category, index) => (
                                <Bar
                                    key={category.name}
                                    dataKey={category.name}
                                    stackId="portfolio"
                                    fill={category.color}
                                    radius={
                                        index === categories.length - 1
                                            ? [8, 8, 0, 0]
                                            : [0, 0, 0, 0]
                                    }
                                    opacity={getBarOpacity(category.name)}
                                    style={{
                                        transition: "opacity 0.1s ease-in-out",
                                    }}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PortfolioBarChart;
