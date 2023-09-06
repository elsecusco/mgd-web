import { Pair } from '../../@models/pair';

export class TramiteTipos {
  tiposPrioridad: Pair[];
  tiposRecepcion: Pair[];
  tiposDocumento: Pair[];
  tiposAtencion: Pair[];
  tiposAprobaciones?: Pair[];
  tiposDocumentoInterno?: Pair[];
  tiposGerencias?: Pair[];
  tiposCorrelativos: { [id: string]: Pair[] };
  tiposAnaliticoIntegracion?: Pair[];
  tiposSucursal?: Pair[];
  tiposTiposOT?: Pair[];
  tiposClaseOTMantenimiento?: Pair[];
  tiposOTMantenimiento?: { [id: string]: Pair[] };
  tiposTecnicoSupervisor?: { [id: string]: Pair[] };
  tiposFirmaMotivo?: Pair[];
  areas: Area[];

  constructor() {
    this.tiposPrioridad = [];
    this.tiposRecepcion = [];
    this.tiposDocumento = [];
    this.tiposAtencion = [];
    this.tiposAprobaciones = [];
    this.tiposDocumentoInterno = [];
    this.tiposGerencias = [];
    this.tiposCorrelativos = {};
    this.tiposAnaliticoIntegracion = [];
    this.tiposSucursal = [];
    this.tiposTiposOT = [];
    this.tiposClaseOTMantenimiento = [];
    this.tiposOTMantenimiento = {};
    this.tiposTecnicoSupervisor = {};
    this.tiposFirmaMotivo = [];
    this.areas = [];
  }
}

interface Area {
  codigoArea: number;
  nombreArea: string;
  codigoEmpresa: number;
  codigoSucursal: number;
}
