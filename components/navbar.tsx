"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calculator, Users, Home, Menu, X } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/",
            label: "Inicio",
            icon: Home,
            active: pathname === "/",
        },
        {
            href: "/quoter",
            label: "Cotizador",
            icon: Calculator,
            active: pathname === "/quoter",
        },
        // {
        //     href: "/customers",
        //     label: "Clientes",
        //     icon: Users,
        //     active: pathname === "/customers",
        // },
    ]

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="print:hidden border-b bg-white">
            <div className="flex h-16 items-center justify-between px-4 max-w-6xl mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="text-[#153A66]">URBAMIX</span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-[#153A66] flex items-center gap-2",
                                route.active ? "text-black" : "text-muted-foreground",
                            )}
                        >
                            <route.icon className="w-4 h-4" />
                            {route.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-white">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block text-sm font-medium transition-colors hover:text-[#153A66] flex items-center gap-2 p-2 rounded-md hover:bg-gray-50",
                                route.active ? "text-black bg-gray-50" : "text-muted-foreground",
                            )}
                        >
                            <route.icon className="w-4 h-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
