"use client";
import React, { useState } from "react";
import gallery7 from "../images/tailor-made-model.png";

const MailingList = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: wire up to your mailing list API
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden">

      {/* ── Background image ─────────────────────────────────────────── */}
      <img
        src={gallery7}
        alt="Mailing list background"
        className="absolute inset-0 w-full object-cover object-top"
      />

      {/* Subtle dark gradient on the left so text is always legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-14 max-w-lg">

        {!submitted ? (
          <>
            <h2 className="text-white text-2xl sm:text-3xl font-light leading-snug mb-3">
              Sign up to keep up to date with{" "}
              <span className="font-semibold">our store!</span>
            </h2>

            <p className="text-white/70 text-xs tracking-wide leading-relaxed mb-7 max-w-sm">
              Dive into unique style, sans pretense and without conformity.
              Be the first to know about new arrivals and exclusives.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-[420px]">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full h-12 px-4 bg-transparent border border-white/60 text-white text-xs tracking-wide placeholder:text-white/50 outline-none focus:border-white transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full h-12 bg-white text-[#212121] text-xs font-medium tracking-[0.12em] uppercase hover:bg-white/90 transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/50">
              You're in
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-light leading-snug">
              Thanks for subscribing.
            </h2>
            <p className="text-white/60 text-xs tracking-wide leading-relaxed max-w-xs">
              Watch your inbox — good things are coming.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MailingList;
