import Link from "next/link";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { getProducts } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteProductAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage({ searchParams }: PageProps<"/admin/productos">) {
  const { ok } = await searchParams;
  const products = await getProducts();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Productos ({products.length})</h1>
        <Link href="/admin/productos/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-dark">
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      {ok && (
        <p role="status" className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {ok === "2" ? "Producto eliminado." : "Producto guardado."}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 text-right">Precio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.slug} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage product={p} className="h-14 w-14 shrink-0 rounded-lg" />
                    <div>
                      <p className="flex items-center gap-1.5 font-bold">
                        {p.name}
                        {p.featured && <Star size={14} className="fill-amber-400 text-amber-400" aria-label="Destacado" />}
                      </p>
                      <p className="text-xs text-muted">{p.size}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3 text-right font-bold">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/productos/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-line px-3 py-1.5 font-bold hover:border-brand hover:text-brand">
                      <Pencil size={14} /> Editar
                    </Link>
                    <form action={deleteProductAction.bind(null, p.slug)}>
                      <ConfirmButton
                        message={`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-line px-3 py-1.5 font-bold hover:border-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} /> Eliminar
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
