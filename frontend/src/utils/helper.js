import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i  < Math.min(words.length, 2); i++) {
        initials += words[i].charAt(0).toUpperCase();
    }

    return initials;
};

export const addThousandsSeparator = (number) => {
    if (!number) return "";

    const [integerPart, fractionPart] = number.toString().split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionPart ? `${formattedIntegerPart}.${fractionPart}` : formattedIntegerPart;
};

export const prepareExpenseBarChartData = (data = []) => {
    // Create an array for the last 30 days
    const days = [];
    const today = new Date();
    
    // Generate dates for the last 30 days
    for (let i = 29; i >= 0; i--) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);
        days.push({
            date: new Date(currentDate),
            displayDate: moment(currentDate).format('MMM D'),
            amount: 0
        });
    }

    // Process expense data
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29); // Include today (30 days total)
    
    const expensesByDay = {};
    data
        .filter(item => new Date(item.date) >= thirtyDaysAgo)
        .forEach(item => {
            const dateKey = moment(item.date).format('YYYY-MM-DD');
            if (!expensesByDay[dateKey]) {
                expensesByDay[dateKey] = 0;
            }
            expensesByDay[dateKey] += Number(item.amount);
        });

    // Merge with the 30-day array
    return days.map(day => {
        const dateKey = moment(day.date).format('YYYY-MM-DD');
        return {
            date: day.date,
            month: day.displayDate,
            amount: parseFloat((expensesByDay[dateKey] || 0).toFixed(2))
        };
    });
};

export const prepareIncomeBarChartData = (data = []) => { 
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const charData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: item?.amount,
        source: item?.source,
    }));
    return charData;
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const charData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: item?.amount,
        category: item?.category,
    }));
    return charData;
};