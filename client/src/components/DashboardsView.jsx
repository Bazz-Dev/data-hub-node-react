import React, { useEffect, useMemo, useState } from "react";
import Input from "./ui/Input.jsx";
import Select from "./ui/Select.jsx";
import DashboardCard from "./DashboardCard.jsx";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export default function DashboardsView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const [filters, setFilters] = useState({
    gerencia: "",
    desarrollador: "",
    estado: "",
    search: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJson("/api/dashboards");
        setItems(data.items || []);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const options = useMemo(() => ({
    gerencias: uniq(items.map((d) => d.gerencia)),
    desarrolladores: uniq(items.map((d) => d.desarrollador)),
    estados: uniq(items.map((d) => d.estado)),
  }), [items]);

  const filtered = useMemo(() => {
    const q = (filters.search || "").toLowerCase().trim();
    return items.filter((d) => {
      if (filters.gerencia && d.gerencia !== filters.gerencia) return false;
      if (filters.desarrollador && d.desarrollador !== filters.desarrollador) return false;
      if (filters.estado && d.estado !== filters.estado) return false;
      if (!q) return true;
      return JSON.stringify(d).toLowerCase().includes(q);
    });
  }, [items, filters]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Dashboards</h1>
          <p className="text-sm text-muted mt-1">Catálogo informativo conectado a CSV (backend local).</p>
        </div>
        <div className="text-sm text-muted">
          <span className="font-extrabold text-text">{filtered.length}</span> resultados
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          className="md:col-span-2"
          placeholder="Buscar por título, gerencia, estado, etc…"
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
        />

        <Select value={filters.gerencia} onChange={(e) => setFilters((p) => ({ ...p, gerencia: e.target.value }))}>
          <option value="">Gerencia (todas)</option>
          {options.gerencias.map((x) => <option key={x} value={x}>{x}</option>)}
        </Select>

        <Select value={filters.estado} onChange={(e) => setFilters((p) => ({ ...p, estado: e.target.value }))}>
          <option value="">Estado (todos)</option>
          {options.estados.map((x) => <option key={x} value={x}>{x}</option>)}
        </Select>

        <Select value={filters.desarrollador} onChange={(e) => setFilters((p) => ({ ...p, desarrollador: e.target.value }))} className="md:col-span-2">
          <option value="">Desarrollador (todos)</option>
          {options.desarrolladores.map((x) => <option key={x} value={x}>{x}</option>)}
        </Select>

        <button
          className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-extrabold shadow-soft hover:border-primary/40 transition"
          onClick={() => setFilters({ gerencia: "", desarrollador: "", estado: "", search: "" })}
        >
          Limpiar filtros
        </button>
      </section>

      {loading && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft text-muted">
          Cargando dashboards…
        </div>
      )}

      {!!error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-soft">
          <div className="font-extrabold">Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
          <div className="font-extrabold">Sin resultados</div>
          <div className="text-sm text-muted mt-1">Prueba ajustar filtros o buscar con menos palabras.</div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => <DashboardCard key={d.id} d={d} />)}
      </section>
    </div>
  );
}
