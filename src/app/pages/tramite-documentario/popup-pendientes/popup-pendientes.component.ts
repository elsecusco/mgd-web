import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Inject,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { PopupPendientes } from '../../../@models/tramite/popup-pendientes';
// import { notifyOk } from '@core/swal';

@Component({
  selector: 'popup-pendientes',
  templateUrl: './popup-pendientes.component.html',
  styleUrls: ['./popup-pendientes.component.scss'],
})
export class PopupPendientesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PopupPendientesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupPendientes
  ) {}

  ngOnInit() {}
}
