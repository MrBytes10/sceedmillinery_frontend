//sceed_frontend/src/components/ProductGrid.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
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

  // "A FEW LEFT" when stock is low but not zero — adjust threshold to taste
  const isLowStock =
    product.isInStock &&
    product.stockCount != null &&
    product.stockCount <= 5;

  return (
    <div
      onClick={() => product.isInStock && navigate(`/product/${product.id}`)}
      className={`group relative flex flex-col ${product.isInStock ? "cursor-pointer" : "cursor-default opacity-60"
        }`}>

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
          }>
          <Heart
            className={`w-4 h-4 transition-colors ${isInFavorites(product.id)
                ? "text-[#212121] fill-current"
                : "text-[#212121]"
              }`}
          />
        </button>

        {/* Product image — subtle scale on hover */}
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* ── Info area ───────────────────────────────────────────────────── */}
      <div className="pt-3 pb-1">
        <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#212121] leading-snug line-clamp-1">
          {product.name}
        </p>

        <div className="flex items-baseline gap-2 mt-1">
          {discountPercentage && (
            <span className="text-[10px] tracking-wide text-[#999] line-through">
              ${product.originalPrice.toLocaleString()} USD
            </span>
          )}
          <span className="text-[10px] tracking-wide text-[#212121]">
            ${product.price.toLocaleString()} USD
          </span>
        </div>
      </div>
    </div>
  );
};


const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length === 0 ? (
        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-600 text-center col-span-full">
          No products found within that Price Range.
        </p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductGrid;
