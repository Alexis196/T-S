"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Pedidos", match: (p: string) => p === "/admin" || p.startsWith("/admin/pedidos") },
  { href: "/admin/productos", label: "Productos", match: (p: string) => p.startsWith("/admin/productos") },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-lg px-4 py-2 text-sm font-bold ${
            l.match(pathname) ? "bg-brand text-white" : "text-ink hover:bg-tint"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
