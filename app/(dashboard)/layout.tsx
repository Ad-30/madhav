
import DashboardNavbar from "@/components/dashboard-navbar";
import { DashboardNavigation } from "@/components/dashboard-navigation";
import { useState, useEffect, useCallback } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode; }) => {
    return (

        <div className="flex flex-col min-h-screen">
            <DashboardNavbar />
            <div className="flex flex-1">
                <DashboardNavigation />
                {children}
            </div>
        </div>

    );
}
export default DashboardLayout;