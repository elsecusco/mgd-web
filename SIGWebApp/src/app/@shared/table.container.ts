import {
  Component,
  Input,
  AfterViewInit,
  Renderer2,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@core/window';

@Component({
  selector: 'table-container',
  template: `
    <div class="relative" id="{{idContainer}}">
      <loading-sp [loading]="loading"></loading-sp>
      <div class="overflow-auto" id="{{idContainer}}1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContainer implements AfterViewInit {
  @Input() idContainer: string;
  @Input() heightSub: number;
  @Input() loading: boolean;

  constructor(
    private r2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  ngAfterViewInit() {
    const el = this.document.getElementById(this.idContainer);
    const el1 = this.document.getElementById(`${this.idContainer}1`);
    const h =
      this.window.innerHeight ||
      this.document.documentElement.clientHeight ||
      this.document.body.clientHeight;

    let height = h - this.heightSub;
    height = height > 400 ? height : 400;
    this.r2.setStyle(el, 'height', `${height}px`);
    this.r2.setStyle(el1, 'height', `${height}px`);
  }
}
