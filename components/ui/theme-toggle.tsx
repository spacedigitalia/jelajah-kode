"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted && theme === "dark"

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={() => setTheme(isDark ? "light" : "dark")}
            />
            <div className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out",
                "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                "peer-hover:ring-2 peer-hover:ring-primary/30",
                isDark ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
            )}>
                {/* Toggle circle */}
                <div className={cn(
                    "absolute top-[2px] left-[2px] h-5 w-5 rounded-full",
                    "bg-white dark:bg-white",
                    "shadow-lg shadow-black/20",
                    "border-2 border-transparent",
                    "transition-all duration-300 ease-in-out",
                    "transform-gpu",
                    "hover:scale-110 active:scale-95",
                    isDark
                        ? "translate-x-5 shadow-primary/30"
                        : "translate-x-0 shadow-gray-400/30"
                )} />

                {/* Icons */}
                <Sun className={cn(
                    "absolute left-1 top-1/2 -translate-y-1/2 size-3 z-10",
                    "text-yellow-500 transition-opacity duration-200",
                    isDark ? "opacity-0" : "opacity-100"
                )} />
                <Moon
                    className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 size-3 z-10",
                        "transition-opacity duration-200",
                        isDark ? "opacity-100" : "opacity-0"
                    )}
                    fill="#1e293b"
                    stroke="#1e293b"
                    strokeWidth={2}
                />
            </div>
            <span className="sr-only">Toggle theme</span>
        </label>
    )
}

