"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-10 w-10 rounded-xl bg-gray-100/50 dark:bg-gray-800/50" />
        )
    }

    const currentTheme = theme || "system"

    const getIcon = () => {
        switch (currentTheme) {
            case "dark":
                return <Moon className="size-5 text-gray-700 dark:text-gray-300" />
            case "light":
                return <Sun className="size-5 text-amber-500" />
            default:
                return <Monitor className="size-5 text-gray-700 dark:text-gray-300" />
        }
    }

    const themeOptions = [
        {
            value: "system",
            label: "System",
            icon: Monitor,
            description: "Mengikuti tema sistem"
        },
        {
            value: "light",
            label: "Light",
            icon: Sun,
            description: "Tema terang"
        },
        {
            value: "dark",
            label: "Dark",
            icon: Moon,
            description: "Tema gelap"
        }
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "group relative inline-flex items-center justify-center",
                        "h-10 w-10 rounded-xl",
                        "bg-gray-100/80 dark:bg-gray-800/80",
                        "backdrop-blur-sm",
                        "border border-gray-200/50 dark:border-gray-700/50",
                        "hover:bg-gray-200/80 dark:hover:bg-gray-700/80",
                        "hover:border-gray-300/50 dark:hover:border-gray-600/50",
                        "transition-all duration-200 ease-in-out",
                        "hover:scale-105 active:scale-95",
                        "shadow-sm hover:shadow-md",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-blue-500/50",
                        "focus-visible:ring-offset-2"
                    )}
                    aria-label="Pilih tema"
                >
                    <div className="relative">
                        {getIcon()}
                        <span className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-opacity duration-200" />
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl"
            >
                {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = currentTheme === option.value

                    return (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={cn(
                                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                "cursor-pointer transition-all duration-150",
                                "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                                isActive && "bg-blue-50 dark:bg-blue-950/30",
                                "focus:bg-gray-100/80 dark:focus:bg-gray-800/80"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center",
                                "h-8 w-8 rounded-lg",
                                isActive
                                    ? "bg-blue-500/10 dark:bg-blue-400/20"
                                    : "bg-gray-100 dark:bg-gray-800"
                            )}>
                                <Icon className={cn(
                                    "size-4",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-400"
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={cn(
                                    "text-sm font-medium",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-900 dark:text-gray-100"
                                )}>
                                    {option.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {option.description}
                                </div>
                            </div>
                            {isActive && (
                                <Check className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

