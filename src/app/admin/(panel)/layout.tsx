import Image from "next/image";
import Link from "next/link";
import { LogOut, Store } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="border-b border-line bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-6">
            <Link href="/admin" aria-label="Panel de administración">
              <Image src="/logo.jpg" alt="T&S Distribuidora" width={852} height={780} unoptimized className="h-12 w-auto" />
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 hover:text-brand">
              <Store size={16} /> Ver tienda
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="inline-flex items-center gap-1.5 hover:text-accent">
                <LogOut size={16} /> Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 print:max-w-none print:p-0">{children}</main>
    </>
  );
}
