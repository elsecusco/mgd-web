import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TramiteService } from '../tramite-documentario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Archivo } from '../../../@core/archivo';
import { FileSave } from '../../../@core/file-save.service';

@Component({
  selector: 'reporte-principal',
  templateUrl: './reporte-principal.component.html',
  styleUrls: ['./reporte-principal.component.scss'],
})
export class ReportePrincipalComponent implements OnInit {
  @ViewChild('link') public link!: ElementRef;
  //codigo: number = 2019006785;
  //  urlpdf: string = "http://localhost:9000/api/reporteprincipal"
  loadedPDF: Boolean = false;
  pdf!: Blob;
  constructor(
    private api: TramiteService,
    private fs: FileSave,
    public dialogRef: MatDialogRef<ReportePrincipalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit() {
    this.getUrl();
  }

  getUrl() {
    this.api.getReporteSeguimiento(this.data).subscribe((res) => {
      this.pdf = res;
      this.loadedPDF = true;
    });
  }

  descargarPdf() {
    this.api
      .getReporteSeguimiento(this.data)
      .subscribe((blob) => this.setFile(blob));
  }

  setFile(blob: any) {
    const name = this.data.toString();
    const archivo: Archivo = {
      nombre: name,
      archivo: blob,
      extension: '.pdf',
      element: this.link,
    };
    this.fs.save(archivo);
  }
}
