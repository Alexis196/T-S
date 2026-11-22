import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-line bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link href={`/productos/${product.slug}`} className="block w-32 shrink-0 sm:w-36">
        <ProductImage product={product} className="aspect-square rounded-xl" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <Link href={`/productos/${product.slug}`} className="block text-[15px] font-bold leading-snug hover:text-brand">
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted">{product.size}</p>
          <p className="mt-1 text-xl font-extrabold text-brand">{formatPrice(product.price)}</p>
        </div>
        <AddToCartButton slug={product.slug} className="mt-2 w-full" />
      </div>
    </div>
  );
}
