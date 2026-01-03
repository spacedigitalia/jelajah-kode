"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Grid3x3, FileText, Filter as FilterIcon } from "lucide-react"
import { fetchProductsBySearch, fetchProductCategories, fetchProductType } from "@/utils/fetching/FetchProducts"
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
import BottomSheet from "@/helper/bottomsheets/BottomShets"
import BottomSheetsFilter from "@/components/content/filter/BottomSheetsFilter"

export default function Filter() {
    const router = useRouter()
    const [categoryOpen, setCategoryOpen] = React.useState(false)
    const [typeOpen, setTypeOpen] = React.useState(false)
    const [filterSheetOpen, setFilterSheetOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<string>("")
    const [selectedType, setSelectedType] = React.useState<string>("")
    const [searchQuery, setSearchQuery] = React.useState<string>("")
    const [suggestions, setSuggestions] = React.useState<ProductsSearchItem[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false)
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const [categories, setCategories] = React.useState<Array<{ value: string; label: string }>>([])
    const [types, setTypes] = React.useState<Array<{ value: string; label: string }>>([])
    const inputRef = React.useRef<HTMLInputElement>(null)
    const suggestionsRef = React.useRef<HTMLDivElement>(null)

    // Fetch categories and types from API
    React.useEffect(() => {
        const fetchCategoriesAndTypes = async () => {
            try {
                const [categoriesData, typesData] = await Promise.all([
                    fetchProductCategories(),
                    fetchProductType(),
                ])

                setCategories(
                    categoriesData.map((cat) => ({
                        value: cat.categoryId || cat._id,
                        label: cat.title,
                    }))
                )

                setTypes(
                    typesData.map((type) => ({
                        value: type.typeId || type._id,
                        label: type.title,
                    }))
                )
            } catch (error) {
                console.error("Error fetching categories and types:", error)
            }
        }

        fetchCategoriesAndTypes()
    }, [])

    // Debounce untuk fetch suggestions
    React.useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        const timeoutId = setTimeout(async () => {
            setIsLoadingSuggestions(true)
            try {
                const results = await fetchProductsBySearch(searchQuery.trim(), 1)
                setSuggestions(results.data)
                setShowSuggestions(results.data.length > 0)
                setSelectedIndex(-1)
            } catch (error) {
                console.error("Error fetching suggestions:", error)
                setSuggestions([])
                setShowSuggestions(false)
            } finally {
                setIsLoadingSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case "ArrowUp":
                e.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case "Enter":
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelectSuggestion(suggestions[selectedIndex].title)
                } else {
                    if (searchQuery.trim()) {
                        setShowSuggestions(false)
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                    }
                }
                break
            case "Escape":
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
        }
    }

    const handleSelectSuggestion = (title: string) => {
        setSearchQuery(title)
        setShowSuggestions(false)
        setSelectedIndex(-1)
        router.push(`/search?q=${encodeURIComponent(title)}`)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowSuggestions(false)
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleApplyFilters = () => {
        setFilterSheetOpen(false)
        // Trigger search with current filters
        if (searchQuery.trim()) {
            setShowSuggestions(false)
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    // Close suggestions when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-14">
            {/* Glow Effect */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-40 bg-linear-to-b from-blue-500/20 dark:from-blue-500/30 via-blue-500/10 dark:via-blue-500/20 to-transparent blur-3xl pointer-events-none"></div>

            <form onSubmit={handleSearch} className="relative flex flex-row gap-4 items-center overflow-visible">
                {/* Search Input */}
                <div className="relative flex-1 w-full overflow-visible">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setShowSuggestions(true)
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true)
                            }
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (searchQuery.trim() || suggestions.length > 0) && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-100 w-full mt-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                        >
                            {isLoadingSuggestions ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    Mencari...
                                </div>
                            ) : suggestions.length > 0 ? (
                                <ul className="py-1">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={suggestion._id}
                                            onClick={() => handleSelectSuggestion(suggestion.title)}
                                            className={cn(
                                                "px-4 py-3 cursor-pointer text-sm transition-colors",
                                                index === selectedIndex
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-900 dark:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <span className="truncate">{suggestion.title}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : searchQuery.trim() && !isLoadingSuggestions ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada hasil ditemukan
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Mobile: Single button to open BottomSheet with all filters (< 1280px) */}
                <div className="block xl:hidden">
                    <BottomSheet
                        open={filterSheetOpen}
                        onOpenChange={setFilterSheetOpen}
                        trigger={
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                            >
                                <FilterIcon className="h-5 w-5" />
                            </Button>
                        }
                        title="Filter"
                        description="Pilih kategori dan tipe"
                        side="bottom"
                        responsive={false}
                        contentClassName="max-h-[80vh] rounded-t-2xl"
                    >
                        <BottomSheetsFilter
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            handleApplyFilters={handleApplyFilters}
                            categories={categories}
                            types={types}
                        />
                    </BottomSheet>
                </div>

                {/* Desktop: Separate Popovers for Category and Type, plus Apply button (>= 1280px) */}
                <div className="hidden xl:flex flex-row gap-4">
                    {/* Category Filter */}
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
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
                                type="button"
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
                        type="submit"
                        className="w-auto px-6 py-5.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
                    >
                        Terapkan
                    </Button>
                </div>
            </form>
        </div>
    )
}
