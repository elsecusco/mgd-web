export class Menu {
  codigoItemSuperior?: string;
  codigoItem?: string;
  nombreItem?: string;
  urlSuperior?: string;
  url?: string;
  orden?: number;
  nivelMenu?: number;
  icono?: string;
  subMenu?: Menu[];
  constructor() {
    this.subMenu = [];
  }
}
