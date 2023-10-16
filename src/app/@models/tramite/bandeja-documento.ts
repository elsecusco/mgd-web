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
    this.asunto = '';
    this.atendido = 0;
    this.bandeja = '';
    this.codigoDocumentoTramite = 0;
    this.de = '';
    this.emitido = 0;
    //this.fecha = null;
    ///this.fechaDerivacion = null;
    this.leido = 0;
    this.nombreRemitenteDocumento = '';
    this.numeroAtencion = 0;
    this.numeroDocumento = '';
    this.numeroExpediente = '';
    this.para = '';
    this.recibido = 0;
    this.usuarioBuzon = '';
    this.tipoDerivacion= '';
    this.estiloCelda = '';
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
