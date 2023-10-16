export class ReporteFiltro {
  usuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  constructor() {
    this.usuario = '';
    this.fechaInicio = new Date();
    //modificar rango de tiempo
    this.fechaInicio.setDate(new Date().getDate() - 1);
    this.fechaFin = new Date();
  }
}
