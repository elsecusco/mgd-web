export class DocumentoInternoFiltro {
    loginUsuario:string;
    fechaInicio: Date;
    fechaFin: Date;
    prefijoUser: string;
    prefijoGerencia:string;
    prefijoArea:string;
    codigoTipoDocumento:number;
    codigoEstado:number;
    tipoEmisor:number;//0 gerencia, 1 area, 2 trabajador
    constructor() {
        this.loginUsuario = null;
        this.fechaInicio = new Date();
        this.fechaInicio.setDate(new Date().getDate() - 30);
        this.fechaFin = new Date();
        this.prefijoUser = null;
        this.prefijoGerencia = null;
        this.codigoTipoDocumento = 0;
        this.codigoEstado = 0;
        this.tipoEmisor = 0;
    }
  }