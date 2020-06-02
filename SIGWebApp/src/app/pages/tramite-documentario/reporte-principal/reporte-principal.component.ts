import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { TramiteService } from '../tramite-documentario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Archivo } from '@core/archivo';
import { FileSave } from '@core/file-save.service';
import { SeguimientoDocumento } from '@models/tramite/seguimiento-documento';
import { SeguimientoState } from '../states/seguimiento.states';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'reporte-principal',
  templateUrl: './reporte-principal.component.html',
  styleUrls: ['./reporte-principal.component.scss']
})
export class ReportePrincipalComponent implements OnInit {

  @ViewChild('link') public link: ElementRef;
  //codigo: number = 2019006785;
  urlpdf: string = "http://localhost:9000/api/reporteprincipal"

  constructor(private api: TramiteService,
              private fs: FileSave,
              public dialogRef: MatDialogRef<ReportePrincipalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: number) { }  
  
  ngOnInit() {
      this.getUrl();
  } 
  
  getUrl(){
    this.api.getReporteSeguimiento(this.data).subscribe(res => {
    this.urlpdf= URL.createObjectURL(res);
    });
  }

  descargarPdf(){
    this.api.getReporteSeguimiento(this.data)
    .subscribe(blob => this.setFile(blob));
  }
  
  setFile(blob) {
    const name = this.data.toString();
    const archivo: Archivo = {
      nombre: name,
      archivo: blob,
      extension: '.pdf',
      element: this.link
    };
    this.fs.save(archivo);
  }
}
