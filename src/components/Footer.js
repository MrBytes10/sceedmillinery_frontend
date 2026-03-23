import React, { useState } from "react";
import { ReactComponent as UgandanFlag } from "../assets/icons/UgandanFlag.svg";
import { ReactComponent as YoutubeIcon } from "../assets/icons/youtubeIcon.svg";
import { ReactComponent as FacebookIcon } from "../assets/icons/facebookIcon.svg";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagramIcon.svg";
import { ReactComponent as WhatsAppIcon } from "../assets/icons/WhatsAppIcon.svg";
import { ReactComponent as JeanSignature } from "../assets/icons/jeanGmailSignature.svg";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0f0f0f] text-white">

      {/* ── Top rule ────────────────────────────────────────────────────── */}
      <div className="h-px w-full bg-white/10" />

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="px-8 sm:px-14 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">


        {/* Socials */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/40">
            Socials
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/sceedmillinery"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white/50 hover:text-white transition-colors duration-200">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://web.facebook.com/glamandpoppy/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-white/50 hover:text-white transition-colors duration-200">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@faithnamalwa"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-white/50 hover:text-white transition-colors duration-200">
              <YoutubeIcon className="w-5 h-5" />
            </a>
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/+256787315801"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 border border-white/20 px-3 h-9 w-fit hover:border-white/50 transition-colors duration-200">
            <WhatsAppIcon className="w-4 h-4 text-green-400" />
            <span className="text-[10px] tracking-[0.1em] uppercase text-white/60">
              WhatsApp us
            </span>
          </a>
        </div>

        {/* Store Policy */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/40">
            Store Policy
          </p>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Privacy Policy", href: "/shop" },
              { label: "Refund Policy", href: "#" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-xs text-white/55 hover:text-white transition-colors duration-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/40">
            Company
          </p>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Store", href: "/shop" },
              { label: "Contact", href: "/contact" },
              { label: "About", href: "/about" },
              { label: "Login", href: "/login" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-xs text-white/55 hover:text-white transition-colors duration-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="h-px w-full bg-white/10" />
      <div className="px-8 sm:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Flag + signature */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-sm">
            <UgandanFlag className="h-4 w-auto" aria-hidden="true" />
            <span className="text-[10px] font-medium text-white/60 tracking-wide">
              UG
            </span>
          </div>
          <JeanSignature className="opacity-50" />
        </div>

        {/* Copyright */}
        <p className="text-[10px] tracking-[0.1em] text-white/30 text-center">
          © SceedMillinery {new Date().getFullYear()}
        </p>

        {/* Spacer for symmetry on desktop */}
        <div className="hidden sm:block w-24" />
      </div>
    </footer>
  );
}

export default Footer;
