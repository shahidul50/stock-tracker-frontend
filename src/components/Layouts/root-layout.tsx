import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex min-h-svh w-full bg-white overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-[#fafbfa] min-w-0">
        <Header />
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto overflow-x-hidden mt-16 ml-0 md:ml-64 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;