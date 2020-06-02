import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TramiteService } from '../tramite-documentario.service';
import { ArchivoDocumento } from '@models/tramite/archivo.documento';
import { FileSave } from '@core/file-save.service';
import { Archivo } from '@core/archivo';
import { notifyOk } from '@core/swal';
import { AtenderDocumento } from '@models/tramite/atender-documento';
import { Observable } from 'rxjs';
import { max } from 'rxjs/operators';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { BandejaState } from '../states/bandeja.state';
import { Select } from '@ngxs/store';
import { DetalleAdjuntarComponent } from '../detalle-adjuntar/detalle-adjuntar.component';
import { MatRadioChange } from '@angular/material';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';

@Component({
  selector: 'documento-adjuntar',
  templateUrl: './documento-adjuntar.component.html',
  styleUrls: ['./documento-adjuntar.component.scss']
})
export class DocumentoAdjuntarComponent implements OnInit {
  private _codigoDocumento: number;
  private _numeroAtencion: number;
   
  // tipoArchivos=[{val:1,nome:"Principal"},
  //               {val:2,nome:"Anexo"}]

  MaxFechaRecepcion : Observable <ArchivoDocumento> 

  bandejaf: BandejaFiltro;
  @Select(BandejaState.bandejaFiltro)
  public bandejaf$: Observable<BandejaFiltro>;

  buzonActual:BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;

  @Input()
    set codigoDocumento(codigoDocumento: number) {
    this._codigoDocumento = codigoDocumento;
  }
  get codigoDocumento(): number {
    return this._codigoDocumento;
  }

  @Input()
  set numeroAtencion(_numeroAtencion: number) {
  this._numeroAtencion = _numeroAtencion;
  }
  get numeroAtencion(): number {
    return this._numeroAtencion;
  }

  @ViewChild('link') public link: ElementRef;
  //columnas = ['nombreArchivo','ubicacionArchivo', 'fechaArchivo', 'accion'];
  columnas = ['nombreArchivo','descripcionArchivo','fechaArchivo', 'accion','codigoTipoDocumentoTramiteAdjunto'];
  archivos: ArchivoDocumento[] = [];

  constructor(
    private api: TramiteService,
    public dialog: MatDialog,
    private fs: FileSave
  ) {}

  ngOnInit() {
    // this.bandejaf = new BandejaFiltro();
    this.bandejaf$.subscribe(b => this.bandejaf =b);
    this.buzonActual$.subscribe(u=>this.buzonActual=u);
    this.getArchivos();
  }

  adjuntar() {
    if (this.numeroAtencion == undefined)
        this.numeroAtencion = 0 
        const dialogRef = this.dialog.open( DetalleAdjuntarComponent, {
          width: '600px',
          data: {codigoDocumento: this.codigoDocumento,
                numeroAtencion: this.numeroAtencion}
        }); 
        dialogRef.afterClosed().subscribe(complete => {
          if (complete) this.getArchivos();
        });
  }
  // actualizarTipoAdjunto(e:ArchivoDocumento){
  //   console.log(JSON.stringify(e))
  //   this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,e.codigoTipoDocumentoTramiteAdjunto)
  //    .subscribe(res => {
  //     if (res.id == 0) notifyOk(res.mensaje);
  //     });  //console.log(JSON.stringify(e))
  // }
  actualizarTipoAdjunto(event: MatRadioChange, e:ArchivoDocumento){
    //  console.log(JSON.stringify(e))
    //  console.log(JSON.stringify(this.buzonActual))
    this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,event.value)
     .subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
      });
  }
  getArchivos() {
    this.api
      .archivosDocumento(this.codigoDocumento, this.buzonActual.loginUsuarioBuzon)
      .subscribe(res => (this.archivos = res));
  }
  descargar(e: ArchivoDocumento) {
    // if ((e.nombreArchivo.includes('.pdf'))|| (e.nombreArchivo.endsWith('.xlsx'))|| (e.nombreArchivo.includes('.docx')))
    if ((e.nombreArchivo.includes('.pdf')))
      this.api
        .descargarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
        .subscribe(blob => this.setFile(e, blob));
        
  }
 eliminar(e: ArchivoDocumento) {
     this.api
    .eliminarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
    .subscribe(res => {
    if (res.id == 0) notifyOk(res.mensaje);
    });
      //eliminar columna del html
      this.archivos = this.archivos.filter((value,key)=>{
      return value.codigoDocumentoAdjunto != e.codigoDocumentoAdjunto;
    });
  } 

  setFile(e: ArchivoDocumento, blob) {
    const pos=e.nombreArchivo.lastIndexOf('.');
    const archivo: Archivo = {
    nombre: e.nombreArchivo.substring(0,pos),
    archivo: blob,
    extension: e.nombreArchivo.substring(pos),
    element: this.link
    };
    this.fs.save(archivo);
    }
  // openPDF(e: ArchivoDocumento) {
  //     this.api
  //       .descargarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
  //       .subscribe(res => {
  //         const fileURL = URL.createObjectURL(res);
  //         window.open(fileURL, '_blank');
  //         });
        
  //   }
}