export interface IRemitente {
  codigoRemitenteDocumento: number;
  nombreRemitenteDocumento?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  codigoTipoRemitenteDocumento?: number;
  numeroDocumentoIdentidad?:string;
  apellidoPaterno?:string;
  apellidoMaterno?:string;
  nombres?:string;
}
export class TipoRemitente {
  CodigoTipoRemitenteDocumento: number;
  NombreTipoRemitenteDocumento: string;
  constructor() {
    this.CodigoTipoRemitenteDocumento = 0;
    this.NombreTipoRemitenteDocumento = '';
  }
}
export class Remitente implements IRemitente {
  codigoRemitenteDocumento: number;
  nombreRemitenteDocumento: string;
  telefonoContacto: string;
  emailContacto: string;
  codigoTipoRemitenteDocumento: number;

  constructor() {
    this.codigoRemitenteDocumento = 0;
    this.nombreRemitenteDocumento = '';
    this.telefonoContacto = '';
    this.emailContacto = '';
    this.codigoTipoRemitenteDocumento = 0;
  }
}
