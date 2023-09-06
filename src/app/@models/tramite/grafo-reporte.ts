export class GrafoReporte {
  flechas: Flecha[];
  nodos: Nodo[];
  constructor() {
    this.flechas = [];
    this.nodos = [];
  }
}

export interface Flecha {
  id: string;
  source: string;
  showSource: string;
  tipoSource: string;
  de: string;
  target: string;
  showTarget: string;
  tipoTarget: string;
  para: string;
  label: string;
  fecha: string;
  tipo: string;
  descripcion: string;
}

export interface Nodo {
  id: string;
  label: string;
  labelShow: string;
  tipoNodo: number;
}
