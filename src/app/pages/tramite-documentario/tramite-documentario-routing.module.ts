import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/@core/auth/auth.guard';
import { TramiteDocumentario } from './tramite-documentario.component';
import { InicioTramitePage } from './inicio-tramite/inicio-tramite.page';
import { TramiteDocumentarioPage } from './tramite-documentario.page';
import { DocumentoNuevoPage } from './documento-nuevo/documento-nuevo.page';
import { DocumentoDetallePage } from './documento-detalle/documento-detalle.page';
import { ReporteComponent } from './reporte/reporte.component';
import { SeguimientoDocumentoComponent } from './seguimiento-documento/seguimiento-documento.component';
import { DocumentoInternoComponent } from './documento-interno/documento-interno.component';
import { DocumentoInternoNuevoComponent } from './documento-interno-nuevo/documento-interno-nuevo.component';
import { DocumentoInternoReportesComponent } from './documento-interno-reportes/documento-interno-reportes.component';
import { DocumentoExternoReportesComponent } from './documento-externo-reportes/documento-externo-reportes.component';

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
        data: { title: 'Documento para V°B°' }
      },
      {
        path: 'documento-interno-nuevo',
        component: DocumentoInternoNuevoComponent,
        data: { title: 'Registro Documento para V°B°' }
      },
      {
        path: 'documento-interno-nuevo/:codigoDocumento',
        component: DocumentoInternoNuevoComponent,
        data: { title: 'Detalle Documento Interno'}
      },
      {
        path: 'documento-interno-reportes',
        component: DocumentoInternoReportesComponent,
        data: { title: 'Reporte Documento Interno'}
      },
      {
        path: 'documento-externo-reportes',
        component: DocumentoExternoReportesComponent,
        data: { title: 'Reporte Documento Externo'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramiteDocumentarioRoutingModule { }
