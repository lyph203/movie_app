import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const navLinks = [
    { to: "/", label: "Movies" },
    { to: "/timeline", label: "Timeline Release" },
    { to: "/battle", label: "Voting Battle" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  return (
    <header className="text-white mt-0 px-6 py-4 flex items-center justify-between shadow-lg relative bg-gray-900">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-[#455785]">
        MOVIE APP
      </Link>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center space-x-4 relative">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <p
              className="px-2 py-1 bg-indigo-500 rounded-2xl cursor-pointer "
              onClick={() => setShowMenu(!showMenu)}
            >
              {user}
            </p>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded shadow-lg w-40 py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}

        {/* Mobile toggle button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <div
        className={`absolute top-full left-0 w-full bg-gray-800 shadow-md md:hidden z-50 transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-2 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 hover:text-cyan-400 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
