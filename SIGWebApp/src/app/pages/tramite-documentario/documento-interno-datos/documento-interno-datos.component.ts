import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';

import { TramiteTiposState } from '../states/tramite-tipos.state';

import { Observable } from 'rxjs';
import { TramiteTipos } from '@models/tramite/tramite-tipos';

import { Remitente } from '@models/tramite/remitente';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk } from '@core/swal';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { formatDate } from '@angular/common';
import { ThemePalette } from '@angular/material';
import { BuzonesUsuario } from '@models/tramite/buzones-usuario';
import { DocumentoInterno } from '@models/tramite/documento-interno';
import { DocumentoInternoState } from '../states/documento-interno.state';

@Component({
  selector: 'documento-interno-datos',
  templateUrl: './documento-interno-datos.component.html',
  styleUrls: ['./documento-interno-datos.component.scss']
})
export class DocumentoInternoDatosComponent implements OnInit {
 
  codigoDocumento = 0;
  form: FormGroup;
  @ViewChild('f') f: any;
  
  @Input()
  color:ThemePalette

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

  saving: boolean;
  @Output() save = new EventEmitter<number | string>();

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$: Observable<DocumentoInterno>;
  
  @Emitter(DocumentoInternoState.setDocument)
  private setDocument: Emittable<{
  documento: DocumentoInterno;
  vista: string;
  }>;
  constructor(private fb: FormBuilder, private api: TramiteService) {
    this.doc$.subscribe(d => {
      this.doc = { ...d };
      this.codigoDocumento=this.doc.codigoDocumentoTramite;
    });
  }

  ngOnInit() {
  this.tipos = new TramiteTipos();
    this.tipos$.subscribe(tipos => 
      {
        this.tipos = tipos;
        this.doc.codigoTipoCorrelativo = this.tipos.tiposCorrelativos[0].codigo;
        this.doc.codigoTipoDocumento = this.tipos.tiposDocumentoInterno[0].codigo;
        this.doc.codigoTipoRecepcionDocumento=this.tipos.tiposRecepcion[0].codigo;
      });
    this.loaded$.subscribe(l => {
      if (!l) this.loadTipos.emit();
    });
    this.initForm();
    this.changeChk('tieneVencimiento', 'fechaVencimiento');
  }
  ngOnDestroy() {}

  initForm() {
    this.form = this.fb.group({
      codigoDocumento:[this.doc.codigoDocumentoTramite, Validators.required],
      codigoDocumentoInterno: [this.doc.codigoDocumentoInterno],
      codigoTipoCorrelativo: [this.doc.codigoTipoCorrelativo],
      contenidoDocumento: [this.doc.asunto, Validators.required],
      numeroExpediente: [this.doc.numeroExpediente],
      codigoTipoDocumento: [this.doc.codigoTipoDocumento, Validators.required],
      codigoTipoRecepcion: [this.doc.codigoTipoRecepcionDocumento, Validators.required],
      tieneVencimiento: [this.doc.tieneVencimiento, Validators.required],
      fechaDocumento: [this.doc.fechaDocumento, Validators.required],
      fechaVencimiento: [this.doc.fechaVencimiento]
    });
    if(this.codigoDocumento!=0) this.form.disable();
  }

  changeChk(nameChk, nameControl) {
    this.form.get(nameChk).valueChanges.subscribe(checked => {
      if (checked) {
        this.form.get(nameControl).setValidators(Validators.required);
      } else {
        this.form.get(nameControl).clearValidators();
        this.form.patchValue({ [nameControl]: null });
      }
      this.form.get(nameControl).updateValueAndValidity();
    });
  }
  onBlur(nameControl) {
    this.form.get(nameControl).markAsUntouched();
  }

  changeRemitente(r: Remitente) {
    this.form.patchValue({ codigoRemitente: r.codigoRemitenteDocumento });
  }

  saveDoc() {
    //this.form.patchValue({ loginBuzonCrea: this.buzonActual.loginUsuarioBuzon });
    this.saving = true;
    this.api.guardarDocumentoInterno(this.form.value).subscribe(
      res => {
        notifyOk(res.mensaje);
        console.log(res.idItem);
        this.form.disable();
        let codigos=res.idItem.toString().split("|");
        this.form.patchValue({
          codigoDocumentoInterno: codigos[0],
          codigoDocumento: +codigos[1],
          nombreEstadoDocumento: 'En Atención'
        });
        this.doc.codigoDocumentoTramite=+codigos[1];
        this.doc.codigoDocumentoInterno=codigos[0];

        this.saving = false;
        this.setDocument.emit({documento: this.doc, vista: 'entrada'});
        this.save.emit(parseInt(codigos[1]));
      },
      _err => {
        this.saving = false
        this.save.emit(200800145)}
    );
  }
}