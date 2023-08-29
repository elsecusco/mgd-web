export class BandejaSalida {
    usuarioBuzon : string;
    codigoDocumentoTramite: number;
    recibido: number;
    emitido: number;
    nombreRemitenteDocumento: string;
    numeroDocumento: string;
    numeroExpediente:string;
    de: string;
    listaPara: ListaPara[];
    asunto: string;
    leido: number;  
    atendido: number; 
    fechaDerivacion: string;
    fecha: string;
    bandeja: number;
    tipoBuzon: number;

    constructor() {
        this.usuarioBuzon = null;
        this.codigoDocumentoTramite = null;
        this.recibido = null;
        this.emitido = null;
        this.nombreRemitenteDocumento = null;
        this.numeroDocumento = null;
        this.numeroExpediente = null;
        this.de = null;
        this.listaPara = null;
        this.asunto = null;
        this.leido = null;
        this.atendido = null;
        this.fechaDerivacion = null;
        this.fecha = null;
        this.bandeja = null;
        this.tipoBuzon = null;
           
    }
  }
  interface ListaPara{
      numeroAtencion: number;
      tipoDerovacion: string;
      usuarioDestino: string;
  }
  