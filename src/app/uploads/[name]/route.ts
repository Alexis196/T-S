import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/store";

// Sirve las fotos subidas desde el panel (se guardan fuera de /public).
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (!/^[a-f0-9]{32}\.jpg$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const file = await fs.readFile(path.join(UPLOADS_DIR, name));
    return new Response(new Uint8Array(file), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
