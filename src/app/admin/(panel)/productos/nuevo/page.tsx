import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage({ searchParams }: PageProps<"/admin/productos/nuevo">) {
  const { error } = await searchParams;
  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold">Nuevo producto</h1>
      <ProductForm error={typeof error === "string" ? error : undefined} />
    </>
  );
}
