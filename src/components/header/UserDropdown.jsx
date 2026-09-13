import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ToastMessage from "../common/ToastMessage";
import Dropdown from "../ui/dropdown/Dropdown";
import DropdownItem from "../ui/dropdown/DropdownItem";
import {
  IoIosArrowDown,
  FaRegCircleUser,
  LuSettings,
  LuInfo,
  TbLogout2,
} from "../../icons";

export default function UserDropdown({ user: propUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  
  const user = propUser || authUser;

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("karat360-access-token");
      ToastMessage.success("Logged out successfully");
    }
    navigate("/login");
  }

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Chirag Mehta";
  const userEmail = user?.email || "chirag.m@karat360.com";
  const initials = `${user?.first_name?.[0] || "C"}${user?.last_name?.[0] || "M"}`.toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200 group"
      >
        {/* User Avatar */}
        <span className="mr-3 overflow-hidden rounded-full h-10 w-10 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center ring-2 ring-transparent group-hover:ring-amber-500/40 transition-all duration-200">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={fullName}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs tracking-wider">
              {initials}
            </span>
          )}
        </span>
        {/* User Name and Dropdown Icon */}
        <span className="block mr-1 font-medium text-theme-sm group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-200">
          {fullName}
        </span>
        <IoIosArrowDown
          className={`stroke-gray-500 dark:stroke-gray-400 group-hover:stroke-amber-500 dark:group-hover:stroke-amber-400 transition-transform duration-200 w-5 h-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[270px] flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 z-[9999]"
      >
        <div className="ml-1 pb-2 border-b border-gray-100 dark:border-gray-800">
          {/* User Name */}
          <span className="block font-bold text-gray-900 text-theme-sm dark:text-white">
            {fullName}
          </span>
          {/* User Email */}
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">
            {userEmail}
          </span>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {user?.role || "Shop Owner & Administrator"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 font-medium text-gray-700 rounded-xl group text-theme-sm hover:bg-amber-500/10 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-amber-500/15 dark:hover:text-amber-400 transition-all duration-150"
            >
              <FaRegCircleUser className="w-4 h-4 fill-gray-500 group-hover:fill-amber-500 dark:fill-gray-400 dark:group-hover:fill-amber-400 transition-colors duration-150" />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 font-medium text-gray-700 rounded-xl group text-theme-sm hover:bg-amber-500/10 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-amber-500/15 dark:hover:text-amber-400 transition-all duration-150"
            >
              <LuSettings className="w-4 h-4 text-gray-500 group-hover:text-amber-500 dark:text-gray-400 dark:group-hover:text-amber-400 transition-colors duration-150" />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile?tab=support"
              className="flex items-center gap-3 px-3 py-2.5 font-medium text-gray-700 rounded-xl group text-theme-sm hover:bg-amber-500/10 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-amber-500/15 dark:hover:text-amber-400 transition-all duration-150"
            >
              <LuInfo className="w-4 h-4 text-gray-500 group-hover:text-amber-500 dark:text-gray-400 dark:group-hover:text-amber-400 transition-colors duration-150" />
              Support
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 mt-2 font-medium text-gray-700 rounded-xl group text-theme-sm hover:bg-red-500/10 hover:text-red-500 hover:shadow-[0_2px_10px_-2px_rgba(239,68,68,0.15)] dark:text-gray-400 dark:hover:bg-red-500/15 dark:hover:text-red-400 transition-all duration-150 w-full text-left"
        >
          <TbLogout2 className="w-4 h-4 text-gray-500 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400 transition-colors duration-150" />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}

