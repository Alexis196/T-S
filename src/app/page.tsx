import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, GlassWater, Layers, ShieldCheck, ShoppingCart, SprayCan, Timer, Wine } from "lucide-react";
import { getProducts } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const tiles = [
  { slug: "copas", label: "Copas", icon: Wine, image: "/products/10445929.jpg" },
  { slug: "vasos", label: "Vasos", icon: GlassWater, image: "/products/17889085.jpg" },
  { slug: "vajilla", label: "Vajilla", icon: Layers, image: "/products/18977904.jpg" },
  { slug: "accesorios", label: "Limpieza y accesorios", icon: SprayCan, image: "/products/28576636.jpg" },
];

const benefits = [
  { icon: ShieldCheck, title: "Desinfectante", text: "Elimina el 99,9% de los gérmenes." },
  { icon: Timer, title: "Higieniza en segundos", text: "Fórmulas de acción rápida." },
  { icon: BadgeCheck, title: "Calidad garantizada", text: "Productos de primeras marcas." },
];

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="border-l-4 border-brand pl-3 text-2xl font-extrabold">{children}</h2>
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const marked = products.filter((p) => p.featured);
  const featured = (marked.length ? marked : products).slice(0, 6);

  return (
    <>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-tint">
        <Image
          src="/hero/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[70%_62%]"
        />
        <div className="absolute inset-0 -z-10 bg-white/75 md:hidden" />
        <div className="absolute inset-0 -z-10 hidden bg-linear-to-r from-white from-30% via-white/55 via-55% to-white/0 md:block" />
        <div className="mx-auto flex min-h-[340px] max-w-7xl items-center px-4 py-14 md:min-h-[420px]">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Productos de limpieza para tu hogar o negocio
            </h1>
            <p className="mt-4 text-lg text-muted">Calidad, variedad y los mejores precios en un solo lugar.</p>
            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-3 rounded-lg bg-brand px-7 py-4 font-bold text-white shadow-sm hover:bg-brand-dark"
            >
              <ShoppingCart size={22} /> Comprar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <Heading>Comprá por categoría</Heading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ slug, label, icon: Icon, image }) => (
            <Link
              key={slug}
              href={`/categoria/${slug}`}
              className="relative flex h-28 items-center overflow-hidden rounded-2xl bg-tint pl-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative z-10 flex items-center gap-3 font-bold leading-tight">
                <Icon size={32} strokeWidth={1.5} className="shrink-0 text-brand" />
                <span className="max-w-24">{label}</span>
              </div>
              <div className="absolute inset-y-0 right-0 w-3/5">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-tint from-10% via-tint/60 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <Heading>Productos destacados</Heading>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/productos" className="font-bold text-brand underline underline-offset-4">
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <div className="grid gap-4 rounded-2xl bg-tint p-6 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                <Icon size={28} strokeWidth={1.6} />
              </div>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
