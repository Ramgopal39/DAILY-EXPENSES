import React, { useState, useEffect } from "react";
import { prepareIncomeBarChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";

const IncomeOverview = ({transactions, onAddIncome}) => {

    const [charData, setCharData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setCharData(result);
    }, [transactions]);
    return (
        <div className="card"> 
        <div className="flex itemss-center justify-between">
            <div className="">
                <h5 className="text-lg">Income Overview</h5>
                <p className="text-sm text-gray-500 mt-0.5">Track your earnings and manage your income sources effectively.</p>
            </div>

            <button className="add-btn" onClick={onAddIncome}>
                <LuPlus className="text-lg"/>
                Add Income
            </button>
        </div>
        <div className="mt-10">
            <CustomBarChart data={charData}/>
        </div>
        </div>
    );
};

export default IncomeOverview;