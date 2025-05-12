import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui";

export function ThemeToggle() {
    const [theme, setTheme] = useState("system");
    const [systemPreference, setSystemPreference] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        } else {
            setTheme("system");
        }

        const handleSystemChange = (e) => {
            const newPref = e.matches ? "dark" : "light";
            setSystemPreference(newPref);
            if (theme === "system") {
                document.documentElement.classList.toggle("dark", newPref === "dark");
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "system") {
            root.classList.toggle("dark", systemPreference === "dark");
            localStorage.removeItem("theme");
        } else {
            root.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
    }, [theme, systemPreference]);

    const currentThemeIcon = {
        light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
        dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
        system: <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }[theme];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='cursor-pointer'>
                    {currentThemeIcon}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}