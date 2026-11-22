"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

export default function ProductPurchase({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="flex items-center rounded border border-line">
        <button type="button" aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-brand">
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-bold">{qty}</span>
        <button type="button" aria-label="Más" onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-brand">
          <Plus size={14} />
        </button>
      </div>
      <AddToCartButton slug={slug} qty={qty} className="flex-1 py-3.5" />
    </div>
  );
}
