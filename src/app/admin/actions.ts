"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authConfigured, checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  deleteUploadedImage,
  getProduct,
  getProducts,
  removeProduct,
  saveProduct,
  saveUploadedImage,
  setOrderStatus,
} from "@/lib/store";
import { categories, type Category, type Product } from "@/data/products";
import { STATUSES, type OrderStatus } from "@/lib/orders";

/* ---------- Sesión ---------- */

export async function loginAction(formData: FormData) {
  if (!authConfigured()) redirect("/admin/login?error=config");
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 600)); // frena intentos automáticos
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Pedidos ---------- */

export async function setStatusAction(number: number, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as OrderStatus;
  if (!STATUSES.includes(status)) return;
  await setOrderStatus(number, status);
  revalidatePath("/admin", "layout");
}

/* ---------- Productos ---------- */

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "producto";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const slugIn = text(formData, "slug");
  const existing = slugIn ? await getProduct(slugIn) : undefined;
  const back = existing ? `/admin/productos/${existing.slug}` : "/admin/productos/nuevo";
  const fail = (msg: string): never => redirect(`${back}?error=${encodeURIComponent(msg)}`);

  const name = text(formData, "name");
  const price = Number(text(formData, "price").replace(",", "."));
  const category = text(formData, "category") as Category;
  if (name.length < 2) fail("Ingresá el nombre del producto.");
  if (!Number.isFinite(price) || price < 0) fail("Ingresá un precio válido.");
  if (!categories.includes(category)) fail("Elegí una categoría.");

  let image = existing?.image;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) fail("El archivo tiene que ser una imagen.");
    if (file.size > 8 * 1024 * 1024) fail("La imagen pesa más de 8 MB.");
    let uploaded: string;
    try {
      uploaded = await saveUploadedImage(file);
    } catch {
      return fail("No se pudo procesar la imagen. Probá con un JPG o PNG.");
    }
    await deleteUploadedImage(existing?.image);
    image = uploaded;
  } else if (formData.get("removeImage") === "on") {
    await deleteUploadedImage(existing?.image);
    image = undefined;
  }

  let slug = existing?.slug;
  if (!slug) {
    const taken = new Set((await getProducts()).map((p) => p.slug));
    const base = slugify(name);
    slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  }

  const product: Product = {
    slug,
    name,
    price: Math.round(price),
    category,
    size: text(formData, "size"),
    description: text(formData, "description"),
    features: text(formData, "features")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    ...(image ? { image } : {}),
    ...(existing?.color ? { color: existing.color } : {}),
  };

  await saveProduct(product);
  revalidatePath("/", "layout");
  redirect("/admin/productos?ok=1");
}

export async function deleteProductAction(slug: string) {
  await requireAdmin();
  const removed = await removeProduct(slug);
  await deleteUploadedImage(removed?.image);
  revalidatePath("/", "layout");
  redirect("/admin/productos?ok=2");
}
