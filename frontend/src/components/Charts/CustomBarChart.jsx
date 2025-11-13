import React from 'react';
import moment from 'moment';
import CustomTooltip from './CustomTooltip';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

const CustomBarChart = ({data}) => {

    // Use a consistent purple color for all bars
    const barColor = "#8B5CF6";

    const CustomTooltip = ({active, payload}) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                        {moment(data.date).format('MMM D, YYYY')}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="font-semibold text-purple-600">${data.amount?.toFixed(2)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };
    return (
        <div className='bg-white mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />
                    <XAxis 
                        dataKey="month"
                        axisLine={{ stroke: '#e5e7eb' }}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: "#6b7280" }} 
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={CustomTooltip}/>
                    
                    <Bar
                        dataKey="amount"
                        fill={barColor}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={index} 
                                fill={barColor}
                                className="hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
};

export default CustomBarChart;