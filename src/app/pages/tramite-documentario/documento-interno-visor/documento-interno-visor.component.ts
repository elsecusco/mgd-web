import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileSave } from '@core/file-save.service';
import { notifyOk, swalError } from '@core/swal';
import { FirmaModel } from '@models/firma.model';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { Destinatario } from '@models/tramite/destinatario';
import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Firma } from '@shared/firma/firma';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Observable } from 'rxjs';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteService } from '../tramite-documentario.service';

@Component({
  selector: 'documento-interno-visor',
  templateUrl: './documento-interno-visor.component.html',
  styleUrls: ['./documento-interno-visor.component.scss']
})
export class DocumentoInternoVisorComponent implements OnInit {
  
  pdfSrc!: Blob;
  form: FormGroup;
  file: File;
  loadedPDF:Boolean = false;
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
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$: Observable<BuzonesUsuario>;
  
  @ViewChild('link') public link: ElementRef;
  destPara=[]
  cellDerivar=false;
  constructor(public dialogRef: MatDialogRef<DocumentoInternoVisorComponent>, 
              @Inject(MAT_DIALOG_DATA) public data,
              private fb: FormBuilder,
              private api: TramiteService,
              public dialog: MatDialog) {
              pdfDefaultOptions.renderInteractiveForms = false;
              this.buzonActual$.subscribe(b=>this.buzonActual=b)
      
     }

  ngOnInit() {
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
      titulo: [this.data.nombreFile, [Validators.required, Validators.maxLength(110)]],
      proveidoDocumento: ['', Validators.required], 
      nombreArchivo: [this.data.nombreFile, Validators.required],
      codigoDocumentoAdjuntoReemplazo:[this.data.hasOwnProperty("codigoDocumentoAdjuntoReemplazo")?this.data.codigoDocumentoAdjuntoReemplazo:null],
      razon: [((this.data.nombreDerivacion) || this.data.estadoDerivacion =='FD')?'FD':'', Validators.required],
      loginUsuarioPara:[null],
      loginBuzon: [this.buzonActual.loginUsuarioBuzon]
    });
    this.loadPdf();
  }
  loadPdf() {
    this.api
   .descargarArchivo(this.data.codigoDocumento, this.data.codigoDocumentoAdjunto)
   .subscribe(async blob => {
     this.pdfSrc = blob; 
     this.loadedPDF = true;
    })
  }
  aprobarArchivo() {
    this.api.aprobarValidacion(this.form.value).subscribe(
         event => {
            notifyOk(event.mensaje);
            this.dialogRef.close(true);
          }
      );
  }
  derivarArchivo(){
    this.api.derivarInternoFinal(this.form.value).subscribe(
        event => {
            notifyOk(event.mensaje);
            const closeresult=true;
            this.dialogRef.close(closeresult);
        },
        _err => (this.progress = 0)
      );
  }
  guardarArchivo() {
    this.api.guardarArchivoParaFirmarInterno(this.data.codigoDocumento,
            this.data.codigoDocumentoAdjunto).subscribe(
      event => {
            this.firmarArchivo(event);
      }
    )
  }
  firmarArchivo(res: {
    rutaOrigen: string;
    rutaDestino: string;
    urlServicio: string;
  }) {
    this.fields = new FirmaModel();
    this.fields.razon = this.form.get('razon').value;
    this.fields.cargo = this.buzonActual.cargo;
    this.fields.nombreArchivos = this.data.nombreFile;
    

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

  }

  guardarArchivoFirmado() {
    this.api.guardarArchivoFirmado(this.form.value).subscribe(
      res => {
        //console.log(JSON.stringify(res))
        this.isSave = false;
        this.firmando = false;
        if(this.data.tipo == "Derivar")
        this.derivarArchivo()
        else
        this.aprobarArchivo()
      },
      _err => {  
        this.isSave = false;
        this.firmando = false;
      }
    );
  }
  para(destinatarios: Destinatario[]) {
    this.destPara = destinatarios.map(d => d.loginUsuario);
    this.form.patchValue({
      loginUsuarioPara:[...this.destPara]
    });
    this.cellDerivar=(destinatarios.length>0);
  }
  
}



