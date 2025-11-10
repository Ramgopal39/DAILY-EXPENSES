import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddIncomeForm = ({onAddIncome}) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        setIncome({
            ...income,
            [key]: value,
        });
    };
    return (
        <div>

            <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
            <Input 
                value={income.source}
                onChange={(e) => handleChange("source", e.target.value)}
                label="Income source"
                placeholder="Freelance, Salary, etc"
                type="text"
                required
            />

            <Input 
                value={income.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                label="Income amount"
                placeholder="Enter income amount"
                type="number"
                required
                min="0.01"
                step="0.01"
            />

            <Input 
                value={income.date}
                onChange={(e) => handleChange("date", e.target.value)}
                label="Income date"
                type="date"
                required
            />

            <div className="flex justify-end mt-6">
                <button 
                  type="button"
                  className="add-btn add-btn-fill"
                  onClick={() => onAddIncome(income)}>
                    Add Income
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;