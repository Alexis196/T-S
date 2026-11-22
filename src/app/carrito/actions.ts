"use server";

import { createOrder, getProducts } from "@/lib/store";
import { PAYMENTS, type Customer, type OrderItem, type PaymentMethod } from "@/lib/orders";
import { cleanDni, validateCustomer } from "@/lib/validate";

export type PlaceOrderResult = { ok: true; number: number } | { ok: false; error: string };

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const data = (input ?? {}) as Record<string, unknown>;
  const c = (data.customer ?? {}) as Record<string, unknown>;

  const customer: Customer = {
    nombre: str(c.nombre, 60),
    apellido: str(c.apellido, 60),
    dni: cleanDni(str(c.dni, 20)),
    telefono: str(c.telefono, 30),
    email: str(c.email, 120),
    direccion: str(c.direccion, 160),
    localidad: str(c.localidad, 80),
    codigoPostal: str(c.codigoPostal, 12).toUpperCase(),
    notas: str(c.notas, 500),
  };

  const invalid = validateCustomer(customer);
  if (invalid) return { ok: false, error: invalid };

  const payment = data.payment as PaymentMethod;
  if (!PAYMENTS.includes(payment)) return { ok: false, error: "Elegí una forma de pago." };

  if (!Array.isArray(data.items) || data.items.length === 0) return { ok: false, error: "Tu carrito está vacío." };

  // Los precios y nombres se toman del catálogo del servidor, nunca del navegador.
  const catalog = new Map((await getProducts()).map((p) => [p.slug, p]));
  const items: OrderItem[] = [];
  for (const raw of data.items as Record<string, unknown>[]) {
    const product = catalog.get(String(raw?.slug));
    const qty = Math.floor(Number(raw?.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 999) continue;
    items.push({ slug: product.slug, name: product.name, size: product.size, price: product.price, qty });
  }
  if (items.length === 0) return { ok: false, error: "Los productos de tu carrito ya no están disponibles." };

  const order = await createOrder(customer, items, payment);
  return { ok: true, number: order.number };
}
