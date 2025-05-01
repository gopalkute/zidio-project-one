import { RouterProvider } from "react-router"
import Router from "./routes"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <RouterProvider router={Router} />
      <Toaster />
    </>
  )
}

export default App
