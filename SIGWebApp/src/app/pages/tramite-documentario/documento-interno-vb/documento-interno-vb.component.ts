import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Pair } from '@models/pair';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AprobacionDocumento } from '@models/tramite/aprobacion-documento';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { Destinatario } from '@models/tramite/destinatario';
import { MatTable } from '@angular/material';
import { TramiteService } from '../tramite-documentario.service';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { DocumentoInterno } from '@models/tramite/documento-interno';
import { E, F, R, A } from '@angular/cdk/keycodes';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { BandejaInternoState } from '../states/bandeja-interno.state';


@Component({
  selector: 'documento-interno-vb',
  templateUrl: './documento-interno-vb.component.html',
  styleUrls: ['./documento-interno-vb.component.scss']
})
export class DocumentoInternoVbComponent implements OnInit {
  @Output() listAprobaciones = new EventEmitter<Array<AprobacionDocumento>>();
  
  @ViewChild(MatTable) table: MatTable<any>;
  aprobaciones: Array<AprobacionDocumento> = [];
  tituloAccion="Controles"
  ICONS = {
    E:"place",
    F:"alarm",
    R:"cancel",
    A:"offline_pin"
  }
  COLORS = {
    E:"#ee8229",
    F:"#0a9c90",
    R:"#ee2932",
    A:"#087c38"
  }
  TOOLSTIP ={
    E:"En espera",
    F:"En fila",
    R:"Rechazado",
    A:"Aprobado"
  }
  // private _codigoDocumento: number;

  // @Input()
  // set codigoDocumento(codigoDocumento: number) {
  //   this._codigoDocumento = codigoDocumento;
  // }
  // get codigoDocumento(): number {
  //   return this._codigoDocumento;
  // }

  tipos: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$: Observable<TramiteTipos>;

  //columnas = ['nombreArchivo','ubicacionArchivo', 'fechaArchivo', 'accion'];
  columnas = ['nombreTrabajador','tipoAprobacion','fechaAtencion','descripcionAtencion', 'accion'];
  tipoAprobacionAdd:Pair={codigo:0,nombre:""};

  
  private _para: Destinatario[];
  @Input()
  set para(para: Destinatario[]) {
    this._para = para || [];
  }
  get para(): Destinatario[] {
    return this._para;
  }
  vista: string;
  @Select(DocumentoInternoState.vista)
  public vista$: Observable<string>;

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$: Observable<DocumentoInterno>;

  buzonActiva:BuzonesUsuario;
  @Select(BandejaInternoState.bandejaActiva)
  public buzonActiva$: Observable<BuzonesUsuario>;

  constructor(private api: TramiteService) {
    this.vista$.subscribe(v => (this.vista = v));
    this.doc$.subscribe(d => (this.doc = d));
  }

  ngOnInit() {
    this.buzonActiva$.subscribe(u=>this.buzonActiva=u);
   
    this.tipos$.subscribe(tipos => (this.tipos = tipos));
    this.getAprobaciones();
    if(this.doc.tipoDerivacion !='R') this.tituloAccion="Estado"
  }
  addAprobacion(){
    this.para.forEach(v=>{
     // console.log(v.loginUsuario);
      this.aprobaciones.push({loginUsuario:v.loginUsuario,
                              nombreUsuario: v.nombreUsuario,
                              codigoTipoAprobacion:this.tipoAprobacionAdd.codigo,
                              nombreTipoAprobacion:this.tipoAprobacionAdd.nombre});
      //console.log(this.aprobaciones[0].tipoAprobacion.nombre);
    })
    this.para = [];  
    this.refreshTable();
  }
  getAprobaciones() {
   // console.log(this.doc.codigoDocumentoTramite)
     this.api
      .getListaAprobaciones(this.doc.codigoDocumentoTramite)
      .subscribe(res => {this.aprobaciones = res;
  //    console.log(JSON.stringify(this.aprobaciones))
  });
  }
  up(index) {
    if(index>0){
      [this.aprobaciones[index-1],this.aprobaciones[index]]=[this.aprobaciones[index],this.aprobaciones[index-1]];
      this.refreshTable();
    }
  }
  down(index) {
    if(index<this.aprobaciones.length-1){
      [this.aprobaciones[index],this.aprobaciones[index+1]]=[this.aprobaciones[index+1],this.aprobaciones[index]];  
      this.refreshTable();
    }
  } 
  eliminar(index){
    this.aprobaciones.splice(index,1);
    this.refreshTable();
  }
  refreshTable(){
    this.table.renderRows();
    this.listAprobaciones.emit(this.aprobaciones);
  }
  //para(destinatarios: Destinatario[]) {
    //this.paraDest = destinatarios;
  //}
}