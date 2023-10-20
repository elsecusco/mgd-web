import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BandejaState, BandejaStateModel } from '../states/bandeja.state';

import {
  BandejaDocumento,
  ListaAtendido,
  ListaPara,
} from '../../../@models/tramite/bandeja-documento';
import { DocumentoState } from '../states/documento.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
})
export class BandejaComponent implements OnInit, DoCheck {
  //#region variables tabla
  bandejaActiva: string = '';
  contador = 0;
  filtrado: BandejaDocumento[] = [];
  buscarDocs$!: Observable<BandejaStateModel>;
  color: string = '#666';
  datos = new MatTableDataSource<BandejaDocumento>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnas: string[] = [
    'codigoDocumentoTramite',
    'nombreRemitenteDocumento',
    'asunto',
    'numeroDocumento',
    'numeroExpediente',
    'fechaDerivacion',
    'fecha',
    'para',
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
    'N° Expediente',
  ];
  //#endregion variables tabla
  colores = {
    P: '#0b643a',
    C: '#185175',
    leido: '#666',
    1: '#905835',
    2: '#e69605',
    3: '#5fadde',
    4: '#666565',
  };
  icons = {
    leido: 'local_library',
    1: 'check_circle_outline',
    2: 'check_circle',
    3: 'arrow_right_alt',
    4: 'explicit',
  };
  msgs = {
    leido: 'Leido: ',
    1: 'Atención Parcial: ',
    2: 'Atención Final: ',
    3: 'Derivado: ',
    4: 'Atención Externa: ',
  };
  //#region ngxs - state bandeja
  @Select(BandejaState.pending)
  public pending$!: Observable<boolean>;
  @Select(BandejaState.documentos)
  public docs$!: Observable<BandejaDocumento[]>;

  @Emitter(DocumentoState.setDocument)
  private setDocument!: Emittable<{
    documento: BandejaDocumento;
    vista: string;
  }>;
  //#endregion ngxs state bandeja

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.buscarDocs$ = this.store.select((state) => state.bandeja);
  }

  ngDoCheck() {
    this.setTable();
  }

  ngOnInit() {
    this.datos.sort = this.sort;
    this.datos.paginator = this.paginator;
    this.docs$.subscribe((datos) => {
      if (datos === undefined) {
        this.filtro(datos);
        this.datos.data = this.filtrado;
      } else {
        this.datos.data = datos;
      }
    });
    this.paginator._intl.itemsPerPageLabel = 'Items por Página';
  }

  setTable() {
    if (this.contador == 1) {
      this.datos.data = this.filtrado;
      this.datos.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Items por Página';
      this.datos.paginator = this.paginator;
      this.contador = 0;
    }
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
      (h) => h != this.columnas[index]
    );
  }

  selectedRow(doc: BandejaDocumento) {
    if (doc.bandeja == 's') return;
    else {
      let newDoc = { ...doc };
      let i: any = doc.listaAtendido?.findIndex((e) => e.tipoDerivacion == 'P');
      i = i == -1 ? 0 : i;
      newDoc.numeroAtencion = (doc.listaAtendido as ListaAtendido[])[
        i
      ].numeroAtencion;
      newDoc.tipoDerivacion = (doc.listaAtendido as ListaAtendido[])[
        i
      ].tipoDerivacion;
      newDoc.de = (doc.listaAtendido as ListaAtendido[])[i].de;
      newDoc.fechaDerivacion = (doc.listaAtendido as ListaAtendido[])[
        i
      ].fechaDerivacion;
      newDoc.fecha = (doc.listaAtendido as ListaAtendido[])[i].fecha;
      this.processRow(newDoc);
    }
  }
  salidaClick(doc: BandejaDocumento, salida: ListaPara) {
    let newDoc = { ...doc };
    newDoc.para = salida.usuarioDestino;
    newDoc.tipoDerivacion = salida.tipoDerivacion;
    newDoc.numeroAtencion = salida.numeroAtencion;
    newDoc.leido = salida.leido;
    newDoc.atendido = salida.atendido;
    this.processRow(newDoc);
  }
  processRow(doc: BandejaDocumento) {
    this.router.navigate(['../documento-detalle', doc.codigoDocumentoTramite], {
      relativeTo: this.route,
    });
    this.setDocument.emit({ documento: doc, vista: 'bandeja-detalle' });
  }
  //#endregion METODOS TABLA
  getColores(x: any) {
    let t = '';
    if (x == 'P') t = this.colores.P;
    if (x == 'C') t = this.colores.C;
    if (x == 'leido') t = this.colores.leido;
    if (x == 1) t = this.colores[1];
    if (x == 2) t = this.colores[2];
    if (x == 3) t = this.colores[3];
    if (x == 4) t = this.colores[4];
    return t;
  }

  getIcons(x: any) {
    let t = '';
    if (x == 'leido') t = this.icons.leido;
    if (x == 1) t = this.icons[1];
    if (x == 2) t = this.icons[2];
    if (x == 3) t = this.icons[3];
    if (x == 4) t = this.icons[4];
    return t;
  }
  getMsgs(x: any) {
    let t = '';
    if (x == 'leido') t = this.msgs.leido;
    if (x == 1) t = this.msgs[1];
    if (x == 2) t = this.msgs[2];
    if (x == 3) t = this.msgs[3];
    if (x == 4) t = this.msgs[4];
    return t;
  }
  filtro(d: any) {
    if (d === undefined) {
      this.buscarDocs$.subscribe((x: any) => {
        this.bandejaActiva = x.bandejaActiva;
        if (x.bandejaActiva === 'a') {
          this.contador++;
          this.filtrado = x.bandejas.a;
        }
        if (x.bandejaActiva === 'e') {
          this.contador++;
          this.filtrado = x.bandejas.e;
        }
        if (x.bandejaActiva === 's') {
          this.contador++;
          this.filtrado = x.bandejas.s;
        }
      });
    }
  }
}
