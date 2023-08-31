export class DocumentoMesa {
    codigoDocumentoTramite: number;
//  codigoTipoCorrelativo: number;
    numeroDocumento: number;
    numeroExpediente?:string;
    numeroPaginas: number;
    asunto: string;
//  fechaDerivacion: Date;
    codigoTipoDocumento: number;
// codigoTipoRecepcionDocumento: number;
    fechaDocumento:string;
    //destinantario:string;
    codigoProceso:number;
    codigoRemitenteDocumento?: number;
    codigoVerificacion?:number;
    filePrincipal?:string;
    listAnexos?:string;
    constructor() {
        this.codigoDocumentoTramite = 0;
//      this.codigoTipoCorrelativo = 0;
        this.numeroDocumento = 0;
        this.numeroPaginas = 0;
        this.asunto = "";
        this.codigoProceso=0;
//      this.fechaDerivacion = new Date();
        this.codigoTipoDocumento = 12; //informe
        this.fechaDocumento= "";
//      this.destinantario=null;
    }
    static adjuntoToString(file:FileAdjunto):string{
        return file.nombreArchivo+"||"
            + file.codigoTipoDocumentoTramiteAdjunto+"||"
            + file.titulo+"||"
            + file.descripcionArchivo;
    }
}
export class Persona{
    codigoRemitenteDocumento: number;
    codigoTipoDocumento: number;
    numeroDocumentoIdentidad: string;
    nombreRemitenteDocumento: string;
    emailContacto: string;
    telefonoContacto: string;
    constructor(){
        this.codigoRemitenteDocumento=0;
        this.codigoTipoDocumento = 0;
        this.numeroDocumentoIdentidad = "";
        this.nombreRemitenteDocumento = '';
        this.emailContacto = "";
        this.telefonoContacto = "";
    }
}
export interface FileAdjunto{
    file?:File;
    codigoTipoDocumentoTramiteAdjunto?:number;
    titulo:string;
    descripcionArchivo:string;
    nombreArchivo: string;
}
export interface PackageMesa{
    doc:DocumentoMesa;
    persona:Persona;
    principal:FileAdjunto;
    listAnexos:Array<FileAdjunto>;
}
