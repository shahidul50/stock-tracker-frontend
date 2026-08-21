import { createBrowserRouter } from "react-router-dom"
import { ROUTES } from "@/constants/routes"

import { PublicRoute } from "./public-route"
import { ProtectedRoute } from "./protected-route"

import AuthLayout from "@/Layouts/auth-layout"
import RootLayout from "@/Layouts/root-layout"

//pages
import DashboardPage from "@/pages/Dashboard"
import CategoriesPage from "@/pages/Categories"
import CompaniesPage from "@/pages/Companies"
import ItemsPage from "@/pages/Items"
import StockInPage from "@/pages/Stock-in"
import StockOutPage from "@/pages/Stock-out"
import ReportsPage from "@/pages/Reports"
import LoginPage from "@/pages/Login"
import NotFoundPage from "@/pages/NotFound"

export const router = createBrowserRouter([
    {
        //Public Routes
        element: <PublicRoute />,
        errorElement: <NotFoundPage/>,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <LoginPage />
                    }
                ]
            }
        ]
    },
    {
        //Private Routes
        element: <ProtectedRoute />,
        errorElement: <NotFoundPage/>,
        children: [
            {
                element: <RootLayout />,
                children: [
                    {
                        path: ROUTES.DASHBOARD,
                        element: <DashboardPage />
                    },
                    {
                        path: ROUTES.CATEGORIES,
                        element: <CategoriesPage />,
                    },
                    {
                        path: ROUTES.COMPANIES,
                        element: <CompaniesPage />,
                    },
                    {
                        path: ROUTES.ITEMS,
                        element: <ItemsPage />,
                    },
                    {
                        path: ROUTES.STOCK_IN,
                        element: <StockInPage />,
                    },
                    {
                        path: ROUTES.STOCK_OUT,
                        element: <StockOutPage />,
                    },
                    {
                        path: ROUTES.REPORTS,
                        element: <ReportsPage />,
                    }, 
                ]
            }
        ]
    }
])