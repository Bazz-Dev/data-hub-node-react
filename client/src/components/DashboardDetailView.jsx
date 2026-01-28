import React, { useEffect, useMemo, useState } from "react";
import DashboardAvatar from "./DashboardAvatar.jsx";
import Card from "./ui/Card.jsx";
import Badge from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function splitPiped(v) {
  return (v || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}
function splitSemi(v) {
  return (v || "")
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function DashboardDetailView({ id }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [d, setD] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJson(`/api/dashboards/${encodeURIComponent(id)}`);
        setD(data);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const chips = useMemo(() => (d ? splitPiped(d.canales) : []), [d]);
  const fuentes = useMemo(() => (d ? splitPiped(d.fuentes) : []), [d]);
  const responsables = useMemo(() => (d ? splitSemi(d.responsables) : []), [d]);
  const contactos = useMemo(() => (d ? splitSemi(d.contactos) : []), [d]);

  const accessUrl = "https://portalti.natura.net/nco?id=sc_cat_item&sys_id=29d1a1b33bd65e100b26b9d355e45aab&table=sc_cat_item&searchTerm=tableau";

  if (loading) {
    return <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft text-muted">Cargando…</div>;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 p-6">
        <div className="font-extrabold">Error</div>
        <div className="text-sm mt-1">{error}</div>
        <Button as="a" href="#/dashboards" className="mt-4">Volver →</Button>
      </Card>
    );
  }

  if (!d) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Button as="a" href="#/dashboards" variant="ghost">← Volver</Button>
          <h1 className="text-2xl font-black tracking-tight mt-2">{d.titulo}</h1>
          <div className="text-sm text-muted mt-1">{[d.gerencia, d.desarrollador].filter(Boolean).join(" · ") || "—"}</div>
        </div>
        <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold">{d.estado || "N/A"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          {d.thumb_url ? (
            <img src={d.thumb_url} alt={d.titulo} className="w-full rounded-2xl object-cover max-h-80" />
          ) : (
            <DashboardAvatar id={d.id} title={d.titulo} />
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Canales</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {chips.length ? chips.map((c) => <Badge key={c}>{c}</Badge>) : <span className="text-sm text-muted">—</span>}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Fuentes</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {fuentes.length ? fuentes.map((c) => <Badge key={c}>{c}</Badge>) : <span className="text-sm text-muted">—</span>}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Responsables</div>
              <div className="mt-2 space-y-1">
                {responsables.length ? responsables.map((x) => <div key={x} className="text-sm font-semibold">{x}</div>) : <span className="text-sm text-muted">—</span>}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Contactos</div>
              <div className="mt-2 space-y-1">
                {contactos.length ? contactos.map((x) => <a key={x} href={`mailto:${x}`} className="text-sm font-semibold text-primary block">{x}</a>) : <span className="text-sm text-muted">—</span>}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Última actualización</div>
              <div className="mt-1 font-extrabold">{d.ultima_actualizacion || "-"}</div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">ID</div>
              <div className="mt-1 font-mono text-sm">{d.id}</div>
            </div>
          </div>

          {d["Descripcion"] || d["descripcion"] || d["descripcion_larga"] ? (
            <div className="mt-5">
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Descripción</div>
              <p className="mt-2 text-sm leading-relaxed text-text">{d["Descripcion"] || d["descripcion"] || d["descripcion_larga"]}</p>
            </div>
          ) : null}
        </Card>

        <Card className="p-5 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Acciones</div>

          {d.link_dashboard ? (
            <Button as="a" href={d.link_dashboard} target="_blank" rel="noreferrer" className="w-full justify-between" variant="ghost">
              Abrir Dashboard <span>↗</span>
            </Button>
          ) : (
            <div className="text-sm text-muted">Sin link de dashboard</div>
          )}

          <Button as="a" href={accessUrl} target="_blank" rel="noopener noreferrer" className="w-full justify-between" variant="ghost">Solicitar Acceso <span>→</span></Button>

          <div className="pt-3 border-t border-black/5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Observaciones</div>
            <div className="mt-2 text-sm text-muted whitespace-pre-wrap">{d.observaciones || d["Observaciones"] || "—"}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
