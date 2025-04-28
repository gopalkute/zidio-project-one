import { Link } from "react-router"

function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto text-center">
        <p>© 2025 MyApp. All Rights Reserved.</p>
        <div className="space-x-4 mt-4">
          <Link to="/privacy" className="hover:text-teal-200">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-teal-200">Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer