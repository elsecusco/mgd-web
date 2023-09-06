export class ValorizacionRecuperar {
  razonSocial: string;
  ruc: string;
  descripcion: string;
  montoTotal: number;
  importeFondoGarantia: number;
  importeAlquiler: number;
  importePenalidad: number;
  serieNumeroComprobante: string;
  importeComprobante: number;
  hes: string;

  constructor() {
    this.razonSocial = '';
    this.ruc = '';
    this.descripcion = '';
    this.montoTotal = 0;
    this.importeFondoGarantia = 0;
    this.importeAlquiler = 0;
    this.importePenalidad = 0;
    this.serieNumeroComprobante = '';
    this.importeComprobante = 0;
    this.hes = '';
  }
}
