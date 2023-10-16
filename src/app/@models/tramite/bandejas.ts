import { BandejaDocumento } from './bandeja-documento';
import { DocumentoInterno } from './documento-interno';

export class Bandejas {
  e: BandejaDocumento[];
  a: BandejaDocumento[];
  s: BandejaDocumento[];
  constructor() {
    this.e = [];
    this.a = [];
    this.s = [];
  }
  getAtributes(x: string) {
    switch (x) {
      case 'e':
        return this.e;
      case 'a':
        return this.a;
      case 's':
        return this.s;
      default:
        return this.e;
    }
  }
  setAtributes(variable: string, dato: BandejaDocumento[]) {
    if (variable == 'e') {
      this.e = dato;
    }
    if (variable == 'a') {
      this.a = dato;
    }
    if (variable == 's') {
      this.s = dato;
    }
  }
}
export class BandejasInternas {
  e: DocumentoInterno[];
  a: DocumentoInterno[];
  s: DocumentoInterno[];
  constructor() {
    this.e = [];
    this.a = [];
    this.s = [];
  }
  getAtributes(x: string) {
    switch (x) {
      case 'e':
        return this.e;
      case 'a':
        return this.a;
      case 's':
        return this.s;
      default:
        return this.e;
    }
  }
  setAtributes(variable: string, dato: DocumentoInterno[]) {
    if (variable == 'e') {
      this.e = dato;
    }
    if (variable == 'a') {
      this.a = dato;
    }
    if (variable == 's') {
      this.s = dato;
    }
  }
}
