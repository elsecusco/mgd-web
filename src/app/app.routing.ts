import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@core/auth/auth.guard';
import { LoginPage } from '@core/auth/login-page/login.page';
import { ExternPageComponent } from '@core/auth/extern-page/extern-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './pages/pages.module#PagesModule',
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginPage },
  { path: 'mesa-virtual', component: ExternPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRouting {}
