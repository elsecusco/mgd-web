export class DocumentoInterno {
  codigoDocumentoTramite: number;
  codigoDocumentoInterno: string;
  codigoTipoCorrelativo: number;
  numeroAtencion: number;
  numeroExpediente:string;
  numeroDocumentoFisico: string; 
  para?: string;
  asunto: string;
  leido: number;
  //atendido?: string;
  estado:string;
  fecha: string;
  fechaDerivacion: Date;
  tipoDerivacion: string;
  nombreDerivacion: string;
  codigoTipoDocumento: number;
  nombreTipoDocumento?: string;
  codigoTipoRecepcionDocumento: number;
  tieneVencimiento:boolean;
  fechaDocumento:Date;
  fechaVencimiento:Date;
  destinantario:string;
  correo:string;
  remitente:string;
	constructor() {
    this.codigoDocumentoTramite = 0;
    this.codigoDocumentoInterno = "";
    this.codigoTipoCorrelativo = 0;
    this.numeroAtencion = 0;
    this.asunto = "";
    this.leido = 0;
    this.fecha = '';
    this.estado=null;
    //this.atendido ="N";
    this.fechaDerivacion = new Date();
    this.tipoDerivacion = "R";//en redaccion
    this.nombreDerivacion = "";
    this.codigoTipoDocumento = 12; //informe
    this.codigoTipoRecepcionDocumento = 2; //correo
    this.tieneVencimiento=false;
    this.fechaDocumento= new Date();
    this.fechaVencimiento=null;
    this.destinantario=null;
    this.correo=null;
    this.remitente=null;
  }
}

export interface BandejaInternaRespuesta{
  externos:string,
  bandeja:DocumentoInterno[]
}