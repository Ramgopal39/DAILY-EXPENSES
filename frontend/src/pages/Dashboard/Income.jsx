import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import IncomeOverview from "../../components/Income/IncomeOverview";
import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    //Get All Income Details
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_INCOME}`);
            if (response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch income details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Add Income
    const handleAddIncome = async (incomeData) => {
        console.log('Income data received:', incomeData);
        
        if (!incomeData) {
            console.error('No income data provided');
            toast.error("Invalid income data");
            return;
        }
        
        const { source, amount, date, icon } = incomeData;
        console.log('Parsed fields:', { source, amount, date, icon });

        // validation checks
        if (!source || typeof source !== 'string' || !source.trim()) {
            console.error('Invalid source:', source);
            toast.error("Source is required");
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
            console.log('Sending request to:', API_PATHS.INCOME.ADD_INCOME);
            const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source: source.trim(),
                amount: Number(amount),
                date: new Date(date).toISOString().split('T')[0],
                icon: icon || '',
            });
            
            console.log('Server response:', response.data);
            toast.success("Income added successfully");
            setOpenAddIncomeModal(false);
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error adding Income:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            toast.error(error.response?.data?.message || "Failed to add income. Please try again.");
        }
    };

    // Delete Income
    const deleteIncome = async (id) => {
       try {
        const url = API_PATHS.INCOME.DELETE_INCOME(id);
        console.log('Attempting to delete income with URL:', url);
        const response = await axiosInstance.delete(url);
        console.log('Delete response:', response);
        setOpenDeleteAlert({show: false, data: null});
        toast.success("Income deleted successfully");
        fetchIncomeDetails();
       } catch (error) {
        console.error("Error deleting Income:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        toast.error(error.response?.data?.message || "Failed to delete income. Please try again.");
       }
    };

    //Handle download income details
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(`${API_PATHS.INCOME.DOWNLOAD_INCOME}`);
            if (response.data) {
                const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.setAttribute('download', 'income-details.xlsx');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.log("Failed to download income details:", error);
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
    }, []);
    return (
       <DashboardLayout activeMenu="Dashboard">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <IncomeOverview
                 transactions={incomeData}
                 onAddIncome = {() => setOpenAddIncomeModal(true)}/> 
            </div>

            <IncomeList
             transactions={incomeData}
             onDelete={(id) => {
                setOpenDeleteAlert({
                    show: true,
                    data: id,
                });
             }}
             onDownload={handleDownloadIncomeDetails}/>
            </div>

            <Modal
              isOpen={openAddIncomeModal}
              onClose={() => setOpenAddIncomeModal(false)}
              title="Add Income"
            >
                <AddIncomeForm onAddIncome={handleAddIncome}/>
            </Modal>

            <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({show: false, data: null})}
            title="Delete Income"
            >
                <DeleteAlert
                content="Are you sure you want to delete this income?"
                onDelete={() => deleteIncome(openDeleteAlert.data)}
                />
            </Modal>
        </div>
       </DashboardLayout>
    );
}

export default Income;