// import { Destinatario } from "./destinatario";
// import { Pair } from "@models/pair";

export interface AprobacionDocumento {
  loginUsuario: string;
  nombreUsuario: string;
  codigoTipoAprobacion:string;
  nombreTipoAprobacion:string;
  fechaAtencion?:string;
  descripcionAtencion?:string;
  estado?: string;
  }
