export class FirmaModel {
  urlServicio: string;
  cargo: string;
  comentario: string;
  razon: string;
  ubicacion: string;
  rutaOrigen: string;
  rutaDestino: string;
  rutaImagen: string;
  imagen: string;
  nombreArchivos: string;
  altoRubrica: string;
  anchoRubrica: string;
  activarDescripcion: number;
  posicionFirma:
    | 'SD'
    | 'SI'
    | 'SM'
    | 'MD'
    | 'MI'
    | 'MM'
    | 'ID'
    | 'II'
    | 'IM'
    | 'CO'
    | 'TA';
  nombreTag: string;
  estiloFirma: 'I' | 'D' | 'ID' | 'DI' | 'ISDI' | 'DSII';
  ubicacionPagina: 'PP' | 'UP' | 'TP' | 'CP';
  aplicarImagen: 0 | 1;
  usarPersonalizado: 0 | 1;
  tipoFirma: number;
  listarArchivos: number;
  nomarch: string;
  tamanoFuente;
  alias;
  session;
  coordenadas;
  invisible;
  numeroPagina;

  constructor() {
    this.urlServicio = '';
    this.cargo = 'GERENTE DE PRUEBA';
    this.comentario = '';
    this.razon = '';
    this.ubicacion = '';
    this.rutaOrigen = '';
    this.rutaDestino = '';
    this.rutaImagen = 'C:/SOFTNET/opt/imagenes/';
    this.imagen = 'logo-else.png';
    this.nombreArchivos = '';
    // this.altoRubrica = '60.00F';
    // this.anchoRubrica = '110.00F';
    this.altoRubrica = '60.00F';
    this.anchoRubrica = '80.00F';
    this.activarDescripcion = 1;
    this.posicionFirma = 'SD';
    this.nombreTag = '';
    this.estiloFirma = 'ID';
    this.ubicacionPagina = 'PP';
    this.aplicarImagen = 0;
    this.usarPersonalizado = 0;
    this.tipoFirma = 1;
    this.listarArchivos = 1;
    this.nomarch = '';
    this.tamanoFuente = '';
    this.alias = '';
    this.session = '';
    this.coordenadas = '';
    this.invisible = '';
    this.numeroPagina = '';
  }
}
