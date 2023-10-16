export class DocumentoInternoFiltro {
  loginUsuario: string;
  fechaInicio: Date;
  fechaFin: Date;
  prefijoUser: string;
  prefijoGerencia: string;
  prefijoArea: string;
  codigoTipoDocumento: number;
  codigoEstado: number;
  tipoEmisor: number; //0 gerencia, 1 area, 2 trabajador
  constructor() {
    this.prefijoArea = '';
    this.loginUsuario = '';
    this.fechaInicio = new Date();
    this.fechaInicio.setDate(new Date().getDate() - 30);
    this.fechaFin = new Date();
    this.prefijoUser = '';
    this.prefijoGerencia = '';
    this.codigoTipoDocumento = 0;
    this.codigoEstado = 0;
    this.tipoEmisor = 0;
  }
}
