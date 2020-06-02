import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TramiteService } from '../tramite-documentario.service';
import { ArchivoDocumento } from '@models/tramite/archivo.documento';
import { FileSave } from '@core/file-save.service';
import { Archivo } from '@core/archivo';
import { notifyOk } from '@core/swal';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { MatRadioChange } from '@angular/material';
import { DetalleAdjuntarInternoComponent } from '../detalle-adjuntar-interno/detalle-adjuntar-interno.component';
import { DocumentoInterno } from '@models/tramite/documento-interno';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { DetalleAprobacionInternoComponent } from '../detalle-aprobacion-interno/detalle-aprobacion-interno.component';
import { DetalleRechazarInternoComponent } from '../detalle-rechazar-interno/detalle-rechazar-interno.component';
import { BandejaInternoState } from '../states/bandeja-interno.state';

@Component({
  selector: 'documento-anexo-interno',
  templateUrl: './documento-anexo-interno.component.html',
  styleUrls: ['./documento-anexo-interno.component.scss']
})
export class DocumentoAnexoInternoComponent implements OnInit {
  screenAprobacion = false;
  tipoArchivos=[{val:1,nome:"Principal"},
                {val:2,nome:"Anexo"}];
  aprobado = false;
  rechazado = false;
  MaxFechaRecepcion : Observable <ArchivoDocumento> 

  @ViewChild('link') public link: ElementRef;
  //columnas = ['nombreArchivo','ubicacionArchivo', 'fechaArchivo', 'accion'];
  columnas = ['nombreArchivo','descripcionArchivo','fechaArchivo', 'accion'];
  archivos: ArchivoDocumento[] = [];

  archivoPrincipal: ArchivoDocumento = {
    codigoDocumento:0,
    codigoDocumentoAdjunto:0,
    codigoTipoDocumentoTramiteAdjunto:1,
    descripcionArchivo:"",
    eliminable:false,
    fechaArchivo:"",
    loginUsuario:"",
    nombreArchivo:"",
    numeroAtencion:0,
    ubicacionArchivo:""};
  
  bandejaActiva:string;
    @Select(BandejaInternoState.bandejaActiva)
    public buzonActiva$: Observable<string>;  
  
  doc: DocumentoInterno = new DocumentoInterno();
    @Select(DocumentoInternoState.documento)
    public doc$: Observable<DocumentoInterno>;
    
  constructor(
    private api: TramiteService,
    public dialog: MatDialog,
    private fs: FileSave
  ) {
    this.doc$.subscribe(d =>{
      this.doc = d;
      this.archivoPrincipal.codigoDocumento=this.doc.codigoDocumentoTramite;
      this.screenAprobacion =(this.doc.tipoDerivacion!='R' && this.doc.tipoDerivacion!='P')

    });
  }

  ngOnInit() {
    this.buzonActiva$.subscribe(b=>(this.bandejaActiva=b));
    this.getArchivos(1);
    this.getArchivos(2);
  }

  adjuntar(tipo:number) {
        const dialogRef = this.dialog.open( DetalleAdjuntarInternoComponent, {
          width: '600px',
          data: {codigoDocumento: this.doc.codigoDocumentoTramite,
                numeroAtencion: this.doc.numeroAtencion,
                tipoArchivo:this.tipoArchivos[tipo-1]}
        });
        dialogRef.afterClosed().subscribe(complete => {
          if (complete) this.getArchivos(tipo);
        });
  }
  aprobar(){
    const dialogRef = this.dialog.open(DetalleAprobacionInternoComponent, {
      width: '600px',
      data: this.doc
    });
    dialogRef.afterClosed().subscribe(complete => {
      if (complete) {
        this.getArchivos(1);
        this.aprobado=true;
      }
    });
  }
  rechazar(){
    const dialogRef = this.dialog.open(DetalleRechazarInternoComponent, {
      width: '600px',
      data: this.doc
    });
    dialogRef.afterClosed().subscribe(complete => {
      if (complete) {
        this.rechazado=true;
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
  actualizarTipoAdjunto(event: MatRadioChange, e:ArchivoDocumento){
    //  console.log(JSON.stringify(e))
    //  console.log(JSON.stringify(this.buzonActual))
    this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,event.value)
     .subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
      });
  }
  getArchivos(tipo:number) {
    this.api
      .archivosDocumentoInterno(this.doc.codigoDocumentoTramite,
                         tipo)
      .subscribe(res => {
        if (tipo == 2)
        this.archivos = res;
        else{
          if(res.length>0)
            this.archivoPrincipal=res[0]; 
        }
      });
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
    if(e.codigoTipoDocumentoTramiteAdjunto == 1){
      this.archivoPrincipal = {
        codigoDocumento:this.doc.codigoDocumentoTramite,
        codigoDocumentoAdjunto:0,
        codigoTipoDocumentoTramiteAdjunto:1,
        descripcionArchivo:"",
        eliminable:false,
        fechaArchivo:"",
        loginUsuario:"",
        nombreArchivo:"",
        numeroAtencion:0,
        ubicacionArchivo:""};
    }
    else{
      //eliminar columna del html
      this.archivos = this.archivos.filter((value,key)=>{
      return value.codigoDocumentoAdjunto != e.codigoDocumentoAdjunto;
    });
    }
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