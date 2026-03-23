"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import gallery2 from "../images/gallery2.jpg";
import gallery4 from "../images/gallery4.jpg";
import gallery6 from "../images/gallery6.jpg";

const images = [
  { src: gallery2, label: "Collection I" },
  { src: gallery4, label: "Collection II" },
  { src: gallery6, label: "Collection III" },
];

const GalleryShowCase = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [entered, setEntered] = useState(false);
  const lightboxRef = useRef(null);

  // Staggered entrance
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex]);

  const prev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setLightboxIndex((i) => (i + 1) % images.length);

  return (
    <>
      <section className="w-full px-6 sm:px-10 py-16">

        {/* Header */}
        <div
          className="flex items-end justify-between mb-10 transition-all duration-700 ease-out"
          style={{ opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(16px)" }}>
          <div>
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#aaa] mb-2">
              Editorial
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-[#212121]">
              Gallery
            </h2>
          </div>
          <p className="text-[10px] tracking-[0.12em] uppercase text-[#aaa]">
            {images.length} images
          </p>
        </div>

        {/* ── Asymmetric grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-12 grid-rows-2 gap-2 h-[70vh]">

          {/* Large left — spans 7 cols, full height */}
          <div
            className="col-span-12 sm:col-span-7 row-span-2 relative overflow-hidden bg-[#efefef] cursor-pointer group transition-all duration-700 ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "0.1s",
            }}
            onClick={() => setLightboxIndex(0)}>
            <img
              src={images[0].src}
              alt={images[0].label}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[0.18em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images[0].label}
            </span>
          </div>

          {/* Top right — spans 5 cols, 1 row */}
          <div
            className="col-span-12 sm:col-span-5 row-span-1 relative overflow-hidden bg-[#efefef] cursor-pointer group transition-all duration-700 ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "0.2s",
            }}
            onClick={() => setLightboxIndex(1)}>
            <img
              src={images[1].src}
              alt={images[1].label}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[0.18em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images[1].label}
            </span>
          </div>

          {/* Bottom right — spans 5 cols, 1 row */}
          <div
            className="col-span-12 sm:col-span-5 row-span-1 relative overflow-hidden bg-[#efefef] cursor-pointer group transition-all duration-700 ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "0.3s",
            }}
            onClick={() => setLightboxIndex(2)}>
            <img
              src={images[2].src}
              alt={images[2].label}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[0.18em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images[2].label}
            </span>
          </div>
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(10,10,10,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === lightboxRef.current && setLightboxIndex(null)}>

          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-6 text-white/60 hover:text-white transition-colors z-10">
            <X size={18} strokeWidth={1.5} />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-6 text-[9px] font-medium tracking-[0.2em] uppercase text-white/50">
            {lightboxIndex + 1} / {images.length}
          </span>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 text-white/50 hover:text-white transition-colors z-10 p-2">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          {/* Image */}
          <img
            key={lightboxIndex}
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].label}
            className="max-h-[85vh] max-w-[85vw] object-contain"
            style={{ animation: "fadeIn 0.25s ease" }}
          />

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-4 text-white/50 hover:text-white transition-colors z-10 p-2">
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          {/* Label */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-[0.2em] uppercase text-white/50">
            {images[lightboxIndex].label}
          </p>

          {/* Dot indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="w-1 h-1 rounded-full transition-colors duration-200"
                style={{ backgroundColor: i === lightboxIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)" }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
};

export default GalleryShowCase;
