import { Pair } from '@models/pair';

export class TramiteTipos {
  tiposPrioridad: Pair[];
  tiposRecepcion: Pair[];
  tiposDocumento: Pair[];
  tiposAtencion: Pair[];
  tiposAprobaciones?: Pair[];
  tiposDocumentoInterno?: Pair[];
  tiposCorrelativos:Pair[];
  areas: Area[];
  
  constructor() {
    this.tiposPrioridad = [];
    this.tiposRecepcion = [];
    this.tiposDocumento = [];
    this.tiposAtencion = [];
    this.tiposAprobaciones = [];
    this.tiposDocumentoInterno = [];
    this.tiposCorrelativos = [];
    this.areas = [];
  }
}

interface Area {
  codigoArea: number;
  nombreArea: string;
  codigoEmpresa: number;
  codigoSucursal: number;
}
