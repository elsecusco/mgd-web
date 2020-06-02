import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { SeguimientoState } from '../states/seguimiento.states';
import { SeguimientoFiltro } from '@models/tramite/seguimiento-filtro';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { ReportePrincipalComponent } from '../reporte-principal/reporte-principal.component';
import { ReporteGraficoComponent } from '../reporte-grafico/reporte-grafico.component';
import { TramiteService } from '../tramite-documentario.service';
import { tap } from 'rxjs/operators';
import { GrafoReporte } from '@models/tramite/grafo-reporte';



@Component({
  selector: 'seguimiento-documento',
  templateUrl: './seguimiento-documento.component.html',
  styleUrls: ['./seguimiento-documento.component.scss']
})
export class SeguimientoDocumentoComponent implements OnInit {

  datos: MatTableDataSource<SeguimientoDocumento>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('link') public link: ElementRef;

  columnas: string[] = [
    'codigoDocumentoTramite',
    'fechaDocumento',
    'nombreRemitenteDocumento',
    'nombreTipoDocumento',
    'numeroPaginas',
    'numeroExpediente',
    'contenidoDocumento',
    'nombreUsuario',
    'acciones'
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Cod. Único de Expediente',
    'Fecha Documento',
    'Remitente',
    'Documento',
    'N° Páginas',
    'N° Expediente',
    'Asunto',
    'Destinatario',
    'Acciones'
  ];
    documentof: SeguimientoFiltro;
    @Select(SeguimientoState.seguimientoFiltro)
    public documentof$: Observable<SeguimientoFiltro>;

    @Emitter(SeguimientoState.loadDocuments)
    private loadDocs: Emittable<SeguimientoFiltro>;
    //#endregion variables tabla
    //#region ngxs - state bandeja
    @Select(SeguimientoState.pending)
    public pending$:Observable<boolean>;
    @Select(SeguimientoState.documentos)
    public docs$: Observable<SeguimientoDocumento[]>;

    constructor( public dialog: MatDialog ,
      private api: TramiteService
              ) { }

  ngOnInit() {
    this.documentof = new SeguimientoFiltro();
    this.documentof$.subscribe(b=>{
      this.documentof ={
        nombreRemitenteDocumento:b.nombreRemitenteDocumento,
        // anio:b.anio,
        filtro: b.filtro,
        valor:b.valor,
        fechaInicio: b.fechaFin,
        fechaFin: b.fechaInicio,
        check: b.check
         };
     });
    //Línea que resume todo
    //this.documentof$.subscribe(b => this.documentof = b);
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
  verReporte(codigoDocumento: number){
    const dialogRef = this.dialog.open( 
      ReportePrincipalComponent, {
        //width: '800px',
        height:'700px',
        data: codigoDocumento
      });
        dialogRef.afterClosed().subscribe(result => {
        //this.clear();
     });
  }
  verReporteGrafo(detalleSeguimiento: SeguimientoDocumento){
    this.api.graphReport(detalleSeguimiento.codigoDocumentoTramite)
            .subscribe(gr =>{
            const dialogRef = this.dialog.open(
            ReporteGraficoComponent, {
            width: '850px',
            //height:'500px',
            data: {detalle:detalleSeguimiento,
            nodos:gr.nodos,
            flechas:gr.flechas}
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          this.clear();
        });
      }
    )
  }
    clear(){}
  // verReporteGrafo(detalleSeguimiento: SeguimientoDocumento){
  //   const gr:GrafoReporte={"flechas":[{"id":"a","source":"desarrollador01","de":"Yessenia Baca","target":"cchevarria","para":"CHRISTIAN HELER CHEVARRIA MAR","label":"(1) Ago 28, 19","tipo":"P","descripcionAtencion":"ATENDER"},
  //   {"id":"b","source":"desarrollador01","de":"Yessenia Baca","target":"promanh","para":"Pedro Roman Huaman","label":"(2) Ago 28, 19","tipo":"P","descripcionAtencion":"ATENDER"},
  //   {"id":"c","source":"desarrollador01","de":"Yessenia Baca","target":"sielsecoordinacion","para":"Johann Cortez","label":"(3) Ago 28, 19","tipo":"C","descripcionAtencion":"ATENDER"},
  //   {"id":"d","source":"cchevarria","de":"CHRISTIAN HELER CHEVARRIA MAR","target":"mgongora","para":"MARIO FERNANDO GONGORA QUINTANILLA","label":"(4) Ago 28, 19","tipo":"P","descripcionAtencion":"POR FAVOR ATENDER PRONTAMENTE"},
  //   {"id":"e","source":"cchevarria","de":"CHRISTIAN HELER CHEVARRIA MAR","target":"psamalvides","para":"PEDRO SAMALVIDES","label":"(5) Ago 28, 19","tipo":"C","descripcionAtencion":"POR FAVOR ATENDER PRONTAMENTE"},
  //   {"id":"f","source":"cchevarria","de":"CHRISTIAN HELER CHEVARRIA MAR","target":"sielsecoordinacion","para":"Johann Cortez","label":"(6) Ago 28, 19","tipo":"C","descripcionAtencion":"POR FAVOR ATENDER PRONTAMENTE"}],
  //   "nodos":[{"id":"desarrollador01","label":"Yessenia Baca","labelShow":"A"},{"id":"cchevarria","label":"CHRISTIAN HELER CHEVARRIA MAR","labelShow":"B"},{"id":"promanh","label":"Pedro Roman Huaman","labelShow":"C"},
  //   {"id":"sielsecoordinacion","label":"Johann Cortez","labelShow":"D"},{"id":"mgongora","label":"MARIO FERNANDO GONGORA QUINTANILLA","labelShow":"E"},{"id":"psamalvides","label":"PEDRO SAMALVIDES","labelShow":"F"}]}
  //   //console.log("e",detalleSeguimiento)
  //       const dialogRef = this.dialog.open(
  //         ReporteGraficoComponent, {
  //           width: '750px',
  //           height:'750px',
  //           data: {detalle:detalleSeguimiento,
  //                  nodos:gr.nodos,
  //                  flechas:gr.flechas}
  //         }
  //       );
  //       dialogRef.afterClosed().subscribe(result => {
  //         //this.clear();
  //       });
  // }
  }

  
