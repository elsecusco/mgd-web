import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TwoPicker } from '../../../@shared/two-picker/two-picker';
import { DocumentoInternoFiltro } from '../../../@models/tramite/documento-interno-filtro';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Pair } from '../../../@models/pair';
import { Destinatario } from '../../../@models/tramite/destinatario';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
// import { DestinatarioFiltroComponent } from '../destinatario-filtro/destinatario-filtro.component';
import { TramiteService } from '../tramite-documentario.service';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';
import { Area } from '../../../@models/tramite/area';
import { FileSave } from '../../../@core/file-save.service';
import { Archivo } from '../../../@core/archivo';

@Component({
  selector: 'documento-interno-reportes',
  templateUrl: './documento-interno-reportes.component.html',
  styleUrls: ['./documento-interno-reportes.component.scss'],
})
export class DocumentoInternoReportesComponent implements OnInit {
  @ViewChild('link') public link!: ElementRef;
  datos!: MatTableDataSource<DocumentoInterno>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnas: string[] = [
    'estado',
    'codigoDocumentoInterno',
    'nombreTipoDocumento',
    'asunto',
    'fechaDerivacion',
    //'nombreDerivacion',
    'remitente',
    'destinatario',
  ];
  columnasVisibles: string[] = this.columnas.slice();
  headers: string[] = [
    'E',
    'Código',
    'Tipo Documento',
    'Asunto',
    'Fecha Derivación',
    //'Tipo Derivación',
    'Remitente',
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
  TOOLSTIP = {
    FA: 'En espera',
    AA: 'Atendido Aprobador',
    FP: 'En espera Principal',
    AP: 'Atendido',
    FD: 'En Espera Derivado',
    AD: 'Atendido  Derivado',
    R: 'Rechazado',
    N: ' En Redacción',
  };

  documentoFiltro!: DocumentoInternoFiltro;
  /* @ViewChild(DestinatarioFiltroComponent) boxDest: DestinatarioFiltroComponent;
   */

  loaded!: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$!: Observable<Boolean>;

  tipos!: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$!: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos!: Emittable<TramiteTipos>;

  tiposCorrelativos!: Observable<Pair[]>;

  constructor(private api: TramiteService, private fs: FileSave) {}
  tiposDocumentoInterno: Pair[] = [];
  ngOnInit() {
    this.documentoFiltro = new DocumentoInternoFiltro();
    this.tipos = new TramiteTipos();
    this.loaded$.subscribe((l) => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
    });
    this.documentoFiltro.codigoEstado = 10;
    this.tipos$.subscribe((tipos) => {
      if (tipos.tiposGerencias!.length > 0) {
        this.tipos = tipos;
        this.tiposDocumentoInterno = [
          { codigo: -1, nombre: 'Todos' },
          ...this.tiposDocumentoInterno,
        ];
        // this.tiposDocumentoInterno = [{ codigo: -1, nombre: 'Todos' }].concat(
        //   tipos.tiposDocumentoInterno
        // );
        this.documentoFiltro.codigoTipoDocumento = -1;
        this.documentoFiltro.prefijoGerencia =
          tipos.tiposGerencias![0].codigo || '';
      }
    });
    this.documentoFiltro.codigoTipoDocumento = -1;
    this.documentoFiltro.tipoEmisor = -1;
  }
  //---------aumentado para las fecha-------------------
  changeFecha(fechas: TwoPicker) {
    this.documentoFiltro.fechaInicio = fechas.fechaInicio;
    this.documentoFiltro.fechaFin = fechas.fechaFin;
  }
  destinatariosPara(destinatarios: Destinatario[]) {
    if (destinatarios.length > 0) {
      this.documentoFiltro.loginUsuario = destinatarios[0].loginUsuario;
      this.tiposCorrelativos = this.api.getListarPrefijosYGerencias(
        this.documentoFiltro.loginUsuario
      );
      this.tiposCorrelativos.subscribe((o) => {
        this.documentoFiltro.prefijoUser = o[0].codigo;
      });
    } else this.documentoFiltro.loginUsuario = '';
  }
  areasPara(areas: Area[]) {
    if (areas.length > 0) this.documentoFiltro.prefijoArea = areas[0].sigla;
    else this.documentoFiltro.loginUsuario = '';
  }
  /* radioChange($event: MatRadioChange) {
    if($event.value!=2)
      this.boxDest.removeAll();
  } */
  buscarDoc() {
    this.api
      .getReporteDocumentoInterno(this.documentoFiltro)
      .subscribe((tabla) => this.setTable(tabla));
  }
  descargarPdf() {
    this.api
      .getReporteInternoPdf(this.documentoFiltro)
      .subscribe((blob) => this.setFile(blob));
  }
  setFile(blob: any) {
    const name = 'documentos_internos';
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
    this.api.getReporteInternoPdf(this.documentoFiltro).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

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
}
