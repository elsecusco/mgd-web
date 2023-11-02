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
  hidden: boolean = true;
  validarString: string = '';
  saving!: boolean;
  @Output() save = new EventEmitter<number | string>();

  form!: FormGroup;
  tiposRemitente!: Observable<TipoRemitente[]>;
  Tipo: any;

  constructor(
    private remitenteService: RemitenteService,
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<RemitenteUpdateAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRemitente
  ) {}
  ngDoCheck() {
    this.changeValidar(this.form.value.numeroDocumentoIdentidad);
  }
  ngOnInit() {
    this.tiposRemitente = this.api.tiposRemitente().pipe(finalize(() => {}));
    this.initForm();
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
      });
  }
  guardarRemitente() {
    this.saving = true;
    const observer = {
      next: (res: any) => {
        notifyOk(res.mensaje);
        this.form.disable();
        this.form.patchValue({
          codigoRemitenteDocumento: res.idItem,
        });
        this.data.codigoRemitenteDocumento = +res.idItem;
        this.data.nombreRemitenteDocumento = this.form.value.nombre;
        this.data.codigoTipoRemitenteDocumento = this.form.value.tipo;
        this.data.telefonoContacto = this.form.value.telefono;
        this.data.emailContacto = this.form.value.email;
        this.data.numeroDocumentoIdentidad =
          this.form.value.numeroDocumentoIdentidad;
        this.data.apellidoPaterno = this.form.value.apellidoPaterno;
        this.data.apellidoMaterno = this.form.value.apellidoMaterno;
        this.data.nombres = this.form.value.nombres;
        this.saving = false;
        this.save.emit(res.idItem);
        this.dialogRef.close(this.data);
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
  validar() {
    if (this.form.value.numeroDocumentoIdentidad.length == 8)
      this.remitenteService
        .getValidarDni(this.form.value.numeroDocumentoIdentidad)
        .then((r: any) => {
          this.form.controls['nombre'].setValue(r.data.nombre);
          this.form.controls['apellidoPaterno'].setValue(r.data.aPaterno);
          this.form.controls['apellidoMaterno'].setValue(r.data.aMaterno);
          this.form.controls['nombres'].setValue(r.data.nombres);
        });
    if (this.form.value.numeroDocumentoIdentidad.length == 11)
      this.remitenteService
        .getValidarRuc(this.form.value.numeroDocumentoIdentidad)
        .then((r: any) => {
          this.form.controls['nombre'].setValue(r.data.razonSocial);
        });
  }
  changeValidar(e: any) {
    if (e.length == 8) {
      this.validarString = 'validar DNI';
      this.hidden = false;
    } else if (e.length == 11) {
      this.validarString = 'validar RUC';
      this.hidden = false;
    } else {
      this.validarString = 'validar';
      this.hidden = true;
    }
  }
  // onNoClick(): void {
  //   if(this.data.codigoRemitenteDocumento==0)
  //     this.dialogRef.close();
  //   else
  //     this.dialogRef.close(this.data);
  // }
}
