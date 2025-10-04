import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Movies" },
    { to: "/timeline", label: "Timeline Release" },
    { to: "/room", label: "Room" },
    { to: "/share", label: "Share List" },
    { to: "/battle", label: "Voting Battle" },
    { to: "/playlist", label: "Playlist" },
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
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">🔔</button>
        <img
          src="https://via.placeholder.com/40"
          className="w-10 h-10 rounded-full border border-gray-600"
          alt="profile"
        />
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
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
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
