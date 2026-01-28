import React, { useEffect, useState } from "react";
import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";

export default function QueryModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => setCopied(false), [open]);

  if (!open) return null;

  const sql = open.sql || "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = sql;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-black/5">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-muted">Query</div>
            <div className="text-lg font-black tracking-tight mt-1">{open.nombre}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl" onClick={copy}>{copied ? "Copiado ✓" : "Copiar"}</Button>
            <Button className="rounded-2xl" variant="ghost" onClick={onClose}>Cerrar</Button>
          </div>
        </div>

        <pre className="p-5 text-xs overflow-auto max-h-[70vh] bg-black/[0.02]"><code className="whitespace-pre">{sql}</code></pre>
      </Card>
    </div>
  );
}
