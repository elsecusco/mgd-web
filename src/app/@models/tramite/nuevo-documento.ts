export class NuevoDocumento {
  codigoDocumento: number;
  codigoEstadoDocumento: number;
  nombreEstadoDocumento: string;
  numeroDocumentoFisico: string;
  numeroExpediente: string;
  contenidoDocumento: string;
  numeroPaginas: number;
  tieneCaducidad: number;
  tieneVencimiento: number;
  fechaDocumento: Date;
  fechaRecepcion: Date;
  fechaCaducidad: Date;
  fechaVencimiento: Date;
  codigoTipoRecepcion: number;
  codigoRemitente: number;
  codigoTipoDocumento: number;
  codigoEmpresa: number;
  codigoSucursal: number;
  codigoArea: number;
  loginBuzonCrea: string;
  constructor() {
    this.codigoDocumento = 0;
    this.codigoEstadoDocumento = 1;
    this.nombreEstadoDocumento = 'En Registro';
    this.numeroDocumentoFisico = 'S/N';
    this.numeroExpediente = '';
    this.contenidoDocumento = '';
    this.numeroPaginas = 1;
    this.tieneCaducidad = 0;
    this.tieneVencimiento = 0;
    this.fechaDocumento = new Date();
    this.fechaRecepcion = new Date();
    this.fechaCaducidad = new Date();
    this.fechaVencimiento = new Date();
    this.codigoTipoRecepcion = 0;
    this.codigoRemitente = 0;
    this.codigoTipoDocumento = 0;
    this.codigoEmpresa = 0;
    this.codigoSucursal = 0;
    this.codigoArea = 0;
    this.loginBuzonCrea = '';
  }
}
