import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login-page/login.page';
import { LoginFormComponent } from './login-form/login-form.component';

import { AuthService } from './auth.service';
import { AuthGuard, RoleGuard } from './auth.guard';
import { SharedModule } from '../../@shared/shared.module';
import { MaterialModule } from '../material.module';
import{ExternPageComponent} from './extern-page/extern-page.component';
import { from } from 'rxjs';
import { MesaFormComponent } from './mesa-form/mesa-form.component';
import { MesaNuevoComponent } from './mesa-nuevo/mesa-nuevo.component';
import { MesaDatosComponent } from './mesa-datos/mesa-datos.component';
import { MesaAnexoComponent } from './mesa-anexo/mesa-anexo.component';
import { NgxsModule } from '@ngxs/store';
import { DocumentoMesaState } from './state/documento-mesa.state';
import { AdjuntarMesaComponent } from './adjuntar-mesa/adjuntar-mesa.component';
import { ConfirmarMesaComponent } from './confirmar-mesa/confirmar-mesa.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

const MODULES = [CommonModule,
  SharedModule,
  ReactiveFormsModule,
  MaterialModule,
  NgxExtendedPdfViewerModule,
  NgxsModule.forFeature([DocumentoMesaState
  ])];
const ENTRIES = [AdjuntarMesaComponent,ConfirmarMesaComponent];
const COMPONENTS = [
  ...ENTRIES,
  LoginPage,
  LoginFormComponent,
  ExternPageComponent,
  MesaFormComponent,
  MesaNuevoComponent,
  MesaDatosComponent,
  MesaAnexoComponent
];
const PROVIDERS = [AuthService, AuthGuard, RoleGuard];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [...ENTRIES]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [...PROVIDERS]
    };
  }
}
