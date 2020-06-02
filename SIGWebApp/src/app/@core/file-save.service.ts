import { Injectable, ElementRef } from '@angular/core';
import { Archivo } from '@core/archivo';

@Injectable()
export class FileSave {
  constructor() {}

  save(archivo: Archivo) {
    if (archivo.archivo == null) return;

    const type = this.setTipoArchivo(archivo.extension);
    const blob: Blob = new Blob([archivo.archivo], { type });
    const url = window.URL.createObjectURL(blob) || URL.createObjectURL(blob);

    const link = archivo.element.nativeElement;
    link.href = url;
    link.download = archivo.nombre + archivo.extension;
    link.click();
    // tslint:disable-next-line:no-unused-expression
    window.URL.revokeObjectURL(url);
    URL.revokeObjectURL(url);
  }
  setTipoArchivo(extensionArchivo: string) {
    switch (extensionArchivo) {
      case '.xlsx':
        return tipoArchivo.EXCEL;
      case '.txt':
        return tipoArchivo.TXT;
      case '.zip':
        return tipoArchivo.ZIP;
      case '.pdf':
        return tipoArchivo.PDF;
    }
  }
}

const tipoArchivo = {
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT: 'application/text',
  ZIP: 'application/zip',
  PDF: 'application/pdf'
};
