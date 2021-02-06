import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteService } from '../tramite-documentario.service';
import { DocumentoState } from '../states/documento.state';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DocumentoAtencionDialog } from './documento-atencion.dialog';
import { AtenderDocumento } from '@models/tramite/atender-documento';
import { notifyOk } from '@core/swal';
import { ReporteGraficoComponent } from '../reporte-grafico/reporte-grafico.component';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { DetalleAtencionComponent } from '../detalle-atencion/detalle-atencion.component';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { BandejaState } from '../states/bandeja.state';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { DetalleSielseComponent } from '../detalle-sielse/detalle-sielse.component';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { DetalleSielseGuardarComponent } from '../detalle-sielse-guardar/detalle-sielse-guardar.component';
import { Sielse } from '@models/tramite/sielse';

export enum tipoClases{
  A='atencionLectura',
  F='atencionFinal',
  P='derivadoPrincipal',
  C='derivadoConCopia',
  D='sinValores'
}
@Component({
  selector: 'documento-atencion',
  templateUrl: './documento-atencion.component.html',
  styleUrls: ['./documento-atencion.component.scss']
})

export class DocumentoAtencion implements OnInit {
 //Actualizar  
 bandejaf: BandejaFiltro;
 @Select(BandejaState.bandejaFiltro)
 public bandejaf$: Observable<BandejaFiltro>;

 @Emitter(BandejaState.loadDocuments)
  private loadDocs: Emittable<BandejaFiltro>;
  // Fin de actualizar 
  //bandera para mostrar el combo
  verSIELSEcombo=false;
  // currentUserBuzon:BuzonesUsuario;
  // @Select(BandejaState.currentUserBuzon)
  // public currentUserBuzon$: Observable<BuzonesUsuario>;

  buzonActual:BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;
  
  @Output() atender = new EventEmitter<any>();
  columnas = [
    'nombreUsuarioOrigen',
    'nombreUsuarioDestino',
    'fechaDerivacion',
    'descripcionSolicitudAtencion',
    'plazoAtencion',
    'fechaAtencion',
    'masDetalle'
  ];
  atenciones: any[] = [];
  atencion = false;

  tipos: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos: Emittable<TramiteTipos>;

  loaded: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$: Observable<Boolean>;


  doc: BandejaDocumento = new BandejaDocumento();
  @Select(DocumentoState.documento)
  public doc$: Observable<BandejaDocumento>;

  detalleSielse:Sielse;
  constructor(private api: TramiteService, public dialog: MatDialog) {
    this.doc$.subscribe(d => {
      this.doc = { ...d };
    });
  }

  ngOnInit() {

    this.bandejaf$.subscribe(b =>this.bandejaf = b); 
    this.buzonActual$.subscribe(u=>this.buzonActual=u);
    this.tipos$.subscribe(tipos => (this.tipos = tipos));
    this.loaded$.subscribe(l => {
      if (!l) this.loadTipos.emit();
    });
       
    if (this.doc.codigoDocumentoTramite != null)
      this.atencion =
        this.doc.recibido == 0 &&
        this.doc.emitido == 1 &&
        this.doc.atendido == 0 &&
        this.doc.bandeja == 'e' &&
        this.buzonActual.permiso > 1;

    this.getListarAtenciones();

 }
 
  getListarAtenciones() {
    if (this.doc.codigoDocumentoTramite != null)
      this.api
        .listarAtenciones(
          this.doc.codigoDocumentoTramite,
          // this.doc.numeroAtencion
        )
        .subscribe(res => (this.atenciones = res));
  }
  guardarAtencion() {
    const dialogRef = this.dialog.open(DocumentoAtencionDialog, {
      width: '600px',
      data:this.doc.tipoDerivacion
    });
    dialogRef.afterClosed().subscribe(form => {
      if (form) this.guardar(form);
    });
  }

