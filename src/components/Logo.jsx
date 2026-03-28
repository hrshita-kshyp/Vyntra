
import React from 'react';

/**
 * Vyntra logo — V shape with ECG/heartbeat pulse at the bottom point.
 * Use `size` to scale, `showWordmark` to show the "Vyntra" text beside it.
 */
const Logo = ({ size = 36, showWordmark = false, wordmarkClass = 'text-gray-900', className = '' }) => {
  const id = `vg-${size}`; // unique gradient id per size

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vyntra logo"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect width="40" height="40" rx="10" fill={`url(#${id})`} />

        {/*
          Single path: left arm of V → ECG heartbeat blip at the bottom → right arm of V
          Traces: top-left → down → small pulse → up → top-right
        */}
        <path
          d="M 8 11 L 16 26 L 17.5 22 L 19.5 29 L 21.5 22 L 23 26 L 32 11"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showWordmark && (
        <span className={`font-black tracking-tight leading-none ${wordmarkClass}`}>
          Vyntra
        </span>
      )}
    </div>
  );
};

export default Logo;
