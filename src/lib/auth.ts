// Sesión de administrador: contraseña única (ADMIN_PASSWORD) + cookie firmada. Solo servidor.
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ts_admin";
const MAX_AGE = 60 * 60 * 8; // 8 horas

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();
const sign = (value: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(value).digest("hex");

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return crypto.timingSafeEqual(sha(input), sha(expected));
}

export async function createSession() {
  const secret = process.env.ADMIN_SECRET!;
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp, secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = sign(exp, secret);
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
