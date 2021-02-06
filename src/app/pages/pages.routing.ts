import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleGuard } from '@core/auth/auth.guard';

import { Pages } from './pages';
import { InicioPage, InicioComponent } from './inicio';

// roles que tiene acceso a las rutas
// const data = { rol: ['30031'] };

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
        loadChildren:
          './tramite-documentario/tramite-documentario.module#TramiteDocumentarioModule',
        data: { title: 'Inicio Trámite Documentario' }
      }

      // { path: 'anexo/:codigoAnexo', component: AnexoPage, data },
      // { path: 'buscar-suministro', component: BuscarSuministroPage, data },
      // {
      //   path: 'buscar-suministro/:codigoSuministro',
      //   component: SuministroPage,
      //   data
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRouting {}
