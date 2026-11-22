"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

export default function PrintButton({ auto = false, label = "Imprimir" }: { auto?: boolean; label?: string }) {
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => window.print(), 500);
    return () => clearTimeout(t);
  }, [auto]);

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
    >
      <Printer size={16} /> {label}
    </button>
  );
}
