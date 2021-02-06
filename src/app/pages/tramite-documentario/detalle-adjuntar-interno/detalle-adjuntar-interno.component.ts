import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadStatus } from 'ngxf-uploader';
import { notifyOk, swalError } from '@core/swal';
import { FirmaModel } from '@models/firma.model';
import { Firma } from '@shared/firma/firma';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { Select } from '@ngxs/store';
import { BandejaState } from '../states/bandeja.state';
import { Observable } from 'rxjs';
import { ArchivoDocumento } from '@models/tramite/archivo.documento';
import { TramiteService } from '../tramite-documentario.service';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';


@Component({
    selector: 'detalle-adjuntar-interno',
    templateUrl: './detalle-adjuntar-interno.component.html',
    styleUrls: ['./detalle-adjuntar-interno.component.scss']
})

export class DetalleAdjuntarInternoComponent implements OnInit {
  form: FormGroup;
  file: File;
  progress = 0;
  tipo = "";
  
  isSave = false;
  fields: FirmaModel;
  @ViewChild('firma') firma: Firma;
  firmando = false;

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
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;

  
  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<DetalleAdjuntarInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data                       
  ) {}

  ngOnInit() {
    this.buzonActual$.subscribe(b=>this.buzonActual=b)
    this.tipo=this.data.tipoArchivo.nome;
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
      codigoTipoDocumentoTramiteAdjunto:[this.data.tipoArchivo.val],
      titulo: ['', [Validators.required, Validators.maxLength(110)]],
      descripcionArchivo: ['', Validators.required], 
      nombreArchivo: ['', Validators.required],
      codigoDocumentoAdjuntoReemplazo:[this.data.hasOwnProperty("codigoDocumentoAdjuntoReemplazo")?this.data.codigoDocumentoAdjuntoReemplazo:null],
      razon: ['']
    });
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
    else swalError(r.estado);
    //this.guardarArchivoFirmado();
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

  get titulo() {
    return this.form.get('titulo');
  }
  
}