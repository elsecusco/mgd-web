import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { DocumentoExternoReporte } from '@models/tramite/documento-externo-reporte';
import { TramiteService } from '../tramite-documentario.service';
import { FileSave } from '@core/file-save.service';
import { Archivo } from '@core/archivo';
import { TwoPicker } from '@shared/two-picker/two-picker';
import { DestinatarioFiltroComponent } from '../destinatario-filtro/destinatario-filtro.component';
import { Destinatario } from '@models/tramite/destinatario';

@Component({
  selector: 'documento-externo-reportes',
  templateUrl: './documento-externo-reportes.component.html',
  styleUrls: ['./documento-externo-reportes.component.scss']
})
export class DocumentoExternoReportesComponent implements OnInit {
  @ViewChild('link') public link: ElementRef;
  documentoFiltro:DocumentoExternoReporte;

  @ViewChild(DestinatarioFiltroComponent) 
  filtro:DestinatarioFiltroComponent;
  tipoBusqueda = 2;
  porNombre = 1;
  @Output() para = new EventEmitter<Destinatario[]>();
  
  private _matLabel: string;
  private _onlyOne: boolean=false;
  private _blacklist: string = '';
  
  @Input()
  set matLabel(matLabel: string) {
    this._matLabel = matLabel || '';
  }
  get matLabel(): string {
    return this._matLabel;
  }
  
  @Input()
  set onlyOne(onlyOne: boolean) {
    this._onlyOne = onlyOne || false;
  }
  get onlyOne(): boolean {
    return this._onlyOne;
  }

  @Input()
  set blacklist(blacklist: string) {
    this._blacklist = blacklist || '';
  }
  get blacklist(): string {
    return this._blacklist;
  }
  
  constructor(private api: TramiteService,private fs: FileSave) { }

  ngOnInit() {
    this.documentoFiltro=new DocumentoExternoReporte();
    this.documentoFiltro.statusDoc=1
  }
  destinatariosPara(destinatarios: Destinatario[]) {
    //console.log(destinatarios);
    this.para.emit(destinatarios);
    this.documentoFiltro.loginUsuarioDestino = (destinatarios.length)? destinatarios[0].loginUsuario:null;

  }
  clearAll(){
    this.filtro.removeAll();
  }
  setDefault(destinatarioDefault:Destinatario){
    this.filtro.setDefault(destinatarioDefault)
  }
  numericOnly(event): boolean {    
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  descargarPdf(){
    this.api.getReporteExternoPdf(this.documentoFiltro)
    .subscribe(blob => this.setFile(blob));
  }
  setFile(blob) {
    const name = "documentos_internos";
    const archivo: Archivo = {
      nombre: name,
      archivo: blob,
      extension: '.pdf',
      element: this.link
    };
    this.fs.save(archivo);
  }
  changeFecha(fechas: TwoPicker) {
    this.documentoFiltro.fechaInicio= fechas.fechaInicio;
    this.documentoFiltro.fechaFin=fechas.fechaFin;
  }
  openPdf(){
    //console.log(this.documentoFiltro);
    this.api.getReporteExternoPdf(this.documentoFiltro).subscribe(res => {
    const fileURL = URL.createObjectURL(res);
    window.open(fileURL, '_blank');
    });
  }
}
