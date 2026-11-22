// Tipos y constantes de pedidos (seguro para usar en cliente y servidor).

export const STATUSES = ["nuevo", "preparando", "enviado", "entregado", "cancelado"] as const;
export type OrderStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  preparando: "bg-amber-100 text-amber-800",
  enviado: "bg-indigo-100 text-indigo-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export const PAYMENTS = ["transferencia", "efectivo"] as const;
export type PaymentMethod = (typeof PAYMENTS)[number];

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  transferencia: "Transferencia bancaria",
  efectivo: "Efectivo al recibir / retirar",
};

export type Customer = {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  localidad: string;
  codigoPostal: string;
  notas: string;
};

export type OrderItem = {
  slug: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

export type Order = {
  number: number;
  createdAt: string; // ISO
  status: OrderStatus;
  customer: Customer;
  items: OrderItem[];
  total: number;
  payment?: PaymentMethod; // pedidos viejos no lo tienen
};
