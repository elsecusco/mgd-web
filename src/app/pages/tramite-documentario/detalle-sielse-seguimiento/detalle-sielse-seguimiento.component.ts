import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DetalleSielse } from '@models/tramite/detalle-sielse';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'detalle-sielse-seguimiento',
  templateUrl: './detalle-sielse-seguimiento.component.html',
  styleUrls: ['./detalle-sielse-seguimiento.component.scss']
})
export class DetalleSielseSeguimientoComponent implements OnInit {
  datos: DetalleSielse[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  private _codigoSielse: string;
  @Input()
    set codigoSielse(codigoSielse: string) {
    this._codigoSielse = codigoSielse;
  }
  get codigoSielse(): string {
    return this._codigoSielse;
  }

  columnas: string[] = [
    'nombre',
    'fecha',
    'descripcion',
    'responsable'    
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Estado',
    'Fecha',
    'Descripcion',
    'Responsable'
  ];
  constructor(private api: TramiteService) { }

  ngOnInit() {
    this.api
      .detalleSielseSeguimiento(this.codigoSielse)
      .subscribe(res => {this.datos = res;
      });
  }

}
