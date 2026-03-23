import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

const SearchBar = ({
  onSearch,
  disabled = false,
  placeholder = "Search for product",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") handleClose();
  };

  return (
    <>
      {/* ── Trigger icon (collapsed state) ────────────────────────────── */}
      <button
        onClick={() => !disabled && setIsOpen(true)}
        className={`text-[#212121] hover:opacity-60 transition-opacity duration-200 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          }`}
        aria-label="Open search"
        disabled={disabled}>
        <Search size={18} strokeWidth={1.5} />
      </button>

      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
          WebkitBackdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
          backgroundColor: isOpen ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* ── Full-width search bar overlay ─────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-white"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
          boxShadow: isOpen ? "0 1px 0 rgba(0,0,0,0.08)" : "none",
        }}>
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full px-6 sm:px-10 h-16 gap-4">

          {/* Search icon — left anchor */}
          <Search
            size={16}
            strokeWidth={1.5}
            className="text-[#212121] flex-shrink-0"
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none text-sm tracking-wide text-[#212121] placeholder:text-[#aaa] placeholder:tracking-wide"
          />

          {/* Clear button — only shown when there's text */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-[#aaa] hover:text-[#212121] transition-colors flex-shrink-0">
              <X size={14} strokeWidth={1.5} />
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-4 bg-[#e0e0e0] flex-shrink-0" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="text-[9px] font-medium tracking-[0.15em] uppercase text-[#212121] hover:opacity-60 transition-opacity flex-shrink-0">
            Close
          </button>
        </form>

        {/* Bottom border line */}
        <div className="h-px w-full bg-[#e8e8e8]" />
      </div>
    </>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default SearchBar;
