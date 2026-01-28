import React from "react";

export default function Card({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component className={["rounded-3xl border border-black/5 bg-white shadow-soft overflow-hidden", className].join(" ")} {...props}>
      {children}
    </Component>
  );
}
