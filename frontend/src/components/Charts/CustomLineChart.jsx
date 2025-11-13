import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const CustomLineChart = ({ data = [] }) => {
    // Debug: Log the data being received
    console.log('Chart data:', data);

    // If no data, show a message
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                No data available for the chart.
            </div>
        );
    }

    // Ensure data is properly formatted
    const chartData = data.map(item => ({
        ...item,
        // Ensure amount is a number
        amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount
    }));

    // Debug: Log the processed data
    console.log('Processed chart data:', chartData);

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        
        const data = payload[0].payload;
        return (
            <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200">
                {data.category && (
                    <p className="text-sm font-semibold text-purple-800 mb-1">
                        {data.category}
                    </p>
                )}
                <p className="text-sm text-gray-600">
                    Amount:{' '}
                    <span className="font-medium text-gray-900">
                        ${data.amount?.toFixed(2) || '0.00'}
                    </span>
                </p>
                {data.month && (
                    <p className="text-xs text-gray-500 mt-1">
                        {data.month}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    
                    <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                    />
                    
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#ef4444"
                        fill="url(#expenseGradient)"
                        strokeWidth={2}
                        dot={{
                            r: 3,
                            fill: "#ef4444",
                            stroke: "#fff",
                            strokeWidth: 2,
                            fillOpacity: 1
                        }}
                        activeDot={{
                            r: 5,
                            fill: "#ef4444",
                            stroke: "#fff",
                            strokeWidth: 2
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;