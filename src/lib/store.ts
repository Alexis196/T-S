// Almacenamiento simple en archivos JSON (carpeta /data). Solo para uso en el servidor.
import { promises as fs } from "fs";
import path from "path";
import { seedProducts, type Product } from "@/data/products";
import type { Customer, Order, OrderItem, OrderStatus, PaymentMethod } from "./orders";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Cola para que las escrituras simultáneas no se pisen entre sí.
let queue: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw e;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

/* ---------- Productos ---------- */

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE, seedProducts);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export function saveProduct(product: Product): Promise<void> {
  return locked(async () => {
    const list = await getProducts();
    const i = list.findIndex((p) => p.slug === product.slug);
    if (i >= 0) list[i] = product;
    else list.push(product);
    await writeJson(PRODUCTS_FILE, list);
  });
}

export function removeProduct(slug: string): Promise<Product | undefined> {
  return locked(async () => {
    const list = await getProducts();
    const found = list.find((p) => p.slug === slug);
    await writeJson(
      PRODUCTS_FILE,
      list.filter((p) => p.slug !== slug),
    );
    return found;
  });
}

/* ---------- Imágenes subidas ---------- */

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export async function saveUploadedImage(file: File): Promise<string> {
  const sharp = (await import("sharp")).default;
  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input)
    .rotate()
    .resize(900, 900, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toBuffer();
  const name = `${crypto.randomUUID().replace(/-/g, "")}.jpg`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), output);
  return `/uploads/${name}`;
}

export async function deleteUploadedImage(url: string | undefined) {
  if (!url?.startsWith("/uploads/")) return;
  const name = path.basename(url);
  if (!/^[a-f0-9]{32}\.jpg$/.test(name)) return;
  await fs.rm(path.join(UPLOADS_DIR, name), { force: true });
}

/* ---------- Pedidos ---------- */

export async function getOrders(): Promise<Order[]> {
  const list = await readJson<Order[]>(ORDERS_FILE, []);
  return list.sort((a, b) => b.number - a.number);
}

export async function getOrder(number: number): Promise<Order | undefined> {
  return (await getOrders()).find((o) => o.number === number);
}

export function createOrder(customer: Customer, items: OrderItem[], payment: PaymentMethod): Promise<Order> {
  return locked(async () => {
    const list = await readJson<Order[]>(ORDERS_FILE, []);
    const order: Order = {
      number: list.reduce((max, o) => Math.max(max, o.number), 0) + 1,
      createdAt: new Date().toISOString(),
      status: "nuevo",
      customer,
      items,
      payment,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
    };
    list.push(order);
    await writeJson(ORDERS_FILE, list);
    return order;
  });
}

export function setOrderStatus(number: number, status: OrderStatus): Promise<void> {
  return locked(async () => {
    const list = await readJson<Order[]>(ORDERS_FILE, []);
    const order = list.find((o) => o.number === number);
    if (!order) return;
    order.status = status;
    await writeJson(ORDERS_FILE, list);
  });
}
