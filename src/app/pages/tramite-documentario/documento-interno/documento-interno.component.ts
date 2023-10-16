import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';

@Component({
  selector: 'documento-interno',
  templateUrl: './documento-interno.component.html',
  styleUrls: ['./documento-interno.component.scss'],
})
export class DocumentoInternoComponent implements OnInit {
  datos!: MatTableDataSource<DocumentoInterno>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('link') public link!: ElementRef;

  columnas: string[] = [
    'estado',
    'codigoDocumentoInterno',
    'nombreTipoDocumento',
    'asunto',
    'fechaDerivacion',
    'fecha',
    'nombreDerivacion',
    'destinatario',
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'E',
    'Código',
    'Tipo Documento',
    'Asunto',
    'Fecha Derivación',
    'Fecha',
    'Tipo Derivación',
    'Destinatario',
  ];
  ICONS = {
    N: 'note_add',
    FA: 'alarm',
    AA: 'check_circle',
    FP: 'alarm',
    AP: 'spellcheck',
    FD: 'forward',
    AD: 'check_circle',
    R: 'cancel',
  };
  COLORS = {
    FA: '#07802d', //#ed7f09
    AA: '#07802d',
    FP: '#ed7f09',
    AP: '#E86D0E',
    FD: '#E86D0E',
    AD: '#E86D0E',
    R: '#a42400',
    N: '#ffffff',
  };
  //   FA:"Fila Aprobacion",
  //   FP:"Espera de atencion Principal",
  //   AP:"Atendido por el principal",
  //   FD:"Espera de atencion Derivado",
  //   AD:"Aprobado por un derivado",
  //   R:"Rechazado"
  //   N: "Nuevo Redacción"
  //  AA:"Atendido Aprobacion" es el atendido por los que dan VB
  TOOLSTIP = {
    FA: 'En espera',
    AA: 'Atendido Aprobador',
    FP: 'En espera Principal',
    AP: 'Atendido',
    FD: 'En Espera Derivado',
    AD: 'Finalizado Aprobado', //"Atendido  Derivado",
    R: 'Rechazado',
    N: ' En Redacción',
  };
  //#region ngxs - state bandeja
  @Select(BandejaInternoState.pending)
  public pending$!: Observable<boolean>;
  @Select(BandejaInternoState.documentos)
  public docs$!: Observable<DocumentoInterno[]>;

  activa: string = '';
  @Select(BandejaInternoState.bandejaActiva)
  public activa$!: Observable<string>;

  @Emitter(DocumentoInternoState.setDocument)
  private setDocument!: Emittable<{
    documento: DocumentoInterno;
    vista: string;
  }>;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.setTable();
    this.activa$.subscribe((a) => (this.activa = a));
    this.docs$.subscribe((datos) => this.setTable(datos));
    this.paginator._intl.itemsPerPageLabel = 'Items por Página';
  }
  //#region METODOS TABLA
  setTable(data?: DocumentoInterno[]) {
    this.datos = new MatTableDataSource<DocumentoInterno>(data);
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
      (h) => h != this.columnas[index]
    );
  }

  selectedRow(doc: DocumentoInterno) {
    this.processRow(doc);
  }
  processRow(doc: DocumentoInterno) {
    this.setDocument.emit({ documento: doc, vista: 'entrada' });
    this.router.navigate(['../documento-interno-nuevo'], {
      relativeTo: this.route,
    });
  }
  getColors(x: string) {
    switch (x) {
      case 'FA':
        return this.COLORS.FA;
      case 'AA':
        return this.COLORS.AA;
      case 'FP':
        return this.COLORS.FP;
      case 'AP':
        return this.COLORS.AP;
      case 'FD':
        return this.COLORS.FD;
      case 'AD':
        return this.COLORS.AD;
      case 'R':
        return this.COLORS.R;
      case 'N':
        return this.COLORS.N;
      default:
        return;
    }
  }

  getToolstip(x: string): string {
    switch (x) {
      case 'FA':
        return this.TOOLSTIP.FA;
      case 'AA':
        return this.TOOLSTIP.AA;
      case 'FP':
        return this.TOOLSTIP.FP;
      case 'AP':
        return this.TOOLSTIP.AP;
      case 'FD':
        return this.TOOLSTIP.FD;
      case 'AD':
        return this.TOOLSTIP.AD;
      case 'R':
        return this.TOOLSTIP.R;
      case 'N':
        return this.TOOLSTIP.N;
      default:
        return '';
    }
  }
  getIcons(x: string): string {
    switch (x) {
      case 'N':
        return this.ICONS.N;
      case 'R':
        return this.ICONS.R;
      case 'FA':
        return this.ICONS.FA;
      case 'AA':
        return this.ICONS.AA;
      case 'FP':
        return this.ICONS.FP;
      case 'AP':
        return this.ICONS.AP;
      case 'FD':
        return this.ICONS.FD;
      case 'AD':
        return this.ICONS.AD;
      default:
        return '';
    }
  }
  //#endregion METODOS TABLA
}
