import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { PopupPendientesComponent } from '../popup-pendientes/popup-pendientes.component';
import { PendienteState } from '../states/pendientes.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PopupPendientes } from '../../../@models/tramite/popup-pendientes';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { TramiteService } from '../tramite-documentario.service';
import { finalize } from 'rxjs/operators';

import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
// import { BandejaConfiguracionComponent } from '../bandeja-configuracion/bandeja-configuracion.component';
import { BandejaState } from '../states/bandeja.state';
import { DocumentoState } from '../states/documento.state';
import { BandejaDocumento } from '../../../@models/tramite/bandeja-documento';
import { BandejaInternoState } from '../states/bandeja-interno.state';

@Component({
  selector: 'inicio-tramite',
  templateUrl: './inicio-tramite.page.html',
  styleUrls: ['./inicio-tramite.page.scss'],
})
export class InicioTramitePage implements OnInit {
  dialogRef: any;
  nombreRemitente = new FormControl();

  loading!: Boolean;
  @Select(PendienteState.loading)
  public loading$!: Observable<Boolean>;

  loaded!: Boolean;
  @Select(PendienteState.loaded)
  public loaded$!: Observable<Boolean>;

  pendientes!: PopupPendientes;
  @Select(PendienteState.pendientes)
  public pendientes$!: Observable<PopupPendientes>;

  @Emitter(PendienteState.loadPendientes)
  private loadPendientes!: Emittable<PopupPendientes>;

  @Emitter(BandejaState.loadListaBuzones)
  private loadBuzones!: Emittable<void>;

  @Emitter(BandejaInternoState.loadListaBuzonesInternos)
  private loadBuzonesInternos!: Emittable<void>;

  @Emitter(BandejaInternoState.loadDestinatarios)
  private loadDestinatarios!: Emittable<void>;
  //--Para crear un documento nuevo-----
  @Emitter(DocumentoState.setDocument)
  private setDocument!: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private api: TramiteService
  ) {}

  ngOnInit() {
    this.loaded$.subscribe((l) => {
      if (!l) {
        this.loadBuzones.emit();
        this.loadBuzonesInternos.emit();
        this.loadDestinatarios.emit();
        //console.log("cargado dest")
      }
    });
    //this.pendientes = new PopupPendientes();
    //this.pendientes$.subscribe(pendientes => {
    //this.pendientes = pendientes;
    //this.dialog.closeAll();
    //const count=this.pendientes.leidos+this.pendientes.noleidos+this.pendientes.nuevos+ this.pendientes.enProceso;
    // if (count>0)
    //  this.abrirPopup();
    // });
    //this.loadPendientes.emit();
  }
  // abrirPopup(){
  //   this.dialog.closeAll();
  //   const dialogRef = this.dialog.open(
  //   PopupPendientesComponent,{
  //   width: '360px',
  //   height:'300px',
  //   data: this.pendientes});
  // }
  bandeja(tipoBandeja: number) {
    const options = { relativeTo: this.route, skipLocationChange: false };
    // this.router.navigate(['bandeja', tipoBandeja], options);
    this.router.navigate(['bandeja'], options);
  }
  reporte() {
    const options = { relativeTo: this.route, skipLocationChange: false };
    this.router.navigate(['reporte'], options);
  }
  seguimientoDocumento() {
    const options = { relativeTo: this.route, skipLocationChange: false };
    this.router.navigate(['seguimiento-documento'], options);
  }
  documentoInterno() {
    const options = { relativeTo: this.route, skipLocationChange: false };
    this.router.navigate(['documento-interno'], options);
  }
  //----Para un nuevo documento---
  private navigate(url: any) {
    this.router.navigate([`./${url}`], { relativeTo: this.route });
  }
  documentoNuevo() {
    this.navigate('documento-nuevo');
    const doc = new BandejaDocumento();
    this.setDocument.emit({ documento: doc, vista: 'bandeja-nuevo' });
  }
  //----Para un nuevo documento interno ----
  documentoNuevoInterno() {
    this.navigate('documento-interno-nuevo');
    const doc = new BandejaDocumento();
    this.setDocument.emit({ documento: doc, vista: 'bandeja-nuevo' });
  }
  //-----------Para un reporte de documento interno ----
  documentoInternoReportes() {
    const options = { relativeTo: this.route, skipLocationChange: false };
    this.router.navigate(['documento-interno-reportes'], options);
  }
  //-----------Para un reporte de documento externo ----
  documentoExternoReportes() {
    const options = { relativeTo: this.route, skipLocationChange: false };
    this.router.navigate(['documento-externo-reportes'], options);
  }
}
