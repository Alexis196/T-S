import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categoryFromSlug } from "@/data/products";
import { getProducts } from "@/lib/store";
import ProductExplorer from "@/components/ProductExplorer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  return { title: cat ? `${cat} | T&S Distribuidora` : "Categoría no encontrada" };
}

export default async function CategoriaPage({ params }: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const cat = categoryFromSlug(slug);
  if (!cat) notFound();
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="border-l-4 border-brand pl-3 text-3xl font-extrabold">{cat}</h1>
      <p className="mb-8 mt-3 text-muted">Productos de la categoría {cat.toLowerCase()}.</p>
      <Suspense>
        <ProductExplorer products={products} initialCat={cat} />
      </Suspense>
    </div>
  );
}
