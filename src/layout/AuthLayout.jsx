import React from "react";
import authBg from "../assets/images/auth-bg.jpg";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative p-6 bg-gray-50 z-1 dark:bg-[#050811] sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row bg-white dark:bg-[#070a13] sm:p-0 overflow-hidden">
        {/* Left Side: Photo with Gold & Silver Bars & Centered Karat360 Branding */}
        <div className="relative hidden w-full h-full lg:w-1/2 lg:flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <img
            src={authBg}
            alt="Karat360 Gold and Silver Bullion"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-gray-950/80" />
          <div className="absolute inset-0 bg-black/25" />

          {/* Centered Heading and Subtitle in a Round Circle */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4">
            <div className="relative flex flex-col items-center justify-center text-center w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] lg:w-[360px] lg:h-[360px] rounded-full bg-gray-950/80 backdrop-blur-md border-2 border-amber-400/40 shadow-[0_0_60px_rgba(0,0,0,0.95),inset_0_0_40px_rgba(245,158,11,0.15)] p-6">
              {/* Decorative inner circular ring */}
              <div className="absolute inset-2.5 rounded-full border border-amber-400/25 pointer-events-none" />

              {/* Luxury Accent Badge */}
              <div className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Jewellery Platform
              </div>

              {/* Heading - Karat and 360 all in matching gold */}
              <h1 className="relative z-10 font-extrabold text-4xl sm:text-5xl tracking-tight drop-shadow-md bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Karat360
              </h1>

              {/* Subtitle */}
              <p className="relative z-10 text-amber-100/90 text-xs sm:text-sm mt-2.5 font-medium tracking-wide max-w-[220px] drop-shadow">
                Premium Jewellery Management.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        {children}

        {/* Theme Toggler */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
