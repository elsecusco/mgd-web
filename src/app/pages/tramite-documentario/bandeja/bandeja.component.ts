import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { BandejaState } from '../states/bandeja.state';

import { BandejaDocumento, ListaPara } from '@models/tramite/bandeja-documento';
import { DocumentoState } from '../states/documento.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {
  //#region variables tabla
  datos: MatTableDataSource<BandejaDocumento>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnas: string[] = [
    'codigoDocumentoTramite',
    'nombreRemitenteDocumento',
    'asunto',
    'numeroDocumento',
    'numeroExpediente',
    'fechaDerivacion',
    'fecha',
    'para'
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'Código',
    'Remitente',
    'Asunto',
    'N° Documento',
    'N° Expediente',
    'Fecha Derivación',
    'Fecha',
    'Destinatario',
    'N° Expediente'
  ];
  //#endregion variables tabla
  colores = {P:"#0b643a",
            C:"#185175",
            leido:"#666",
            1:"#905835",
            2:"#e69605",
            3:"#5fadde",
            4:"#666565"}
  icons={
    leido:"local_library",
    1:"check_circle_outline",
    2:"check_circle",
    3:"arrow_right_alt",
    4:"explicit"
  }
  msgs={
    leido:"Leido: ",
    1:'Atención Parcial: ',
    2:'Atención Final: ',
    3:'Derivado: ',
    4:'Atención Externa: '
  }
  //#region ngxs - state bandeja
  @Select(BandejaState.pending)
  public pending$: Observable<boolean>;
  @Select(BandejaState.documentos)
  public docs$: Observable<BandejaDocumento[]>;

  @Emitter(DocumentoState.setDocument)
  private setDocument: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;
  //#endregion ngxs state bandeja

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.setTable();
    this.docs$.subscribe(datos => this.setTable(datos));
    this.paginator._intl.itemsPerPageLabel = 'Items por Página';
  }
  //#region METODOS TABLA
  setTable(data?: BandejaDocumento[]) {
    this.datos = new MatTableDataSource<BandejaDocumento>(data);
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

  selectedRow(doc: BandejaDocumento) {
    if (doc.bandeja =='s') return;
    else {
      let newDoc= {...doc}
      let i =doc.listaAtendido.findIndex(e=>e.tipoDerivacion=='P');
      i=(i==-1)?0:i;
      newDoc.numeroAtencion= doc.listaAtendido[i].numeroAtencion;
      newDoc.tipoDerivacion= doc.listaAtendido[i].tipoDerivacion;
      newDoc.de= doc.listaAtendido[i].de;
      newDoc.fechaDerivacion= doc.listaAtendido[i].fechaDerivacion;
      newDoc.fecha= doc.listaAtendido[i].fecha;
      this.processRow(newDoc);
    }
  }
  salidaClick(doc: BandejaDocumento, salida: ListaPara){
    let newDoc={...doc}
        newDoc.para=salida.usuarioDestino;
        newDoc.tipoDerivacion=salida.tipoDerivacion;
        newDoc.numeroAtencion=salida.numeroAtencion;
        newDoc.leido=salida.leido;
        newDoc.atendido=salida.atendido;
    this.processRow(newDoc);
  }
  processRow(doc: BandejaDocumento){
    this.router.navigate(['../documento-detalle', doc.codigoDocumentoTramite], {
      relativeTo: this.route
    });
    this.setDocument.emit({ documento: doc, vista: 'bandeja-detalle' });
  }
  //#endregion METODOS TABLA
}
