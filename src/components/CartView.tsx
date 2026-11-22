"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, Check, CircleCheck, Landmark, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { useCart, setQty, removeFromCart, clearCart } from "@/lib/cart";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { PAYMENT_LABEL, type PaymentMethod } from "@/lib/orders";
import { validateCustomer } from "@/lib/validate";
import { placeOrder } from "@/app/carrito/actions";
import ProductImage from "@/components/ProductImage";

// Opcional: número de WhatsApp del negocio (código de país, sin + ni espacios) para avisar del pedido.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "";

const STEPS = ["Carrito", "Tus datos", "Pago"];

const empty = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  email: "",
  direccion: "",
  localidad: "",
  codigoPostal: "",
  notas: "",
};

const PAYMENT_OPTIONS: { id: PaymentMethod; icon: typeof Landmark; hint: string }[] = [
  {
    id: "transferencia",
    icon: Landmark,
    hint: "Al confirmar el pedido te pasamos los datos bancarios para que hagas la transferencia.",
  },
  {
    id: "efectivo",
    icon: Banknote,
    hint: "Pagás en efectivo cuando recibís o retirás tu pedido.",
  },
];

function Stepper({ current, allDone = false, onGo }: { current: number; allDone?: boolean; onGo?: (step: number) => void }) {
  return (
    <ol aria-label="Pasos de la compra" className="mx-auto mt-8 flex max-w-2xl items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = allDone || n < current;
        const active = !allDone && n === current;
        const clickable = !allDone && n < current && onGo;
        const circle = (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${
              done
                ? "bg-brand text-white"
                : active
                  ? "bg-brand text-white ring-4 ring-brand/20"
                  : "border-2 border-line bg-white text-muted"
            }`}
          >
            {done ? <Check size={18} strokeWidth={3} /> : n}
          </span>
        );
        const text = (
          <span className={`text-sm font-bold ${active || done ? "text-ink" : "text-muted"}`}>{label}</span>
        );
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? "step" : undefined}>
            {clickable ? (
              <button type="button" onClick={() => onGo(n)} className="flex items-center gap-2 hover:opacity-80">
                {circle}
                {text}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {circle}
                {text}
              </div>
            )}
            {i < STEPS.length - 1 && <span className={`mx-3 h-0.5 flex-1 rounded ${n < current || allDone ? "bg-brand" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

export default function CartView({ products }: { products: Product[] }) {
  const { items } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(empty);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ number: number; total: number; payment: PaymentMethod } | null>(null);

  const lines = items.flatMap((i) => {
    const product = products.find((p) => p.slug === i.slug);
    return product ? [{ product, qty: i.qty }] : [];
  });
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const units = lines.reduce((s, l) => s + l.qty, 0);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const goTo = (n: number) => {
    setError("");
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function submitData(e: React.FormEvent) {
    e.preventDefault();
    const invalid = validateCustomer(form);
    if (invalid) return setError(invalid);
    goTo(3);
  }

  async function confirm() {
    if (!payment) return setError("Elegí una forma de pago.");
    setError("");
    setSending(true);
    try {
      const res = await placeOrder({
        customer: form,
        payment,
        items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
      });
      if (res.ok) {
        setDone({ number: res.number, total, payment });
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.error);
      }
    } catch {
      setError("No pudimos enviar tu pedido. Intentá de nuevo en unos minutos.");
    } finally {
      setSending(false);
    }
  }

  /* ---------- Pedido confirmado ---------- */
  if (done) {
    const text = `Hola T&S Distribuidora, hice el pedido #${done.number} en la web (${formatPrice(done.total)}).`;
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-4">
        <Stepper current={3} allDone />
        <div className="mx-auto max-w-xl pt-12 text-center">
          <CircleCheck size={64} strokeWidth={1.5} className="mx-auto text-green-600" />
          <h1 className="mt-4 text-3xl font-extrabold">¡Recibimos tu pedido!</h1>
          <p className="mt-2 text-lg">
            Número de pedido: <strong className="text-brand">#{done.number}</strong>
          </p>
          <p className="mt-3 text-muted">
            {done.payment === "transferencia"
              ? "Nos vamos a comunicar con vos para pasarte los datos de la transferencia y coordinar la entrega."
              : "Nos vamos a comunicar con vos para coordinar la entrega. Pagás en efectivo al recibir o retirar."}{" "}
            Guardá el número de pedido.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {WHATSAPP && (
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Avisar por WhatsApp
              </a>
            )}
            <Link href="/productos" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Carrito vacío ---------- */
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-3 text-muted">Agrega productos para armar tu pedido.</p>
        <Link href="/productos" className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark">
          Ver productos
        </Link>
      </div>
    );
  }

  const input = "w-full rounded-lg border-2 border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";
  const label = "mb-1 block text-xs font-bold";
  const primary =
    "w-full rounded-lg bg-brand py-3.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60";
  const secondary =
    "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-line px-5 py-3 font-bold hover:border-brand hover:text-brand";
  const errorBox = error && (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
      {error}
    </p>
  );

  const totalRow = (
    <div className="flex items-center justify-between text-lg font-extrabold">
      <span>Total</span>
      <span>{formatPrice(total)}</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4">
      <Stepper current={step} onGo={goTo} />

      {/* ---------- Paso 1: confirmar productos ---------- */}
      {step === 1 && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="border-l-4 border-brand pl-3 text-3xl font-extrabold">Confirmá tus productos</h1>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex items-center gap-4 py-4">
                  <ProductImage product={product} className="h-20 w-20 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/productos/${product.slug}`} className="font-semibold hover:text-brand">{product.name}</Link>
                    <p className="text-xs text-muted">{product.size}</p>
                    <p className="mt-1 text-sm">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center rounded-lg border border-line">
                    <button type="button" aria-label="Menos" onClick={() => setQty(product.slug, qty - 1)} className="p-2 hover:text-brand"><Minus size={14} /></button>
                    <span className="w-7 text-center text-sm font-bold">{qty}</span>
                    <button type="button" aria-label="Más" onClick={() => setQty(product.slug, qty + 1)} className="p-2 hover:text-brand"><Plus size={14} /></button>
                  </div>
                  <p className="hidden w-24 text-right font-bold sm:block">{formatPrice(product.price * qty)}</p>
                  <button type="button" aria-label="Quitar" onClick={() => removeFromCart(product.slug)} className="p-2 text-muted hover:text-accent">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/productos" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
              <ArrowLeft size={16} /> Seguir comprando
            </Link>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl bg-tint p-6">
            <p className="text-sm text-muted">
              {units} {units === 1 ? "producto" : "productos"}
            </p>
            {totalRow}
            <button type="button" onClick={() => goTo(2)} className={primary}>
              Confirmar productos
            </button>
            <p className="text-center text-xs text-muted">En el próximo paso completás tus datos.</p>
          </aside>
        </div>
      )}

      {/* ---------- Paso 2: datos personales ---------- */}
      {step === 2 && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submitData} noValidate className="space-y-4">
            <h1 className="border-l-4 border-brand pl-3 text-3xl font-extrabold">Tus datos</h1>
            <p className="text-sm text-muted">Los usamos para preparar y entregar tu pedido.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="nombre">Nombre *</label>
                <input id="nombre" required autoComplete="given-name" value={form.nombre} onChange={set("nombre")} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="apellido">Apellido *</label>
                <input id="apellido" required autoComplete="family-name" value={form.apellido} onChange={set("apellido")} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="dni">DNI *</label>
                <input id="dni" required inputMode="numeric" placeholder="Sin puntos" value={form.dni} onChange={set("dni")} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="telefono">Teléfono *</label>
                <input id="telefono" required type="tel" autoComplete="tel" value={form.telefono} onChange={set("telefono")} className={input} />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="email">Email (opcional)</label>
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="direccion">Dirección (calle, número, piso/depto) *</label>
              <input id="direccion" required autoComplete="street-address" value={form.direccion} onChange={set("direccion")} className={input} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="localidad">Localidad *</label>
                <input id="localidad" required autoComplete="address-level2" value={form.localidad} onChange={set("localidad")} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="cp">Código postal *</label>
                <input id="cp" required autoComplete="postal-code" value={form.codigoPostal} onChange={set("codigoPostal")} className={input} />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="notas">Notas (opcional)</label>
              <textarea id="notas" rows={2} value={form.notas} onChange={set("notas")} className={input} />
            </div>

            {errorBox}

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={() => goTo(1)} className={secondary}>
                <ArrowLeft size={16} /> Volver al carrito
              </button>
              <button type="submit" className="flex-1 rounded-lg bg-brand px-6 py-3.5 font-bold text-white hover:bg-brand-dark">
                Continuar al pago
              </button>
            </div>
          </form>

          <aside className="h-fit space-y-4 rounded-2xl bg-tint p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide">Tu pedido</h2>
            <ul className="space-y-2 text-sm">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex justify-between gap-3">
                  <span>{qty} × {product.name}</span>
                  <span className="shrink-0 font-semibold">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-4">{totalRow}</div>
          </aside>
        </div>
      )}

      {/* ---------- Paso 3: pago ---------- */}
      {step === 3 && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <h1 className="border-l-4 border-brand pl-3 text-3xl font-extrabold">Pago</h1>
            <p className="text-sm text-muted">Elegí cómo querés pagar tu pedido.</p>

            <div role="radiogroup" aria-label="Forma de pago" className="space-y-3">
              {PAYMENT_OPTIONS.map(({ id, icon: Icon, hint }) => {
                const selected = payment === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setPayment(id);
                      setError("");
                    }}
                    className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition ${
                      selected ? "border-brand bg-tint" : "border-line bg-white hover:border-brand/50"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-brand text-white" : "bg-tint text-brand"}`}>
                      <Icon size={20} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold">{PAYMENT_LABEL[id]}</span>
                      <span className="mt-0.5 block text-sm text-muted">{hint}</span>
                    </span>
                    <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-brand bg-brand text-white" : "border-line"}`}>
                      {selected && <Check size={12} strokeWidth={4} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {errorBox}

            <button type="button" onClick={() => goTo(2)} className={secondary}>
              <ArrowLeft size={16} /> Volver a mis datos
            </button>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl bg-tint p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide">Resumen</h2>
            <ul className="space-y-2 text-sm">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex justify-between gap-3">
                  <span>{qty} × {product.name}</span>
                  <span className="shrink-0 font-semibold">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-line pt-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{form.nombre} {form.apellido}</p>
                  <p className="text-muted">DNI {form.dni}</p>
                  <p className="text-muted">{form.direccion}</p>
                  <p className="text-muted">{form.localidad} ({form.codigoPostal.toUpperCase()})</p>
                  <p className="text-muted">Tel. {form.telefono}</p>
                </div>
                <button type="button" onClick={() => goTo(2)} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand hover:underline">
                  <Pencil size={12} /> Editar
                </button>
              </div>
            </div>

            <div className="border-t border-line pt-4">{totalRow}</div>
            <button type="button" onClick={confirm} disabled={sending} className={primary}>
              {sending ? "Enviando..." : "Confirmar pedido"}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
