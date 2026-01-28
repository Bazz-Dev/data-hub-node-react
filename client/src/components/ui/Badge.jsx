import React from "react";

export default function Badge({ children, className = "" }) {
  return (
    <span className={["inline-flex items-center rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold text-muted", className].join(" ")}>
      {children}
    </span>
  );
}
