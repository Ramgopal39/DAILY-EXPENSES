import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleClick = (path) => {
        if (path === "/logout") {
            handleLogout();
            return;
        }
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img 
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full bg-slate-400 object-cover"
                    />
                ) : (
                    <CharAvatar 
                        fullName={user?.fullName} 
                        width="w-20" 
                        height="h-20" 
                        style="text-xl"/>
                )}
                <h5 className="font-medium text-gray-950 leading-6">{user?.fullName || ""}</h5>
            </div>

            <div className="space-y-2">
                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center gap-3 text-[15px] py-3 px-6 rounded-lg transition-colors
                            ${activeMenu === item.label 
                                ? "bg-primary text-white" 
                                : "py-3 px-6 rounded-lg mb-3"
                            }`}
                        onClick={() => handleClick(item.link)}
                    >
                        <item.icon className="text-xl" />
                       {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
};

export default SideMenu;