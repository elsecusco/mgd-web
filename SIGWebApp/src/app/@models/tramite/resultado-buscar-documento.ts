export interface ResultadoBuscarDocumento {
  codigoDocumento: number;
  numeroAtencion: number;
  numeroDocumentoFisico: number;
  numeroExpediente:string;
  nombreDocumento: string;
  fechaDocumento: string;
  fechaRecepcion: string;
  fechaVencimiento: string;
  tieneVencimiento: number;
  nombreRemitente: string;
  remitente: string;
  destinatario: string;
  contenidoDocumento: string;
  descripcionSolicitudAtencion: string;
  descripcionAtencion: string;
}
