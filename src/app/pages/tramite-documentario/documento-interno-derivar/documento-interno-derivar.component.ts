import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Destinatario } from '../../../@models/tramite/destinatario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk, swalError } from '../../../@core/swal';
import { AprobacionDocumento } from '../../../@models/tramite/aprobacion-documento';
import { DocumentoInternoState } from '../states/documento-interno.state';
import { DocumentoInterno } from '../../../@models/tramite/documento-interno';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { BandejaInternoState } from '../states/bandeja-interno.state';
import { DestinatarioBuscarInternoComponent } from '../destinatario-buscar-interno/destinatario-buscar-interno.component';
@Component({
  selector: 'documento-interno-derivar',
  templateUrl: './documento-interno-derivar.component.html',
  styleUrls: ['./documento-interno-derivar.component.scss'],
})
export class DocumentoInternoDerivarComponent implements OnInit, AfterViewInit {
  @ViewChild('boxDest') componenteBuscar!: DestinatarioBuscarInternoComponent;
  sizeAdjuntos = 0;
  private _codigoDocumento: number = 0;
  @Input()
  set codigoDocumento(codigoDocumento: number) {
    this._codigoDocumento = codigoDocumento || 0;
  }
  get codigoDocumento(): number {
    return this._codigoDocumento;
  }
  private _numeroValorizaciones: number = 0;
  @Input()
  set numeroValorizaciones(numeroValorizaciones: number) {
    this._numeroValorizaciones = numeroValorizaciones || 0;
  }
  get numeroValorizaciones(): number {
    return this._numeroValorizaciones;
  }
  private _tipoDocumento: number = 0;
  @Input()
  set tipoDocumento(tipoDocumento: number) {
    this._tipoDocumento = tipoDocumento || 0;
  }
  get tipoDocumento(): number {
    return this._tipoDocumento;
  }

  saving!: boolean;
  @Output() derivar = new EventEmitter();

  form!: FormGroup;
  @ViewChild('f') f: any;

  private destPara: string[] = [];
  private destAprobaciones: string[] = [];
  private tipoAprobaciones: string[] = [];

  vista: string = '';
  @Select(DocumentoInternoState.vista)
  public vista$!: Observable<string>;

  doc: DocumentoInterno = new DocumentoInterno();
  @Select(DocumentoInternoState.documento)
  public doc$!: Observable<DocumentoInterno>;

  buzonActual!: BuzonesUsuario;
  @Select(BandejaInternoState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

  destinatarioGerente!: Destinatario;
  @Select(BandejaInternoState.destinatarioGerente)
  public destinatarioGerente$!: Observable<Destinatario>;

  constructor(private fb: FormBuilder, private api: TramiteService) {
    this.destinatarioGerente$.subscribe((g) => (this.destinatarioGerente = g));
    this.vista$.subscribe((v) => (this.vista = v));
    this.buzonActual$.subscribe((b) => (this.buzonActual = b));
    this.doc$.subscribe((d) => {
      this.doc = { ...d };
    });
  }

  ngOnInit() {
    //console.log(JSON.stringify(this.doc))
    //console.log(this.doc.codigoTipoDocumento)
    //if(this.doc.codigoTipoDocumento)
    this.tipoDocumento = this.doc.codigoTipoDocumento;
    this.initForm();
    //this.changeChk('conPlazoAtencion', 'fechaPlazoAtencion');
    if (this.vista == 'bandeja-detalle') this.setForm();
  }
  ngAfterViewInit() {
    if (this.tipoDocumento == 48) {
      this.componenteBuscar.setDefault(this.destinatarioGerente);
    }
  }

  ngOnDestroy() {}

  initForm() {
    this.form = this.fb.group({
      loginBuzon: [this.buzonActual.loginUsuarioBuzon],
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
      loginAprobacion: [[]],
      codigoAprobacion: [[]],
      fechaDerivacion: [new Date(), Validators.required],
      fechaRecepcion: [null],
      fechaLeido: [null],
      fechaPlazoAtencion: [null],
      fechaAtencion: [null],
      sumillaAtencion: ['', Validators.required],
      descripcionSolicitudAtencion: ['ATENDER', Validators.required],
      descripcionAtencion: ['', Validators.required],
    });
  }
  setForm() {
    this.form.patchValue({
      //loginUsuarioBuzon:this.loginUsuarioOrigen,
      codigoDocumento: this.doc.codigoDocumentoTramite,
      numeroAtencionOrigen: this.doc.numeroAtencion,
      leido: this.doc.leido,
      estado: this.doc.estado,
    });
  }

  changeChk(nameChk: any, nameControl: any) {
    this.form.get(nameChk)?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get(nameControl)?.setValidators(Validators.required);
      } else {
        this.form.get(nameControl)?.clearValidators();
        this.form.patchValue({ [nameControl]: null });
      }
      this.form.get(nameControl)?.updateValueAndValidity();
    });
  }
  onBlur(nameControl: any) {
    this.form.get(nameControl)?.markAsUntouched();
  }

  derivarDoc() {
    this.saving = true;
    if (this.tipoDocumento == 48)
      this.api.derivarDocumentoInternoValorizacion(this.form.value).subscribe(
        (res) => {
          this.saving = false;
          if (res.length == 0) {
            notifyOk('Derivación Realizada!');
            this.derivar.emit();
          } else {
            const users = res.map((r) => r.idItem).join(', ');
            swalError('Error al Derivar a:', users);
          }
        },
        (_err) => (this.saving = false)
      );
    else
      this.api.derivarDocumentoInterno(this.form.value).subscribe(
        (res) => {
          this.saving = false;
          if (res.length == 0) {
            notifyOk('Derivación Realizada!');
            this.derivar.emit();
          } else {
            const users = res.map((r) => r.idItem).join(', ');
            swalError('Error al Derivar a:', users);
          }
        },
        (_err) => (this.saving = false)
      );
  }

  //#region DESTINATARIOS ***********************
  para(destinatarios: Destinatario[]) {
    this.destPara = destinatarios.map((d) => d.loginUsuario);
    this.form.patchValue({
      loginUsuarioPara: [...this.destPara],
    });
  }
  listAprobaciones(aprobaciones: Array<AprobacionDocumento>) {
    this.destAprobaciones = aprobaciones.map((d) => d.loginUsuario);
    this.tipoAprobaciones = aprobaciones.map((d) => d.codigoTipoAprobacion);
    this.form.patchValue({
      loginAprobacion: [...this.destAprobaciones],
      codigoAprobacion: [...this.tipoAprobaciones],
    });
    // console.log(JSON.stringify(this.destAprobaciones));
  }
  //#endregion **********************************
}
