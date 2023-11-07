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
import { Select, Store } from '@ngxs/store';

import { TramiteTiposState } from '../states/tramite-tipos.state';

import { Observable } from 'rxjs';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';

import { Remitente } from '../../../@models/tramite/remitente';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk } from '../../../@core/swal';
// import { BandejaFiltro } from '../../../@models/tramite/bandeja-filtro';
import { BandejaState } from '../states/bandeja.state';
// import { formatDate } from '@angular/common';
// import { ThemePalette } from '@angular/material';
import { BuzonesUsuario } from '../../../@models/tramite/buzones-usuario';
import { RespuestaRemitente } from '../states/remitente.states';

@Component({
  selector: 'documento-nuevo-datos',
  templateUrl: './documento-nuevo-datos.component.html',
  styleUrls: ['./documento-nuevo-datos.component.scss'],
})
export class DocumentoNuevoDatosComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  @ViewChild('f') f: any;

  // @Input()
  // color:ThemePalette

  buzonActual!: BuzonesUsuario;
  @Select(BandejaState.buzonActual)
  public buzonActual$!: Observable<BuzonesUsuario>;

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
  @Output() save = new EventEmitter<number>();

  representanteRemitente$!: Observable<RespuestaRemitente[]>;
  validar: boolean = false;
  codigoEmpresa: string = '';
  codigoDocumentoTramite: string = '';
  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    private store: Store
  ) {}

  ngOnInit() {
    this.buzonActual$.subscribe((u) => (this.buzonActual = u));

    this.initForm();
    this.changeChk('tieneCaducidad', 'fechaCaducidad');
    this.changeChk('tieneVencimiento', 'fechaVencimiento');

    this.tipos = new TramiteTipos();
    this.tipos$.subscribe((tipos) => (this.tipos = tipos));
    this.loaded$.subscribe((l) => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
    });
  }
  ngOnDestroy() {}

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [0, Validators.required],
      mesaPartes: [this.buzonActual.mesaPartes],
      codigoEstadoDocumento: [1, Validators.required], //Estado de Documento
      nombreEstadoDocumento: ['En registro', Validators.required],
      numeroDocumentoFisico: ['S/N', Validators.required],
      numeroExpediente: [''],
      contenidoDocumento: ['', Validators.required],
      numeroPaginas: [1, Validators.required],
      tieneCaducidad: [false, Validators.required],
      tieneVencimiento: [false, Validators.required],
      fechaDocumento: [new Date(), Validators.required],
      fechaRecepcion: [new Date(), Validators.required],
      fechaCaducidad: [null],
      fechaVencimiento: [null],
      codigoTipoRecepcion: [1, Validators.required],
      codigoRemitente: [null, Validators.required],
      codigoTipoDocumento: [null, Validators.required],
      codigoEmpresa: [0, Validators.required],
      codigoSucursal: [0, Validators.required],
      codigoArea: [0, Validators.required],
      loginBuzonCrea: [this.buzonActual.loginUsuarioBuzon, Validators.required],
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

  changeRemitente(r: Remitente | any) {
    this.representanteRemitente$ = this.store.select(
      (state) => state.respuestaRemitente.respuesta
    );
    this.form.patchValue({ codigoRemitente: r.codigoRemitenteDocumento });
    console.log('codigoRemitente', this.form.value.codigoRemitente);
    setTimeout(() => {
      if (this.representanteRemitente$) {
        this.representanteRemitente$.subscribe((res: any) => {
          res.map((r: any) => {
            if (r.idItem == this.form.value.codigoRemitent + 1)
              this.validar = true;
            else this.codigoEmpresa = r.idItem;
          });
        });
      }
    }, 2000);
  }

  async saveDoc() {
    this.form.patchValue({
      loginBuzonCrea: this.buzonActual.loginUsuarioBuzon,
    });
    this.saving = true;
    const observer = {
      next: (res: any) => {
        this.codigoDocumentoTramite = res.idItem;
        notifyOk(res.mensaje);
        this.form.disable();
        this.form.patchValue({
          codigoDocumento: res.idItem,
          nombreEstadoDocumento: 'En Atención',
        });
        this.saving = false;
        this.save.emit(res.idItem);
      },
      error: (_err: any) => {
        this.saving = false;
      },
      complete: () => {
        console.log('complete');
      },
    };
    await this.api.guardarDocumento(this.form.value).subscribe(observer);

    if (this.validar) {
      setTimeout(() => {
        this.api
          .actualizarRemitenteRepresentante({
            codigoRemitenteDocumentoRepresentante: this.codigoEmpresa,
            codigoDocumentoTramite: this.codigoDocumentoTramite,
          })
          .subscribe({
            next: (res: any) => {
              console.log(res);
            },
            error: (_err: any) => {
              console.log(_err);
            },
            complete: () => {
              console.log('complete');
            },
          });
      }, 3000);
    }
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 15 + 'px';
  }
}
