"use client";
import React from "react";

export default function Logo({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      {/* Outer Glow Defs */}
      <defs>
        <linearGradient id="xotCyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#1F6FEB" />
        </linearGradient>
        <linearGradient id="xotEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#58A6FF" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
        <linearGradient id="xotEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#39D353" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00F0FF" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Square Block Frame */}
      <rect
        x="15"
        y="15"
        width="80"
        height="80"
        rx="10"
        fill="#0D1117"
        stroke="#30363D"
        strokeWidth="2.5"
      />

      {/* Right Ear Protrusion */}
      <path
        d="M 95 44 A 16 16 0 0 1 95 76 Z"
        fill="url(#xotCyanBlue)"
      />

      {/* Top-Left Forehead Arc */}
      <path
        d="M 17 45 A 28 28 0 0 1 45 17 L 45 45 Z"
        fill="#00F0FF"
      />

      {/* Center Eye Semi-Circle */}
      <path
        d="M 52 47 A 15 15 0 0 0 82 47 Z"
        fill="url(#xotEyeGrad)"
      />

      {/* Angular Nose Wedge */}
      <path
        d="M 45 45 L 34 65 L 45 65 Z"
        fill="#39D353"
      />

      {/* Bottom Chin/Mouth Curve */}
      <path
        d="M 45 65 A 18 18 0 0 1 45 85 Z"
        fill="#58A6FF"
      />

      {/* Sharp Accent Lines */}
      <path
        d="M 45 17 L 45 93"
        stroke="#161B22"
        strokeWidth="2"
      />
    </svg>
  );
}
