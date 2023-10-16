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
  cargo: string;

  constructor(obj: DataObj) {
    this.loginUsuario = (obj && obj.loginUsuario) || '';
    this.nombreUsuario = (obj && obj.nombreUsuario) || '';
    this.estadoUsuario = (obj && obj.estadoUsuario) || 0;
    this.rol = (obj && obj.rol) || [];
    this.mesaPartes = (obj && obj.mesaPartes) || '';
    this.cargo = (obj && obj.cargo) || '';
  }
}

interface DataObj {
  loginUsuario?: string;
  nombreUsuario?: string;
  estadoUsuario?: number;
  rol?: string[];
  mesaPartes?: string;
  cargo?: string;
}
