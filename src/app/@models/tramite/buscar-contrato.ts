import { ValorizacionDetalle } from './valorizacion-detalle';

export class BuscarContrato {
  codigoDocumento?: string;
  codigoContrato: string;
  nombreProveedor: string;
  numeroRuc: string;
  fechaInicioTexto: string;
  fechaFinTexto: string;
  descripcion: string;
  montoContrato: string;
  fechaInicioFin?: string;
  listValorizaciones?: ValorizacionDetalle[];
  numeroContrato?: string;
  fondoGarantia?: string;
  alquiler?: string;
  penalidad?: string;
  constructor() {
    this.fechaFinTexto = '';
    this.fechaInicioTexto = '';
    this.codigoDocumento = '';
    this.codigoContrato = '';
    this.nombreProveedor = '';
    this.numeroRuc = '';
    this.descripcion = '';
    this.montoContrato = '';
    this.fechaInicioFin = '';
    this.listValorizaciones = [];
    this.numeroContrato = '';
    this.fondoGarantia = '';
    this.alquiler = '';
    this.penalidad = '';
  }
}
