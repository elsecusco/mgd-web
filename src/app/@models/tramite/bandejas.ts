import { BandejaDocumento } from "./bandeja-documento";
import { DocumentoInterno } from "./documento-interno";

export class Bandejas {
  e:BandejaDocumento[];
  a:BandejaDocumento[];
  s:BandejaDocumento[];
  constructor(){
    this.e=[];
    this.a=[];
    this.s=[];
  }
}
export class BandejasInternas {
  e:DocumentoInterno[];
  a:DocumentoInterno[];
  s:DocumentoInterno[];
  constructor(){
    this.e=[];
    this.a=[];
    this.s=[];
  }
}