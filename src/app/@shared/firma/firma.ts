import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { WINDOW } from '../../@core/window';

import { FirmaModel } from '../../@models/firma.model';

@Component({
  selector: 'firma',
  templateUrl: './firma.html'
})
export class Firma implements OnInit {
  @Input() f!: FirmaModel;
  @Output() resultado = new EventEmitter<any>();

  @ViewChild('form') form!: ElementRef<HTMLFormElement>;
  constructor(@Inject(WINDOW) private window: Window) {}

  listener:any;

  ngOnInit() {
    this.listener = this.result.bind(this);
    this.window.addEventListener('message', this.listener, false);
  }
  ngOnDestroy() {
    this.window.removeEventListener('message', this.listener, false);
  }

  result(e: any) {
    ///console.log(JSON.stringify(this.f))
    this.resultado.emit(JSON.parse(e.data));
  }

  firmar() {
    this.form.nativeElement.submit();
  }
}
