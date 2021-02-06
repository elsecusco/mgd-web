export interface IRemitente {
  codigoRemitenteDocumento: number;
  nombreRemitenteDocumento?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  codigoTipoRemitenteDocumento?: number;
}
export class TipoRemitente{
  CodigoTipoRemitenteDocumento:number;
  NombreTipoRemitenteDocumento:string;
}
export class Remitente implements IRemitente {
  codigoRemitenteDocumento: number;
  nombreRemitenteDocumento: string;
  telefonoContacto: string;
  emailContacto: string;
  codigoTipoRemitenteDocumento: number;

  constructor() {
    this.codigoRemitenteDocumento = null;
    this.nombreRemitenteDocumento = null;
    this.telefonoContacto = null;
    this.emailContacto = null;
    this.codigoTipoRemitenteDocumento = null;
  }
}

