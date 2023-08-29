import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { MatSidenav } from '@angular/material';
import { AuthState } from '@core/auth/state/auth.state';
import { Usuario } from '@core/auth/usuario';

@Component({
  selector: 'ngx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Select(AuthState.usuario)
  usuario$: Observable<Usuario>;

  @Select(state => state.router.state.url)
  url$: Observable<string>;

  @Input()
  sidenav: MatSidenav;
  isFullscreen = false;

  constructor() {}

  ngOnInit() {}
}
