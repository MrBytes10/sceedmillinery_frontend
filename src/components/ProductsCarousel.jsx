"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { API_ENDPOINTS } from "../config/api";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const isFavorited = isInFavorites(product.id);
    if (isFavorited) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  const productImage =
    product.displayImage || "https://via.placeholder.com/400x400";

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) *
        100
      )
      : null;

  const isLowStock =
    product.isInStock &&
    product.stockCount != null &&
    product.stockCount <= 5;

  return (
    <div
      onClick={() => product.isInStock && navigate(`/product/${product.id}`)}
      className={`group relative flex flex-col ${product.isInStock ? "cursor-pointer" : "cursor-default opacity-60"
        }`}
    >
      {/* ── Image area ──────────────────────────────────────────────────── */}
      <div className="relative w-full bg-[#efefef] overflow-hidden aspect-[3/4]">
        {/* Low stock badge — top left, matching reference */}
        {(isLowStock || product.isLowStock) && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-medium tracking-[0.15em] uppercase text-[#212121]">
            A Few Left
          </span>
        )}

        {/* Discount badge — top left (only when no low-stock badge) */}
        {discountPercentage && !isLowStock && !product.isLowStock && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-medium tracking-[0.15em] uppercase text-[#212121]">
            {discountPercentage}% Off
          </span>
        )}

        {/* Out of stock badge */}
        {!product.isInStock && (
          <span className="absolute top-3 left-3 z-10 text-[9px] font-medium tracking-[0.15em] uppercase text-[#888]">
            Out of Stock
          </span>
        )}

        {/* Favourite button — top right */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={
            isInFavorites(product.id)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isInFavorites(product.id)
              ? "text-white fill-current"
              : "text-white"
              }`}
          />
        </button>

        {/* Product image — subtle scale on hover */}
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* ── Info area ───────────────────────────────────────────────────── */}
      <div className="pt-3 pb-1">
        <p className="text-[14px] font-medium tracking-[0.12em] uppercase text-black leading-snug line-clamp-1">
          {product.name}
        </p>

        <div className="flex items-baseline gap-2 mt-1">
          {discountPercentage && (
            <span className="text-[10px] tracking-wide text-black line-through">
              ${product.originalPrice.toLocaleString()} USD
            </span>
          )}
          <span className="text-[10px] tracking-wide text-black">
            ${product.price.toLocaleString()} USD
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getProducts);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.slice(0, 12)); // Limit to 12 products for carousel
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12" style={{ background: "linear-gradient(135deg, #3E0B08 0%, #000000 100%)" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-8 text-black">
            Featured Products
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-alexBrush text-6xl text-center mb-8 text-black">
          Featured Products
        </h2>

        <div className="w-full overflow-hidden pt-8 text-black" ref={emblaRef}>
          <div className="flex gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;
