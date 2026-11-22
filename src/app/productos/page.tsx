import type { Metadata } from "next";
import { Suspense } from "react";
import ProductExplorer from "@/components/ProductExplorer";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Productos | T&S Distribuidora" };
export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="border-l-4 border-brand pl-3 text-3xl font-extrabold">Productos</h1>
      <p className="mb-8 mt-3 text-muted">Limpieza, vajilla, copas y vasos para tu hogar y tu negocio.</p>
      <Suspense>
        <ProductExplorer products={products} />
      </Suspense>
    </div>
  );
}
