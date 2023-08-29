import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth.service';
import { PackageMesa, DocumentoMesa } from '@models/documento-mesa';
import { UploadStatus } from 'ngxf-uploader';
import { notifyOk } from '@core/swal';

@Component({
    selector: 'confirmar-mesa',
    templateUrl: './confirmar-mesa.component.html',
    styleUrls: ['./confirmar-mesa.component.scss']
})

export class ConfirmarMesaComponent implements OnInit {
  form: FormGroup;
  progress = 0;
  verficacionMensaje = "";  
  isSave = false;
  isVerificado=false;
  confirmacionFinal=false;
  
  constructor(
    private fb: FormBuilder,
    private api: AuthService,
    public dialogRef: MatDialogRef<ConfirmarMesaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:PackageMesa                   
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      codigoRemitenteDocumento:[this.data.persona.codigoRemitenteDocumento],
      codigoVerificacion: ['', Validators.required]
    });
  }

  verificarCodigo(){
    this.api.verificarCodigo(this.form.value).subscribe(
      r=>{
        this.verficacionMensaje=r.mensaje;
        this.isVerificado=(r.id == 1);
        if(r.id == 1){
          this.verficacionMensaje+= ": Registrando documentos espere por favor... no cierre esta ventana";
          this.data.doc.codigoVerificacion=this.form.value.codigoVerificacion;
          this.subirArchivo();
        }
      }
    );
  }
  subirArchivo() {
    
    this.data.doc.filePrincipal=DocumentoMesa.adjuntoToString(this.data.principal);
    this.data.doc.listAnexos=this.data.listAnexos.map(v=>DocumentoMesa.adjuntoToString(v)).join("##");
    let files:File[]=[];
    files.push(this.data.principal.file);
    this.data.listAnexos.map(v=>files.push(v.file));
    this.api.subirArchivos(this.data.doc, files).subscribe(
      event => {
        this.progress = event.percent;
        if (event.status === UploadStatus.Completed && event.data) {
          notifyOk(event.data.mensaje);
          this.data.doc.codigoDocumentoTramite=event.data.codigoDocumentoTramite;
          this.confirmacionFinal=true;
        }
      },
      _err => (this.progress = 0)
    );
  }
  close(){
    this.dialogRef.close(true);
  }
}