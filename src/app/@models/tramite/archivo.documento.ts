export interface ArchivoDocumento {
  codigoDocumento: number;
 // codigoDocumentoInterno?:string;
  codigoTipoDocumentoTramiteAdjunto:number; 
  codigoDocumentoAdjunto: number;
  nombreArchivo: string;
  descripcionArchivo: string; 
  ubicacionArchivo: string;
  fechaArchivo: any;
  eliminable:boolean;
  numeroAtencion:number;
  loginUsuario : string; 
  nombreUsuario?:string;
  extencion: string;
}
export interface ArchivosAnexos{
  anexosIniciales: ArchivoDocumento[];
  anexosRespuesta: ArchivoDocumento[];
}