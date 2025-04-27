import { RouterProvider } from "react-router"
import Router from "./routes"
import { Toaster } from "react-hot-toast"
import { HelmetProvider } from "react-helmet-async"

function App() {
  return (
    <HelmetProvider >
      <RouterProvider router={Router} />
      <Toaster />
    </HelmetProvider>
  )
}

export default App
