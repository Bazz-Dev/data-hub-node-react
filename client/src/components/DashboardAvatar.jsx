import React, { useMemo } from "react";
import Avatar from "./ui/Avatar.jsx";

function hashToHsl(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

export default function DashboardAvatar({ id, title }) {
  const initials = (title || id || "DB")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="aspect-[5/3] w-full rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
      <Avatar size={80} className="bg-black text-white text-2xl">{initials || "DB"}</Avatar>
    </div>
  );
}
