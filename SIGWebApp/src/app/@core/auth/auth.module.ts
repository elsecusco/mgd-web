import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login-page/login.page';
import { LoginFormComponent } from './login-form/login-form.component';

import { AuthService } from './auth.service';
import { AuthGuard, RoleGuard } from './auth.guard';

import { MaterialModule } from '../material.module';
import { ExternFormComponent } from './extern-form/extern-form.component';

const MODULES = [CommonModule, ReactiveFormsModule, MaterialModule];
const COMPONENTS = [LoginPage, LoginFormComponent];
const PROVIDERS = [AuthService, AuthGuard, RoleGuard];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, ExternFormComponent],
  exports: [...COMPONENTS]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [...PROVIDERS]
    };
  }
}
