import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// ---- CSV helpers ----
function readCsv(filePath, delimiter = ";") {
  const raw = fs.readFileSync(filePath, "utf8");
  return parse(raw, {
    columns: true,
    delimiter,
    bom: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  });
}

function safeStr(v) {
  return (v ?? "").toString().trim();
}

function splitPiped(v) {
  return safeStr(v)
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

// ---- Data loading ----
const DASHBOARDS_FILE =
  process.env.DASHBOARDS_CSV || path.join(__dirname, "..", "data", "dashboards.csv");
const QUERIES_FILE =
  process.env.QUERIES_CSV || path.join(__dirname, "..", "data", "queries.csv");

let dashboardsCache = [];
let queriesCache = [];

function loadDashboards() {
  try {
    if (!fs.existsSync(DASHBOARDS_FILE)) {
      dashboardsCache = [];
      return;
    }
    // Original dashboards.csv uses ';'
    dashboardsCache = readCsv(DASHBOARDS_FILE, ";").map((r) => {
    // Keep original fields but normalize a few common ones used by UI
    const id =
      safeStr(r["id"]) ||
      safeStr(r["ID"]) ||
      safeStr(r["dashboard_id"]) ||
      safeStr(r["Dashboard"]) ||
      safeStr(r["Nombre"]) ||
      safeStr(r["Título"]) ||
      `dash-${Math.random().toString(16).slice(2)}`;

    // Try to map title
    const titulo =
      safeStr(r["Nombre Dashboard"] ?? r["Nombre"] ?? r["titulo"] ?? r["Título"] ?? r["Dashboard"]) ||
      id;

    // Common business fields (fallback to empty)
    const gerencia = safeStr(r["Gerencia"] ?? r["gerencia"]);
    const desarrollador = safeStr(r["Desarrollador"] ?? r["desarrollador"]);
    const estado = safeStr(r["Estado Publicacion"] ?? r["Estado"] ?? r["estado"]);

    return {
      ...r,
      id,
      titulo,
      gerencia,
      desarrollador,
      estado,
      canales: safeStr(r["Canales"] ?? r["canales"] ?? r["Tipo_conexion"] ?? r["Tipo conexion"]),
      fuentes: safeStr(r["Fuentes"] ?? r["fuentes"] ?? r["Origen_datos"] ?? r["Origen datos"]),
      responsables: safeStr(r["Responsables"] ?? r["responsables"] ?? r["Owner"] ?? r["Owner "]),
      link_dashboard: safeStr(r["Url_Dashboard"] ?? r["URL"] ?? r["Link Dashboard"] ?? r["link_dashboard"] ?? r["link"]),
      thumb_url: safeStr(r["thumb_url"] ?? r["Thumb"] ?? r["Imagen"]),
      ultima_actualizacion: safeStr(r["ultima_actualizacion"] ?? r["Última Actualización"] ?? r["Ultima Actualizacion"] ?? ""),
    };
  });
  } catch (err) {
    console.error(`Failed to load dashboards from ${DASHBOARDS_FILE}:`, err && (err.stack || err.message || err));
    dashboardsCache = [];
  }
}

function loadQueries() {
  try {
    if (!fs.existsSync(QUERIES_FILE)) {
      queriesCache = [];
      return;
    }
    // Our queries.csv is ';' delimited
    queriesCache = readCsv(QUERIES_FILE, ";").map((r, idx) => ({
    id: safeStr(r["id"]) || `q-${idx + 1}`,
    nombre: safeStr(r["Nombre"]) || safeStr(r["nombre"]) || `Query ${idx + 1}`,
    tags: splitPiped(r["Tags"] ?? r["tags"]),
    sql: safeStr(r["SQL"] ?? r["sql"]),
  }));
  } catch (err) {
    console.error(`Failed to load queries from ${QUERIES_FILE}:`, err && (err.stack || err.message || err));
    queriesCache = [];
  }
}

loadDashboards();
loadQueries();

// simple hot reload if files change (optional)
fs.watch(path.dirname(DASHBOARDS_FILE), { persistent: false }, (event, filename) => {
  if (!filename) return;
  if (filename.toLowerCase().endsWith(".csv")) {
    try { loadDashboards(); } catch {}
  }
});
fs.watch(path.dirname(QUERIES_FILE), { persistent: false }, (event, filename) => {
  if (!filename) return;
  if (filename.toLowerCase().endsWith(".csv")) {
    try { loadQueries(); } catch {}
  }
});

// Global error handlers to surface crashes
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err && (err.stack || err.message || err));
});

// ---- Dev friendliness: allow Vite dev server origin ----
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// make CORS permissive for local dev too
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

// ---- API ----
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dashboards: dashboardsCache.length,
    queries: queriesCache.length,
    dashboardsFile: DASHBOARDS_FILE,
    queriesFile: QUERIES_FILE,
    updatedAt: new Date().toISOString(),
  });
});

app.get("/api/dashboards", (req, res) => {
  const search = safeStr(req.query.search).toLowerCase();
  let items = dashboardsCache;
  if (search) {
    items = items.filter((d) =>
      JSON.stringify(d).toLowerCase().includes(search)
    );
  }
  res.json({ count: items.length, items });
});

app.get("/api/dashboards/:id", (req, res) => {
  const id = safeStr(req.params.id);
  const found = dashboardsCache.find((d) => safeStr(d.id) === id);
  if (!found) return res.status(404).json({ error: "Dashboard not found", id });
  res.json(found);
});

app.get("/api/meta", (req, res) => {
  const uniq = (arr) => Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  res.json({
    gerencias: uniq(dashboardsCache.map((d) => safeStr(d.gerencia))),
    desarrolladores: uniq(dashboardsCache.map((d) => safeStr(d.desarrollador))),
    estados: uniq(dashboardsCache.map((d) => safeStr(d.estado))),
  });
});

app.get("/api/queries", (req, res) => {
  const search = safeStr(req.query.search).toLowerCase();
  const items = search
    ? queriesCache.filter((q) => `${q.nombre} ${q.tags.join(" ")}`.toLowerCase().includes(search))
    : queriesCache;
  res.json({ count: items.length, items, source: fs.existsSync(QUERIES_FILE) ? "csv" : "none" });
});

// Global error handler for express
app.use((err, req, res, next) => {
  console.error('Express error handler:', err && (err.stack || err.message || err));
  if (res.headersSent) return next(err);
  res.status(err && err.status ? err.status : 500).json({ error: err && (err.message || 'Internal Server Error') });
});

// ---- Static (production build) ----
const clientDist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.type("text").send(
`Client not built yet.
- Dev: run "npm run dev" and open http://localhost:5173
- Prod: run "npm run build" then "npm start" and open http://localhost:${PORT}`
    );
  });
}

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}/api/health`);
});
