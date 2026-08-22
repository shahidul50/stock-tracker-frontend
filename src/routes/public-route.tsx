import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/context/auth.context";
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuthContext()

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                {/* <div className="text-muted-foreground">Loading...</div> */}
                <Spinner />
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />
    }

    return <Outlet />
}