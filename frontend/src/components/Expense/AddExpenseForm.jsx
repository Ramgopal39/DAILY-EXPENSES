import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddExpenseForm = ({onAddExpense}) => {
    const [income, setIncome] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value});
    };
    return (
        <div>
            <EmojiPickerPopup
             icon={income.icon}
             onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
              value={income.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Rent, Groceries, etc."
              label="Category"
              type="text"
            />

            <Input
              value={income.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder=""
              label="Amount"
              type="number"
            />

            <Input
              value={income.date}
              onChange={(e) => handleChange("date", e.target.value)}
              placeholder=""
              label="Date"
              type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                type="button"
                onClick={() => onAddExpense(income)}
                className="add-btn add-btn-fill"
                >
                Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;