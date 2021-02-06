import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';

import { TramiteService } from '../tramite-documentario.service';
import { ArchivoDocumento, ArchivosAnexos } from '@models/tramite/archivo.documento';
import { FileSave } from '@core/file-save.service';
import { Archivo } from '@core/archivo';
import { notifyOk } from '@core/swal';
import { Observable } from 'rxjs';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { BandejaState } from '../states/bandeja.state';
import { Select } from '@ngxs/store';
import { DetalleAdjuntarComponent } from '../detalle-adjuntar/detalle-adjuntar.component';
import { MatRadioChange } from '@angular/material';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { PdfViewerDialogComponent } from '../pdf-viewer-dialog/pdf-viewer-dialog.component';
import { DocumentoInternoVisorComponent } from '../documento-interno-visor/documento-interno-visor.component';

@Component({
  selector: 'documento-adjuntar',
  templateUrl: './documento-adjuntar.component.html',
  styleUrls: ['./documento-adjuntar.component.scss']
})
export class DocumentoAdjuntarComponent implements OnInit {
  private _codigoDocumento: number;
  private _numeroAtencion: number;
  
  @Output() sizeAdjuntos = new EventEmitter<number>();
  @ViewChild("iniciales") tableIniciales: MatTable<any>;
  @ViewChild("respuesta") tableRespuesta: MatTable<any>;

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
  columnas = ['nombreUsuario','nombreArchivo','descripcionArchivo','fechaArchivo', 'accion','codigoTipoDocumentoTramiteAdjunto'];
  archivos:ArchivosAnexos={anexosIniciales:[],anexosRespuesta:[]}
  
  constructor(
    private api: TramiteService,
    public dialog: MatDialog,
    private fs: FileSave
  ) {}

  ngOnInit() {
 
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
 
  actualizarTipoAdjunto(event: MatRadioChange, e:ArchivoDocumento){
    //  console.log(JSON.stringify(e))
    this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,event.value)
     .subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
      });
  }
  getArchivos() {
    this.api
      .archivosDocumento(this.codigoDocumento, this.buzonActual.loginUsuarioBuzon)
      .subscribe(res => {this.archivos = res
        //console.log(JSON.stringify(res))
        this.sizeAdjuntos.emit(res.anexosIniciales.length+res.anexosRespuesta.length);
      });
  }
  descargar(e: ArchivoDocumento) {
       //if ((e.nombreArchivo.includes('.pdf'))) 
      this.api
        .descargarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
        .subscribe(blob => this.setFile(e, blob));
        
  }
  // async descargarVarios(files: any) {
  //   for (let file of files) {
  //     await this.descargar(file);
  //   }
  //   //files.forEach(file => this.descargar(file))
  // }
 eliminar(tipo:string,e: ArchivoDocumento) {
     this.api
    .eliminarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
    .subscribe(res => {
    if (res.id == 0) notifyOk(res.mensaje);
    });
      //eliminar columna del html
      let archivos=(tipo=="iniciales")?this.archivos.anexosIniciales:this.archivos.anexosRespuesta;
          archivos = archivos.filter((value,key)=>{
        return value.codigoDocumentoAdjunto != e.codigoDocumentoAdjunto;
      });
      if(tipo=="iniciales")
        this.tableIniciales.dataSource=archivos;
      else
      if(tipo=="respuesta")
        this.tableRespuesta.dataSource=archivos;
      //console.log(archivos.length)
  } 
  
  abrirVisor(e:ArchivoDocumento){
      //console.log(archivoPrincipal);
        const data={
          codigoDocumento: e.codigoDocumento,
          codigoDocumentoAdjunto:e.codigoDocumentoAdjunto
        }
        this.dialog.open(
          PdfViewerDialogComponent, {
            width: '50vw',
            height:'100vh',
            data: data
          }
        );    
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
  endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
  } 
}