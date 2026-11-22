"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({
  slug,
  qty = 1,
  className = "",
}: {
  slug: string;
  qty?: number;
  className?: string;
}) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(slug, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-brand-dark ${className}`}
    >
      {added ? <Check size={16} /> : <ShoppingCart size={16} />}
      {added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
