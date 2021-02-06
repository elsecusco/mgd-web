import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadStatus } from 'ngxf-uploader';
import { notifyOk, swalError } from '@core/swal';
import { FirmaModel } from '@models/firma.model';
import { Firma } from '@shared/firma/firma';
import { Select } from '@ngxs/store';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { Observable } from 'rxjs';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { AuthService } from '@core/auth/auth.service'; 
import { Usuario } from '@core/auth/usuario';
import { TramiteService } from '../tramite-documentario.service';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { BandejaState } from '../states/bandeja.state';


@Component({
    selector: 'detalle-adjuntar',
    templateUrl: './detalle-adjuntar.component.html',
    styleUrls: ['./detalle-adjuntar.component.scss']
  
})
export class DetalleAdjuntarComponent implements OnInit {
  form: FormGroup;
  file: File;
  progress = 0;
  
  isSave = false;
  fields: FirmaModel;
  @ViewChild('firma') firma: Firma;
  firmando = false;
  loading: Boolean;

  @Select(TramiteTiposState.loading)
  public loading$: Observable<Boolean>;

  loaded: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$: Observable<Boolean>;

  tipos: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos: Emittable<TramiteTipos>;

  buzonActual:BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;
  
  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    private auth:AuthService,
    public dialogRef: MatDialogRef<DetalleAdjuntarComponent>,
    @Inject(MAT_DIALOG_DATA) public data                       
  ) {}

  ngOnInit() {
    this.buzonActual$.subscribe(b=>this.buzonActual=b)
    this.loaded$.subscribe(l => {
      if (!l) this.loadTipos.emit();
    });
    this.tipos$.subscribe(tipos =>{
      this.tipos = tipos
    })

    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [this.data.codigoDocumento, Validators.required],
      numeroAtencion:[this.data.numeroAtencion, Validators.required],
      codigoTipoDocumentoTramiteAdjunto:['1'],
      titulo: ['', [Validators.required, Validators.maxLength(110)]],
      descripcionArchivo: [''], 
      nombreArchivo: ['', Validators.required],
      razon: ['']
    });
  }
  get titulo() {
    return this.form.get('titulo');
  } 
  changeFile(file: File) {
    this.file = file;
    this.form.patchValue({ titulo: file.name, nombreArchivo: file.name });
  }

  subirArchivo() {
    if (this.file instanceof File) {
      this.api.adjuntarArchivo(this.form.value, this.file).subscribe(
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
    this.fields.cargo = this.buzonActual.cargo;
    //this.fields.ubicacion = 'Aplicación Trámite Ducumentario';
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
    if (r.resultado == 1) this.guardarArchivoFirmado();
    else{
     swalError(r.estado);
      // this.guardarArchivoFirmado();
    }
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