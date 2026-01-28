import React from "react";
import Container from "./ui/Container.jsx";
import Button from "./ui/Button.jsx";

export default function TopNav({ active }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
      <Container className="py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black shadow-soft">DH</div>
          <div>
            <div className="font-extrabold tracking-tight">Data Hub</div>
            <div className="text-xs text-muted">Dashboards · Queries · Contexto</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button as="a" href="#/dashboards" variant={active === "dashboards" ? "solid" : "ghost"} className="px-3 py-2 rounded-xl text-sm font-bold">Dashboards</Button>
          <Button as="a" href="#/queries" variant={active === "queries" ? "solid" : "ghost"} className="px-3 py-2 rounded-xl text-sm font-bold">Queries</Button>
        </nav>
      </Container>
    </header>
  );
}
