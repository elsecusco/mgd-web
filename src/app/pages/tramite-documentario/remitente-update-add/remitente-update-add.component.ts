import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Inject,
  DoCheck,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import {
  Remitente,
  IRemitente,
  TipoRemitente,
} from '../../../@models/tramite/remitente';
import { Observable, of } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  finalize,
} from 'rxjs/operators';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { notifyOk } from '../../../@core/swal';
import { RemitenteService } from './remitente.service';

@Component({
  selector: 'remitente-update-add',
  templateUrl: './remitente-update-add.component.html',
  styleUrls: ['./remitente-update-add.component.scss'],
})
export class RemitenteUpdateAddComponent implements OnInit, DoCheck {
  hiddenValidarDni: boolean = true;
  hiddenDni: boolean = true;
  hiddenValidarRuc: boolean = true;
  hiddenRuc: boolean = true;
  validarStringDni: string = '';
  validarStringRuc: string = '';
  valorTipoDocumento: string = 'D.N.I.';
  saving!: boolean;
  selected: string = 'D.N.I.';
  representante: respuestaRemitente[] = [];
  @Output() save = new EventEmitter<number | string>();

  form!: FormGroup;
  tiposRemitente!: Observable<TipoRemitente[]>;
  Tipo: any;
  listTipoDocumento: tipoDocumento[] = [];
  constructor(
    private remitenteService: RemitenteService,
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<RemitenteUpdateAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRemitente
  ) {}
  ngDoCheck() {
    this.changeValidarDni(this.form.value.numeroDocumentoIdentidad);
    this.changeValidarRuc(this.form.value.numeroDocumentoIdentidadRuc);
  }
  ngOnInit() {
    this.tiposRemitente = this.api.tiposRemitente().pipe(finalize(() => {}));
    this.initForm();
    this.cargarData();
  }
  initForm() {
    if (this.data.codigoRemitenteDocumento > 0)
      this.form = this.fb.group({
        codigoRemitenteDocumento: this.data.codigoRemitenteDocumento,
        nombre: [this.data.nombreRemitenteDocumento, Validators.required],
        tipo: [this.data.codigoTipoRemitenteDocumento, Validators.required],
        telefono: [this.data.telefonoContacto, Validators.required],
        // email: [this.data.emailContacto, Validators.required]
        email: [this.data.emailContacto, Validators.required],
        numeroDocumentoIdentidad: [this.data.numeroDocumentoIdentidad, ''],
        apellidoPaterno: [this.data.apellidoPaterno, ''],
        apellidoMaterno: [this.data.apellidoMaterno, ''],
        nombres: [this.data.nombres, ''],
        numeroDocumentoIdentidadRuc: [this.data.nombres, ''],
        razonSocial: [this.data.nombres, ''],
      });
    else
      this.form = this.fb.group({
        codigoRemitenteDocumento: this.data.codigoRemitenteDocumento,
        nombre: ['', Validators.required],
        tipo: ['', Validators.required],
        telefono: ['', Validators.required],
        // email: ['', Validators.required]
        email: ['', Validators.required],
        numeroDocumentoIdentidad: ['', ''],
        apellidoPaterno: ['', ''],
        apellidoMaterno: ['', ''],
        nombres: ['', ''],
        numeroDocumentoIdentidadRuc: ['', ''],
        razonSocial: ['', ''],
      });
  }
  guardarRemitente() {
    let remitenteRepresentate: any = {
      codigoRemitenteDocumento: 0,
      nombre: this.form.value.nombre,
      tipo: this.form.value.tipo,
      telefono: this.form.value.telefono,
      email: this.form.value.email,
      NumeroDocumentoIdentidad: this.form.value.numeroDocumentoIdentidad,
      ApellidoPaterno: this.form.value.apellidoPaterno,
      ApellidoMaterno: this.form.value.apellidoMaterno,
      Nombres: this.form.value.nombres,
    };
    let remitenteEmpresa: any = {
      codigoRemitenteDocumento: 0,
      nombre: this.form.value.razonSocial,
      tipo: this.form.value.tipo,
      telefono: this.form.value.telefono,
      email: this.form.value.email,
      NumeroDocumentoIdentidad: this.form.value.numeroDocumentoIdentidadRuc,
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Nombres: '',
    };
    if (!this.hiddenRuc) {
      this.api.guardarRemitente(remitenteEmpresa).subscribe({
        next: (res: any) => {
          this.representante.push(res);
        },
        error: (_err: any) => {
          console.log(_err);
        },
        complete: () => {
          console.log('complete');
        },
      });
    }
    this.saving = true;
    const observer = {
      next: (res: any) => {
        if (!this.hiddenRuc) this.representante.push(res);
        notifyOk(res.mensaje);
        this.form.disable();
        this.form.patchValue({
          codigoRemitenteDocumento: res.idItem,
        });
        this.data.codigoRemitenteDocumento = +res.idItem;
        this.data.nombreRemitenteDocumento = this.hiddenRuc
          ? this.form.value.nombre
          : this.form.value.razonSocial;
        this.data.codigoTipoRemitenteDocumento = this.form.value.tipo;
        this.data.telefonoContacto = this.form.value.telefono;
        this.data.emailContacto = this.form.value.email;
        this.data.numeroDocumentoIdentidad = this.hiddenRuc
          ? this.form.value.numeroDocumentoIdentidad
          : this.form.value.numeroDocumentoIdentidadRuc;
        this.data.apellidoPaterno = this.hiddenRuc
          ? this.form.value.apellidoPaterno
          : '';
        this.data.apellidoMaterno = this.hiddenRuc
          ? this.form.value.apellidoMaterno
          : '';
        this.data.nombres = this.hiddenRuc ? this.form.value.nombres : '';
        this.saving = false;
        this.save.emit(res.idItem);
        if (!this.hiddenRuc) {
          this.dialogRef.close({
            data: this.data,
            remitente: this.representante,
          });
        } else this.dialogRef.close(this.data);
      },
      error: (_err: any) => {
        this.saving = false;
      },
      complete: () => {
        console.log('complete');
      },
    };
    this.api.guardarRemitente(this.form.value).subscribe(observer);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  validarDni() {
    if (this.form.value.numeroDocumentoIdentidad.length == 8)
      this.remitenteService
        .getValidarDni(this.form.value.numeroDocumentoIdentidad)
        .then((r: any) => {
          this.form.controls['nombre'].setValue(r.data.nombre);
          this.form.controls['apellidoPaterno'].setValue(r.data.aPaterno);
          this.form.controls['apellidoMaterno'].setValue(r.data.aMaterno);
          this.form.controls['nombres'].setValue(r.data.nombres);
        });
  }
  validarRuc() {
    if (this.form.value.numeroDocumentoIdentidadRuc.length == 11)
      this.remitenteService
        .getValidarRuc(this.form.value.numeroDocumentoIdentidadRuc)
        .then((r: any) => {
          this.form.controls['razonSocial'].setValue(r.data.razonSocial);
        });
  }
  selectChange(e: any) {
    this.valorTipoDocumento = e;
    if (e != 'D.N.I.') this.hiddenDni = false;
    else this.hiddenDni = true;
  }
  changeValidarDni(e: any) {
    if (e.length == 8) {
      this.validarStringDni = 'Validar DNI';
      this.hiddenValidarDni = false;
    } else {
      this.validarStringDni = 'Validar';
      this.hiddenValidarDni = true;
    }
  }
  changeValidarRuc(e: any) {
    if (e.length == 11) {
      this.validarStringRuc = 'Validar RUC';
      this.hiddenValidarRuc = false;
    } else {
      this.validarStringRuc = 'Validar';
      this.hiddenValidarRuc = true;
    }
  }
  activarRuc(e: any) {
    // console.log("change",e.target.checked);
    this.hiddenRuc = !e.target.checked;
  }
  cargarData() {
    this.api.tipoDocumento().subscribe({
      next: (res: tipoDocumento[]) => {
        this.listTipoDocumento = res;
      },
      error: (_err: any) => {
        console.log('error', _err);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  // onNoClick(): void {
  //   if(this.data.codigoRemitenteDocumento==0)
  //     this.dialogRef.close();
  //   else
  //     this.dialogRef.close(this.data);
  // }
}
export interface tipoDocumento {
  CodigoTipoDocumentoIdentidad: number;
  NombreTipoDocumentoIdentidad: string;
  CantidadDigitos: number;
  SoloNumero: number;
}
export interface respuestaRemitente {
  id: number;
  idItem: string;
  mensaje: string;
}
