import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthState } from '../../@core/auth/state/auth.state';
import { Usuario } from '../../@core/auth/usuario';

@Component({
  selector: 'ngx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Select(AuthState.usuario)
  usuario$: Observable<Usuario> | undefined; // --- - | undefined

  @Select((state: any) => state.router.state.url)
  url$: Observable<string> | undefined; // --- - | undefined

  @Input()
  sidenav: MatSidenav | undefined; // --- - | undefined
  isFullscreen = false;

  constructor() {}

  ngOnInit() {}
}
