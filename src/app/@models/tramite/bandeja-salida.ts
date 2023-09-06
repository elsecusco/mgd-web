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
        this.usuarioBuzon = '';
        this.codigoDocumentoTramite = 0;
        this.recibido = 0;
        this.emitido = 0;
        this.nombreRemitenteDocumento = '';
        this.numeroDocumento = '';
        this.numeroExpediente = '';
        this.de = '';
        this.listaPara = [];
        this.asunto = '';
        this.leido = 0;
        this.atendido = 0;
        this.fechaDerivacion = '';
        this.fecha = '';
        this.bandeja = 0;
        this.tipoBuzon = 0;

    }
  }
  interface ListaPara{
      numeroAtencion: number;
      tipoDerovacion: string;
      usuarioDestino: string;
  }
