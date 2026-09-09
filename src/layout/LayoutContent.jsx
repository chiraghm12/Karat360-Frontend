import { Outlet } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";

const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        {/* Add bg-white and dark:bg-gray-900 to ensure dashboard area changes with theme */}
        <div className="p-4 max-w-full md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
    )
}

export default LayoutContent;