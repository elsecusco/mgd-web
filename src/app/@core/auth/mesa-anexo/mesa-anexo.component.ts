import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { ArchivoDocumento } from '../../../@models/tramite/archivo.documento';
import { FileSave } from '../../../@core/file-save.service';
import { Archivo } from '../../../@core/archivo';
import { Observable } from 'rxjs';
import { AdjuntarMesaComponent } from '../adjuntar-mesa/adjuntar-mesa.component';
import { FileAdjunto } from '../../../@models/documento-mesa';

@Component({
  selector: 'mesa-anexo',
  templateUrl: './mesa-anexo.component.html',
  styleUrls: ['./mesa-anexo.component.scss'],
})
export class MesaAnexoComponent implements OnInit {
  screenAprobacion = false;
  tipoArchivos = [
    { val: 1, nome: 'Principal' },
    { val: 2, nome: 'Anexo' },
  ];
  aprobado = false;
  rechazado = false;

  @ViewChild(MatTable) table: MatTable<any>;
  //columnas = ['nombreArchivo','ubicacionArchivo', 'fechaArchivo', 'accion'];
  columnas = ['nombreArchivo', 'descripcionArchivo', 'accion'];

  @Output() listAnexos = new EventEmitter<Array<FileAdjunto>>();
  anexos: Array<FileAdjunto> = [];

  @Output() principal = new EventEmitter<FileAdjunto>();
  archivoPrincipal: FileAdjunto = {
    descripcionArchivo: '',
    nombreArchivo: '',
    file: undefined,
    // file: null,
    codigoTipoDocumentoTramiteAdjunto: 1,
    titulo: '',
  };

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  adjuntar(tipo: number) {
    const dialogRef = this.dialog.open(AdjuntarMesaComponent, {
      width: '600px',
      data: { tipoArchivo: this.tipoArchivos[tipo - 1] },
    });
    dialogRef.afterClosed().subscribe((adjunto: any) => {
      if (adjunto)
        if (tipo == 1) {
          this.archivoPrincipal = adjunto;
          this.principal.emit(this.archivoPrincipal);
        } else {
          this.anexos.push(adjunto);
          this.refreshTable();
        }
    });
  }

  // actualizarTipoAdjunto(e:ArchivoDocumento){
  //   console.log(JSON.stringify(e))
  //   this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,e.codigoTipoDocumentoTramiteAdjunto)
  //    .subscribe(res => {
  //     if (res.id == 0) notifyOk(res.mensaje);
  //     });  //console.log(JSON.stringify(e))
  // }

  eliminar(index: any) {
    if (index == -1) {
      this.archivoPrincipal = {
        descripcionArchivo: '',
        nombreArchivo: '',
        file: undefined,
        codigoTipoDocumentoTramiteAdjunto: 1,
        titulo: '',
      };
      this.principal.emit(this.archivoPrincipal);
    } else {
      this.anexos.splice(index, 1);
      this.refreshTable();
    }
  }
  refreshTable() {
    this.table.renderRows();
    this.listAnexos.emit(this.anexos);
  }
}
