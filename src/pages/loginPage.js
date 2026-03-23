//sceed_frontend/src/pages/loginPage.js

import React, { useState } from "react";
import Header from "../components/Header";
import backgroundImage from "../images/IMG_2828.jpg";
import { API_ENDPOINTS } from "../config/api";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "At least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.loginUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { error: text };
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user.id.toString());
        localStorage.setItem("userEmail", data.user.email);

        try {
          const mergeResponse = await fetch(API_ENDPOINTS.mergeCart, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`,
              "Content-Type": "application/json",
            },
          });

          if (!mergeResponse.ok) {
            console.warn("Cart merge failed, but continuing login");
          }
        } catch (error) {
          console.error("Error merging cart:", error);
        }
      }

      window.location.href = "/";
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `w-full h-11 px-4 bg-transparent border text-sm text-[#212121] placeholder:text-[#aaa] outline-none transition-colors duration-200 ${errors[field]
      ? "border-red-400 focus:border-red-500"
      : "border-[#d4d4d4] focus:border-[#212121]"
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left: form ──────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 sm:px-16 py-16">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#aaa] mb-3">
              Welcome back
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
              Log in to your account
            </h1>
          </div>

          {/* API error */}
          {apiError && (
            <div className="mb-6 px-4 py-3 border border-red-300 bg-red-50 text-red-600 text-xs tracking-wide">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#888]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputCls("email")}
              />
              {errors.email && (
                <p className="text-[10px] text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#888]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#212121] transition-colors">
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#212121] text-white text-[10px] font-medium tracking-[0.16em] uppercase hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                {isSubmitting ? "Logging in…" : "Log In"}
              </button>

              <p className="text-center text-xs text-[#aaa]">
                Don't have an account?{" "}
                <a href="/sign-up" className="text-[#212121] underline underline-offset-2 hover:opacity-60 transition-opacity">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* ── Right: image ─────────────────────────────────────────────── */}
        <div className="hidden lg:block relative">
          <img
            src={backgroundImage}
            alt="Login visual"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle darkening overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
