import React, { useState } from "react";
import Header from "../components/Header";
import backgroundImage from "../images/modelAlone.jpg";
import { API_ENDPOINTS } from "../config/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import phoneUtils from "../utils/phoneUtils";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    physicalAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.length < 2) newErrors.fullName = "At least 2 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";

    if (!formData.physicalAddress.trim()) newErrors.physicalAddress = "Address is required";

    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!phoneUtils.isValidMobile("+" + formData.phoneNumber))
      newErrors.phoneNumber = "Enter a valid phone number";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      newErrors.password = "Min 8 chars with uppercase, number & special character";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.registerUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: "+" + formData.phoneNumber,
          physicalAddress: formData.physicalAddress,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      if (data.token) localStorage.setItem("authToken", data.token);
      window.location.href = "/registration-success";
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared input class builder
  const inputCls = (field) =>
    `w-full h-11 px-4 bg-transparent border text-sm text-[#212121] placeholder:text-[#aaa] outline-none transition-colors duration-200 ${errors[field] ? "border-red-400 focus:border-red-500" : "border-[#d4d4d4] focus:border-[#212121]"
    }`;

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", col: 1 },
    { name: "email", label: "Email Address", type: "email", col: 2 },
    { name: "physicalAddress", label: "Physical Address", type: "text", col: 1 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left: form ──────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 sm:px-16 py-16">

          {/* Heading */}
          <div className="mb-10">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#aaa] mb-3">
              New here?
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
              Create your account
            </h1>
          </div>

          {/* API error */}
          {apiError && (
            <div className="mb-6 px-4 py-3 border border-red-300 bg-red-50 text-red-600 text-xs tracking-wide">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Text fields */}
              {fields.map(({ name, label, type }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#888]">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={inputCls(name)}
                  />
                  {errors[name] && (
                    <p className="text-[10px] text-red-500">{errors[name]}</p>
                  )}
                </div>
              ))}

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#888]">
                  Phone Number
                </label>
                <PhoneInput
                  country="ug"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  enableSearch
                  inputProps={{ name: "phoneNumber", required: true }}
                  containerClass="!w-full"
                  inputClass={`!w-full !h-11 !bg-transparent !border !text-sm !text-[#212121] !rounded-none !outline-none !transition-colors !duration-200 ${errors.phoneNumber ? "!border-red-400" : "!border-[#d4d4d4]"
                    }`}
                  buttonClass="!bg-transparent !border-[#d4d4d4] !rounded-none"
                  dropdownClass="!rounded-none !shadow-md"
                />
                {errors.phoneNumber && (
                  <p className="text-[10px] text-red-500">{errors.phoneNumber}</p>
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#888]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputCls("confirmPassword")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#212121] transition-colors">
                    {showConfirmPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#212121] text-white text-[10px] font-medium tracking-[0.16em] uppercase hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                {isSubmitting ? "Creating account…" : "Create Account"}
              </button>

              <p className="text-center text-xs text-[#aaa]">
                Already have an account?{" "}
                <a href="/login" className="text-[#212121] underline underline-offset-2 hover:opacity-60 transition-opacity">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* ── Right: image ─────────────────────────────────────────────── */}
        <div className="hidden lg:block relative">
          <img
            src={backgroundImage}
            alt="Sign up visual"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle darkening overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
