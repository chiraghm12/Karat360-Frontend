import React from "react";

const RingLoader = ({ className = "h-5 w-5 mr-2 text-white" }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
        />
        <path
            className="text-white"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            d="M12 2a10 10 0 0 1 10 10"
        />
    </svg>
);

export default RingLoader;
