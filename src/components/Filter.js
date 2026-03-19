import React, { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

// ── Trigger Button ──────────────────────────────────────────────────────────
export const FilterTriggerButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 border border-[#212121] text-xs font-medium text-[#212121] rounded-[6px] hover:bg-[#212121] hover:text-white transition-colors duration-200">
    <SlidersHorizontal size={14} />
    Filter & Sort
  </button>
);

// ── Main Filter Modal ───────────────────────────────────────────────────────
const Filter = ({
  priceRange = 1000,
  setPriceRange = () => { },
  setSelectedColors = () => { },
  selectedColors = [],
  setSelectedCategory = () => { },
  selectedCategory = null,
  inStock,
  setInStock,
  isOpen = false,
  onClose = () => { },
}) => {
  const initialState = useMemo(
    () => ({
      localPriceRange: priceRange,
      localSelectedColors: selectedColors,
      localSelectedCategory: selectedCategory,
      localInStock: inStock,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [localPriceRange, setLocalPriceRange] = useState(initialState.localPriceRange);
  const [localSelectedColors, setLocalSelectedColors] = useState(initialState.localSelectedColors);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(initialState.localSelectedCategory);
  const [localInStock, setLocalInStock] = useState(initialState.localInStock);

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [availableColors, setAvailableColors] = useState([]);
  const [categories] = useState(["Hatinators", "Fascinators"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getColors);
        if (!response.ok) throw new Error("Failed to fetch colors");
        const colors = await response.json();
        setAvailableColors(colors);
      } catch {
        setError("Error loading colors");
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  const handlePriceChange = (e) => setLocalPriceRange(parseInt(e.target.value));

  const handleColorSelect = (color) => {
    setLocalSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setIsColorDropdownOpen(false);
  };

  const handleCategoryChange = (category) => {
    setLocalSelectedCategory(category === localSelectedCategory ? null : category);
  };

  const applyFilters = () => {
    setPriceRange(localPriceRange);
    setSelectedColors(localSelectedColors);
    setSelectedCategory(localSelectedCategory);
    setInStock(localInStock);
    onClose();
  };

  const resetFilters = () => {
    setLocalPriceRange(1000);
    setLocalSelectedColors([]);
    setLocalSelectedCategory(null);
    setLocalInStock(false);
  };

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
          backgroundColor: isOpen ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0)",
          pointerEvents: isOpen ? "auto" : "none",
          WebkitBackdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
        }}
      />

      {/* ── Slide-in Panel ──────────────────────────────────────────────── */}
      <div
        className="fixed top-0 right-0 h-full z-50 w-full sm:w-[360px] bg-white shadow-2xl flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e8e8]">
          <h2 className="text-lg font-poppins font-semibold tracking-wide text-[#212121]">
            Filter &amp; Sort
          </h2>
          <button
            onClick={onClose}
            className="text-[#212121] hover:opacity-60 transition-opacity">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Availability ──────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-[#e8e8e8]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium tracking-wider uppercase text-[#212121]">
                Availability
              </span>
            </div>
            <label className="flex items-center mt-3 gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localInStock}
                onChange={(e) => setLocalInStock(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#212121] cursor-pointer"
              />
              <span className="text-xs text-[#212121]">In stock only</span>
            </label>
          </div>

          {/* ── Category ──────────────────────────────────────────────── */}
          <div className="border-b border-[#e8e8e8]">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex justify-between items-center px-6 py-5 text-left">
              <span className="text-xs font-medium tracking-wider uppercase text-[#212121]">
                Category
              </span>
              <ChevronRight
                size={14}
                className="text-[#212121] transition-transform duration-200"
                style={{ transform: isCategoryOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isCategoryOpen ? "200px" : "0px" }}>
              <div className="px-6 pb-5 space-y-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      checked={localSelectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                      className="w-3.5 h-3.5 accent-[#212121] cursor-pointer"
                    />
                    <span className="text-xs text-[#212121]">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Color ─────────────────────────────────────────────────── */}
          <div className="border-b border-[#e8e8e8]">
            <button
              onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
              className="w-full flex justify-between items-center px-6 py-5 text-left">
              <span className="text-xs font-medium tracking-wider uppercase text-[#212121]">
                Color
                {localSelectedColors.length > 0 && (
                  <span className="ml-2 text-[10px] text-[#757575] normal-case tracking-normal">
                    ({localSelectedColors.length} selected)
                  </span>
                )}
              </span>
              <ChevronRight
                size={14}
                className="text-[#212121] transition-transform duration-200"
                style={{ transform: isColorDropdownOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            </button>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isColorDropdownOpen ? "240px" : "0px" }}>
              <div className="px-6 pb-5">
                {/* Selected color pills */}
                {localSelectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {localSelectedColors.map((color) => (
                      <span
                        key={color}
                        className="text-[10px] bg-[#f2f2f2] rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[#212121]">
                        {color}
                        <button
                          onClick={() => handleColorSelect(color)}
                          className="text-[#757575] hover:text-[#212121] transition-colors leading-none">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Color list */}
                <div className="max-h-32 overflow-y-auto space-y-2.5">
                  {loading ? (
                    <p className="text-xs text-[#757575]">Loading colors…</p>
                  ) : error ? (
                    <p className="text-xs text-red-500">{error}</p>
                  ) : (
                    availableColors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={localSelectedColors.includes(color)}
                          onChange={() => handleColorSelect(color)}
                          className="w-3.5 h-3.5 accent-[#212121] cursor-pointer"
                        />
                        <span className="text-xs text-[#212121]">{color}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pricing ───────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-[#e8e8e8]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-medium tracking-wider uppercase text-[#212121]">
                Price
              </span>
              <span className="text-xs text-[#757575]">Up to ${localPriceRange}</span>
            </div>
            <input
              type="range"
              min="200"
              max="1000"
              value={localPriceRange}
              onChange={handlePriceChange}
              className="w-full h-px bg-[#D9D9D9] rounded-full appearance-none mb-0 cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #212121 0%, #212121 ${((localPriceRange - 200) / 800) * 100
                  }%, #D9D9D9 ${((localPriceRange - 200) / 800) * 100}%, #D9D9D9 100%)`,
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-[#757575]">$200</span>
              <span className="text-[10px] text-[#757575]">$1,000</span>
            </div>
          </div>
        </div>

        {/* ── Footer actions ────────────────────────────────────────── */}
        <div className="px-6 py-5 border-t border-[#e8e8e8] flex gap-3">
          <button
            onClick={resetFilters}
            className="flex-1 py-3 border border-[#212121] text-xs font-medium text-[#212121] rounded-[6px] hover:bg-[#f5f5f5] transition-colors">
            Reset all filters
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 py-3 bg-[#212121] text-xs font-medium text-white rounded-[6px] hover:bg-[#3a3a3a] transition-colors">
            See results
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
