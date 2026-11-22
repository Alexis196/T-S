import Link from "next/link";
import { Eye, Printer, Tag } from "lucide-react";
import { getOrders } from "@/lib/store";
import { STATUSES, STATUS_LABEL, STATUS_STYLE, type OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PedidosPage({ searchParams }: PageProps<"/admin">) {
  const { estado } = await searchParams;
  const filter = STATUSES.find((s) => s === estado);
  const all = await getOrders();
  const orders = filter ? all.filter((o) => o.status === filter) : all;
  const count = (s: OrderStatus) => all.filter((o) => o.status === s).length;

  const chip = (active: boolean) =>
    `rounded-full border-2 px-4 py-1.5 text-sm font-bold ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"
    }`;

  return (
    <>
      <h1 className="text-3xl font-extrabold">Pedidos</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/admin" className={chip(!filter)}>Todos ({all.length})</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin?estado=${s}`} className={chip(filter === s)}>
            {STATUS_LABEL[s]} ({count(s)})
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted shadow-sm">
          {all.length === 0 ? "Todavía no hay pedidos." : "No hay pedidos con ese estado."}
        </p>
      ) : (
        <>
        <div className="mt-6 hidden overflow-x-auto rounded-2xl bg-white shadow-sm md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">N°</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Localidad / CP</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.number} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-extrabold">#{o.number}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(o.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {o.customer.nombre} {o.customer.apellido}
                  </td>
                  <td className="px-4 py-3">{o.customer.dni}</td>
                  <td className="px-4 py-3">
                    {o.customer.localidad} ({o.customer.codigoPostal})
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/pedidos/${o.number}`} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-line px-3 py-1.5 font-bold hover:border-brand hover:text-brand">
                        <Eye size={14} /> Ver
                      </Link>
                      <Link href={`/admin/pedidos/${o.number}?imprimir=1`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 font-bold text-white hover:bg-brand-dark">
                        <Printer size={14} /> Factura
                      </Link>
                      <Link href={`/admin/pedidos/${o.number}/ticket?imprimir=1`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-bold text-white hover:bg-slate-900">
                        <Tag size={14} /> Ticket
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Móvil: tarjetas en lugar de tabla */}
        <ul className="mt-6 space-y-3 md:hidden">
          {orders.map((o) => (
            <li key={o.number} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold">#{o.number}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
              </div>
              <p className="mt-2 font-semibold">{o.customer.nombre} {o.customer.apellido}</p>
              <p className="text-sm text-muted">DNI {o.customer.dni} · {o.customer.localidad} ({o.customer.codigoPostal})</p>
              <p className="text-sm text-muted">
                {new Date(o.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
              </p>
              <p className="mt-1 text-lg font-extrabold">{formatPrice(o.total)}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <Link href={`/admin/pedidos/${o.number}`} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-line px-3 py-2 font-bold"><Eye size={14} /> Ver</Link>
                <Link href={`/admin/pedidos/${o.number}?imprimir=1`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 font-bold text-white"><Printer size={14} /> Factura</Link>
                <Link href={`/admin/pedidos/${o.number}/ticket?imprimir=1`} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 font-bold text-white"><Tag size={14} /> Ticket</Link>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </>
  );
}
