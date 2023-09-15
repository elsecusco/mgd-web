import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { Authenticate, AuthResponse, Usuario } from './usuario';
import { setUrl } from '../../@core/functions';
import { Pair } from '../../@models/pair';
import { HttpService } from '../../@core/http.service';
import { Persona } from '../../@models/documento-mesa';
import { Resultado } from '../../@models/resultado';
import { NgxfUploaderService, UploadEvent } from 'ngxf-uploader';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private Upload: NgxfUploaderService
  ) {}

  login(auth: Authenticate): Observable<AuthResponse> {
    return this.auth('api/login', auth);
  }
  private auth(url: string, user: Authenticate): Observable<AuthResponse> {
    const URL = setUrl(url);
    return this.http.post<AuthResponse>(URL, user).pipe(
      catchError((e) => {
        return throwError(() => e);
      })
    );
  }

  isAuthenticated(data: AuthResponse): IsAuthenticated {
    let isExpired = true;

    if (data.token != '') {
      const token = data.token;
      localStorage.setItem('token', token);
      console.log('isAuthenticated');
      const helper = new JwtHelperService();
      try {
        isExpired = helper.isTokenExpired(token);
      } catch (error) {
        isExpired = true;
      }
      // if (isExpired) localStorage.removeItem('token');
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
  getTipos(): Observable<TiposMesa> {
    return this.httpService.get({
      uri: `api/TramiteTiposMesaVirtual`,
      open: false,
      close: false,
    });
  }
  getRemitente(idTipoDoc: number, numeroDoc: number): Observable<Persona[]> {
    return this.httpService.get({
      uri: `api/BusquedaRemitenteDocumento/${idTipoDoc}/${numeroDoc}`,
      open: false,
      close: false,
    });
  }
  pedirCodigo(persona: Persona): Observable<any> {
    return this.httpService.post({
      uri: `api/RemitenteGuardarPedirCodigo`,
      body: persona,
      open: false,
      close: false,
    });
  }
  verificarCodigo(body: any): Observable<Resultado> {
    return this.httpService.post({
      uri: `api/ValidarCodigoRemitente`,
      body,
      open: false,
      close: false,
    });
  }
  subirArchivos(form: any, files: File[]): Observable<UploadEvent> {
    return this.Upload.upload({
      url: setUrl('api/GuardarDocumentoMV'),
      fields: form,
      files: files,
      process: true,
    });
  }
}
export interface TiposMesa {
  tiposDocumento: Pair[];
  tiposProceso: Pair[];
  tiposDocIdentidad: Pair[];
}

export interface IsAuthenticated {
  isAuth: boolean;
  message: string;
}
