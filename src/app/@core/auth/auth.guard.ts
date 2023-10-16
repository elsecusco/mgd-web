import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { Usuario } from '../../@core/auth/usuario';
import { Authenticated, Logout } from './state/auth.action';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private store: Store, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const auth = this.checkLogin();
    if (auth.isAuth) {
      this.store.dispatch(new Authenticated(auth.usuario));
      return true;
    }
    this.store.dispatch(new Logout());
    return false;
  }

  checkLogin(): { isAuth: boolean; usuario: Usuario } {
    const token = localStorage.getItem('token')!;

    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);

    if (isExpired) return { isAuth: false, usuario: {} as Usuario };

    const usuario = helper.decodeToken(token).usuario;
    return { isAuth: true, usuario };
  }
}

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return this.checkRol(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return this.canActivate(route, state);
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
