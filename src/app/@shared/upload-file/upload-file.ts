import { Component, Output, EventEmitter } from '@angular/core';
import { FileError } from 'ngxf-uploader';
import { swalError } from '../../@core/swal';
import { tipoArchivo } from '../../@core/file-save.service';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.html'
})
export class UploadFile {
  fileName = '';

  @Output() file = new EventEmitter<File>();

  constructor() {}

  uploadFile(file: File | FileError): void {
    if (!(file instanceof File)) {
      this.alertError(file);
      return;
    }
    if(!this.isValidType(file.type) && !file.name.endsWith(".rar")){
      this.alertError(FileError.TypeError);
      return;
    }
    this.fileName = file.name;
    this.file.emit(file);
  }
  isValidType(type:string):boolean{
    //console.log(type);
    for(let key in tipoArchivo)
      if(tipoArchivo[key as keyof typeof tipoArchivo]===type)
        return true;
    return false;
  }

  alertError(msg: FileError) {
    switch (msg) {
      case FileError.NumError:
        swalError('Number Error');
        break;
      case FileError.SizeError:
        swalError('Size Error');
        break;
      case FileError.TypeError:
        swalError('Tipo de archivo no soportado solo permite (PDF, Word, Excel,*.zip,*.rar)');
        break;
    }
  }
}
