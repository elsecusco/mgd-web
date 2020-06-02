export class AtenderDocumento {
  codigoDocumento: number;
  numeroAtencion: number;
  //tipo:string;
  descripcionAtencion: string;
  atencionFinal: false;
  
  constructor() {
    this.codigoDocumento = null;
    this.numeroAtencion = null;
    //this.tipo = null;
    this.descripcionAtencion = null;
    this.atencionFinal = false;
  }
}
