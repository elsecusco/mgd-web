import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { ReporteState } from '../states/reporte.state';
import { Observable, from, of } from 'rxjs';

// import { TwoPicker } from '@shared/two-picker/two-picker';
import { ReporteFiltro } from '../../../@models/tramite/reporte-filtro';
import { FormControl } from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  finalize,
} from 'rxjs/operators';
import { UsuarioApp } from '../../../@models/tramite/usuario-app';
import { FileSave } from '../../../@core/file-save.service';
import { Archivo } from '../../../@core/archivo';
import { AuthService } from '../../../@core/auth/auth.service';
// import { Usuario } from '@core/auth/usuario';

@Component({
  selector: 'reporte-filtro',
  templateUrl: './reporte-filtro.component.html',
  styleUrls: ['./reporte-filtro.component.scss'],
})
export class ReporteFiltroComponent implements OnInit {
  nombreUsuario = new FormControl();
  usuarios!: Observable<UsuarioApp[]>;
  show = 'hidden';

  @ViewChild('link') public link!: ElementRef;

  loaded!: Boolean;
  @Select(ReporteState.loaded)
  public loaded$!: Observable<Boolean>;

  reportef: ReporteFiltro = new ReporteFiltro();
  @Select(ReporteState.reporteFiltro)
  public reportef$!: Observable<ReporteFiltro>;

  public dateTimeRange!: Date[];

  @Emitter(ReporteState.loadDocuments)
  private loadDocs!: Emittable<ReporteFiltro>;

  constructor(
    private api: TramiteService,
    private fs: FileSave,
    private auth: AuthService
  ) {}

  displayFn = (r?: UsuarioApp) => (r ? r.nombreUsuario : '');
  ngOnInit() {
    const userActual = this.auth.getUser();
    this.reportef$.subscribe((r) => {
      this.reportef = {
        usuario: r.usuario,
        fechaInicio: r.fechaInicio,
        fechaFin: r.fechaFin,
      };
    });
    this.loaded$.subscribe((l) => {
      if (!l) {
        this.reportef.usuario = userActual.loginUsuario;
        this.loadDocs.emit(this.reportef);
      }
    });
    this.usuarios = this.nombreUsuario.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((nombre) => this.buscarUsuario(nombre))
    );
    this.nombreUsuario.setValue({
      nombreUsuario: userActual.nombreUsuario,
      loginUsuario: userActual.loginUsuario,
    });
    this.dateTimeRange = [this.reportef.fechaInicio, this.reportef.fechaFin];
  }
  buscarUsuario(value: any): Observable<UsuarioApp[]> {
    if (typeof value == 'object' || value.length < 5) return of([]);

    this.show = 'visible';
    return this.api
      .buscarUsuario(value)
      .pipe(finalize(() => (this.show = 'hidden')));
  }
  changeFecha() {
    this.reportef.fechaInicio = this.dateTimeRange[0];
    this.reportef.fechaFin = this.dateTimeRange[1];
  }
  actualizar() {
    this.loadDocs.emit(this.reportef);
  }

  selectUsuarios(r: any) {
    this.reportef.usuario = r.loginUsuario;
  }
  descargarPdf() {
    this.api
      .getReportePdf(this.reportef)
      .subscribe((blob) => this.setFile(blob));
  }
  setFile(blob: any) {
    const name = this.reportef.usuario;
    const archivo: Archivo = {
      nombre: name,
      archivo: blob,
      extension: '.pdf',
      element: this.link,
    };
    this.fs.save(archivo);
  }
  // openPdf(){
  //  window.open(this.api.getReporteUrl(this.reportef),"_target") ;
  // }
  openPdf() {
    this.api.getReportePdf(this.reportef).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }
}
