import React, { useEffect, useMemo, useState } from "react";
import QueryModal from "./QueryModal.jsx";
import Card from "./ui/Card.jsx";
import Badge from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";
import Input from "./ui/Input.jsx";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function QueriesView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJson("/api/queries");
        setItems(data.items || []);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter((x) => `${x.nombre} ${x.tags.join(" ")}`.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Queries</h1>
          <p className="text-sm text-muted mt-1">Tabla alimentada desde CSV (backend local).</p>
        </div>
        <div className="text-sm text-muted">
          <span className="font-extrabold text-text">{filtered.length}</span> queries
        </div>
      </div>

      <Input placeholder="Buscar por nombre o tags…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft text-muted">
          Cargando queries…
        </div>
      )}

      {!!error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-soft">
          <div className="font-extrabold">Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02]">
              <tr>
                <th className="text-left p-4 font-extrabold">Nombre</th>
                <th className="text-left p-4 font-extrabold">Tags</th>
                <th className="text-right p-4 font-extrabold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-t border-black/5">
                  <td className="p-4 font-semibold">{q.nombre}</td>
                  <td className="p-4 text-muted">
                    <div className="flex flex-wrap gap-2">
                      {q.tags?.length ? q.tags.map((t) => <Badge key={t}>{t}</Badge>) : <span className="text-muted">—</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="solid" className="inline-flex items-center text-xs" onClick={() => setOpen(q)}>Ver query</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="border-t border-black/5">
                  <td className="p-6 text-muted" colSpan={3}>Sin resultados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <QueryModal open={open} onClose={() => setOpen(null)} />
    </div>
  );
}
