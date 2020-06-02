export interface Authenticate {
  username: string;
  password: string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
}

export class Usuario {
  loginUsuario: string;
  nombreUsuario: string;
  estadoUsuario: number;
  rol: string[];
  mesaPartes: string;

  constructor(obj: DataObj) {
    this.loginUsuario = (obj && obj.loginUsuario) || null;
    this.nombreUsuario = (obj && obj.nombreUsuario) || null;
    this.estadoUsuario = (obj && obj.estadoUsuario) || null;
    this.rol = (obj && obj.rol) || [];
    this.mesaPartes=(obj && obj.mesaPartes)||null;
  }
}

interface DataObj {
  loginUsuario?: string;
  nombreUsuario?: string;
  estadoUsuario?: number;
  rol?: string[];
  mesaPartes?: string;
}