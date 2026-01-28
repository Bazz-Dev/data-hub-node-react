import React from "react";
import DashboardAvatar from "./DashboardAvatar.jsx";
import Card from "./ui/Card.jsx";
import Badge from "./ui/Badge.jsx";

function chips(str) {
  return (str || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export default function DashboardCard({ d }) {
  return (
    <Card as="a" href={`#/dashboard/${encodeURIComponent(d.id)}`} className="group block hover:shadow-lg transition">
      <div className="p-4">
        {d.thumb_url ? (
          <img
            src={d.thumb_url}
            alt={d.titulo}
            className="aspect-[5/3] w-full rounded-2xl object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <DashboardAvatar id={d.id} title={d.titulo} />
        )}

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-extrabold tracking-tight line-clamp-2">{d.titulo}</div>
            <div className="text-xs text-muted mt-1 line-clamp-1">{[d.gerencia, d.desarrollador].filter(Boolean).join(" · ") || "—"}</div>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold">{d.estado || "N/A"}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {chips(d.canales).map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>

        <div className="mt-3 text-xs text-muted">Últ. actualización: <span className="font-semibold text-text">{d.ultima_actualizacion || "-"}</span></div>

        <div className="mt-4 text-primary font-extrabold text-xs uppercase tracking-wide group-hover:translate-x-0.5 transition">Ver detalle →</div>
      </div>
    </Card>
  );
}
