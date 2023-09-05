import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { toAAmmdd } from '../../@core/functions';
import { TwoPicker } from './two-picker';

@Component({
  selector: 'two-picker',
  templateUrl: './two-picker.component.html',
  styleUrls: ['./two-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoPickerComponent implements OnInit {
  private _fechaInicio = new Date();
  private _fechaFin = new Date();

  @Input()
  set fechaInicio(fechaInicio: Date) {
    this._fechaInicio = fechaInicio || new Date();
  }

  get fechaInicio(): Date {
    return this._fechaInicio;
  }

  @Input()
  set fechaFin(fechaFin: Date) {
    this._fechaFin = fechaFin || new Date();
  }

  get fechaFin(): Date {
    return this._fechaFin;
  }

  @Output() changeFecha = new EventEmitter<TwoPicker>();

  constructor() {}
  ngOnInit() {}

  changeInicio(fecha: Date) {
    const fechaInicio = fecha;
    const fechaFin = this.fechaFin;
    this.changeFecha.emit({ fechaInicio, fechaFin });
  }
  changeFin(fecha: Date) {
    const fechaInicio = this.fechaInicio;
    const fechaFin = fecha;
    this.changeFecha.emit({ fechaInicio, fechaFin });
  }
}
