//sceed_frontend/src/pages/HomePage.js

import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Filter from "../components/Filter";
import ProductGrid from "../components/ProductGrid";
import BannerOne from "../components/bannerOne";
import BannerTwo from "../components/bannerTwo";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../config/api";
import Pagination from "../components/pagination";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState(1000);
  const [filterSticky, setFilterSticky] = useState(false);
  const [showAdditionalSections, setShowAdditionalSections] = useState(true);

  const filterRef = useRef(null);
  const productGridRef = useRef(null);
  const productsSectionRef = useRef(null);
  // State for discount filters
  const [discountFilters, setDiscountFilters] = useState({
    any: false,
    30: false,
    20: false,
    10: false,
  });
  // Add this with your other state declarations at the top of HomePage
  const [inStock, setInStock] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Number of products to show per page
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products from the backend
  // the fetchProducts function:

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from:", API_ENDPOINTS.getProducts); // Log the endpoint

        const response = await fetch(API_ENDPOINTS.getProducts);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Products data received:", data); // Log the received data

        // Validate the data structure
        if (!Array.isArray(data)) {
          console.error(
            "Expected an array of products, received:",
            typeof data
          );
          setError("Invalid data format received from server");
          setLoading(false);
          return;
        }

        // Log the first product's structure if available
        if (data.length > 0) {
          console.log("Sample product structure:", data[0]);
        }

        setProducts(data);
        setLoading(false);

        // Log filtered products after price filter is applied
        console.log(
          "Filtered products:",
          data.filter((product) => product.price <= priceRange)
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Can add priceRange as dependency since we're using it in the logging

  useEffect(() => {
    const handleScroll = () => {
      if (
        filterRef.current &&
        productGridRef.current &&
        productsSectionRef.current
      ) {
        const scrollY = window.scrollY;
        const productsSectionBottom =
          productsSectionRef.current.getBoundingClientRect().bottom;
        setShowAdditionalSections(productsSectionBottom <= window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //filtering products by discount
  // Filter products based on price range
  // const filteredProducts = products.filter((product) => {
  //   return product.price <= priceRange;
  // });
  // Update the filtering logic in HomePage:
  // Filter products based on price range and discount
  const filteredProducts = products.filter((product) => {
    const meetsPrice = product.price <= priceRange;

    // Calculate discount percentage if there's an original price
    const discountPercentage =
      product.originalPrice && product.originalPrice > product.price
        ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
          100
        )
        : 0;

    // Check if any discount filter is selected
    const meetsDiscount =
      (discountFilters.any && discountPercentage > 0) ||
      (discountFilters[30] && discountPercentage >= 30) ||
      (discountFilters[20] && discountPercentage >= 20) ||
      (discountFilters[10] && discountPercentage >= 10);

    // inStock filter condition
    const meetsInStock = inStock ? product.isInStock : true;

    return (
      meetsPrice &&
      meetsInStock &&
      (Object.values(discountFilters).some(Boolean) ? meetsDiscount : true)
    );
  });
  //pagination
  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [priceRange, discountFilters, inStock]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto px-1 mt-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading products...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  // what to return incase of product loading errors
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div
          ref={filterRef}
          className={`md:w-1/4 ${filterSticky ? "md:sticky md:top-20" : ""}`}
          style={{ height: "fit-content" }}>
          {/* <Filter priceRange={priceRange} setPriceRange={setPriceRange} /> */}
          {/* <Filter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            discountFilters={discountFilters}
            setDiscountFilters={setDiscountFilters}
            inStock={inStock}
            setInStock={setInStock}
            onApplyFilters={() => {
              // This will trigger a re-render of the ProductGrid
              // You can also add any additional filter logic here
            }}
          /> */}
        </div>
        {/*filtered products*/}

        <div className="flex-grow container mx-auto px-1 mt-[-20vw]">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        </div>
        {/* Additional sections */}
        <>
          <BannerOne />
          <BannerTwo />
          {/* <Gallery images={galleryImages} /> */}
        </>

        <Footer />
      </div>
    );
  }

  return (<>
    <Hero />

  </>);
};

export default HomePage;
