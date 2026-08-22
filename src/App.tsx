import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { Toaster } from "./components/ui/toast"

import { AuthProvider } from "./context/auth.context"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/query-client"

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
