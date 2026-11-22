// Datos del comercio que se imprimen en la cabecera del comprobante.
// COMPLETAR con los datos reales (están como ejemplo).
export const BUSINESS = {
  razonSocial: "T&S Distribuidora",
  domicilio: "Tu dirección, Ciudad",
  condicionIva: "Responsable Monotributo",
  cuit: "00-00000000-0",
  ingresosBrutos: "00000000",
  inicioActividades: "01/01/2020",
  telefono: "+00 000 000 0000",
  email: "contacto@tsdistribuidora.com",
};

// Esta app NO emite facturas electrónicas de ARCA (no genera CAE ni QR).
// El comprobante se imprime como "X" = documento no válido como factura.
// Si facturás con ARCA, usá este comprobante como detalle del pedido / remito.
export const DOCUMENT_LETTER = "X";
export const DOCUMENT_NOTE = "Documento no válido como factura";
