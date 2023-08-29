// angular
import { NgModule, Optional, SkipSelf, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// ngxs
import { NgxsModule } from '@ngxs/store';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
// import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer
} from '@ngxs/router-plugin';

import { CustomRouterStateSerializer } from './state/custom-router.state';
// not used in production
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AuthState } from './auth/state/auth.state';

// otras librerías

import { AuthModule } from './auth/auth.module';
import { LoadingModule } from './loading/loading.module';
import { ResponseHttpInterceptor } from '../@core/responseHttp.interceptor';

import { environment as env } from '../../environments/environment';

import { JWTModule } from '../@core/jwt.module';
import { HttpService } from '../@core/http.service';
import { IconService } from '../@core/icon.service';
import { FileSave } from '../@core/file-save.service';
import { _window, WINDOW } from '../@core/window';
import { ThemePickerModule } from '../@core/theme-picker/theme-picker.module';
import { MenuState } from './navigator/state/menu.state';
import { NavigatorModule } from './navigator/navigator.module';
import { PageTitleService } from './page-title.service';

const MODULES = [
  // angular
  CommonModule,
  HttpClientModule,
  ServiceWorkerModule.register('/ngsw-worker.js', {
    enabled: env.production
  }),
  // ngxs
  NgxsModule.forRoot([AuthState, MenuState], {
    developmentMode: !env.production
  }),
  NgxsEmitPluginModule.forRoot(),
  NgxsReduxDevtoolsPluginModule.forRoot({
    disabled: env.production,
    maxAge: 10
  }),
  // NgxsStoragePluginModule.forRoot(),
  NgxsFormPluginModule.forRoot(),
  NgxsRouterPluginModule.forRoot(),
  NgxsLoggerPluginModule.forRoot({ disabled: env.production, collapsed: true }),

  // app
  AuthModule.forRoot(),
  LoadingModule.forRoot(),
  ThemePickerModule.forRoot(),
  JWTModule,
  NavigatorModule.forRoot([])
];

const PROVIDERS = [
  { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  { provide: LOCALE_ID, useValue: 'es-PE' },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseHttpInterceptor,
    multi: true
  },
  { provide: WINDOW, useFactory: _window },
  HttpService,
  FileSave,
  IconService,
  PageTitleService
];

@NgModule({
  imports: [...MODULES],
  providers: [...PROVIDERS]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule ya está cargado. Importar solo en AppModule');
    }
  }
}
