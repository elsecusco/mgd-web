import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxsModule } from '@ngxs/store';

import { TramiteDocumentarioRouting } from './tramite-documentario.routing';
import { SharedModule } from '@shared/shared.module';

import { TramiteService } from './tramite-documentario.service';

import { BandejaState } from './states/bandeja.state';
import { BandejaInternoState } from './states/bandeja-interno.state';

import { TramiteTiposState } from './states/tramite-tipos.state';
import { DocumentoState } from './states/documento.state';
import { ReporteState } from './states/reporte.state';

import { TramiteDocumentario } from './tramite-documentario.component';
import { InicioTramitePage } from './inicio-tramite/inicio-tramite.page';
import { TramiteDocumentarioPage } from './tramite-documentario.page';
import { BandejaComponent } from './bandeja/bandeja.component';
import { BandejaFiltroComponent } from './bandeja-filtro/bandeja-filtro.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ReporteFiltroComponent } from './reporte-filtro/reporte-filtro.component';
import { BandejaBuscar } from './bandeja-buscar/bandeja-buscar';

import { DocumentoNuevoPage } from './documento-nuevo/documento-nuevo.page';
import { DocumentoNuevoDatosComponent } from './documento-nuevo-datos/documento-nuevo-datos.component';
import { DocumentoDetallePage } from './documento-detalle/documento-detalle.page';
import { DocumentoDetalle } from './documento-detalle/documento-detalle';

import { RemitenteBuscarComponent } from './remitente-buscar/remitente-buscar.component';
import { DestinatarioBuscarComponent } from './destinatario-buscar/destinatario-buscar.component';
import { DestinatarioFiltroComponent } from './destinatario-filtro/destinatario-filtro.component';

import { DocumentoDerivarComponent } from './documento-derivar/documento-derivar.component';
import { DocumentoAdjuntarComponent } from './documento-adjuntar/documento-adjuntar.component';
// import { DocumentoAdjuntarDialog } from './documento-adjuntar/documento-adjuntar.dialog';
import { DocumentoAtencion } from './documento-atencion/documento-atencion.component';
import { DocumentoAtencionDialog } from './documento-atencion/documento-atencion.dialog';

//--aumentado para día y hora
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PopupPendientesComponent } from './popup-pendientes/popup-pendientes.component';
import { RemitenteUpdateAddComponent } from './remitente-update-add/remitente-update-add.component';
import { PendienteState } from './states/pendientes.state';

//----para reseteo de estados
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { BandejaConfiguracionComponent } from './bandeja-configuracion/bandeja-configuracion.component';
import { SeguimientoDocumentoComponent } from './seguimiento-documento/seguimiento-documento.component';
import { SeguimientoFiltroComponent } from './seguimiento-filtro/seguimiento-filtro.component';
import { SeguimientoState } from './states/seguimiento.states';
import { ReportePrincipalComponent } from './reporte-principal/reporte-principal.component';
import { from } from 'rxjs';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ReporteGraficoComponent } from './reporte-grafico/reporte-grafico.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DetalleAtencionComponent } from './detalle-atencion/detalle-atencion.component';
import { DetalleAdjuntarComponent } from './detalle-adjuntar/detalle-adjuntar.component';
import { DocumentoInternoComponent } from './documento-interno/documento-interno.component';
import { DocumentoInternoFiltroComponent } from './documento-interno-filtro/documento-interno-filtro.component';
import { DocumentoInternoNuevoComponent } from './documento-interno-nuevo/documento-interno-nuevo.component';
import { DocumentoInternoDatosComponent } from './documento-interno-datos/documento-interno-datos.component';
import { DocumentoInternoDerivarComponent } from './documento-interno-derivar/documento-interno-derivar.component';
import { DocumentoInternoState } from './states/documento-interno.state';
import { DestinatarioBuscarInternoComponent } from './destinatario-buscar-interno/destinatario-buscar-interno.component';
import { DocumentoAnexoInternoComponent } from './documento-anexo-interno/documento-anexo-interno.component';
import { DocumentoInternoVbComponent } from './documento-interno-vb/documento-interno-vb.component';
import { DetalleAdjuntarInternoComponent } from './detalle-adjuntar-interno/detalle-adjuntar-interno.component';
import { DetalleAprobacionInternoComponent } from './detalle-aprobacion-interno/detalle-aprobacion-interno.component';
import { DetalleRechazarInternoComponent } from './detalle-rechazar-interno/detalle-rechazar-interno.component';
import { DocumentoInternoBuscarComponent } from './documento-interno-buscar/documento-interno-buscar.component';
import { DocumentoInternoReportesComponent } from './documento-interno-reportes/documento-interno-reportes.component';
import { AreaFiltroComponent } from './area-filtro/area-filtro.component';
import { DocumentoExternoReportesComponent } from './documento-externo-reportes/documento-externo-reportes.component';
import { RemitenteFiltroComponent } from './remitente-filtro/remitente-filtro.component';
import { DetalleSielseComponent } from './detalle-sielse/detalle-sielse.component';
import { DetalleSielseGuardarComponent } from './detalle-sielse-guardar/detalle-sielse-guardar.component';
import { DetalleSielseSeguimientoComponent } from './detalle-sielse-seguimiento/detalle-sielse-seguimiento.component';
import { ValorizacionContabilidadComponent } from './valorizacion-contabilidad/valorizacion-contabilidad.component';
import { ValorizacionDetalleComponent } from './valorizacion-detalle/valorizacion-detalle.component';
import { PdfViewerDialogComponent } from './pdf-viewer-dialog/pdf-viewer-dialog.component';
import { ReporteMemoComponent } from './reporte-memo/reporte-memo.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentoInternoVisorComponent } from './documento-interno-visor/documento-interno-visor.component';

