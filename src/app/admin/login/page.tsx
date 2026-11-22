import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <Image src="/logo.jpg" alt="T&S Distribuidora" width={852} height={780} unoptimized className="mx-auto h-24 w-auto" />
        <h1 className="mt-4 text-center text-xl font-extrabold">Panel de administración</h1>
        <label htmlFor="password" className="mb-1 mt-6 block text-xs font-bold">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border-2 border-line px-3 py-2.5 outline-none focus:border-brand"
        />
        {error === "1" && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">Contraseña incorrecta.</p>}
        {error === "config" && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
            Falta configurar ADMIN_PASSWORD y ADMIN_SECRET en el archivo .env.local.
          </p>
        )}
        <button type="submit" className="mt-5 w-full rounded-lg bg-brand py-3 font-bold text-white hover:bg-brand-dark">
          Ingresar
        </button>
      </form>
    </div>
  );
}
