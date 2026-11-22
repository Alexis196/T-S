"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href === "/productos" ? pathname.startsWith("/productos") || pathname.startsWith("/categoria") : false;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="T&S Distribuidora - Inicio" className="shrink-0">
          <Image src="/logo.jpg" alt="T&S Distribuidora" width={852} height={780} priority unoptimized className="h-[72px] w-auto" />
        </Link>

        <nav className="flex h-full items-center gap-6 text-[15px] font-bold sm:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex h-full items-center border-b-2 ${
                isActive(l.href) ? "border-brand text-brand" : "border-transparent hover:text-brand"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos");
            }}
            className="relative hidden md:block"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              name="q"
              placeholder="Buscar productos..."
              className="w-64 rounded-full border-2 border-line bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand lg:w-80"
            />
          </form>
          <Link href="/carrito" className="relative p-1.5 hover:text-brand" aria-label={`Carrito, ${count} productos`}>
            <ShoppingCart size={28} strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
