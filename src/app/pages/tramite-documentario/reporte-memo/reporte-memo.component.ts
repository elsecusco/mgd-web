import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSave } from '../../../@core/file-save.service';
import { FirmaModel } from '../../../@models/firma.model';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Firma } from '../../../@shared/firma/firma';
import { UploadStatus } from 'ngxf-uploader';
import { Observable } from 'rxjs';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteService } from '../tramite-documentario.service';
import { Archivo } from '../../../@core/archivo';
import { notifyOk, swalError } from '../../../@core/swal';
// import { ArchivoDocumento } from '@models/tramite/archivo.documento';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'reporte-memo',
  templateUrl: './reporte-memo.component.html',
  styleUrls: ['./reporte-memo.component.scss']
})
export class ReporteMemoComponent implements OnInit {
  form!: FormGroup;
  file!: File;
  loadedPDF:Boolean = false;
  progress = 0;

  isSave = false;
  fields!: FirmaModel;
  @ViewChild('firma') firma!: Firma;
  firmando = false;
  loading!: Boolean;

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

  buzonActual!:BuzonesUsuario;
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

  @ViewChild('link') public link!: ElementRef;

  pdf!: Blob;
  constructor(public dialogRef: MatDialogRef<ReporteMemoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private api: TramiteService,
              private fs: FileSave,
              public dialog: MatDialog,
              private fb: FormBuilder,
    ) {
      pdfDefaultOptions.renderForms = false;
     }

  ngOnInit() {
    //console.log(this.data.codigoDocumento);
    this.buzonActual$.subscribe(b=>this.buzonActual=b)
    this.loaded$.subscribe(l => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
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
      titulo: ['Memo - '+this.data.codigoDocumentoInterno, [Validators.required, Validators.maxLength(110)]],
      descripcionArchivo: ['', Validators.required],
      nombreArchivo: ['Memo-'+this.data.codigoDocumentoInterno+".pdf", Validators.required],
      codigoDocumentoAdjuntoReemplazo:[this.data.hasOwnProperty("codigoDocumentoAdjuntoReemplazo")?this.data.codigoDocumentoAdjuntoReemplazo:null],
      razon: ['', Validators.required]
    });
    this.obtenerMemo()
  }
  obtenerMemo(){
    //console.log(JSON.stringify(this.data))
    if(this.data.codigoDocumentoAdjunto)
      this.api.
       descargarArchivo(this.data.codigoDocumento, this.data.codigoDocumentoAdjunto)
        .subscribe(blob =>{
           //this.pdf = URL.createObjectURL(blob);
           this.pdf = blob;
           this.loadedPDF = true;
      });

    else
      this.api.getReporteMemo(this.data.codigoDocumento).subscribe(res => {

        //this.pdf= URL.createObjectURL(res);
        this.pdf = res;
        this.loadedPDF = true;
    });

 }
  guardarArchivo() {
    if(this.data.codigoDocumentoAdjunto)
    this.api.guardarArchivoParaFirmarMemoAdjunto(this.data.codigoDocumento,this.data.codigoDocumentoAdjunto).subscribe(
      event => {
        // console.log(JSON.stringify(event))
          this.firmarArchivo(event);
      }
    );
    else
    this.api.guardarArchivoParaFirmarMemo(this.data.codigoDocumento).subscribe(
      event => {
        // console.log(JSON.stringify(event))
          this.firmarArchivo(event);
      }
    );
  }
  firmarArchivo(res: {
    rutaOrigen: string;
    rutaDestino: string;
    urlServicio: string;
  }) {
    this.fields = new FirmaModel();
    // this.fields.comentario = 'FIRMADO COMPONENTE FIRMA ANGULAR';
    this.fields.razon = this.form.get('razon')?.value;
    this.fields.cargo = this.buzonActual.cargo;
    this.fields.nombreArchivos = "Memo-"+this.data.codigoDocumentoInterno+".pdf";

    this.fields = { ...this.fields, ...res };
    this.isSave = true;
    // inicia la firma
    this.firmando = true;
    setTimeout(() => {
      this.firma.firmar();
    });
  }

  resultadoFirma(r: any) {
    if (r.resultado == 1) this.guardarArchivoFirmado();
    else swalError(r.estado);
    //this.guardarArchivoFirmado();
  }

  guardarArchivoFirmado() {
    this.api.guardarArchivoFirmado(this.form.value).subscribe(
      res => {
        //console.log(JSON.stringify(res))
        this.isSave = false;
        this.firmando = false;
        notifyOk(res.mensaje);
        this.dialogRef.close(res.idItem);
      },
      _err => {
        this.isSave = false;
        this.firmando = false;
      }
    );
  }
  descargarPdf(){
    if(this.data.codigoDocumentoAdjunto)
     // console.log(JSON.stringify(this.data))
      this.api.
       descargarArchivo(this.data.codigoDocumento, this.data.codigoDocumentoAdjunto)
       .subscribe(blob => this.setFile(this.data.codigoDocumento, blob));

    else
      this.api.getReporteMemo(this.data.codigoDocumento)
      .subscribe(blob => this.setFile(this.data.codigoDocumento, blob));

  }

  setFile(e: string, blob: any) {
    const archivo: Archivo = {
    nombre: "Memo-"+e,
    archivo: blob,
    extension: ".pdf",
    element: this.link
    };
    this.fs.save(archivo);
  }

}