//import { DocumentoInternoBuscarComponent } from './documento-interno-buscar/documento-interno-buscar.component';

//arreglos auxiliares
const MODULES = [
  CommonModule,
  ReactiveFormsModule,
  TramiteDocumentarioRouting,
  SharedModule,
  FormsModule,
  NgxGraphModule,
  NgxChartsModule,
  MatSliderModule,
  MatTabsModule,
  MatSlideToggleModule,
  // Agreagado para el nuevo date y hours
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  NgxExtendedPdfViewerModule,
  // Agreagado para el nuevo date y hours
  NgxsModule.forFeature([
    BandejaState,
    BandejaInternoState,
    ReporteState,
    TramiteTiposState,
    DocumentoState,
    DocumentoInternoState,
    PendienteState,
    SeguimientoState]
  ),
  NgxsResetPluginModule.forRoot()
];

//const ENTRIES = [DocumentoAdjuntarDialog, DocumentoAtencionDialog];
const ENTRIES = [
  //DocumentoAdjuntarDialog,
  DetalleSielseComponent,
  ValorizacionDetalleComponent,
  DetalleSielseGuardarComponent,
  PdfViewerDialogComponent,
  ReporteMemoComponent,
  DocumentoInternoVisorComponent,
  DocumentoAtencionDialog,
  RemitenteUpdateAddComponent,
  PopupPendientesComponent,
  DetalleAprobacionInternoComponent,
  DetalleRechazarInternoComponent,
  DetalleAtencionComponent,
  DetalleAdjuntarComponent,
  ReportePrincipalComponent,
  ReporteGraficoComponent,
  DetalleAdjuntarInternoComponent];

const COMPONENTS = [
  ...ENTRIES,
  TramiteDocumentario,
  InicioTramitePage,
  TramiteDocumentarioPage,
  DocumentoDetallePage,
  DocumentoDetalle,
  BandejaComponent,
  ReporteComponent,
  ReporteFiltroComponent,
  SeguimientoFiltroComponent,
  SeguimientoDocumentoComponent,
  DocumentoNuevoPage,
  BandejaFiltroComponent,
  BandejaBuscar,
  DocumentoInternoBuscarComponent,
  RemitenteBuscarComponent,
  RemitenteFiltroComponent,
  DestinatarioBuscarComponent,
  DestinatarioFiltroComponent,
  AreaFiltroComponent,
  DocumentoNuevoDatosComponent,

  DocumentoDerivarComponent,
  DocumentoAdjuntarComponent,
  DocumentoAtencion,
  DetalleSielseComponent,
  DetalleSielseGuardarComponent,

  PopupPendientesComponent,
  RemitenteUpdateAddComponent,
  BandejaConfiguracionComponent,
  SeguimientoDocumentoComponent,
  SeguimientoFiltroComponent,
  ReportePrincipalComponent,
  ReporteGraficoComponent,

  DetalleAtencionComponent,
  DetalleAdjuntarComponent,
  DocumentoInternoComponent,
  DocumentoInternoFiltroComponent,
  DocumentoInternoNuevoComponent,
  DocumentoInternoDatosComponent,
  DocumentoInternoDerivarComponent,
  DestinatarioBuscarInternoComponent,
  DocumentoAnexoInternoComponent,
  DocumentoInternoVbComponent
];

const PROVIDERS = [TramiteService];

//método para llamar a todos los arreglos
@NgModule({

 declarations: [...COMPONENTS, DocumentoInternoReportesComponent, DocumentoExternoReportesComponent, DetalleSielseComponent, DetalleSielseGuardarComponent, DetalleSielseSeguimientoComponent, ValorizacionContabilidadComponent, PdfViewerDialogComponent, ReporteMemoComponent, DocumentoInternoVisorComponent],
 imports: [...MODULES],
 bootstrap:[ReporteGraficoComponent],
 providers: [...PROVIDERS],
 schemas: [CUSTOM_ELEMENTS_SCHEMA],
 entryComponents: [...ENTRIES],

  })
export class TramiteDocumentarioModule {}