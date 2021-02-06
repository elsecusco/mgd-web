import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileSave } from '@core/file-save.service';
import { TramiteService } from '../tramite-documentario.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'pdf-viewer-dialog',
  templateUrl: './pdf-viewer-dialog.component.html',
  styleUrls: ['./pdf-viewer-dialog.component.scss']
})
export class PdfViewerDialogComponent implements OnInit {

  pdfSrc!: Blob;
  loadedPDF:Boolean = false;
  constructor(public dialogRef: MatDialogRef<PdfViewerDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data,  
    private api: TramiteService,
    public dialog: MatDialog,
    private fs: FileSave ) {
      pdfDefaultOptions.renderInteractiveForms = false;
     }

  ngOnInit() {
    this.loadPdf();
    

  }

  loadPdf() {
         this.api
        .descargarArchivo(this.data.codigoDocumento, this.data.codigoDocumentoAdjunto)
        .subscribe(async blob => {
          this.pdfSrc = blob; 
          this.loadedPDF = true;
          //this.pdfSrc = await blob.arrayBuffer();
          //this.pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
          //console.log('loaded');
          // this.loadedPDF = true;
          // console.log(pdfSrc);
        })
  }

}
