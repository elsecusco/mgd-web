export class DocumentoMesa {
  codigoDocumentoTramite: number;
  codigoTipoCorrelativo: number;
  numeroDocumento: number;
  numeroExpediente: string;
  numeroPaginas: number;
  asunto: string;
  fechaDerivacion: Date;
  codigoTipoDocumento: number;
  codigoTipoRecepcionDocumento: number;
  fechaDocumento: Date;
  destinantario: string;
  codigoProceso: number;
  persona: Persona;
  constructor() {
    this.numeroExpediente = '';
    this.codigoDocumentoTramite = 0;
    this.codigoTipoCorrelativo = 0;
    this.numeroDocumento = 0;
    this.numeroPaginas = 0;
    this.asunto = '';
    this.codigoProceso = 0;
    this.fechaDerivacion = new Date();
    this.codigoTipoDocumento = 12; //informe
    this.codigoTipoRecepcionDocumento = 2; //correo
    this.fechaDocumento = new Date();
    this.destinantario = '';
    this.persona = new Persona();
  }
}
export class Persona {
  tipoDocumento: number;
  numeroDocumento: string;
  nombre: string; //nombre o razon social
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo: string;
  celular: string;
  constructor() {
    this.tipoDocumento = 0;
    this.numeroDocumento = '';
    this.nombre = '';
    this.correo = '';
    this.celular = '';
  }
}
