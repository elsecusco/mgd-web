export class BuzonesUsuario {
  loginUsuarioBuzon: string;
  nombreUsuarioBuzon: string;
  //nombreUsuario: string;
  permiso: number; // 1.- sololectura,2.- derivar-atender,3.- derivar-atender-crear
  mesaPartes: string;
  cargo: string;
  constructor() {
    this.loginUsuarioBuzon = null;
    this.nombreUsuarioBuzon = null;
  //  this.nombreUsuario = null;
    this.permiso = 0;
    this.mesaPartes =  null;
    this.cargo = null;
  }
}
