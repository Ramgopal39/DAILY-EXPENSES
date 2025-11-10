const express = require("express");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

//Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Category, amount, and date are required" });
        }
        
        const newExpense = new Expense({
            userId,
            icon: icon || '',
            category,
            amount: Number(amount),
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Get All Expense Sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        res.json({ message: 'Expense record deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense record', error: error.message });
    }
}

// Download Expense Sources as Excel
exports.downloadExpenseExcel = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseData = await Expense.find({ userId }).sort({ date: -1 });
        
        // Convert dates to readable format
        const formattedData = expenseData.map(item => ({
            'Category': item.category,
            'Amount': item.amount,
            'Date': item.date.toLocaleDateString(),
            'Icon': item.icon || ''
        }));

        // Set headers for Excel download
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=expense-report.xlsx'
        );
        
        // In a real implementation, you would use a library like 'xlsx' to create the Excel file
        // For now, we'll send the data as JSON and handle the Excel conversion in the frontend
        res.json(formattedData);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    }
}