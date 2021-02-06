export class BandejaFiltro {
  //loginUsuarioBuzon:string;
  bandeja: string;
  fechaInicio: Date;
  fechaFin: Date;
  constructor() {
    //this.loginUsuarioBuzon = "";
    this.bandeja = 'e';
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(new Date().getDate() - 30);
    this.fechaFin = new Date();
  }
}

export class BuscarBandeja {
  filtro: string;
  tipoBusqueda: number;
  valorBusqueda: string;

  constructor() {
    this.filtro = '';
    this.tipoBusqueda = null;
    this.valorBusqueda = '';
   
  }
}

