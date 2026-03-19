// sceed_frontend/src/pages/shopPage.js

import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
// import Filter from "../components/Filter";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../config/api";
import Pagination from "../components/pagination";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState(1000);
  const [filterSticky, setFilterSticky] = useState(false);
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filterRef = useRef(null);
  const productGridRef = useRef(null);
  const productsSectionRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Number of products to show per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_ENDPOINTS.getProducts}?maxPrice=${priceRange}`;

        if (selectedColors.length > 0) {
          url += `&colors=${selectedColors.join(",")}`;
        }

        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        if (inStock) {
          url += `&inStock=true`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [priceRange, selectedColors, selectedCategory, inStock]);

  const filteredProducts = products.filter((product) => {
    const meetsPrice = product.price <= priceRange;
    const meetsColor =
      selectedColors.length === 0 || selectedColors.includes(product.color);
    const meetsCategory =
      !selectedCategory || product.category === selectedCategory;
    const meetsInStock = inStock ? product.isInStock : true;

    return meetsPrice && meetsColor && meetsCategory && meetsInStock;
  });

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
  }, [priceRange, selectedColors, selectedCategory, inStock]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto px-4 mt-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading products...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* 
        <div
          ref={filterRef}
          className={`md:w-1/4 ${filterSticky ? "md:sticky md:top-20" : ""}`}
          style={{ height: "fit-content" }}>
          <Filter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            inStock={inStock}
            setInStock={setInStock}
            onApplyFilters={() => {
              // This will trigger a re-render of the ProductGrid
              // You can also add any additional filter logic here
            }}
          />
        </div>
        */}
        <div className="flex-grow container mx-auto px-4 mt-[-20vw]">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 mt-8">
        <div
          className="flex flex-col md:flex-row gap-8"
          ref={productsSectionRef}>
          {/* 
          <div
            ref={filterRef}
            className={`md:w-1/4 ${filterSticky ? "md:sticky md:top-20" : ""}`}
            style={{ height: "fit-content" }}>
            <Filter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              inStock={inStock}
              setInStock={setInStock}
              onApplyFilters={() => {
                // This will trigger a re-render of the ProductGrid
                // You can also add any additional filter logic here
              }}
            />
          </div>
          */}

          <div ref={productGridRef} className="md:w-full">
            <ProductGrid
              products={currentProducts}
              selectedCategory={selectedCategory}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
