import React from "react";
import { useState, useEffect } from "react";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  UserRound,
  Menu,
  X,
  Search
} from "lucide-react";

import logoImage from "../images/sceedBlackLogo.png";

import SearchBar from "./SearchBar";
import { useSearch } from "./SearchContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import ProductGrid from "./ProductGrid"; // Import ProductGrid component

const Header = () => {
  const { favoritesCount } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { updateSearchResults } = useSearch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.getProducts);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate relevance for search results
  const calculateRelevance = (product, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = product.name.toLowerCase();
    const descLower = (product.productFeatures || "").toLowerCase();
    const categoryLower = (product.category || "").toLowerCase();

    let score = 0;
    if (nameLower.includes(searchLower)) score += 3;
    if (descLower.includes(searchLower)) score += 2;
    if (categoryLower.includes(searchLower)) score += 1;

    return score;
  };

  // Handle search with API data
  const handleSearch = (searchTerm) => {
    if (loading) return;

    const results = products
      .map((product) => ({
        ...product,
        relevance: calculateRelevance(product, searchTerm),
      }))
      .filter((product) => product.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    setSearchResults(results);
    setShowResults(true);

    // If no results found, show message
    if (results.length === 0) {
      navigate("/search-results", {
        state: {
          message: "No products found matching your search.",
          searchTerm,
        },
      });
    } else {
      // Navigate to search results page with the results
      navigate("/search-results", {
        state: {
          results,
          searchTerm,
        },
      });
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu((prev) => !prev);
    } else {
      navigate("/sign-up");
    }
  };

  // Click outside handler for user menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const isActive = (path) => location.pathname === path;

  return (
    // <div className="container mx-auto px-1">
    <header className="relative w-full">
      {/* Logo and top text */}
      <div className="bg-white text-black rounded-b-[10px]">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center py-0 px-4 sm:px-6 lg:px-8">
          <a href="/">
            <img
              src={logoImage}
              alt="SceedMillinery"
              className="w-60 sm:w-[250px] sm:h-[100px] mb-1"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <nav
          className={`${isMenuOpen ? "block" : "hidden"
            } sm:block`}>
          <ul className="flex flex-col sm:flex-row sm:justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-center py-2 px-4 sm:px-6 lg:px-8 font-alexBrush">
            <li>
              <Link
                to="/"
                className={`text-black font-medium text-2xl relative ${isActive("/") ? "opacity-50" : ""
                  }`}>
                <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`text-black font-medium text-2xl relative ${isActive("/about") ? "opacity-50" : ""
                  }`}>
                <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About</span>
              </Link>
            </li>
            {/* shop page */}
            <li>
              <Link
                to="/shop"
                className={`text-black font-medium font-playfair tracking-wide text-2xl relative ${isActive("/shop") ? "opacity-50" : ""
                  }`}>
                <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Shop</span>
              </Link>
            </li>
            <li>
              <Link
                to="/our-awards"
                className={`text-black font-medium text-2xl relative ${isActive("/our-awards") ? "opacity-50" : ""
                  }`}>
                <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Our Awards</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>


      {/* Icons - Top Right - Only show on shop page */}
      {(location.pathname === "/shop" || location.pathname.startsWith("/shop")) && (
        <div className="relative h-6 px-4 sm:px-6 lg:px-8">
          <div className="absolute -top-12 right-4 sm:right-6 flex space-x-4 items-center z-20">
            <div className="relative">
              <SearchBar
                onSearch={handleSearch}
                disabled={loading}
                placeholder={loading ? "Loading..." : "Search products..."}
              />
            </div>

            {/* User Icon and Menu */}
            <div className="user-menu-container relative">
              <UserRound
                size={20}
                onClick={handleUserIconClick}
                className="cursor-pointer"
              />

              <div
                className={`${showUserMenu
                  ? "visible opacity-100 scale-100"
                  : "invisible opacity-0 scale-95"
                  } 
                        transition-all duration-200 ease-out`}>
                {isAuthenticated && (
                  <div
                    className="absolute mt-2 right-0 bg-[#212121] border border-[#CECDC8] rounded-md shadow-lg z-10 w-37 
                        origin-top-right transform scale-100 opacity-100 transition-all duration-200 
                        animate-in fade-in-0 zoom-in-95">
                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white hover:bg-[#CECDC8] hover:text-[#212121] transition-colors duration-200">
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white hover:bg-[#CECDC8] hover:text-[#212121] transition-colors duration-200">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Cart Icon */}
            <Link to="/cart" className="text-black hover:text-gray-600">
              <ShoppingCart size={20} />
            </Link>

            {/* Favorites Icon with Counter */}
            <Link to="/favorites" className="relative">
              <Heart className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-black hover:text-gray-600 ml-auto">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
    // </div>
  );
};

export default Header;
