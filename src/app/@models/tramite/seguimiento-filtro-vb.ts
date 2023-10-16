export class SeguimientoFiltroVb {
  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioTexto?: string;
  fechaFinTexto?: string;
  filtro: number;
  valor: string;
  asunto: string;
  nombreArchivo: string;
  razonSocial: string;
  ruc: string;
  serieNumero: string;
  hes: string;
  constructor() {
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(new Date().getDate() - 140);
    this.fechaFin = new Date();
    this.filtro = -1;
    this.valor = '';
    this.asunto = '';
    this.nombreArchivo = '';
    this.razonSocial = '';
    this.ruc = '';
    this.serieNumero = '';
    this.hes = '';
  }
}
