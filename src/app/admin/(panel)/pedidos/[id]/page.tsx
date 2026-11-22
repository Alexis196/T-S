import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getOrder } from "@/lib/store";
import { PAYMENT_LABEL, STATUSES, STATUS_LABEL, STATUS_STYLE } from "@/lib/orders";
import { BUSINESS, DOCUMENT_LETTER, DOCUMENT_NOTE } from "@/lib/business";
import { formatPrice } from "@/lib/format";
import PrintButton from "@/components/admin/PrintButton";
import { setStatusAction } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function PedidoPage({ params, searchParams }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  const { imprimir } = await searchParams;
  const order = await getOrder(Number(id));
  if (!order) notFound();
  const c = order.customer;
  const numero = String(order.number).padStart(8, "0");
  const fecha = new Date(order.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Dato con etiqueta en línea, estilo comprobante.
  const item = (label: string, value: string) => (
    <p className="leading-snug">
      <span className="font-bold">{label}: </span>
      {value || "—"}
    </p>
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="inline-flex items-center gap-2 font-bold hover:text-brand">
            <ArrowLeft size={18} /> Volver a pedidos
          </Link>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form action={setStatusAction.bind(null, order.number)} className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={order.status}
              className="rounded-lg border-2 border-line bg-white px-3 py-2 text-sm font-bold"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
            <button type="submit" className="rounded-lg border-2 border-brand px-4 py-2 text-sm font-bold text-brand hover:bg-tint">
              Cambiar estado
            </button>
          </form>
          <Link
            href={`/admin/pedidos/${order.number}/ticket`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-900"
          >
            <Tag size={16} /> Ticket de envío
          </Link>
          <PrintButton auto={imprimir === "1"} label="Imprimir factura" />
        </div>
      </div>

      {/* Comprobante (formato inspirado en una factura de ARCA) */}
      <article className="mx-auto max-w-[190mm] bg-white p-6 text-[11px] text-black shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <p className="border border-b-0 border-black py-1 text-center text-xs font-bold tracking-widest">ORIGINAL</p>

        {/* Cabecera: comercio | letra | comprobante */}
        <header className="relative grid grid-cols-1 border border-black sm:grid-cols-2">
          <div className="border-b border-black p-3 sm:border-b-0 sm:border-r sm:pr-12">
            <Image src="/logo.jpg" alt="T&S Distribuidora" width={852} height={780} unoptimized className="h-14 w-auto" />
            <p className="mt-1 text-sm font-extrabold">{BUSINESS.razonSocial}</p>
            <p className="mt-1">
              <span className="font-bold">Domicilio: </span>
              {BUSINESS.domicilio}
            </p>
            <p>
              <span className="font-bold">Condición frente al IVA: </span>
              {BUSINESS.condicionIva}
            </p>
            <p>{BUSINESS.telefono} · {BUSINESS.email}</p>
          </div>

          {/* Cuadro con la letra del comprobante */}
          <div className="mx-auto w-14 border-x border-b border-black bg-white text-center sm:absolute sm:left-1/2 sm:top-0 sm:-translate-x-1/2">
            <p className="text-3xl font-extrabold leading-none pt-1">{DOCUMENT_LETTER}</p>
            <p className="pb-1 text-[8px] font-bold leading-tight">COD. 00</p>
          </div>

          <div className="p-3 sm:pl-12">
            <p className="text-xl font-extrabold leading-tight">PEDIDO</p>
            <p className="mt-1 text-sm font-bold">N° {numero}</p>
            {item("Fecha de emisión", fecha)}
            <p className="mt-1.5 leading-snug"><span className="font-bold">CUIT: </span>{BUSINESS.cuit}</p>
            <p className="leading-snug"><span className="font-bold">Ingresos Brutos: </span>{BUSINESS.ingresosBrutos}</p>
            <p className="leading-snug"><span className="font-bold">Inicio de actividades: </span>{BUSINESS.inicioActividades}</p>
          </div>
        </header>

        {/* Datos del cliente (compactos) */}
        <section className="mt-2 border border-black px-3 py-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-[1.6fr_1fr]">
            {item("Apellido y nombre", `${c.apellido} ${c.nombre}`)}
            {item("DNI", c.dni)}
            {item("Domicilio", c.direccion)}
            {item("Localidad", `${c.localidad} (C.P. ${c.codigoPostal})`)}
            {item("Teléfono", c.telefono)}
            {item("Email", c.email)}
            {item("Condición de venta", order.payment ? PAYMENT_LABEL[order.payment] : "")}
          </div>
          {c.notas && (
            <p className="mt-1 border-t border-slate-300 pt-1 leading-snug">
              <span className="font-bold">Observaciones: </span>
              <span className="whitespace-pre-line">{c.notas}</span>
            </p>
          )}
        </section>

        {/* Detalle */}
        <table className="mt-2 w-full border border-black text-left">
          <thead className="bg-slate-200 print:bg-slate-200">
            <tr className="border-b border-black">
              <th className="px-2 py-1">Producto / Servicio</th>
              <th className="w-14 px-2 py-1 text-right">Cant.</th>
              <th className="w-24 px-2 py-1 text-right">Precio unit.</th>
              <th className="w-24 px-2 py-1 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.slug} className="border-b border-slate-300 last:border-b-0">
                <td className="px-2 py-1">
                  {i.name} <span className="text-slate-500">— {i.size}</span>
                </td>
                <td className="px-2 py-1 text-right">{i.qty}</td>
                <td className="px-2 py-1 text-right">{formatPrice(i.price)}</td>
                <td className="px-2 py-1 text-right">{formatPrice(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 flex justify-end">
          <div className="flex w-72 items-center justify-between border border-black px-3 py-1.5 text-sm font-extrabold">
            <span>Importe total:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <p className="mt-6 border-t border-slate-400 pt-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {DOCUMENT_NOTE}
        </p>
      </article>
    </>
  );
}
