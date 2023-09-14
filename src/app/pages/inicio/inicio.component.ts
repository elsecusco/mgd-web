import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
// import { Menu } from '@models/menu';

@Component({
  selector: 'inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  _pending = false;
  @Input() items: any[] = [];
  @Input()
  set pending(isPending: boolean) {
    this._pending = isPending;
  }

  constructor() {}

  ngOnInit() {}
}
