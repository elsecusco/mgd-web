import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { Authenticate, AuthResponse, Usuario } from './usuario';
import { setUrl } from '@core/functions';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(auth: Authenticate): Observable<AuthResponse> {
    return this.auth('api/login', auth);
  }
  private auth(url: string, user: Authenticate): Observable<AuthResponse> {
    const URL = setUrl(url);
    return this.http
      .post<AuthResponse>(URL, user)
      .pipe(catchError(e => throwError(e)));
  }

  isAuthenticated(data: AuthResponse): IsAuthenticated {
    let isExpired = true;

    if (data.token != '') {
      const token = data.token;
      localStorage.setItem('token', token);
      const helper = new JwtHelperService();
      try {
        isExpired = helper.isTokenExpired(token);
      } catch (error) {
        isExpired = true;
      }
      if (isExpired) localStorage.removeItem('token');
    }
    return { isAuth: !isExpired, message: data.mensaje };
  }

  getUser(): Usuario {
    const token = localStorage.getItem('token');
    let u: Usuario = new Usuario({});
    if (token != null && token != undefined && token != '') {
      const helper = new JwtHelperService();
      u = helper.decodeToken(token).usuario;
    }
    return u;
  }
}

export interface IsAuthenticated {
  isAuth: boolean;
  message: string;
}
