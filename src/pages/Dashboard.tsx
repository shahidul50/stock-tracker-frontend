
import { Link } from "react-router-dom"
import { ArrowRight, Boxes, ClipboardPlus, ShoppingCart } from "lucide-react"

import { ROUTES } from "@/constants/routes"
import { useAuthContext } from "@/context/auth.context"

const quickActions = [
  { label: "Add Stock In", href: ROUTES.STOCK_IN, icon: ShoppingCart },
  { label: "Process Stock Out", href: ROUTES.STOCK_OUT, icon: ShoppingCart },
  { label: "New Item Setup", href: ROUTES.ITEMS, icon: ClipboardPlus },
]

const DashboardPage = () => {
  const { user } = useAuthContext()
  const firstName = user?.name?.split(" ")[0] || "there"
  const displayName = user?.name || "Stock Manager"

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-emerald-900/5 bg-linear-to-br from-emerald-50 via-teal-50 to-slate-50 px-6 py-10 shadow-sm dark:border-emerald-300/10 dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-slate-900 sm:px-10 sm:py-12 lg:min-h-68 lg:px-10">
        <div className="relative z-10 flex h-full flex-col justify-center lg:max-w-[68%]">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Boxes className="size-4" /> Stock overview
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, <span className="text-emerald-700 dark:text-emerald-400">{displayName}</span> <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Here is your stock management overview for today. Ensure all recent entries are verified before end of day.
          </p>
        </div>

        <div className="relative mx-auto mt-8 flex h-40 w-48 items-center justify-center rounded-xl border-4 border-white bg-white/70 p-5 shadow-lg dark:border-slate-700 dark:bg-slate-800/80 lg:absolute lg:right-10 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
          <div className="flex size-full flex-col items-center justify-center rounded-lg border border-emerald-100 bg-linear-to-br from-white to-emerald-50 dark:border-emerald-900 dark:from-slate-700 dark:to-emerald-950">
            <img src="/images/Stack Tracker Logo.png" alt="StockTracker inventory" className="mb-2 size-14 object-contain" />
            <span className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Inventory</span>
          </div>
        </div>
      </section>

      <nav aria-label="Quick actions" className="grid gap-4 sm:grid-cols-3">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className="group flex min-h-14 items-center justify-center gap-3 rounded-lg bg-emerald-700 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Icon className="size-5" />
            <span>{label}</span>
            <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-1" aria-hidden="true" />
      <p className="sr-only">Good morning, {firstName}. Use the quick actions to manage inventory.</p>
    </div>
  )
}

export default DashboardPage
