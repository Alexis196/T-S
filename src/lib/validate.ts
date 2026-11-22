// Validación de los datos del cliente. Se usa en el navegador (paso 2) y otra vez en el servidor.
import type { Customer } from "./orders";

export const cleanDni = (dni: string) => dni.replace(/[.\s-]/g, "");

export function validateCustomer(c: Customer): string | null {
  if (c.nombre.trim().length < 2) return "Ingresá tu nombre.";
  if (c.apellido.trim().length < 2) return "Ingresá tu apellido.";
  if (!/^\d{7,9}$/.test(cleanDni(c.dni))) return "El DNI debe tener entre 7 y 9 números.";
  if (c.telefono.replace(/\D/g, "").length < 6) return "Ingresá un teléfono válido.";
  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) return "El email no es válido.";
  if (c.direccion.trim().length < 5) return "Ingresá tu dirección completa.";
  if (c.localidad.trim().length < 2) return "Ingresá tu localidad.";
  if (!/^[A-Z0-9 -]{3,10}$/.test(c.codigoPostal.trim().toUpperCase())) return "El código postal no es válido.";
  return null;
}
