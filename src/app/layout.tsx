import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HideOnAdmin from "@/components/HideOnAdmin";

const nunito = Nunito_Sans({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T&S Distribuidora | Limpieza y vajilla",
  description:
    "Tienda online de productos de limpieza, vajilla, copas y vasos para el hogar y para empresas. Ventas por mayor y menor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
      </body>
    </html>
  );
}
