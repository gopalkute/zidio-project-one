import { PATHS } from "@/utils"
import { Link } from "react-router"

function Header() {
  return (
    <header className="bg-black text-white shadow-lg p-4" >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-teal-300">MyApp</h1>
        <nav className="space-x-6">
          <Link to={PATHS.SIGNIN} className="hover:text-teal-200">Sign In</Link>
          <Link to={PATHS.SIGNUP} className="hover:text-teal-200">Sign Up</Link>
        </nav>
      </div>
    </header >
  )
}

export default Header