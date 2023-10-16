import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk } from '../../../@core/swal';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';

@Component({
  selector: 'detalle-rechazar-interno',
  templateUrl: './detalle-rechazar-interno.component.html',
  styleUrls: ['./detalle-rechazar-interno.component.scss'],
})
export class DetalleRechazarInternoComponent implements OnInit {
  titulo: string = '';
  form!: FormGroup;
  progress = 0;
  isSave = false;

  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<DetalleRechazarInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentoInterno
  ) {
    if (data.tipoDerivacion == 'P') {
      this.titulo = 'Rechazar Documento';
    } else {
      this.titulo = 'Rechazar Aprobacion';
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [this.data.codigoDocumentoTramite, Validators.required],
      numeroAtencion: [this.data.numeroAtencion, Validators.required],
      aprobacion: [this.data.nombreDerivacion],
      descripcionRechazo: ['', Validators.required],
    });
  }

  rechazarDocumento() {
    //console.log(JSON.stringify(this.form.value))
    this.api.rechazarDocumento(this.form.value).subscribe(
      (event) => {
        if (event.id == 0) {
          notifyOk(event.mensaje);
          this.dialogRef.close(true);
        }
      },
      (_err) => (this.progress = 0)
    );
  }
}
