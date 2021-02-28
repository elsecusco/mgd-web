export class SeguimientoFiltro {
  nombreRemitenteDocumento: string;  
  asunto: string;
  filtro:number;
  valor: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioTexto?:string;
  fechaFinTexto?:string;
  check:boolean;
  nombreArchivo:string;
    constructor() {
      // this.anio= (new Date()).getFullYear()
      this.nombreRemitenteDocumento='';
      this.asunto ='';
      this.filtro= -1;
      this.valor= '';
      this.fechaInicio= new Date();
      this.fechaInicio.setDate(new Date().getDate() - 140);
      this.fechaFin=new Date();
      this.check=false;
      this.nombreArchivo='';
  }
}

