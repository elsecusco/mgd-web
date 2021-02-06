import { Injectable, ElementRef } from '@angular/core';
import { Archivo } from '@core/archivo';
//import { type } from 'os';

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
      case '.xls':
        return tipoArchivo.EXCEL_A;
      case '.txt':
        return tipoArchivo.TXT;
      case '.zip':
        return tipoArchivo.ZIP;
      case '.pdf':
        return tipoArchivo.PDF;
	  case '.rar':
        return tipoArchivo.RAR;
	  case '.docx':
        return tipoArchivo.DOCX;
    case '.doc':
        return tipoArchivo.DOC;
    }
  }
}
export const tipoArchivo = {
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  EXCEL_A : 'application/vnd.ms-excel',
  TXT: 'application/text',
  ZIP: 'application/x-zip-compressed',
  PDF: 'application/pdf',
  RAR: 'application/rar',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword'
};
