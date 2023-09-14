import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TramiteService } from '../tramite-documentario.service';
import { UploadStatus } from 'ngxf-uploader';
import { notifyOk, swalError } from '../../../@core/swal';
import { FirmaModel } from '../../../@models/firma.model';
import { Firma } from '../../../@shared/firma/firma';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';
import { Destinatario } from '../../../@models/tramite/destinatario';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';

@Component({
  selector: 'detalle-aprobacion-interno',
  templateUrl: './detalle-aprobacion-interno.component.html',
  styleUrls: ['./detalle-aprobacion-interno.component.scss'],
})
export class DetalleAprobacionInternoComponent implements OnInit {
  errorMaxlength = false;
  titulo: string;
  form!: FormGroup;
  file!: File;
  progress = 0;
  //botones
  aprovar = false;
  derivar = false;
  aprovarSubir = false;
  derivarSubir = false;
  cellDerivar = false;

  isSave = false;
  fields!: FirmaModel;
  @ViewChild('firma') firma!: Firma;
  firmando = false;

  @Select(TramiteTiposState.loading)
  public loading$!: Observable<Boolean>;

  loaded!: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$!: Observable<Boolean>;

  tipos!: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$!: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos!: Emittable<TramiteTipos>;

  buzonActual!: BuzonesUsuario;
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

  destPara: string[] = [];
  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<DetalleAprobacionInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataAprobacion
  ) {
    this.buzonActual$.subscribe((b) => (this.buzonActual = b));
    if (data.doc.tipoDerivacion == 'P' || data.doc.tipoDerivacion == 'D') {
      this.titulo = this.data.tipo + ' Documento';
    } else {
      this.titulo = 'Aprobar Documento';
    }
    if (data.doc.tipoDerivacion == 'D') {
      if (data.tipo == 'Derivar') this.derivar = true;
      else this.aprovar = true;
    } else {
      if (data.tipo == 'Derivar') this.derivarSubir = true;
      else this.aprovarSubir = true;
    }
  }

  ngOnInit() {
    this.loaded$.subscribe((l) => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
    });
    this.tipos$.subscribe((tipos) => {
      this.tipos = tipos;
    });
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      loginBuzon: [this.buzonActual.loginUsuarioBuzon],
      codigoDocumento: [
        this.data.doc.codigoDocumentoTramite,
        Validators.required,
      ],
      numeroAtencion: [this.data.doc.numeroAtencion, Validators.required],
      aprobacion: [this.data.doc.nombreDerivacion],
      descripcionAprobacion: [''],
      loginUsuarioPara: [null],
      proveidoDocumento: [null],
      razon: [''],
    });
  }
  changeFile(file: File) {
    this.file = file;
    this.errorMaxlength = this.file.name.length > 110;
    this.form.patchValue({ titulo: file.name, nombreArchivo: file.name });
  }

  aprobarArchivo() {
    const observer = {
      next: (event: any) => {
        this.progress = event.percent;
        if (event.status === UploadStatus.Completed && event.data) {
          notifyOk(event.data.mensaje);
          this.dialogRef.close(true);
        }
      },
      error: (_err: any) => (this.progress = 0),
      complete: () => {
        console.log(this.progress);
      },
    };
    if (this.file instanceof File) {
      this.api.aprobarArchivo(this.form.value, this.file).subscribe(observer);
    }
  }

  derivarArchivo() {
    const frm = { ...this.data.doc, ...this.form.value };
    const observer = {
      next: (event: any) => {
        this.progress = event.percent;
        if (event.status === UploadStatus.Completed && event.data) {
          notifyOk(event.data.mensaje);
          this.dialogRef.close(true);
        }
      },
      error: (_err: any) => (this.progress = 0),
      complete: () => {
        console.log(this.progress);
      },
    };
    if (this.file instanceof File) {
      this.api.derivarArchivoFinal(frm, this.file).subscribe(observer);
    }
  }
  derivarDePrincipal() {
    const frm = { ...this.data.doc, ...this.form.value };
    this.api.derivarDeFinal(frm).subscribe((r) => {
      notifyOk(r.mensaje);
      this.dialogRef.close(true);
    });
  }
  aprovarDePrincipal() {
    const frm = { ...this.data.doc, ...this.form.value };
    this.api.aprovarDeFinal(frm).subscribe((r) => {
      notifyOk(r.mensaje);
      this.dialogRef.close(true);
    });
  }
  para(destinatarios: Destinatario[]) {
    this.destPara = destinatarios.map((d) => d.loginUsuario);
    this.form.patchValue({
      loginUsuarioPara: [...this.destPara],
    });
    this.cellDerivar = destinatarios.length > 0;
  }

  guardarArchivo() {
    const observer = {
      next: (event: any) => {
        this.progress = event.percent;
        if (event.status === UploadStatus.Completed && event.data)
          this.firmarArchivo(event.data);
      },
      error: (_err: any) => {
        this.progress = 0;
      },
      complete: () => {
        console.log('Completed');
      },
    };
    if (this.file instanceof File) {
      this.api.guardarArchivoParaFirmar(this.file).subscribe(observer);
    }
  }

  firmarArchivo(res: {
    rutaOrigen: string;
    rutaDestino: string;
    urlServicio: string;
  }) {
    this.fields = new FirmaModel();
    this.fields.razon = this.form.get('razon')?.value;
    this.fields.cargo = this.buzonActual.cargo;
    this.fields.nombreArchivos = this.file.name;

    this.fields = { ...this.fields, ...res };
    this.isSave = true;
    this.firmando = true;
    setTimeout(() => {
      this.firma.firmar();
    });
  }
  resultadoFirma(r: any) {
    if (r.resultado == 1) this.guardarArchivoFirmado();
    else {
      swalError(r.estado);
    }
  }

  guardarArchivoFirmado() {
    const observer = {
      next: (res: any) => {
        this.isSave = false;
        this.firmando = false;
        notifyOk(res.mensaje);
        this.dialogRef.close(true);
      },
      error: (_err: any) => {
        this.isSave = false;
        this.firmando = false;
      },
      complete: () => {
        this.dialogRef.close(true);
      },
    };
    this.api.guardarArchivoFirmado(this.form.value).subscribe(observer);
  }
}
export interface DataAprobacion {
  doc: DocumentoInterno;
  tipo: string;
}
