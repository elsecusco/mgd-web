import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoExternoReporte } from '@models/tramite/documento-externo-reporte';
import { TramiteService } from '../tramite-documentario.service';
import { FileSave } from '@core/file-save.service';
import { Archivo } from '@core/archivo';
import { TwoPicker } from '@shared/two-picker/two-picker';

@Component({
  selector: 'documento-externo-reportes',
  templateUrl: './documento-externo-reportes.component.html',
  styleUrls: ['./documento-externo-reportes.component.scss']
})
export class DocumentoExternoReportesComponent implements OnInit {
  @ViewChild('link') public link: ElementRef;
  documentoFiltro:DocumentoExternoReporte;
  
  constructor(private api: TramiteService,private fs: FileSave) { }

  ngOnInit() {
    this.documentoFiltro=new DocumentoExternoReporte();
    this.documentoFiltro.statusDoc=1
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
    this.api.getReporteExternoPdf(this.documentoFiltro).subscribe(res => {
    const fileURL = URL.createObjectURL(res);
    window.open(fileURL, '_blank');
    });
  }
}
