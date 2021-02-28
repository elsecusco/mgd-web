import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { PdfViewerDialogComponent } from '../pdf-viewer-dialog/pdf-viewer-dialog.component';
import { ReporteMemoComponent } from '../reporte-memo/reporte-memo.component';
import { DocumentoInternoVisorComponent } from '../documento-interno-visor/documento-interno-visor.component';
// import { ReporteMemoComponent } from '../reporte-memo/reporte-memo.component';

@Component({
  selector: 'documento-anexo-interno',
  templateUrl: './documento-anexo-interno.component.html',
  styleUrls: ['./documento-anexo-interno.component.scss']
})
export class DocumentoAnexoInternoComponent implements OnInit {
  private _tipoDocumento: number;
  @Input()
  set tipoDocumento(tipoDocumento: number) {
    this._tipoDocumento = tipoDocumento || 0;
  }
  get tipoDocumento(): number {
    return this._tipoDocumento;
  }
  screenAprobacion = false;
  screenAtencion=false;
  tipoArchivos=[{val:1,nome:"Principal"},
                {val:2,nome:"Anexo"},
                {val:3,nome:"Anexo Gerencia"},
                {val:2,nome:"Reemplazo"}];
  aprobado = false;
  rechazado = false;
  editableFile = true;
  //MaxFechaRecepcion : Observable <ArchivoDocumento> 
  @Output() sizeAdjuntos = new EventEmitter<number>();

  @ViewChild('link') public link: ElementRef;
  //columnas = ['nombreArchivo','ubicacionArchivo', 'fechaArchivo', 'accion'];
  columnasGerencia = ['nombreUsuario','nombreArchivo','descripcionArchivo','fechaArchivo', 'accion'];
  columnas = ['nombreUsuario','nombreArchivo','descripcionArchivo','fechaArchivo', 'accion'];
  archivos: ArchivoDocumento[] = [];
  archivosGerencia: ArchivoDocumento[] = [];
  archivoPrincipal: ArchivoDocumento = {
    codigoDocumento:0,
    codigoDocumentoAdjunto:null,
    codigoTipoDocumentoTramiteAdjunto:1,
    descripcionArchivo:"",
    eliminable:false,
    fechaArchivo:"",
    loginUsuario:"",
    nombreArchivo:"",
    numeroAtencion:0,
    ubicacionArchivo:"",
    extencion:""};
  
    bandejaActiva:string;
    @Select(BandejaInternoState.bandejaActiva)
    public buzonActiva$: Observable<string>;
    
