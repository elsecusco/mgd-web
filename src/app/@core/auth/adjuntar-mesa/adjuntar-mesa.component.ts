import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileAdjunto } from '../../../@models/documento-mesa';
/* import { UploadStatus } from 'ngxf-uploader';
import { notifyOk, swalError } from '@core/swal';
 */
@Component({
  selector: 'adjuntar-mesa',
  templateUrl: './adjuntar-mesa.component.html',
  styleUrls: ['./adjuntar-mesa.component.scss'],
})
export class AdjuntarMesaComponent implements OnInit {
  form!: FormGroup; //--- - | undefined
  file!: File; //--- - | undefined
  progress = 0;
  tipo = '';
  isSave = false;

  firmando = false; //eliminaar despues
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdjuntarMesaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.tipo = this.data.tipoArchivo.nome;
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      codigoTipoDocumentoTramiteAdjunto: [this.data.tipoArchivo.val],
      titulo: ['', Validators.required],
      descripcionArchivo: [''],
      nombreArchivo: ['', Validators.required],
    });
  }
  changeFile(file: File) {
    this.file = file;
    this.form?.patchValue({ titulo: file.name, nombreArchivo: file.name });
  }

  subirArchivo() {
    if (this.file instanceof File) {
      const adjunto: FileAdjunto = {
        codigoTipoDocumentoTramiteAdjunto: this.data.tipoArchivo.val,
        file: this.file,
        nombreArchivo: this.form?.get('nombreArchivo')?.value,
        titulo: this.form?.get('titulo')?.value,
        descripcionArchivo: this.form?.get('descripcionArchivo')?.value,
      };
      this.dialogRef.close(adjunto);
    }
  }
}
