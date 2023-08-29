export class DocumentoMesa {
    codigoDocumentoTramite: number;
    codigoTipoCorrelativo: number;
    numeroDocumento: number;
    numeroExpediente:string;
    numeroPaginas: number;
    asunto: string;
    fechaDerivacion: Date;
    codigoTipoDocumento: number;
    codigoTipoRecepcionDocumento: number;
    fechaDocumento:Date;
    destinantario:string;
    codigoProceso:number;
    persona:Persona;
    constructor() {
        this.codigoDocumentoTramite = 0;
        this.codigoTipoCorrelativo = 0;
        this.numeroDocumento = null;
        this.numeroPaginas=null;
        this.asunto = "";
        this.codigoProceso=0;
        this.fechaDerivacion = new Date();
        this.codigoTipoDocumento = 12; //informe
        this.codigoTipoRecepcionDocumento = 2; //correo
        this.fechaDocumento= new Date();
        this.destinantario=null;
        this.persona=new Persona();
    }
}
export class Persona{
    tipoDocumento: number;
    numeroDocumento: string;
    nombre: string; //nombre o razon social
    apellidoPaterno?:string;
    apellidoMaterno?:string;
    correo:string;
    celular:string;
    constructor(){
        this.tipoDocumento = 0;
        this.numeroDocumento = "";
        this.nombre = null;
        this.correo = "";
        this.celular = "";
    }
}