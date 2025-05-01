import { RouterProvider } from "react-router"
import Router from "./routes"
import { Toaster } from "react-hot-toast"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
      <>
      <RouterProvider router={Router} />
      <Toaster />
      </>
  )
}

export default App
