import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Boxes,
  Building2,
  Package,
  PlusCircle,
  MinusCircle,
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerClose } from "@/components/ui/drawer"

import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { useAuthContext } from "@/context/auth.context"

const mainNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard }, // Assuming /dashboard route or similar
  { label: "Categories", href: ROUTES.CATEGORIES, icon: Boxes },
  { label: "Companies", href: ROUTES.COMPANIES, icon: Building2 },
  { label: "Items", href: ROUTES.ITEMS, icon: Package },
]

const operationItems = [
  { label: "Stock In", href: ROUTES.STOCK_IN, icon: PlusCircle },
  { label: "Stock Out", href: ROUTES.STOCK_OUT, icon: MinusCircle },
  { label: "Reports", href: ROUTES.REPORTS, icon: BarChart3 },
]

function SidebarContent() {
  const location = useLocation()
  const { user, logout } = useAuthContext()

  return (
    <>
      {/* Brand Header (Fixed) */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
        <img src="/images/Stock-tracker-logo.png" alt="Stock Tracker" className="h-8 w-8 object-contain" />
        <span className="text-xl font-bold text-[#00694B] dark:text-emerald-500">StockTracker</span>
      </div>

      {/* Navigation Content (Scrollable) */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            // Treat categories as dashboard active if we don't have dashboard
            const isActive = location.pathname === item.href || (item.label === "Dashboard" && location.pathname === "/dashboard")
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#00694B] text-white shadow-sm dark:bg-emerald-600"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500 dark:text-gray-400")} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div>
          <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Operations
          </h4>
          <div className="space-y-1">
            {operationItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href) && (item.href as string) !== "/"
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#00694B] text-white shadow-sm dark:bg-emerald-600"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500 dark:text-gray-400")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* User Profile Footer (Fixed) */}
      <div className="shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
              <img src="/images/user-icon.png" alt="User" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || "Admin User"}</span>
              <span className="truncate text-xs text-gray-500 dark:text-gray-400">Inventory Manag...</span>
            </div>
          </div>
          <button onClick={() => logout()} className="shrink-0 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex fixed top-0 h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-[#f4f6f8] transition-colors dark:border-gray-800 dark:bg-gray-950 z-50">
      <SidebarContent />
    </aside>
  )
}

export default Sidebar

export function MobileSidebar() {
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger
        render={<button className="md:hidden flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />}
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </DrawerTrigger>
      <DrawerContent className="w-64 rounded-none border-l border-gray-200 bg-[#f4f6f8] dark:border-gray-800 dark:bg-gray-950 p-0 [&>div[data-slot=drawer-swipe-handle]]:hidden">
        <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Close Button */}
          <div className="flex items-center justify-end px-4 pt-3">
            <DrawerClose
              render={<button className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors" />}
            >
              <X className="h-5 w-5" />
            </DrawerClose>
          </div>
          <SidebarContent />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
