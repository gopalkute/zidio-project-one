import { signout } from "@/api";
import {
    Button,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    Spinner1,
    ThemeToggle,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    useSidebar
} from "@/components";
import { useAuth } from "@/context";
import { ClockCounterClockwise, Graph, LogOutIcon, PATHS, showGenericErrorAsToast, TOAST_OPTIONS, Upload, User } from "@/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

function DashboardSidebar() {
    const menuItems = [
        { title: "Upload & Analyze Data", icon: Upload, url: PATHS.DASHBOARD },
        { title: "Analysis History  ", icon: ClockCounterClockwise, url: PATHS.UPLOADS_HISTORY },
    ];

    const { setOpenMobile } = useSidebar();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            const { success, genericErrors } = await signout();
            if (success) {
                logout();
                toast.success("You've been logged out successfully.", TOAST_OPTIONS);
                navigate(PATHS.SIGNIN, { replace: true });
                return;
            }

            showGenericErrorAsToast(genericErrors);
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Something went wrong. Please try again.", TOAST_OPTIONS);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Sidebar className="text-lg md:text-md w-64 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <SidebarContent className="pt-6 px-4 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-base">
                    <Graph className="w-6 h-6" />
                    <span>Excel Analytics</span>
                </div>

                <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        className="flex items-center gap-3 px-2 py-1 hover:bg-muted rounded-md"
                                        to={item.url}
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        <item.icon className="w-5 h-5 text-primary" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>

            <SidebarFooter >
                <div className="flex items-center justify-between w-full px-2 py-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-grow flex justify-between items-center px-2 py-1"
                    >
                        <div className="flex items-center space-x-3 px-2 py-1">
                            <User className="w-4 h-4" />
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium leading-none">{user?.username || 'User'}</span>
                                <span className="text-xs text-muted-foreground">{user?.email || 'email@example.com'}</span>
                            </div>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="p-1 rounded-md hover:bg-muted transition cursor-default md:cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        {isLoggingOut ? <Spinner1 className={'w-4 h-4 border-2 border-loading-spinner-color'} /> : <LogOutIcon className="w-5 h-5" />}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Logout</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Button>
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default DashboardSidebar;
