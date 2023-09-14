import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { TwoPicker } from '../../../@shared/two-picker/two-picker';
import { SeguimientoFiltroVb } from '../../../@models/tramite/seguimiento-filtro-vb';
import { ReporteVbState } from '../states/reporte-vb.state';

@Component({
  selector: 'reporte-vb',
  templateUrl: './reporte-vb.component.html',
  styleUrls: ['./reporte-vb.component.scss'],
})
export class ReporteVBComponent implements OnInit {
  loaded!: Boolean;
  @Select(ReporteVbState.loaded)
  public loaded$!: Observable<Boolean>;

  documentof!: SeguimientoFiltroVb;
  @Select(ReporteVbState.seguimientoFiltroVb)
  public documentof$!: Observable<SeguimientoFiltroVb>;

  @Emitter(ReporteVbState.loadDocuments)
  private loadDocs!: Emittable<SeguimientoFiltroVb>;

  public dateTimeRange!: Date[];

  constructor() {}

  ngOnInit() {
    this.documentof$.subscribe((b) => (this.documentof = { ...b }));
    this.dateTimeRange = [
      this.documentof.fechaInicio,
      this.documentof.fechaFin,
    ];
    this.loaded$.subscribe((l) => {
      if (!l) this.loadDocs.emit(this.documentof);
    });

    this.buscarDoc();
  }
  changeFecha(fechas: TwoPicker) {
    this.documentof.fechaInicio = fechas.fechaInicio;
    this.documentof.fechaFin = fechas.fechaFin;
  }
  actualizar() {
    this.loadDocs.emit(this.documentof);
  }
  buscarDoc() {
    this.loadDocs.emit(this.documentof);
    console.log(JSON.stringify(this.documentof));
  }
}
