import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

    //Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            console.log('Fetching expense data from:', API_PATHS.EXPENSE.GET_EXPENSE);
            const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE);
            console.log('Expense data received:', response.data);
            if (response.data && Array.isArray(response.data)) {
                setExpenseData(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                toast.error('Failed to load expense data. Invalid format.');
            }
        } catch (error) {
            console.error("Failed to fetch expense details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            toast.error(error.response?.data?.message || 'Failed to load expense data');
        } finally {
            setLoading(false);
        }
    };

    //Handle Add Expense
    const handleAddExpense = async (expenseData) => {
        console.log('Expense data received:', expenseData);
        
        if (!expenseData) {
            console.error('No expense data provided');
            toast.error("Invalid expense data");
            return;
        }
        
        const { category, amount, date, icon } = expenseData;
        console.log('Parsed fields:', { category, amount, date, icon });

        // validation checks
        if (!category || typeof category !== 'string' || !category.trim()) {
            console.error('Invalid category:', category);
            toast.error("Category is required");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            console.error('Invalid amount:', amount);
            toast.error("Amount must be greater than 0");
            return;
        }

        if (!date) {
            console.error('Date is missing');
            toast.error("Date is required");
            return;
        }

        try {
            console.log('Sending request to:', API_PATHS.EXPENSE.ADD_EXPENSE);
            const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category: category.trim(),
                amount: Number(amount),
                date: new Date(date).toISOString(), // Send full ISO string
                icon: icon || '',
            });
            
            console.log('Server response:', response.data);
            toast.success("Expense added successfully");
            setOpenAddExpenseModal(false);
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error adding Expense:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            toast.error(error.response?.data?.message || "Failed to add expense. Please try again.");
        }
    };

        // Delete Expense        
    const deleteExpense = async (id) => {
       try {
        const url = API_PATHS.EXPENSE.DELETE_EXPENSE(id);
        console.log('Attempting to delete expense with URL:', url);
        const response = await axiosInstance.delete(url);
        console.log('Delete response:', response);
        setOpenDeleteAlert({show: false, data: null});
        toast.success("Expense deleted successfully");
        fetchExpenseDetails();
       } catch (error) {
        console.error("Error deleting Expense:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        toast.error(error.response?.data?.message || "Failed to delete expense. Please try again.");
       }
    };

    //Handle download expense details
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_EXPENSE}`);
            if (response.data) {
                const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.setAttribute('download', 'expense-details.xlsx');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.log("Failed to download expense details:", error);
        }
    };
    useEffect(() => {
        fetchExpenseDetails();
        return () => {};
    }, []);
    return (
        <DashboardLayout activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-col-1 gap-6">
                    <div>
                        <ExpenseOverview
                        transactions={expenseData}
                        onExpenseIncome={() => setOpenAddExpenseModal(true)}/>
                    </div>

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({
                                show: true,
                                data: id,
                            });
                        }} onDownload={handleDownloadExpenseDetails}/>
                </div>

                <Modal
                isOpen={openAddExpenseModal}
                onClose={() => setOpenAddExpenseModal(false)}
                title="Add Expense">
                    <AddExpenseForm onAddExpense={handleAddExpense}/>
                </Modal>

                <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({show: false, data: null})}
                title="Delete Expense"
                >
                    <DeleteAlert
                    content="Are you sure you want to delete this expense?"
                    onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
}

export default Expense;