  guardar(form) {
    let doc = new AtenderDocumento();
        doc.codigoDocumento = this.doc.codigoDocumentoTramite;
        doc.numeroAtencion = this.doc.numeroAtencion;
    const body = { ...doc, ...form };
    this.api.atenderDocumento(body).subscribe(res => {
      if (res.id == 0) notifyOk(res.mensaje);
      this.atender.emit();
    });
  }
 
  atenderAutomaticamente(){
      if (this.doc.bandeja == 'e')
      {
          this.api.atencionesAutomaticas(this.doc.codigoDocumentoTramite,this.doc.numeroAtencion).subscribe(res => {
           if (res.id == 0 && res.mensaje!= ''){
             notifyOk(res.mensaje);
             //this.atender.emit();
             this.actualizar();
            }
          });
        }  
      }
  esCopia(t: string){
  switch(t){
      case "P": return "#0b643a";
      case "C": return "#185175";
    }
  }
  esColor(t: string){
    switch(t){
      case "A": return "#d187de";
      case "F": return "#e69605";
     }
    }
  verDetalleAtencion(detalle,fila){
      const data={
        detalle:detalle
        ,de:fila.de
        ,fechaDerivacion:fila.fechaDerivacion
        ,descripcionSolicitudAtencion:fila.descripcionSolicitudAtencion
        ,plazoAtencion:fila.plazoAtencion
      }
      this.dialog.open(
        DetalleAtencionComponent, {
          width: '350px',
          //height:'400px',
          data: data
        }
      );
    }
  verReporteGrafo(){
    const detalleSeguimiento:SeguimientoDocumento={
      codigoDocumentoTramite:this.doc.codigoDocumentoTramite,
      fechaDocumento:this.doc.fecha,
      contenidoDocumento:this.doc.asunto,
      nombreRemitenteDocumento:this.doc.nombreRemitenteDocumento
    }
    this.api.graphReport(this.doc.codigoDocumentoTramite)
      .subscribe(gr =>{
          const dialogRef = this.dialog.open(
            ReporteGraficoComponent, {
              // width: '750px',
              // height:'750px',
              data: {detalle:detalleSeguimiento,
                     nodos:gr.nodos,
                     flechas:gr.flechas}
            }
          );
          dialogRef.afterClosed().subscribe(result => {});
        }
      );
  }
  ngOnDestroy() {
    this.atenderAutomaticamente()
  }

  selectClass(tipo : string){
    let classValue: string;
    switch(tipo){
      case 'A':classValue='atencionLectura';
      break;
      case 'F':classValue='atencionFinal';
      break;
      case 'P':classValue='derivadoPrincipal';
      break;
      case 'C':classValue='derivadoConCopia';
      break;
      case 'D':classValue='sinValores';
      break;
     }
    return classValue;
  }
  actualizar() {
    this.loadDocs.emit(this.bandejaf);
  }

  //#endregion **********************************
  openCargo(){
    this.api.getCargo(this.doc.codigoDocumentoTramite).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
      });
  }
  
  controlSielse(){
    this.api.getDetalleSielse(this.doc.codigoDocumentoTramite).subscribe(
      s=>{
        if (s.length>0)
        this.detalleSielse=s[0]
        else this.detalleSielse=null
        // console.log(JSON.stringify(this.detalleSielse))
        if(this.detalleSielse)
          this.verSielse()
        else
          this.verSIELSEcombo=true;
      }
    )
    
  }

  verSielse(){
    const dialogRef = this.dialog.open( 
      DetalleSielseComponent,{
        // width: '450px',
        //height: '700px',
        data: this.detalleSielse
      });
        dialogRef.afterClosed().subscribe(result => {
        //this.clear();
     });
  }

  guardarSielse(opcion){    
    if(opcion==1){
      const dialogRef = this.dialog.open( 
      DetalleSielseGuardarComponent,{
        width: '600px',
        data: this.doc.codigoDocumentoTramite
      });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            //this.doc.usuarioMantenimiento=this.doc.usuarioBuzon
            this.verSIELSEcombo=false;
          }
        //this.clear();
     });
    }
  }  
}