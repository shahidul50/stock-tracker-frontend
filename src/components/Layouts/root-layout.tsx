import Header from "@/components/shared/Header"
import Sidebar from "@/components/shared/Sidebar"
import { Outlet } from "react-router-dom"


const RootLayout = () => {
  return (
<div className="flex min-h-svh bg-white overflow-hidden ">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-[#fafbfa]">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 ml-0 md:ml-64 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout
