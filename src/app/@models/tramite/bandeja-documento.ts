export class BandejaDocumento {
  usuarioBuzon : string;
  codigoDocumentoTramite: number;
  recibido: number;
  emitido: number;
  nombreRemitenteDocumento: string;
  numeroDocumento: string;
  numeroExpediente:string;
  de?: string;
  asunto: string;
  estiloCelda: string;
  fechaDerivacion?: string;
  fecha?: string;
  bandeja: string;
  leido?: number;
  atendido?: number;
  tipoDerivacion?:string;
  numeroAtencion?: number;
  para?: string;
  listaPara?: ListaPara[];
  listaAtendido?:ListaAtendido[];
  // codigoSielse?: string;
  // tipoAnalitico?: string;
  // descripcionIntegracion?:string;
  // usuarioMantenimiento?:string;
  constructor() {
    this.asunto = null;
    this.atendido = null;
    this.bandeja = null;
    this.codigoDocumentoTramite = null;
    this.de = null;
    this.emitido = null;
    //this.fecha = null;
    ///this.fechaDerivacion = null;
    this.leido = null;
    this.nombreRemitenteDocumento = null;
    this.numeroAtencion = null;
    this.numeroDocumento = null;
    this.numeroExpediente = null;
    this.para = null;
    this.recibido = null;
    this.usuarioBuzon = null;
    this.tipoDerivacion= null;
    this.estiloCelda = null;
  }
}

export interface ListaPara{
  numeroAtencion: number;
  tipoDerivacion: string;
  usuarioDestino: string;
  leido: number;
  atendido: number;
  fechaLeido:string;
  fechaAtencion:string;
}

export interface ListaAtendido{
  numeroAtencion: number;
  tipoDerivacion: string;
  de:string;
  fechaDerivacion: string;
  fecha: string;
  leido:number;
  fechaLeido:string;
  fechaAtencion:string;
}
export interface BandejaRespuesta{
  internos:string,
  bandeja:BandejaDocumento[]
}