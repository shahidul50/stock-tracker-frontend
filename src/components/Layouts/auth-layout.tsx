import { Outlet } from "react-router-dom"


const AuthLayout = () => {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
