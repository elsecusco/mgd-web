import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot
} from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { Usuario } from '@core/auth/usuario';
import { Authenticated, Logout } from './state/auth.action';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): boolean {
    const auth = this.checkLogin();
    if (auth.isAuth) {
      this.store.dispatch(new Authenticated(auth.usuario));
      return true;
    }

    this.store.dispatch(new Logout());
    return false;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  checkLogin(): { isAuth: boolean; usuario: Usuario } {
    const token = localStorage.getItem('token');

    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);

    if (isExpired) return { isAuth: false, usuario: null };

    const usuario = helper.decodeToken(token).usuario;
    return { isAuth: true, usuario };
  }
}

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor() {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkRol(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.canActivate(route);
  }

  checkRol(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (token == null) return false;

    if (route.data['rol'] == undefined) return true;

    const helper = new JwtHelperService();
    const usuario: Usuario = helper.decodeToken(token).usuario;
    const permisos = usuario.rol;

    const roles: string[] = route.data['rol'];

    let access = false;
    for (let i = 0; i < roles.length; i++) {
      const rol = roles[i];
      access = permisos.includes(rol);
      if (access) break;
    }
    if (!access) {
      // notifyInfo('Acceso no autorizado!');
    }

    return access;
  }
}
