"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Sparkles, MoveUpRight, LogOut, User, Settings, LayoutDashboard, Menu } from "lucide-react"

import { ThemeToggle } from "@/components/ui/theme-toggle"

import { cn } from "@/lib/utils"

import { useAuth } from "@/utils/context/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import BottomSheet from "@/helper/bottomsheets/BottomShets"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

export default function Header() {
  const { user, loading, signOut, userRole } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      <header className="sticky top-3 z-50">
        {/* Main container */}
        <div className="relative px-4 xl:px-0 max-w-3xl mx-auto">
          <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 px-4 py-4 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="size-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                ACTULUS
              </span>
            </Link>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300",
                    "hover:text-blue-600 dark:hover:text-blue-400",
                    "transition-colors duration-200",
                    "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5",
                    "after:bg-blue-600 dark:after:bg-blue-400",
                    "after:transition-all after:duration-200",
                    "hover:after:w-full"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu - Only visible on mobile */}
              {isMobile && (
                <BottomSheet
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                  side="bottom"
                  responsive={false}
                  title="Menu"
                  trigger={
                    <button
                      className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Open menu"
                    >
                      <Menu className="size-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  }
                  className="px-0"
                  contentClassName="max-h-[80vh] rounded-t-2xl"
                >
                  <nav className="flex flex-col gap-2 px-4 pb-4">
                    {navigationLinks.map((link) => {
                      const isActive = pathname === link.href ||
                        (link.href !== "/" && pathname?.startsWith(link.href))
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-blue-600 text-white dark:bg-blue-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>
                </BottomSheet>
              )}
              {loading ? (
                // Loading state
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="size-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : user ? (
                // Authenticated user menu with dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <Avatar className="size-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <Avatar className="size-8">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/profile"
                          className="w-full flex items-center gap-2"
                        >
                          <User className="size-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {userRole === "admins" && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link
                            href="/dashboard"
                            className="w-full flex items-center gap-2"
                          >
                            <LayoutDashboard className="size-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/settings"
                          className="w-full flex items-center gap-2"
                        >
                          <Settings className="size-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Not authenticated - show Sign In button
                <Link href="/signin" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Sign In</span>
                  <MoveUpRight className="size-4" />
                </Link>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
