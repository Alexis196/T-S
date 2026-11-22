import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contacto" className="mt-20 border-t border-line bg-tint">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Image
            src="/logo.jpg"
            alt="T&S Distribuidora"
            width={852}
            height={780}
            unoptimized
            className="h-20 w-auto mix-blend-multiply"
          />
          <p className="mt-3 text-sm text-muted">
            Limpieza, vajilla, copas y vasos para tu hogar, comercio e institución.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide">Tienda</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/productos" className="hover:text-brand">Todos los productos</Link></li>
            <li><Link href="/carrito" className="hover:text-brand">Mi carrito</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide">Contacto</h3>
          {/* Datos de ejemplo: reemplazar por los reales */}
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><Phone size={14} /> +00 000 000 0000</li>
            <li className="flex items-center gap-2"><Mail size={14} /> contacto@tsdistribuidora.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Tu dirección, Ciudad</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © T&amp;S Distribuidora. Todos los derechos reservados.{" "}
        <Link href="/admin" className="ml-2 underline underline-offset-2 hover:text-brand">
          Acceso administrador
        </Link>
      </p>
    </footer>
  );
}
