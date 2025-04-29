import { Link } from "react-router"

function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto text-center px-4">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-6">
          <Link to="/privacy" className="hover:text-teal-200">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-teal-200">Terms of Service</Link>
          <Link to="/contact" className="hover:text-teal-200">Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer