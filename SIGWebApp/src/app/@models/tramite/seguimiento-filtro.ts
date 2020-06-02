export class SeguimientoFiltro {
  nombreRemitenteDocumento: string;  
  // anio:number;
  filtro:number;
  valor: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioTexto?:string;
  fechaFinTexto?:string;
  check:boolean;
    constructor() {
      // this.anio= (new Date()).getFullYear()
      this.nombreRemitenteDocumento='';
      this.filtro= -1;
      this.valor= '';
      this.fechaInicio= new Date();
      this.fechaInicio.setDate(new Date().getDate() - 140);
      this.fechaFin=new Date();
      this.check=false;
  }
}

