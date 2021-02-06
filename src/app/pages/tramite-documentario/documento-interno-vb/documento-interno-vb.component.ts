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
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { DestinatarioBuscarInternoComponent } from '../destinatario-buscar-interno/destinatario-buscar-interno.component';


@Component({
  selector: 'documento-interno-vb',
  templateUrl: './documento-interno-vb.component.html',
  styleUrls: ['./documento-interno-vb.component.scss']
})
export class DocumentoInternoVbComponent implements OnInit {
  @Output() listAprobaciones = new EventEmitter<Array<AprobacionDocumento>>();

  @ViewChild(DestinatarioBuscarInternoComponent) boxDest: DestinatarioBuscarInternoComponent;
  
  @ViewChild(MatTable) table: MatTable<any>;
  listas = {listaAprobadores:[],listaDerivados:[]}
  
  //aprobaciones: Array<AprobacionDocumento> = [];
  tituloAccion="Controles"
  ICONS = {
    E:"place",
    F:"alarm",
    R:"cancel",
    A:"offline_pin",
    D:"forward",
    C:"done_outline"
  }
  COLORS = {
    E:"#ee8229",
    F:"#0a9c90",
    R:"#ee2932",
    A:"#087c38",
    D:"#e67c0b",
    C:"#1384b0"
  }
  TOOLSTIP ={
    E:"En espera",
    F:"En fila",
    R:"Rechazado",
    A:"Aprobado",
    D:"Derivado",
    C:"Fin de Proceso"
  }
  blacklist="";

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

  private _tipoDocumento: number;
  @Input()
  set tipoDocumento(tipoDocumento: number) {
    this._tipoDocumento = tipoDocumento || 0;
  }
  get tipoDocumento(): number {
    return this._tipoDocumento;
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

  destinatarioJefe:Destinatario;
  @Select(BandejaInternoState.destinatarioJefe)
  public destinatarioJefe$:Observable<Destinatario>;

  constructor(private api: TramiteService) {
    this.vista$.subscribe(v => (this.vista = v));
    this.doc$.subscribe(d => (this.doc = d));
  }

  ngOnInit() {
    this.destinatarioJefe$.subscribe(j=>this.destinatarioJefe=j);
    this.buzonActiva$.subscribe(u=>this.buzonActiva=u);   
    this.tipos$.subscribe(tipos => (this.tipos = tipos));
    if(this.doc.tipoDerivacion !='R'){
      this.getAprobaciones();
      this.tituloAccion="Estado"
    }
     if(this.doc.tipoDerivacion =='R' 
      && this.listas.listaAprobadores.length == 0
      && this.tipoDocumento == 48){
        this.listas.listaAprobadores.push({loginUsuario:this.destinatarioJefe.loginUsuario,
          nombreUsuario: this.destinatarioJefe.nombreUsuario,
          codigoTipoAprobacion:"V",
          nombreTipoAprobacion:"Doy V° B°"});
          this.listAprobaciones.emit(this.listas.listaAprobadores);
          //console.log("tipo doc "+this.tipoDocumento)  
      //  this.refreshTable();
      }

  }
  addAprobacion(){
    this.para.forEach(v=>{
     // console.log(v.loginUsuario);
      this.listas.listaAprobadores.push({loginUsuario:v.loginUsuario,
                              nombreUsuario: v.nombreUsuario,
                              codigoTipoAprobacion:this.tipoAprobacionAdd.codigo,
                              nombreTipoAprobacion:this.tipoAprobacionAdd.nombre});
      //console.log(this.listas.listaAprobadores[0].tipoAprobacion.nombre);
    })
    this.boxDest.clearAll();
    this.para = [];
    this.refreshTable();
  }
  getAprobaciones() {
   // console.log(this.doc.codigoDocumentoTramite)
     this.api
      .getListaAprobaciones(this.doc.codigoDocumentoTramite)
      .subscribe(res => {this.listas = res;
  //    console.log(JSON.stringify(this.listas.listaAprobadores))
  });
  }
  up(index) {
    if(index>0){
      [this.listas.listaAprobadores[index-1],
      this.listas.listaAprobadores[index]]=
      [this.listas.listaAprobadores[index],
      this.listas.listaAprobadores[index-1]];
      this.refreshTable();
    }
  }
  down(index) {
    if(index<this.listas.listaAprobadores.length-1){
      [this.listas.listaAprobadores[index],this.listas.listaAprobadores[index+1]]=[this.listas.listaAprobadores[index+1],this.listas.listaAprobadores[index]];  
      this.refreshTable();
    }
  } 
  eliminar(index){
    this.listas.listaAprobadores.splice(index,1);
    this.refreshTable();
    this.setBlackList();
  }
  refreshTable(){
    this.table.renderRows();
    this.listAprobaciones.emit(this.listas.listaAprobadores);
  }
  setBlackList(){
    this.blacklist =";"+
    this.listas.listaAprobadores.map(e=>e.loginUsuario).join(";")
    +";";
  }
  paraDest(destinatarios: Destinatario[]) {
    this.para = destinatarios;
    this.setBlackList();
  }
}