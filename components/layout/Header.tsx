"use client"

import React from "react"

import Link from "next/link"

import { Sparkles, User } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ThemeToggle } from "@/components/ui/theme-toggle"

import { cn } from "@/lib/utils"

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
]

export default function Header() {
  return (
    <header className="sticky top-3 z-50">
      {/* Main container */}
      <div className="relative max-w-3xl mx-auto">
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
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Book a Call Button */}
            <Button
              asChild
              className={cn(
                "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                "text-white shadow-md hover:shadow-lg",
                "transition-all duration-200",
                "px-4 sm:px-6"
              )}
            >
              <Link href="/signin" className="flex items-center gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
