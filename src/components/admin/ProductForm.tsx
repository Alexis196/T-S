import { categories, type Product } from "@/data/products";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { saveProductAction } from "@/app/admin/actions";

export default function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const input = "w-full rounded-lg border-2 border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";
  const label = "mb-1 block text-xs font-bold";

  return (
    <form action={saveProductAction} className="max-w-3xl space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      {product && <input type="hidden" name="slug" value={product.slug} />}

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div>
        <label className={label} htmlFor="name">Nombre *</label>
        <input id="name" name="name" required defaultValue={product?.name} className={input} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="price">Precio ($) *</label>
          <input id="price" name="price" type="number" min="0" step="1" required defaultValue={product?.price} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="category">Categoría *</label>
          <select id="category" name="category" required defaultValue={product?.category ?? ""} className={input}>
            <option value="" disabled>Elegir…</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="size">Presentación</label>
          <input id="size" name="size" placeholder="500 ml, set de 6…" defaultValue={product?.size} className={input} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="description">Descripción</label>
        <textarea id="description" name="description" rows={3} defaultValue={product?.description} className={input} />
      </div>

      <div>
        <label className={label} htmlFor="features">Características (una por línea)</label>
        <textarea id="features" name="features" rows={4} defaultValue={product?.features.join("\n")} className={input} />
      </div>

      <div>
        <span className={label}>Foto</span>
        <div className="flex flex-wrap items-center gap-4">
          {product?.image && <ProductImage product={product} className="h-28 w-28 rounded-lg" />}
          <div className="space-y-2">
            <input name="image" type="file" accept="image/*" className="block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-tint file:px-4 file:py-2 file:font-bold file:text-brand" />
            <p className="text-xs text-muted">JPG, PNG o WebP, hasta 8 MB. Se recorta a formato cuadrado.</p>
            {product?.image && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="removeImage" /> Quitar la foto actual
              </label>
            )}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4" />
        Mostrar como destacado en el inicio
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
        <Link href="/admin/productos" className="rounded-lg border-2 border-line px-6 py-3 font-bold hover:border-brand">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