    buzonActual:BuzonesUsuario;
    @Select(BandejaInternoState.buzonActual)
    public buzonActual$: Observable<BuzonesUsuario>;
  
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
        this.screenAprobacion =!(this.doc.tipoDerivacion =='R'
                                  ||this.doc.tipoDerivacion =='P'
                                  ||this.doc.tipoDerivacion =='D');
        this.screenAtencion= this.doc.tipoDerivacion ==  'P'
                              || this.doc.tipoDerivacion =='D';
        this.buzonActiva$.subscribe(b=>this.bandejaActiva=b)
        this.buzonActual$.subscribe(b=>this.buzonActual=b)
        const estadosEditables=['FA', null,'N']
        this.editableFile = estadosEditables.some(x => x==this.doc.estado)
        
      });
    }

  ngOnInit() {
    //console.log(this.tipoDocumento)
    this.buzonActiva$.subscribe(b=>(this.bandejaActiva=b));
    this.getArchivos(1);
    this.getArchivos(2);
    if(this.screenAtencion)
      this.getArchivos(3);
  }

  adjuntar(tipo:number) {
        const dialogRef = this.dialog.open( DetalleAdjuntarInternoComponent, {
          width: '600px',
          data: {codigoDocumento: this.doc.codigoDocumentoTramite,
                numeroAtencion: this.doc.numeroAtencion,
                codigoDocumentoAdjuntoReemplazo:(tipo==1)?this.archivoPrincipal.codigoDocumentoAdjunto:null,
                tipoArchivo:this.tipoArchivos[tipo-1]}
        });
        dialogRef.afterClosed().subscribe(complete => {
          if (complete) this.getArchivos(tipo);
        });
  }
  derivar(){
    //console.log(JSON.stringify(this.doc))
    const dialogRef = this.dialog.open(DetalleAprobacionInternoComponent, {
      // width: '600px',
      width: '50vw',
      height:'100vh',
      data:{doc:this.doc,
            tipo:"Derivar"}
    });
    dialogRef.afterClosed().subscribe(complete => {
      //console.log(complete)
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
      //console.log(complete)
      if (complete) {
        this.rechazado=true;
      }
    });
  }
  actualizarTipoAdjunto(event: MatRadioChange, e:ArchivoDocumento){
    //  console.log(JSON.stringify(e))
     this.api.actualizarAdjunto(e.codigoDocumento,e.codigoDocumentoAdjunto,event.value)
     .subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
      });
  }
  getArchivos(tipo:number) {
    this.api
      .archivosDocumentoInterno(this.buzonActual.loginUsuarioBuzon,
         this.doc.codigoDocumentoTramite,
                         tipo)
      .subscribe(res => {
        switch(tipo){
          case 1:
            if(res.length>0){
              this.archivoPrincipal=res[0]; 
              this.sizeAdjuntos.emit(res.length);
            }
          break;
          case 2:
            this.archivos = res;
          break;
          case 3:
            this.archivosGerencia=res;  
        }
      });
  }
  descargar(e: ArchivoDocumento) {
     //if ((e.nombreArchivo.includes('.pdf')))
     this.api
        .descargarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
        .subscribe(blob => this.setFile(e, blob));
        
  }
  reemplazar(e: ArchivoDocumento) {
    const dialogRef = this.dialog.open( DetalleAdjuntarInternoComponent, {
      width: '600px',
      data: {codigoDocumento: this.doc.codigoDocumentoTramite,
            numeroAtencion: this.doc.numeroAtencion,
            codigoDocumentoAdjuntoReemplazo:e.codigoDocumentoAdjunto,
            tipoArchivo:this.tipoArchivos[3]}
    });
    dialogRef.afterClosed().subscribe(complete => {
      if (complete) this.getArchivos(2);
    });
  }
 eliminar(e: ArchivoDocumento) {
   //console.log(e)
     this.api
    .eliminarArchivo(e.codigoDocumento, e.codigoDocumentoAdjunto)
    .subscribe(res => {
    if (res.id == 0) notifyOk(res.mensaje);
    });
    if(e.codigoTipoDocumentoTramiteAdjunto == 1){
      this.archivoPrincipal = {
        codigoDocumento:this.doc.codigoDocumentoTramite,
        codigoDocumentoAdjunto:null,
        codigoTipoDocumentoTramiteAdjunto:1,
        descripcionArchivo:"",
        eliminable:false,
        fechaArchivo:"",
        loginUsuario:"",
        nombreArchivo:"",
        numeroAtencion:0,
        ubicacionArchivo:"",
        extencion:""};
      this.sizeAdjuntos.emit(0);
    }
    else{
      //eliminar columna del html
      this.archivosGerencia = this.archivosGerencia.filter((value,key)=>{
        return value.codigoDocumentoAdjunto != e.codigoDocumentoAdjunto;
      });
      this.archivos = this.archivos.filter((value,key)=>{
      return value.codigoDocumentoAdjunto != e.codigoDocumentoAdjunto;
    });
    }
  } 
  abrirVisor(archivoPrincipal:ArchivoDocumento){
      // const data={
      //   codigoDocumento: archivoPrincipal.codigoDocumento,
      //   codigoDocumentoAdjunto:archivoPrincipal.codigoDocumentoAdjunto
      // }
      // this.dialog.open(
      //   PdfViewerDialogComponent, {
      //     width: '50vw',
      //     height:'100vh',
      //     data: data
      //   }
      // );  
      const dialogRef = this.dialog.open(
        PdfViewerDialogComponent, {
          width: '40vw',
          height:'90vh',
          data: {
            codigoDocumento: archivoPrincipal.codigoDocumento,
            codigoDocumentoAdjunto:archivoPrincipal.codigoDocumentoAdjunto
          }
          });
          dialogRef.afterClosed().subscribe(c =>{
            //console.log(c)
            if (c)
            this.archivoPrincipal.codigoDocumentoAdjunto=c
            this.getArchivos(1)
           
          });
  }

  aprobar(){
    //console.log(this.doc);
    const data={codigoDocumento: this.doc.codigoDocumentoTramite,
      codigoDocumentoAdjunto:this.archivoPrincipal.codigoDocumentoAdjunto,
      numeroAtencion: this.doc.numeroAtencion,
      nombreFile: this.archivoPrincipal.nombreArchivo,
      nombreDerivacion:this.doc.nombreDerivacion,
      tipo:"Atender",
      estadoDerivacion:this.doc.estado,
      codigoDocumentoAdjuntoReemplazo:this.archivoPrincipal.codigoDocumentoAdjunto,
      tipoArchivo:this.tipoArchivos[0]}
     //console.log(JSON.stringify(data))
    const dialogRef = this.dialog.open(
        DocumentoInternoVisorComponent, {
          width: '43vw',
          height:'100vh',
          data: data
          });
    dialogRef.afterClosed().subscribe(complete => {
            //console.log(complete)
            if (complete) {
              this.aprobado=true;
            }
            this.getArchivos(1)
          });   
  }
  derivarPrincipal(){
    //console.log(JSON.stringify(this.doc));
    const dialogRef = this.dialog.open(
        DocumentoInternoVisorComponent, {
          width: '43vw',
          height:'100vh',
          data: {
            codigoDocumento: this.doc.codigoDocumentoTramite,
            codigoDocumentoAdjunto:this.archivoPrincipal.codigoDocumentoAdjunto,
            numeroAtencion: this.doc.numeroAtencion,
            nombreFile: this.archivoPrincipal.nombreArchivo,
            tipo:"Derivar",
            estadoDerivacion:this.doc.estado,
            codigoDocumentoAdjuntoReemplazo:this.archivoPrincipal.codigoDocumentoAdjunto,
            tipoArchivo:this.tipoArchivos[0]}
          });
          dialogRef.afterClosed().subscribe(c =>{
            //console.log(c)
            if (c){
              this.aprobado=true;
              //console.log(this.aprobado)
              this.archivoPrincipal.codigoDocumentoAdjunto=c

            }
            else
            this.getArchivos(1)
            
          });
  }

  verMemo(){
    //console.log(this.archivoPrincipal);
    const dialogRef = this.dialog.open(
      ReporteMemoComponent, {
        width: '54vw',
        height:'90vh',
        data: {codigoDocumento: this.doc.codigoDocumentoTramite,
          codigoDocumentoInterno : this.doc.codigoDocumentoInterno,
          codigoDocumentoAdjunto:this.archivoPrincipal.codigoDocumentoAdjunto,
          numeroAtencion: this.doc.numeroAtencion,
          codigoDocumentoAdjuntoReemplazo:this.archivoPrincipal.codigoDocumentoAdjunto,
          tipoArchivo:this.tipoArchivos[0]}
      });
    dialogRef.afterClosed().subscribe(c =>{
      //console.log(c)
      this.archivoPrincipal.codigoDocumentoAdjunto=c
    });
  }
  descargarMemo() {
    if(this.archivoPrincipal.codigoDocumentoAdjunto)
      this.api.
       descargarArchivo(this.archivoPrincipal.codigoDocumento, 
          this.archivoPrincipal.codigoDocumentoAdjunto)
          .subscribe(blob => this.setFile(this.archivoPrincipal, blob));
  
    else
      this.api.getReporteMemo(this.archivoPrincipal.codigoDocumento)
        .subscribe(blob => this.setFile(this.archivoPrincipal, blob));      
  }
  setFile(e: ArchivoDocumento, blob) {
    const pos=e.nombreArchivo.lastIndexOf('.');
    const archivo: Archivo = {
    nombre: e.nombreArchivo.substring(0,pos),
    archivo: blob,
    extension: '.pdf',//e.nombreArchivo.substring(pos),
    element: this.link
    };
    this.fs.save(archivo);
    }
 }