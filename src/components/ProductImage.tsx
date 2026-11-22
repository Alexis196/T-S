import Image from "next/image";
import type { Product } from "@/data/products";

// Muestra la foto del producto; si no tiene, una ilustración provisoria de envase.
export default function ProductImage({
  product,
  className = "",
  priority = false,
}: {
  product: Pick<Product, "color" | "name" | "image">;
  className?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={`relative overflow-hidden bg-tint ${className}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          // Las fotos subidas desde el panel ya vienen redimensionadas.
          unoptimized={product.image.startsWith("/uploads/")}
          sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }
  const color = product.color ?? "#1b5fb0";
  return (
    <div className={`relative flex items-center justify-center bg-tint ${className}`} role="img" aria-label={product.name}>
      <svg viewBox="0 0 120 160" className="h-[78%] w-auto drop-shadow-sm">
        <rect x="44" y="6" width="32" height="12" rx="3" fill="#cfd8e6" />
        <rect x="54" y="18" width="12" height="12" fill="#e4eaf3" />
        <rect x="30" y="30" width="60" height="120" rx="14" fill="#ffffff" stroke="#cfd8e6" strokeWidth="2" />
        <rect x="34" y="70" width="52" height="74" rx="10" fill={color} opacity="0.16" />
        <circle cx="60" cy="96" r="17" fill={color} />
        <path d="M50 96h20M60 86v20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
