import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { DocumentoState } from '../states/documento.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import swal from 'sweetalert2';
import { TramiteService } from '../tramite-documentario.service';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { notifyOk } from '@core/swal';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { BandejaState } from '../states/bandeja.state';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';

@Component({
  selector: 'documento-detalle-page',
  templateUrl: './documento-detalle.page.html',
  styleUrls: ['./documento-detalle.page.scss']
})
export class DocumentoDetallePage implements OnInit {
  private sub: any;
  codigoDocumento = 0;
  
  derivar = false;
  toggleDerivar = false;
  recuperarDerivacion = false;
  cancelarAtencion = true;

  bandejaf: BandejaFiltro;
  @Select(BandejaState.bandejaFiltro)
  public bandejaf$: Observable<BandejaFiltro>;

  buzonActual:BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;

  @Emitter(BandejaState.loadDocuments)
  private loadDocs: Emittable<BandejaFiltro>;

  doc: BandejaDocumento = new BandejaDocumento();
  @Select(DocumentoState.documento)
  public doc$: Observable<BandejaDocumento>;

  @Emitter(DocumentoState.setDocument)
  private setDocument: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: TramiteService
  ) {
    this.doc$.subscribe(d => {
      this.doc = { ...d };
    });
  }
  ngOnInit() {

    this.bandejaf$.subscribe(b => this.bandejaf=b);
    this.buzonActual$.subscribe(u=>this.buzonActual=u);

    this.sub = this.route.params.subscribe(params => {
    this.codigoDocumento = params['codigoDocumento'];
    });

    if (this.doc.codigoDocumentoTramite != null) {
      this.derivar =
        //this.doc.leido == 0 &&
        this.doc.atendido == 0 &&
        this.doc.bandeja == 'e' &&
        this.buzonActual.permiso > 1;

      this.recuperarDerivacion =
        //this.doc.leido == 0 &&
         this.doc.atendido == 0
        && this.doc.bandeja == 's'
        && this.buzonActual.permiso > 1;

      this.cancelarAtencion =
        this.doc.bandeja == 'a'
        && this.buzonActual.permiso  > 1 ;
    }
  }

  derivarDocumento() {
    this.navigate();
  }

  atender() {
    this.navigate();
  }
  deshacerDerivacion() {
    swal({
      title: `<span class="swalquestion-title">¿Desea recuperar el documento: ${
        this.doc.codigoDocumentoTramite
      } ?</span>`,
      type: 'question',
      showCancelButton: true,
      confirmButtonColor:'#607d8b',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Si, Recuperar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.value) this.recuperarDerivaciondocumento();
    });
  }
  deshacerAtencion() {
    swal({
      title: `<span class="swalquestion-title">¿Desea cancelar la atención del documento: ${
        this.doc.codigoDocumentoTramite
      } ?</span>`,
      type: 'question',
      showCancelButton: true,
      confirmButtonColor:'#607d8b',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Si, Recuperar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.value) this.cancelarAtencionDocumento();
    });
  }
  recuperarDerivaciondocumento() {
    const body = [this.doc.codigoDocumentoTramite, this.doc.numeroAtencion];
    this.api.recuperarDerivacion(body).subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
        this.navigate();
    });
  }
  cancelarAtencionDocumento(){
    const body = [this.doc.codigoDocumentoTramite, this.doc.numeroAtencion];
    this.api.cancelarAtencion(body).subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
        this.navigate();
    });
  }
  navigate() {
    this.loadDocs.emit(this.bandejaf);
    this.router.navigate(['../../bandeja'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    const doc = new BandejaDocumento();
    this.setDocument.emit({ documento: doc, vista: '' });
  }
}
