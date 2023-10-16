import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';

import { TramiteTiposState } from '../states/tramite-tipos.state';

import { Observable } from 'rxjs';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';

import { Remitente } from '../../../@models/tramite/remitente';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk } from '../../../@core/swal';
import { BandejaInternoState } from '../states/bandeja-interno.state';
// import { ThemePalette } from '@angular/material';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { Pair } from '../../../@models/pair';
// import { ValorizacionDetalle } from '@models/tramite/valorizacion-detalle';
import { ValorizacionContabilidadComponent } from '../valorizacion-contabilidad/valorizacion-contabilidad.component';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'documento-interno-datos',
  templateUrl: './documento-interno-datos.component.html',
  styleUrls: ['./documento-interno-datos.component.scss'],
})
export class DocumentoInternoDatosComponent implements OnInit {
  numeroValorizaciones = 0;
  @ViewChild(ValorizacionContabilidadComponent)
  valorizacion!: ValorizacionContabilidadComponent;
  editData: boolean = true;
  codigoDocumento = 0;
  correlativos: Pair[] = [];

  form!: FormGroup;
  @ViewChild('f') f: any;

  @Input()
  // color:ThemePalette
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

  saving!: boolean;
  @Output() save = new EventEmitter<number | string>();

  @Output() changeTipoDoc = new EventEmitter<number>();

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$!: Observable<DocumentoInterno>;

  @Emitter(DocumentoInternoState.setDocument)
  private setDocument!: Emittable<{
    documento: DocumentoInterno;
    vista: string;
  }>;

  buzonActual!: BuzonesUsuario;
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

  //tiposDocumentoInterno=[]
  //tiposRecepcion=[]
  constructor(private fb: FormBuilder, private api: TramiteService) {
    this.doc$.subscribe((d) => {
      this.doc = { ...d };
      this.codigoDocumento = this.doc.codigoDocumentoTramite;
    });
    this.buzonActual$.subscribe((b) => (this.buzonActual = b));
  }

  ngOnInit() {
    this.editData = this.doc.codigoDocumentoTramite == 0;
    if (this.doc.codigoTipoDocumento == 48) this.cargarValorizacionDi();
    this.loaded$.subscribe((l) => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
    });
    this.tipos$.subscribe((tipos) => {
      this.tipos = tipos;
      this.correlativos =
        this.tipos.tiposCorrelativos[this.buzonActual.loginUsuarioBuzon];
      //console.log(JSON.stringify(this.correlativos))
      if (this.doc.codigoDocumentoTramite != 0) {
        //console.log("enviado desde nGinit");
        this.setCodigosTxt();
      } else if (this.correlativos != undefined)
        this.doc.codigoTipoCorrelativo = this.correlativos[0].codigo || 0;
    });

    this.initForm();
    this.changeChk('tieneVencimiento', 'fechaVencimiento');
  }
  ngOnDestroy() {}
  tipoDocumento: any;
  tipoRecepcion: any;
  setCodigosTxt() {
    if (this.tipos && this.tipos.tiposDocumentoInterno) {
      if (this.tipos.tiposDocumentoInterno.length > 0 && this.form) {
        this.tipoDocumento = this.tipos.tiposDocumentoInterno.find(
          (e) => e.codigo === this.doc.codigoTipoDocumento
        )!.nombre;
        this.tipoRecepcion = this.tipos.tiposRecepcion.find(
          (e) => e.codigo === this.doc.codigoTipoRecepcionDocumento
        )!.nombre;
        //console.log(this.tipoDocumento+" "+this.tipoRecepcion)
      }
    }
  }
  initForm() {
    this.form = this.fb.group({
      loginBuzon: [this.buzonActual.loginUsuarioBuzon],
      codigoDocumento: [this.doc.codigoDocumentoTramite, Validators.required],
      codigoDocumentoInterno: [this.doc.codigoDocumentoInterno],
      codigoTipoCorrelativo: [this.doc.codigoTipoCorrelativo],
      contenidoDocumento: [this.doc.asunto, Validators.required],
      numeroExpediente: [this.doc.numeroExpediente],
      numeroDocumentoFisico: [this.doc.numeroDocumentoFisico],
      //codigoTipoDocumento: [48, Validators.required],
      codigoTipoDocumento: [this.doc.codigoTipoDocumento, Validators.required],
      codigoTipoRecepcion: [
        this.doc.codigoTipoRecepcionDocumento,
        Validators.required,
      ],
      tieneVencimiento: [this.doc.tieneVencimiento, Validators.required],
      fechaDocumento: [this.doc.fechaDocumento, Validators.required],
      fechaVencimiento: [this.doc.fechaVencimiento],
    });
    //console.log("enviado desde initFrom");
    this.setCodigosTxt();

    //  if(this.codigoDocumento!=0) this.form.disable();
  }
  cargarValorizacionDi() {
    this.api
      .listarValorizacion(this.codigoDocumento)
      .subscribe((valorizacion) => {
        this.valorizacion.detalleContrato = valorizacion;
        this.valorizacion.guardado = true;
      });
  }

  changeChk(nameChk: any, nameControl: any) {
    this.form.get(nameChk)!.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get(nameControl)!.setValidators(Validators.required);
      } else {
        this.form.get(nameControl)!.clearValidators();
        this.form.patchValue({ [nameControl]: null });
      }
      this.form.get(nameControl)!.updateValueAndValidity();
    });
  }
  onBlur(nameControl: any) {
    this.form.get(nameControl)!.markAsUntouched();
  }

  changeRemitente(r: Remitente) {
    this.form.patchValue({ codigoRemitente: r.codigoRemitenteDocumento });
  }

  saveDoc() {
    //console.log(JSON.stringify(this.form.value))
    //this.form.patchValue({ loginBuzonCrea: this.buzonActual.loginUsuarioBuzon });
    const observer = {
      next: (res: any) => {
        notifyOk(res.mensaje);
        //console.log(res.idItem);
        //this.form.disable();
        let codigos = res.idItem.toString().split('|');
        this.form.patchValue({
          codigoDocumentoInterno: codigos[0],
          codigoDocumento: +codigos[1],
          nombreEstadoDocumento: 'En Atención',
        });
        this.doc.codigoDocumentoTramite = +codigos[1];
        this.doc.codigoDocumentoInterno = codigos[0];
        this.saving = false;
        this.save.emit(parseInt(codigos[1]));
        this.doc.codigoTipoDocumento = this.form.value.codigoTipoDocumento;
        this.doc.codigoTipoRecepcionDocumento =
          this.form.value.codigoTipoRecepcion;
        this.setCodigosTxt();
        this.editData = false;
        this.changeTipoDoc.emit(this.doc.codigoTipoDocumento);
        this.setDocument.emit({ documento: this.doc, vista: 'entrada' });
        //console.log(this.doc.codigoTipoDocumento)
        if (this.doc.codigoTipoDocumento == 48)
          this.valorizacion.save(parseInt(codigos[1]));
      },
      error: (_err: any) => {
        this.saving = false;
      },
      complete: () => {
        console.log('Completed');
      },
    };
    this.saving = true;
    this.api.guardarDocumentoInterno(this.form.value).subscribe(observer);
  }
}
