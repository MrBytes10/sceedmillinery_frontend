import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoImage from "../images/sceedWhiteLogo444.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { updateSearchResults } = useSearch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (route)

  // Determine if a link is active by comparing current URL
  const isActive = (path) => location.pathname === path;

  return (
    <header className="relative w-full">
      {/* logo and top text */}
      <div className="bg-black text-white rounded-b-[10px]">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-0 px-4 sm:px-6 lg:px-8">
          <img
            src={logoImage}
            alt="Sceed Millinery Logo"
            className="w-60 h-auto sm:w-[250px] sm:h-[100px] mb-2 sm:mb-0"
          />
          <p className="text-center text-base sm:text-lg lg:text-xl font-medium font-poppins tracking-wide sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2">
            Sign Up
          </p>
        </div>
      </div>

      {/* navbar */}
      <div className="bg-white py-0 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex justify-between w-full sm:w-auto mb-0 sm:mb-0">
            <div className="flex space-x-4"></div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-black hover:text-gray-600">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className={`${isMenuOpen ? "block" : "hidden"} sm:block`}>
            <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <li>
                <Link
                  to="/"
                  className={`text-black hover:text-gray-600 font-medium font-playfair font-semibold tracking-wide text-sm sm:text-base ${isActive("/") ? "opacity-50" : ""
                    }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`text-black hover:text-gray-600 font-medium text-sm sm:text-base ${isActive("/about") ? "opacity-50" : ""
                    }`}>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`text-black hover:text-gray-600 font-medium text-sm sm:text-base ${isActive("/contact") ? "opacity-50" : ""
                    }`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
