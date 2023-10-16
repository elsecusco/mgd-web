import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Pair } from '../../../@models/pair';
import { TramiteTipos } from '../../../@models/tramite/tramite-tipos';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TramiteTiposState } from '../states/tramite-tipos.state';
import { TramiteService } from '../tramite-documentario.service';
import { notifyOk } from '../../../@core/swal';

@Component({
  selector: 'detalle-sielse-guardar',
  templateUrl: './detalle-sielse-guardar.component.html',
  styleUrls: ['./detalle-sielse-guardar.component.scss'],
})
export class DetalleSielseGuardarComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('f') f: any;

  tipos!: TramiteTipos;
  @Select(TramiteTiposState.tipos)
  public tipos$!: Observable<TramiteTipos>;

  @Emitter(TramiteTiposState.loadTipos)
  private loadTipos!: Emittable<TramiteTipos>;

  loaded!: Boolean;
  @Select(TramiteTiposState.loaded)
  public loaded$!: Observable<Boolean>;

  private tiposSucursal: any[] = [];

  public today = new Date();

  constructor(
    private fb: FormBuilder,
    private api: TramiteService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DetalleSielseGuardarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.tipos$.subscribe((tipos) => (this.tipos = tipos));
    this.loaded$.subscribe((l) => {
      if (!l) this.loadTipos.emit({} as TramiteTipos);
    });
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      codigoDocumento: [this.data],
      codigoSucursal: [null, Validators.required],
      claseOTMantenimiento: [null],
      tipoOTMantenimiento: [null],
      codigoTrabajador: [null, Validators.required],
      fechaInspeccion: [new Date(), Validators.required],
      indicaciones: ['', Validators.required],
    });
  }
  tiposTecnicoSupervisor: Pair[] = [];
  onCodigoSucursalChange(codigoSucursal: any) {
    this.tiposTecnicoSupervisor = this.tipos.tiposTecnicoSupervisor
      ? this.tipos.tiposTecnicoSupervisor[codigoSucursal]
      : [];
    //cambia el tipo de solicitud, al elegir la clase solicitud
    //this.tiposSucursal = this.tipos.tiposTecnicoSupervisor[codigoSucursal];
  }
  tiposOTMantenimiento: Pair[] = [];
  onClaseOTMantenimientoChange(claseOt: any) {
    this.tiposOTMantenimiento = this.tipos.tiposOTMantenimiento
      ? this.tipos.tiposOTMantenimiento[claseOt]
      : [];
  }
  guardar() {
    this.api.guardarOTMantenimiento(this.form.value).subscribe((res) => {
      notifyOk(res.mensaje);
      this.dialogRef.close(true);
      //console.log(res.idItem);
      //this.form.disable();
    });
  }
}
