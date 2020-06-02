import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Select } from '@ngxs/store';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { Observable } from 'rxjs';

import { TramiteTipos } from '@models/tramite/tramite-tipos';
import { Destinatario } from '@models/tramite/destinatario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk, swalError } from '@core/swal';
import { BandejaDocumento } from '@models/tramite/bandeja-documento';
import { DocumentoState } from '../states/documento.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { BandejaFiltro } from '@models/tramite/bandeja-filtro';
import { BandejaState } from '../states/bandeja.state';

@Component({
  selector: 'documento-derivar',
  templateUrl: './documento-derivar.component.html',
  styleUrls: ['./documento-derivar.component.scss']
})
export class DocumentoDerivarComponent implements OnInit {
  private _codigoDocumento: number;
  @Input()
  set codigoDocumento(codigoDocumento: number) {
    this._codigoDocumento = codigoDocumento || 0;
  }
  get codigoDocumento(): number {
    return this._codigoDocumento;
  }
  saving: boolean;
  @Output() derivar = new EventEmitter();

  form: FormGroup;
  @ViewChild('f') f: any;

  loaded: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$: Observable<Boolean>;

  tipos: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos: Emittable<TramiteTipos>;

  private destPara: string[] = [];
  private destConCopia: string[] = [];

  vista: string;
  @Select(DocumentoState.vista)
  public vista$: Observable<string>;

  doc: BandejaDocumento = new BandejaDocumento();
  @Select(DocumentoState.documento)
  public doc$: Observable<BandejaDocumento>;

  constructor(private fb: FormBuilder, private api: TramiteService) {
    this.vista$.subscribe(v => (this.vista = v));
    this.doc$.subscribe(d => (this.doc = { ...d }));
  }

  ngOnInit() {
    this.initForm();
    this.changeChk('conPlazoAtencion', 'fechaPlazoAtencion');
    this.tipos$.subscribe(tipos => (this.tipos = tipos));
    this.loaded$.subscribe(l => {
      if (!l) this.loadTipos.emit();
    });
    if (this.vista == 'bandeja-detalle') this.setForm();
  }

  ngOnDestroy() {}

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [this.codigoDocumento, Validators.required],
      numeroAtencion: [0, Validators.required],
      numeroAtencionOrigen: [0, Validators.required],
      codigoPrioridadAtencion: [4, Validators.required],
      codigoTipoAtencionRequeridaDocumento: [1, Validators.required],
      leido: [0, Validators.required],
      atendido: [0, Validators.required],
      atencionFinal: [0, Validators.required],
      conPlazoAtencion: [false, Validators.required],
      codigoAreaOrigen: [0, Validators.required],
      codigoAreaDestino: [0, Validators.required],
      //loginUsuarioOrigen: [this.loginUsuarioOrigen, Validators.required],
      loginUsuarioPara: [[], Validators.required],
      loginUsuarioConCopia: [[], ],
      fechaDerivacion: [new Date(), Validators.required],
      fechaRecepcion: [null],
      fechaLeido: [null],
      fechaPlazoAtencion: [null],
      fechaAtencion: [null],
      sumillaAtencion: ['', Validators.required],
      descripcionSolicitudAtencion: ['ATENDER', Validators.required],
      descripcionAtencion: ['', Validators.required]
    });
  }
  setForm() {
    this.form.patchValue({
      //loginUsuarioBuzon:this.loginUsuarioOrigen,
      codigoDocumento: this.doc.codigoDocumentoTramite,
      numeroAtencionOrigen: this.doc.numeroAtencion,
      leido: this.doc.leido,
      atendido: this.doc.atendido
    });
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

  derivarDoc() {
    this.saving = true;
    this.api.derivarDocumento(this.form.value).subscribe(
      res => {
        this.saving = false;
        if (res.length == 0) {
          notifyOk('Derivación Realizada!');
          this.derivar.emit();
        } else {
          const users = res.map(r => r.idItem).join(', ');
          swalError('Error al Derivar a:', users);
        }
      },
      _err => (this.saving = false)
    );
  }

  //#region DESTINATARIOS ***********************
  para(destinatarios: Destinatario[]) {
    this.destPara = destinatarios.map(d => d.loginUsuario);
    this.form.patchValue({
      loginUsuarioPara:[...this.destPara]
    });
  }
  conCopia(destinatarios: Destinatario[]) {
    this.destConCopia = destinatarios.map(d => d.loginUsuario);
    this.form.patchValue({
      loginUsuarioConCopia:[...this.destConCopia]
    });
  }
  //#endregion **********************************
}
