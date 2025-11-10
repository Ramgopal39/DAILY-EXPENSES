const express = require("express");
const xlsx = require("xlsx");
const Income = require("../models/Income");

//Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Source, amount, and date are required" });
        }
        
        const newIncome = new Income({
            userId,
            icon: icon || '',
            source,
            amount: Number(amount),
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//Delete Income Source
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!income) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        res.json({ message: 'Income record deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Error deleting income record', error: error.message });
    }
}

// Download Income Sources as Excel
exports.downloadIncomeExcel = async (req, res) => {
    try {
        const userId = req.user.id;
        const incomeData = await Income.find({ userId }).sort({ date: -1 });
        
        // Convert dates to readable format
        const formattedData = incomeData.map(item => ({
            'Source': item.source,
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
            'attachment; filename=income-report.xlsx'
        );
        
        // In a real implementation, you would use a library like 'xlsx' to create the Excel file
        // For now, we'll send the data as JSON and handle the Excel conversion in the frontend
        res.json(formattedData);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    }
}
