import React, { useState, useRef } from "react";

const OTPInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);
    if (onChange) onChange(newOtp.join(""));
    if (idx < length - 1 && value) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
        if (onChange) onChange(newOtp.join(""));
      } else if (idx > 0) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === length) {
      setOtp(paste.split(""));
      if (onChange) onChange(paste);
      inputRefs.current[length - 1].focus();
    }
  };

  // Classes inspired by InputField.jsx for border, bg, and shadow
  const baseInputClasses =
    "h-12 w-1/6 rounded-lg border appearance-none px-0 py-2.5 text-center text-lg shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800";

  return (
    <div className="flex gap-2 justify-center my-4">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={baseInputClasses}
          value={digit}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          ref={el => (inputRefs.current[idx] = el)}
          autoFocus={idx === 0}
          required
        />
      ))}
    </div>
  );
};

export default OTPInput;
