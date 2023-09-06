export class AtenderDocumento {
  codigoDocumento: number;
  numeroAtencion: number;
  //tipo:string;
  descripcionAtencion: string;
  atencionFinal: false;

  constructor() {
    this.codigoDocumento = 0;
    this.numeroAtencion = 0;
    //this.tipo = null;
    this.descripcionAtencion = '';
    this.atencionFinal = false;
  }
}
