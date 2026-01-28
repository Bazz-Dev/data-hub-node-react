import React from "react";

export default function Select(props) {
  return (
    <select
      {...props}
      className={[
        "rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-soft focus:outline-none",
        props.className || "",
      ].join(" ")}
    />
  );
}
