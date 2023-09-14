import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Inject,
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

@Component({
  selector: 'remitente-update-add',
  templateUrl: './remitente-update-add.component.html',
  styleUrls: ['./remitente-update-add.component.scss'],
})
export class RemitenteUpdateAddComponent {
  saving!: boolean;
  @Output() save = new EventEmitter<number | string>();

  form!: FormGroup;
  tiposRemitente!: Observable<TipoRemitente[]>;
  Tipo: any;

  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialogRef: MatDialogRef<RemitenteUpdateAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRemitente
  ) {}

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
        email: [this.data.emailContacto, ''],
      });
    else
      this.form = this.fb.group({
        codigoRemitenteDocumento: this.data.codigoRemitenteDocumento,
        nombre: ['', Validators.required],
        tipo: ['', Validators.required],
        telefono: ['', Validators.required],
        // email: ['', Validators.required]
        email: ['', ''],
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
  // onNoClick(): void {
  //   if(this.data.codigoRemitenteDocumento==0)
  //     this.dialogRef.close();
  //   else
  //     this.dialogRef.close(this.data);
  // }
}
