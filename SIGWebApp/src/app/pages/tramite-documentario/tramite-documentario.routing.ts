import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TramiteDocumentario } from './tramite-documentario.component';
import { TramiteDocumentarioPage } from './tramite-documentario.page';
import { InicioTramitePage } from './inicio-tramite/inicio-tramite.page';
import { DocumentoNuevoPage } from './documento-nuevo/documento-nuevo.page';
import { DocumentoDetallePage } from './documento-detalle/documento-detalle.page';
import { ReporteComponent } from './reporte/reporte.component';
import { SeguimientoDocumentoComponent } from './seguimiento-documento/seguimiento-documento.component';
import { DocumentoInternoComponent } from './documento-interno/documento-interno.component';
import { DocumentoInternoNuevoComponent } from './documento-interno-nuevo/documento-interno-nuevo.component';
import { RoleGuard } from '@core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TramiteDocumentario,
    canActivateChild: [RoleGuard],
    children: [
      {
        path: '',
        component: InicioTramitePage
      },
      {
        path: 'bandeja',
        component: TramiteDocumentarioPage,
        data: { title: 'Bandeja' }
      },
      {
        path: 'documento-nuevo',
        component: DocumentoNuevoPage,
        data: { title: 'Registro Documento' }
      },
      {
        path: 'documento-detalle/:codigoDocumento',
        component: DocumentoDetallePage,
        data: { title: 'Detalle Documento' }
      },
      {
        path: 'reporte',
        component: ReporteComponent,
        data: { title: 'Reporte' }
      },
      {
        path: 'seguimiento-documento',
        component: SeguimientoDocumentoComponent,
        data: { title: 'Seguimiento de Documentos' }
      },
      {
      // ng g c pages\tramite-documentario\documento-interno
        path: 'documento-interno',
        component: DocumentoInternoComponent,
        data: { title: 'Documento Interno' }
      },
      {
        path: 'documento-interno-nuevo',
        component: DocumentoInternoNuevoComponent,
        data: { title: 'Registro Documento Interno' }
      },
      {
        path: 'documento-interno-nuevo/:codigoDocumento',
        component: DocumentoInternoNuevoComponent,
        data: { title: 'Detalle Documento Interno'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramiteDocumentarioRouting {}
