export class ReporteDocumento {
  CodigoDocumentoTramite: number;
  NumeroDocumento: string;
  FechaDerivacion: string; //Date;
  NombreTipoDocumento: string;
  FechaDocumento: string; //Date;
  FechaRecepcion: string; //Date;
  ContenidoDocumento: string;
  NombreRemitenteDocumento: string;
  LoginUsuarioDestino: string;
  NombreArea: string;

  constructor() {
    this.CodigoDocumentoTramite = 0;
    this.NumeroDocumento = '';
    this.FechaDerivacion = '';
    this.NombreTipoDocumento = '';
    this.FechaDocumento = '';
    this.FechaRecepcion = '';
    this.ContenidoDocumento = '';
    this.NombreRemitenteDocumento = '';
    this.LoginUsuarioDestino = '';
    this.NombreArea = '';
  }
}
