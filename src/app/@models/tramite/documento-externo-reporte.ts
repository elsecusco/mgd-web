export class DocumentoExternoReporte {
  fechaInicio: Date;
  fechaFin: Date;
  conRemitente: boolean;
  codigoRemitente: number;
  conNroExpediente: boolean;
  numeroExpediente: string;
  conFechaVencimiento: number;
  conPlazoAtencion: number;
  diasPorVencer: number;
  loginUsuarioDestino: string;
  statusDoc: number;
  constructor() {
    this.conRemitente = false;
    this.codigoRemitente = 0;
    this.conNroExpediente = false;
    this.numeroExpediente = '';
    this.conFechaVencimiento = -1;
    this.conPlazoAtencion = -1;
    this.diasPorVencer = 0;
    this.loginUsuarioDestino = '';
    this.statusDoc = 0;
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(new Date().getDate() - 30);
    this.fechaFin = new Date();
  }
}
