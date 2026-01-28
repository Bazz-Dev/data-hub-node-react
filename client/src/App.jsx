import React, { useEffect, useMemo, useState } from "react";
import TopNav from "./components/TopNav.jsx";
import DashboardsView from "./components/DashboardsView.jsx";
import DashboardDetailView from "./components/DashboardDetailView.jsx";
import QueriesView from "./components/QueriesView.jsx";

function parseHash() {
  const hash = window.location.hash || "#/dashboards";
  // #/dashboard/<id>
  const m = hash.match(/^#\/dashboard\/(.+)$/);
  if (m) return { route: "detail", id: decodeURIComponent(m[1]) };
  if (hash.startsWith("#/queries")) return { route: "queries" };
  return { route: "dashboards" };
}

export default function App() {
  const [loc, setLoc] = useState(parseHash());

  useEffect(() => {
    const onHash = () => setLoc(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const activeTab = loc.route === "queries" ? "queries" : "dashboards";

  return (
    <div className="min-h-screen">
      <TopNav active={activeTab} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {loc.route === "dashboards" && <DashboardsView />}
        {loc.route === "detail" && <DashboardDetailView id={loc.id} />}
        {loc.route === "queries" && <QueriesView />}
      </main>
    </div>
  );
}
