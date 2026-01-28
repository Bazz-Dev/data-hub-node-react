import React from "react";

export default function Avatar({ size = 40, children, className = "", src, alt }) {
  const s = typeof size === "number" ? `${size}px` : size;
  const base = "rounded-2xl bg-black text-white flex items-center justify-center font-black overflow-hidden";
  return (
    <div style={{ width: s, height: s }} className={[base, className].join(" ")}> 
      {src ? <img src={src} alt={alt || "avatar"} className="w-full h-full object-cover" /> : children}
    </div>
  );
}
