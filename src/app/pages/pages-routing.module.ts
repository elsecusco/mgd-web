import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '../@core/auth/auth.guard';
import { Pages } from './pages';
import { InicioPage } from './inicio';

const routes: Routes = [
  {
    path: '',
    component: Pages,
    canActivateChild: [RoleGuard],
    // Se modifico el SIG por el MGD
    data: { title: 'MGD' },
    children: [
      { path: '', component: InicioPage },
      {
        path: 'tramite-documentario',
        loadChildren:()=> import('./tramite-documentario/tramite-documentario.module').then(m => m.TramiteDocumentarioModule),
        data: { title: 'Inicio Trámite Documentario' },
      },

      // { path: 'anexo/:codigoAnexo', component: AnexoPage, data },
      // { path: 'buscar-suministro', component: BuscarSuministroPage, data },
      // {
      //   path: 'buscar-suministro/:codigoSuministro',
      //   component: SuministroPage,
      //   data
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
