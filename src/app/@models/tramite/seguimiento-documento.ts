export class SeguimientoDocumento {
  codigoDocumentoTramite: number;
  nombreRemitenteDocumento: string;
  fechaDocumento?: string; //Date;
  contenidoDocumento: string;
  numeroExpediente?: string;
  numeroPaginas?: number;
  nombreTipoDocumento?: string;
  nombreUsuario?: string;

  constructor() {
    this.codigoDocumentoTramite = 0;
    this.nombreRemitenteDocumento = '';
    this.fechaDocumento = '';
    this.contenidoDocumento = '';
    this.numeroExpediente = '';
    this.numeroPaginas = 0;
    this.nombreTipoDocumento = '';
    this.nombreUsuario = '';
  }
}
