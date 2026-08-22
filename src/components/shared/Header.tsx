import { ModeToggle } from "../mode-toogle"
import { MobileSidebar } from "./Sidebar"

const Header = () => {
  return (
    <header className="flex h-16 w-full md:w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 px-4 md:px-6 transition-colors fixed top-0 right-0 z-40">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
