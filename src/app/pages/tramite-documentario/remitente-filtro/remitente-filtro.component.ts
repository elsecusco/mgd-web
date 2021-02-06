import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TramiteService } from '../tramite-documentario.service';
import { Remitente, IRemitente, TipoRemitente } from '@models/tramite/remitente';
import { Observable, of } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  finalize
} from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { notifyOk } from '@core/swal';
import { RemitenteUpdateAddComponent } from '../remitente-update-add/remitente-update-add.component';

@Component({
  selector: 'remitente-filtro',
  templateUrl: './remitente-filtro.component.html',
  styleUrls: ['./remitente-filtro.component.scss']
})
export class RemitenteFiltroComponent implements OnInit {
  // para cambiar por donde empiezan a buscar el remitente
  tipoBusqueda = 2;
  nombreRemitente = new FormControl();
  remitentes: Observable<Remitente[]>;
  show = 'hidden';

  private _disabled: boolean;
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled || false;

    if (disabled) this.nombreRemitente.disable();
    else this.nombreRemitente.enable();
  }
  get disabled() {
    return this._disabled;
  }

  @Output() remitente = new EventEmitter<Remitente>();

  //constructor(private api: TramiteService) {}
  constructor(private api: TramiteService,public dialog: MatDialog) {}

  displayFn = (r?: Remitente) => (r ? r.nombreRemitenteDocumento : undefined);

  ngOnInit() {
    this.remitentes = this.nombreRemitente.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(nombre => this.buscarRemitente(nombre)),
      );
    this.clear();
  }
  
  buscarRemitente(value): Observable<Remitente[]> {
    if (typeof value == 'object' || value.length < 5) return of([]);

    this.show = 'visible';
    return this.api
      .buscarRemitente(this.tipoBusqueda, value)
      .pipe(finalize(() => (this.show = 'hidden')));
  }

  selectRemitente() {
    this.remitente.emit(this.nombreRemitente.value);
  }

  clear() {
    this.nombreRemitente.setValue('');
    this.remitente.emit(new Remitente());
  }
  
addRemitente() {
  const dialogRef = this.dialog.open(
    RemitenteUpdateAddComponent, {
    width: '440px',
    height:'450px',
    data: 
    {codigoRemitenteDocumento:0}
    // PARA RECUPERAR EL MODIFICAR DEL REMITENTE 81-83 
    // data: (this.nombreRemitente.value == "")?
    //   {codigoRemitenteDocumento:0}:
    //     this.nombreRemitente.value
    });
    dialogRef.afterClosed().subscribe(result => {
    if(result){
        this.nombreRemitente.setValue(result);
        this.remitente.emit(result);
     }
    else
      this.clear();
     });
   }
}
