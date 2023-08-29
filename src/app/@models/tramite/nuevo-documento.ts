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
  loginBuzonCrea:string;
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
    this.fechaCaducidad = null;
    this.fechaVencimiento = null;
    this.codigoTipoRecepcion = null;
    this.codigoRemitente = null;
    this.codigoTipoDocumento = null;
    this.codigoEmpresa = null;
    this.codigoSucursal = null;
    this.codigoArea = null;
    this.loginBuzonCrea = null;
    
  }
}
