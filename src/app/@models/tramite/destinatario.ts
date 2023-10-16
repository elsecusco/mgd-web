export class Destinatario {
  loginUsuario: string;
  nombreUsuario: string;
  codigoEmpresa: number;
  codigoSucursal: number;
  codigoArea: number;
  nombreArea: string;

  constructor() {
    this.loginUsuario = '';
    this.nombreUsuario = '';
    this.codigoEmpresa = 0;
    this.codigoSucursal = 0;
    this.codigoArea = 0;
    this.nombreArea = '';
  }
}
