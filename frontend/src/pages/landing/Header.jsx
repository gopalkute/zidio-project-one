import { PATHS } from "@/utils"
import { Link } from "react-router"

function Header() {
  return (
    <header className="bg-black text-white shadow-lg p-4" >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-teal-300 hover:text-teal-600">
          MyApp
        </Link>

        <nav className="space-x-6">
          <Link to={PATHS.SIGNUP} className="hover:text-teal-300">Features</Link>
          <Link to={PATHS.SIGNUP} className="hover:text-teal-300">About</Link>
          <Link to={PATHS.SIGNIN} className="hover:text-teal-300 font-semibold hover:underline">Sign In</Link>
        </nav>
      </div>
    </header >
  )
}

export default Header