export class  ReporteDocumento  {
    CodigoDocumentoTramite: number;
    NumeroDocumento: string;
    FechaDerivacion: string;//Date;
    NombreTipoDocumento : string;
    FechaDocumento: string;//Date;
    FechaRecepcion: string;//Date;
    ContenidoDocumento: string;
    NombreRemitenteDocumento: string;
    LoginUsuarioDestino: string;
    NombreArea: string;

    constructor() {
        this.CodigoDocumentoTramite = null;
        this.NumeroDocumento= null;
        this.FechaDerivacion= null;
        this.NombreTipoDocumento= null;
        this.FechaDocumento= null;
        this.FechaRecepcion= null;
        this.ContenidoDocumento= null;
        this.NombreRemitenteDocumento= null;
        this.LoginUsuarioDestino= null;
        this.NombreArea= null;
    }
}