import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TramiteService } from '../tramite-documentario.service';
import { UploadStatus } from 'ngxf-uploader';
import { notifyOk, swalError } from '@core/swal';
import { FirmaModel } from '@models/firma.model';
import { Firma } from '@shared/firma/firma';
import { DocumentoInterno } from '@models/tramite/documento-interno';


@Component({
    selector: 'detalle-aprobacion-interno',
    templateUrl: './detalle-aprobacion-interno.component.html',
    styleUrls: ['./detalle-aprobacion-interno.component.scss']
})

export class DetalleAprobacionInternoComponent implements OnInit {
  titulo:string;
  form: FormGroup;
  file: File;
  progress = 0;
  
  isSave = false;
  fields: FirmaModel;
  @ViewChild('firma') firma: Firma;
  firmando = false;

  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<DetalleAprobacionInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DocumentoInterno                       
  ) {
    if(data.tipoDerivacion=='P'){
      this.titulo="Atender Documento"
    }else
    {
      this.titulo="Aprobar Documento"
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [this.data.codigoDocumentoTramite, Validators.required],
      numeroAtencion:[this.data.numeroAtencion, Validators.required],
      aprobacion: [this.data.nombreDerivacion],
      descripcionAprobacion:[""]
    });
  }
  changeFile(file: File) {
    this.file = file;
    this.form.patchValue({ titulo: file.name, nombreArchivo: file.name });
  }

  aprobarArchivo() {
    if (this.file instanceof File) {
      this.api.aprobarArchivo(this.form.value, this.file).subscribe(
        event => {
          this.progress = event.percent;
          if (event.status === UploadStatus.Completed && event.data) {
            notifyOk(event.data.mensaje);
            this.dialogRef.close(true);
          }
        },
        _err => (this.progress = 0)
      );
    }
  }
  guardarArchivo() {
    if (this.file instanceof File) {
      this.api.guardarArchivoParaFirmar(this.file).subscribe(
        event => {
          this.progress = event.percent;
          if (event.status === UploadStatus.Completed && event.data)
            this.firmarArchivo(event.data);
        },
        _err => (this.progress = 0)
      );
    }
  }

  firmarArchivo(res: {
    rutaOrigen: string;
    rutaDestino: string;
    urlServicio: string;
  }) {
    this.fields = new FirmaModel();
    // this.fields.comentario = 'FIRMADO COMPONENTE FIRMA ANGULAR';
    this.fields.razon = this.form.get('razon').value;
    this.fields.ubicacion = 'Aplicación Trámite Ducumentario';
    this.fields.nombreArchivos = this.file.name;

    this.fields = { ...this.fields, ...res };
    this.isSave = true;

    // inicia la firma
    this.firmando = true;
    setTimeout(() => {
      this.firma.firmar();
    });
  }

  resultadoFirma(r) {
    if (r.resultado == 0) this.guardarArchivoFirmado();
    else swalError(r.estado);
    // this.guardarArchivoFirmado();
  }

  guardarArchivoFirmado() {
    this.api.guardarArchivoFirmado(this.form.value).subscribe(
      res => {
        this.isSave = false;
        this.firmando = false;
        notifyOk(res.mensaje);
        this.dialogRef.close(true);
      },
      _err => {  
        this.isSave = false;
        this.firmando = false;
      }
    );
  }
}