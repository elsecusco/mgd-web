export class SeguimientoDocumento  {
    codigoDocumentoTramite: number;
    nombreRemitenteDocumento: string;
    fechaDocumento?: string;//Date;
    contenidoDocumento: string;
    numeroExpediente?:string;
    numeroPaginas?:number;
    nombreTipoDocumento?:string;
    nombreUsuario?:string;
    //acciones:string;

   constructor() {
       this.codigoDocumentoTramite = null;
       this.nombreRemitenteDocumento = null;
       this.fechaDocumento = null;
       this.contenidoDocumento = null;
       this.numeroExpediente = null;
       this.numeroPaginas = null;
       this.nombreTipoDocumento = null;
       this.nombreUsuario = null;
       //this.acciones ="<mat-icon>note_add</mat-icon>";

   }
}
