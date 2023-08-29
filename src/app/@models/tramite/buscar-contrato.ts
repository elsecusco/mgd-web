import { ValorizacionDetalle } from "./valorizacion-detalle";

export class BuscarContrato {
    codigoDocumento?:string;
    codigoContrato: string;
    nombreProveedor: string;
    numeroRuc: string;
    fechaInicioTexto : string;
    fechaFinTexto: string; 
    descripcion: string;
    montoContrato:string;
    fechaInicioFin?:string;
    listValorizaciones?: ValorizacionDetalle[];
    numeroContrato?: string;
    fondoGarantia?: string;
    alquiler?: string;
    penalidad?: string;
    constructor() {
        this.codigoDocumento = null;
        this.codigoContrato = null;
        this.nombreProveedor = null;
        this.numeroRuc = null;
        this.descripcion = null;
        this.montoContrato = null;
        this.fechaInicioFin = null;
        this.listValorizaciones = [];
        this.numeroContrato = null; 
        this.fondoGarantia = null;
        this.alquiler = null;
        this.penalidad = null;
    }
}