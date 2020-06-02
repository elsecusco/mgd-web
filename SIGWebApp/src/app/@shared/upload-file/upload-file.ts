import { Component, Output, EventEmitter } from '@angular/core';
import { FileError } from 'ngxf-uploader';
import { swalError } from '@core/swal';

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
    this.fileName = file.name;
    this.file.emit(file);
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
        swalError('Type Error');
        break;
    }
  }
}
