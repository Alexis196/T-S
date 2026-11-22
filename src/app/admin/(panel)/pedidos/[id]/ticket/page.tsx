import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/store";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

// Ticket de envío: solo los datos que necesita el correo/transportista.
// A propósito NO incluye DNI, teléfono, email, notas ni precios.
export default async function TicketPage({ params, searchParams }: PageProps<"/admin/pedidos/[id]/ticket">) {
  const { id } = await params;
  const { imprimir } = await searchParams;
  const order = await getOrder(Number(id));
  if (!order) notFound();
  const c = order.customer;

  const row = (label: string, value: string, big = false) => (
    <div className="border-b border-slate-300 py-3 last:border-b-0">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-1 break-words font-extrabold leading-tight ${big ? "text-4xl tracking-wider" : "text-2xl"}`}>{value}</p>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href={`/admin/pedidos/${order.number}`} className="inline-flex items-center gap-2 font-bold hover:text-brand">
          <ArrowLeft size={18} /> Volver al pedido
        </Link>
        <PrintButton auto={imprimir === "1"} label="Imprimir ticket de envío" />
      </div>

      <article className="mx-auto w-full max-w-[105mm] rounded-2xl border-2 border-slate-800 bg-white p-5 shadow-sm print:mx-0 print:rounded-none print:shadow-none">
        <p className="text-xs font-extrabold uppercase tracking-widest">Pedido #{order.number}</p>
        <div className="mt-2">
          {row("Nombre", c.nombre)}
          {row("Apellido", c.apellido)}
          {row("Dirección", c.direccion)}
          {row("Código postal", c.codigoPostal, true)}
        </div>
      </article>
    </>
  );
}
