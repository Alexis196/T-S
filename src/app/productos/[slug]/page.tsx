import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { getProduct, getProducts } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import ProductPurchase from "@/components/ProductPurchase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? `${product.name} | T&S Distribuidora` : "Producto no encontrado" };
}

export default async function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-xs text-muted">
        <Link href="/productos" className="hover:text-brand">Productos</Link> / {product.category} / {product.name}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductImage product={product} priority className="aspect-square rounded-2xl" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{product.category}</p>
          <h1 className="mt-1 text-3xl font-extrabold">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.size}</p>
          <p className="mt-4 text-3xl font-bold text-brand">{formatPrice(product.price)}</p>
          <p className="mt-5 text-muted">{product.description}</p>
          <ul className="mt-5 space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand" /> {f}
              </li>
            ))}
          </ul>
          <ProductPurchase slug={product.slug} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="border-l-4 border-brand pl-3 text-2xl font-extrabold">También te puede interesar</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
