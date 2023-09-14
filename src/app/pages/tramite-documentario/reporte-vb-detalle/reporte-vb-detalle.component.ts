import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SeguimientoDocumento } from '../../../@models/tramite/seguimiento-documento';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SeguimientoFiltroVb } from '../../../@models/tramite/seguimiento-filtro-vb';
import { TramiteService } from '../tramite-documentario.service';
import { ReporteVBprincipalComponent } from '../reporte-vbprincipal/reporte-vbprincipal.component';
import { FormGroup } from '@angular/forms';
import { Select } from '@ngxs/store';
import { ReporteVbState } from '../states/reporte-vb.state';

@Component({
  selector: 'reporte-vb-detalle',
  templateUrl: './reporte-vb-detalle.component.html',
  styleUrls: ['./reporte-vb-detalle.component.scss']
})
export class ReporteVBDetalleComponent implements OnInit {

  datos!: MatTableDataSource<SeguimientoDocumento>


  @Select(ReporteVbState.pending)
  public pending$!:Observable<boolean>;

  documentof!: SeguimientoFiltroVb;
  @Select(ReporteVbState.seguimientoFiltroVb)
  public documentof$!: Observable<SeguimientoFiltroVb>;


  @Select(ReporteVbState.documentos)
  public docs$!: Observable<SeguimientoDocumento[]>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('link') public link!: ElementRef;

  form!: FormGroup;
  @ViewChild('f') f: any;

  columnas: string[] = [
    'codigoDocumentoInterno',
    'fechaDocumento',
    'contenidoDocumento',
    'nombreTipoDocumento',
    'nombreTipoDerivacion',
    'nombreUsuario',
    'estado',
    'acciones'
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Cod. Documento Interno',
    'Fecha Documento',
    'Asunto',
    'Tipo Documento',
    'Tipo Derivación',
    'Tramitador',
    'Estado',
    'Acciones'
  ];
  constructor( public dialog: MatDialog, private api: TramiteService) { }
  ngOnInit() {
     this.documentof = new SeguimientoFiltroVb();
     //Línea que resume todo
     this.documentof$.subscribe(b => this.documentof = b);
     this.setTable();
     this.docs$.subscribe(datos => this.setTable(datos));
        }
     //#region METODOS TABLA
      setTable(data?: SeguimientoDocumento[]) {
      this.datos = new MatTableDataSource<SeguimientoDocumento>(data);
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
    // Listo para usar es el componente es el model que abre que EL PDF del reporte
    verReporte(codigoDocumento: number){
    const dialogRef = this.dialog.open(
      ReporteVBprincipalComponent, {
        width: '1200px',
        height:'100vh',
        data: codigoDocumento
      });
        dialogRef.afterClosed().subscribe((result: any) => {
        //this.clear();
     });
  }

  clear(){}

}



