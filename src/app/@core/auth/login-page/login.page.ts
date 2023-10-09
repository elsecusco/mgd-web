import { Component, OnInit, Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Authenticate } from '../usuario';
import { Login } from '../state/auth.action';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
@Injectable()
export class LoginPage implements OnInit {

  titulo: string = '';
  subtitulo: string = '';
  footer: string = '';

  @Select((state: any) => state.auth.pending)
  pending$!: Observable<boolean>

  @Select((state: any) => state.auth.errorMessage)
  error$!: Observable<string>
  constructor(private store: Store) {
    // pdfDefaultOptions.renderInteractiveForms = false; upgrade version
    pdfDefaultOptions.renderForms = false;
  }

  ngOnInit() {
    this.titulo = 'SIELSE';
    this.subtitulo = 'Sistema de Gestión Documental'
    this.footer = `ELSE © ${new Date().getFullYear()} | Todos los derechos reservados.`;
  }

  onSubmit($event: Authenticate) {
    this.store.dispatch(new Login($event));
  }
}
