import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './@core/auth/auth.guard'
import { LoginPage } from './@core/auth/login-page/login.page';
import { ExternPageComponent } from './@core/auth/extern-page/extern-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    // loadChildren: './pages/pages.module#PagesModule', old version
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginPage },
  { path: 'mesa-virtual', component: ExternPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
