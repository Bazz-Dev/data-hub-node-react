import React from "react";

export default function Button({ children, variant = "solid", className = "", as: Component = "button", ...props }) {
  const base = "px-4 py-2 rounded-2xl text-sm font-semibold transition inline-flex items-center justify-center";
  const variants = {
    solid: "bg-primary text-white shadow-soft",
    ghost: "bg-white hover:bg-black/5 text-text border border-black/10",
    subtle: "bg-black/5 text-text",
  };
  return (
    <Component className={[base, variants[variant] || variants.solid, className].join(" ")} {...props}>
      {children}
    </Component>
  );
}
