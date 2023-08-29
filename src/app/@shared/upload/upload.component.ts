import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FileError,
  NgxfUploaderService,
  UploadEvent,
  UploadStatus
} from 'ngxf-uploader';
import { swalError, notifyOk } from '@core/swal';
import { setUrl } from '@core/functions';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  progress = 0;
  fileName = '';

  private _options: UploadOptions;
  @Input()
  set options(options: UploadOptions) {
    this._options = options;
  }
  get options(): UploadOptions {
    return this._options;
  }

  @Input() disabled: boolean;

  @Output() complete = new EventEmitter();

  constructor(private Upload: NgxfUploaderService) {}

  uploadFile(file: File | FileError): void {
    if (!(file instanceof File)) {
      this.alertError(file);
      return;
    }
    this.fileName = file.name;

    this.Upload.upload({
      url: setUrl(this.options.uri),
      fields: this.options.form,
      files: file,
      process: true
    }).subscribe(
      (event: UploadEvent) => {
        this.progress = event.percent;
        if (event.status === UploadStatus.Completed && event.data) {
          notifyOk(event.data.mensaje);
          this.complete.emit();
        }
      },
      _err => (this.progress = 0)
    );
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

export class UploadOptions {
  uri: string;
  form: any;

  constructor() {
    this.uri = '';
    this.form = null;
  }
}
