import react from "react";
import { useState } from "react";
import heroImage from "../images/IMG_2837.jpg";
import logoImage from "../images/sceedWhiteLogo.png";
import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useSearch } from "./SearchContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { MoveRight } from "lucide-react";



const Hero = () => {
  const { favoritesCount } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { updateSearchResults } = useSearch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isActive = (path) => location.pathname === path;


  return (
    <>
      <div className="relative w-full h-screen">
        {/* Background image */}
        <img
          src={heroImage}
          alt="two models"
          className="w-full h-full object-cover"
        />
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-10">
          {/*Header section*/}
          <header className="relative w-full">

            <div className="text-white rounded-b-[10px]">
              <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center py-0 px-4 sm:px-6 lg:px-8">
                <a href="/">
                  <img
                    src={logoImage}
                    alt="SceedMillinery"
                    className="w-60 sm:w-[250px]"
                  />
                </a>
              </div>
              <nav>
                <ul className="flex flex-col sm:flex-row sm:justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-center px-4 sm:px-6 lg:px-8">
                  <li>
                    <Link
                      to="/about"
                      className={`text-white font-medium text-xl  relative ${isActive("/about") ? "opacity-50" : ""
                        }`}>
                      <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About</span>
                    </Link>
                  </li>
                  {/* shop page */}
                  <li>
                    <Link
                      to="/shop"
                      className={`text-white font-medium font-medium tracking-wide text-xl relative ${isActive("/shop") ? "opacity-50" : ""
                        }`}>
                      <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Shop</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/our-awards"
                      className={`text-white font-medium text-xl relative ${isActive("/our-awards") ? "opacity-50" : ""
                        }`}>
                      <span className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Our Awards</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
        </div>

        {/*product description at bottom*/}
        <div className="absolute bottom-0 right-0 z-10 bg-gradient-to-l from-black/800 to-transparent px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto text-white">
            <h2 className="text-3xl sm:text-4xl font-raleway font-bold mb-4">
              Elevate Your Style with Sceed Millinery
            </h2>
            <p className="sm:text-base font-raleway font-semibold leading-relaxed max-w-2xl">
              At Sceed Millinery, every fascinator is a study in craftsmanship and refined design. Each piece is meticulously handcrafted using carefully selected materials, resulting in creations that embody elegance, sophistication, and enduring style.

              Designed for women who appreciate distinction, our fascinators bring a sense of effortless refinement to life's most memorable occasions — from weddings and race days to elegant celebrations.

              More than accessories, Sceed Millinery pieces are statement designs that frame your presence with confidence and grace. Discover a collection where timeless millinery meets modern sophistication. <br />
              <div className="flex flex-row items-left mt-4 gap-2">
                <Link to="/shop">
                  Expore more
                </Link>
                <MoveRight />
              </div>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Hero;
