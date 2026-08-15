"use client";
import React from "react";

export default function Logo({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      {/* Clean outer isometric diamond / faceted block */}
      <defs>
        <linearGradient id="xotGlowGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F0FF" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Main outer square with sharp minimal border */}
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        rx="5"
        fill="#0D1117"
        stroke="url(#xotGlowGrad)"
        strokeWidth="2.5"
      />

      {/* Right Ear Protrusion */}
      <path
        d="M 39 17 C 44 17 44 27 39 27"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Abstract Face Profile Geometry */}
      {/* Forehead Arc */}
      <path
        d="M 5 19 C 14 19 19 14 19 5"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose Line & Angle */}
      <path
        d="M 19 19 L 19 26 L 14 26"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Eye Feature (Semi-circle arc) */}
      <path
        d="M 23 18 C 23 23 31 23 31 18"
        stroke="#60A5FA"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth Arc */}
      <path
        d="M 19 26 C 19 33 24 35 24 39"
        stroke="#00F0FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
