import { Component, OnInit } from '@angular/core';
import { SeguimientoFiltro } from '../../../@models/tramite/seguimiento-filtro';
import { Observable } from 'rxjs';
import { SeguimientoState } from '../states/seguimiento.states';
import { Select } from '@ngxs/store';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { TwoPicker } from '../../../@shared/two-picker/two-picker';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'seguimiento-filtro',
  templateUrl: './seguimiento-filtro.component.html',
  styleUrls: ['./seguimiento-filtro.component.scss'],
})
export class SeguimientoFiltroComponent implements OnInit {
  // // Asigando el año actual
  // anio= (new Date()).getFullYear()
  // // Combo de los codigos del documento
  //selected = 1;
  // filtro: number;
  // valor: string;

  //------------Se aumento para la fecha-----------

  loaded!: Boolean;
  @Select(SeguimientoState.loaded)
  public loaded$!: Observable<Boolean>;

  //------------------------------------------------

  documentof!: SeguimientoFiltro;
  @Select(SeguimientoState.seguimientoFiltro)
  public documentof$!: Observable<SeguimientoFiltro>;

  @Emitter(SeguimientoState.loadDocuments)
  private loadDocs!: Emittable<SeguimientoFiltro>;

  //-------Se aumento para las fechas ---------------
  public dateTimeRange!: Date[];
  //--------------------------------------------------
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
    //console.log(this.documentof)
    this.buscarDoc();
  }
  //---------aumentado para las fecha-------------------
  changeFecha(fechas: TwoPicker) {
    //  this.documentof.fechaInicio= this.dateTimeRange[0],
    //  this.documentof.fechaFin=this.dateTimeRange[1];
    //this.documentof = { this.b:this.documentof...fechas};
    this.documentof.fechaInicio = fechas.fechaInicio;
    this.documentof.fechaFin = fechas.fechaFin;
  }
  actualizar() {
    this.loadDocs.emit(this.documentof);
  }
  //----------------------------------------------------

  buscarDoc() {
    this.loadDocs.emit(this.documentof);
  }
}
