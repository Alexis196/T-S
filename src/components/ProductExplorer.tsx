"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, type Category, type Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductExplorer({
  products,
  initialCat = "Todos",
}: {
  products: Product[];
  initialCat?: Category | "Todos";
}) {
  const [cat, setCat] = useState<Category | "Todos">(initialCat);
  const q = (useSearchParams().get("q") ?? "").trim();

  const list = useMemo(() => {
    const term = q.toLowerCase();
    return products.filter(
      (p) =>
        (cat === "Todos" || p.category === cat) &&
        (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)),
    );
  }, [products, cat, q]);

  const chip = (active: boolean) =>
    `rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand"
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(["Todos", ...categories] as const).map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={chip(cat === c)}>
            {c}
          </button>
        ))}
      </div>

      {q && (
        <p className="mt-6 text-sm text-muted">
          Resultados para <strong className="text-ink">“{q}”</strong> ·{" "}
          <Link href="/productos" className="font-bold text-brand underline underline-offset-2">
            Quitar búsqueda
          </Link>
        </p>
      )}

      {list.length === 0 ? (
        <p className="py-20 text-center text-muted">No encontramos productos con esa búsqueda.</p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
