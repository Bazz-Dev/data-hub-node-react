import React from "react";

export default function Input(props) {
  return (
    <input
      {...props}
      className={[
        "rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30",
        props.className || "",
      ].join(" ")}
    />
  );
}
