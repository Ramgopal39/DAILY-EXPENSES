import React, { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions = [], onExpenseIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const result = prepareExpenseLineChartData(transactions);
            console.log('Processed chart data:', result);
            setChartData(result);
        } else {
            console.log('No transactions data available');
            setChartData([]);
        }
    }, [transactions]);

    // Add a default height to the chart container
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your expenses and get insights into your spending habits.
                    </p>
                </div>
                <button 
                    className="add-btn" 
                    onClick={onExpenseIncome}
                    aria-label="Add new expense"
                >
                    <LuPlus className="text-lg"/>
                    Add Expense
                </button>
            </div>
            <div className="mt-10 h-64">
                {chartData && chartData.length > 0 ? (
                    <CustomLineChart data={chartData} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No expense data available. Add some expenses to see the chart.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseOverview;