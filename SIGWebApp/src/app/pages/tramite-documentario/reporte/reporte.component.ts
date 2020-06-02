import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ReporteDocumento } from '@models/tramite/reporte-documento';
import { Select } from '@ngxs/store';
import { ReporteState } from '../states/reporte.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  //#region variables tabla
  datos: MatTableDataSource<ReporteDocumento>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnas: string[] = [
    'CodigoDocumentoTramite',
    'NumeroDocumento',
    'FechaDerivacion',
    'NombreTipoDocumento',
    'FechaDocumento',
    'FechaRecepcion',
    'ContenidoDocumento',
    'NombreRemitenteDocumento',
    'LoginUsuarioDestino',
    'NombreArea'
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Cod. Único de Expediente ',
    'N° Documento',
    'Fecha Derivacion',
    'Nombre Tipo Documento',
    'Fecha Documento',
    'Fecha Recepcion',
    'Contenido Documento',
    'Nombre Remitente Documento',
    'Login Usuario Destino',
    'Nombre Area'
  ];
    //#endregion variables tabla
    //#region ngxs - state bandeja
    @Select(ReporteState.pending)
    public pending$:Observable<boolean>;
    @Select(ReporteState.documentos)
    public docs$: Observable<ReporteDocumento[]>;

  constructor() { }

  ngOnInit() {
    this.setTable();
    this.docs$.subscribe(datos => this.setTable(datos));
  }
  //#region METODOS TABLA
  setTable(data?: ReporteDocumento[]) {
    this.datos = new MatTableDataSource<ReporteDocumento>(data);
    this.datos.sort = this.sort;
    this.datos.paginator = this.paginator;
  }
  filter(value: string) {
    this.datos.filter = value.trim().toLowerCase();
  }
  changeDisplayColumn(value: { checked: boolean; index: number }) {
    if (value.checked) this.addColumn(value.index);
    else this.removeColumn(value.index);
  }

  addColumn(index: number) {
    this.columnasVisibles.splice(index, 0, this.columnas[index]);
  }
  removeColumn(index: number) {
    this.columnasVisibles = this.columnasVisibles.filter(
      h => h != this.columnas[index]
    );
  }
  //#endregion METODOS TABLA
}
