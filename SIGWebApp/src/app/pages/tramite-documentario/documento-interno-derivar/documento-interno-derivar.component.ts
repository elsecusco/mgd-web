import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Destinatario } from '@models/tramite/destinatario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk, swalError } from '@core/swal';
import { AprobacionDocumento } from '@models/tramite/aprobacion-documento';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { DocumentoInterno } from '@models/tramite/documento-interno';

@Component({
  selector: 'documento-interno-derivar',
  templateUrl: './documento-interno-derivar.component.html',
  styleUrls: ['./documento-interno-derivar.component.scss']
})
export class DocumentoInternoDerivarComponent implements OnInit {
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

  private destPara: string[] = [];
  private destAprobaciones: string[] = [];
  private tipoAprobaciones: string[] = [];
  
  vista: string;
  @Select(DocumentoInternoState.vista)
  public vista$: Observable<string>;

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$: Observable<DocumentoInterno>;

  constructor(private fb: FormBuilder, private api: TramiteService) {
    this.vista$.subscribe(v => (this.vista = v));
    this.doc$.subscribe(d => (this.doc = { ...d }));
  }

  ngOnInit() {
    this.initForm();
    //this.changeChk('conPlazoAtencion', 'fechaPlazoAtencion');
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
      loginUsuarioPara: [[], Validators.required],
      loginAprobacion: [[], ],
      codigoAprobacion: [[], ],
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
    this.api.derivarDocumentoInterno(this.form.value).subscribe(
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
  listAprobaciones(aprobaciones:Array<AprobacionDocumento>){
    this.destAprobaciones=aprobaciones.map(d=>d.loginUsuario);
    this.tipoAprobaciones=aprobaciones.map(d=>d.codigoTipoAprobacion);
    this.form.patchValue({
      loginAprobacion:[...this.destAprobaciones],
      codigoAprobacion:[...this.tipoAprobaciones]
    });
  }
  //#endregion **********************************
}
