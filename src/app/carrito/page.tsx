import type { Metadata } from "next";
import { getProducts } from "@/lib/store";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Mi carrito | T&S Distribuidora" };
export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  const products = await getProducts();
  return <CartView products={products} />;
}
