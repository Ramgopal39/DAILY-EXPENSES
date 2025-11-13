import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        link: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        link: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        link: "/expense",
    },
    {
        id: "04",
        label: "Logout",
        icon: LuLogOut,
        link: "/logout",
    },
];