import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Authenticate } from '../usuario';
import { Login } from '../state/auth.action';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  titulo: string;
  subtitulo:string;
  footer: string;
  @Select(state => state.auth.pending)
  pending$: Observable<boolean>;

  @Select(state => state.auth.errorMessage)
  error$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.titulo = 'SIELSE';
    this.subtitulo = 'Sistema de Gestión Documental'
    this.footer = `ELSE © ${new Date().getFullYear()} | Todos los derechos reservados.`;
  }

  onSubmit($event: Authenticate) {
    this.store.dispatch(new Login($event));
  }
}
