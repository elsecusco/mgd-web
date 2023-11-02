import { Injectable } from '@angular/core';
import http from './http-common';

@Injectable({
  providedIn: 'root',
})
export class RemitenteService {
  constructor() {}
  getValidarDni = (valor: string) => {
    return http.get<any>(`/validarDni/${valor}`);
  };
  getValidarRuc = (valor: string) => {
    return http.get<any>(`/validarRuc/${valor}`);
  };
}
