import { notFound } from "next/navigation";
import { getProduct } from "@/lib/store";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params, searchParams }: PageProps<"/admin/productos/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const product = await getProduct(slug);
  if (!product) notFound();
  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold">Editar producto</h1>
      <ProductForm product={product} error={typeof error === "string" ? error : undefined} />
    </>
  );
}
