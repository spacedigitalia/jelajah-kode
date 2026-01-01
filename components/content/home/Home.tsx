"use client"

import * as React from "react"

import { Check, Grid3x3, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

const categories = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "fullstack", label: "Fullstack" },
    { value: "mobile", label: "Mobile" },
    { value: "devops", label: "DevOps" },
]

const types = [
    { value: "tutorial", label: "Tutorial" },
    { value: "documentation", label: "Documentation" },
    { value: "example", label: "Example" },
    { value: "template", label: "Template" },
    { value: "snippet", label: "Snippet" },
]

export default function Page() {
    const [categoryOpen, setCategoryOpen] = React.useState(false)
    const [typeOpen, setTypeOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<string>("")
    const [selectedType, setSelectedType] = React.useState<string>("")

    return (
        <div className="min-h-screen overflow-hidden bg-background relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
              `,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div
                    className="absolute inset-0 dark:hidden"
                    style={{
                        backgroundImage: `
                radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
                        backgroundSize: '20px 20px',
                    }}
                />
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        backgroundImage: `
                radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
                        backgroundSize: '20px 20px',
                    }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    {/* Top Label */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-200/20 dark:border-white/20">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Smarter Code, Less Effort</span>
                        <span className="text-lg">📈</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                        Supercharge Your Codebase with an{' '}
                        <span className="bg-linear-to-r from-blue-400 to-purple-400 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            AI Coding Agent
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Your AI pair programmer write, debug, and refactor code faster with a fully integrated development agent.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="relative z-10 w-full max-w-3xl mx-auto mt-20">
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-40 bg-linear-to-b from-blue-500/20 dark:from-blue-500/30 via-blue-500/10 dark:via-blue-500/20 to-transparent blur-3xl pointer-events-none"></div>

                        <div className="relative flex flex-col md:flex-row gap-4 items-center">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>

                            {/* Category Filter */}
                            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-12 h-12 bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                                    >
                                        <Grid3x3 className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search category..." />
                                        <CommandList>
                                            <CommandEmpty>No category found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value=""
                                                    onSelect={() => {
                                                        setSelectedCategory("")
                                                        setCategoryOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCategory === "" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    All Categories
                                                </CommandItem>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                        key={category.value}
                                                        value={category.value}
                                                        onSelect={(currentValue) => {
                                                            setSelectedCategory(currentValue === selectedCategory ? "" : currentValue)
                                                            setCategoryOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedCategory === category.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {category.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Type Filter */}
                            <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-12 h-12 bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                                    >
                                        <FileText className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search type..." />
                                        <CommandList>
                                            <CommandEmpty>No type found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value=""
                                                    onSelect={() => {
                                                        setSelectedType("")
                                                        setTypeOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedType === "" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    All Types
                                                </CommandItem>
                                                {types.map((type) => (
                                                    <CommandItem
                                                        key={type.value}
                                                        value={type.value}
                                                        onSelect={(currentValue) => {
                                                            setSelectedType(currentValue === selectedType ? "" : currentValue)
                                                            setTypeOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedType === type.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {type.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Apply Button */}
                            <Button
                                onClick={() => {
                                    // Handle apply filter logic here
                                    console.log("Applied filters:", {
                                        category: selectedCategory,
                                        type: selectedType,
                                    })
                                }}
                                className="w-full md:w-auto px-6 py-5.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
                            >
                                Terapkan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
