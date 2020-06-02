import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'page-container',
  template: `
    <div class="pd-12" fxLayout="row" fxLayoutAlign="center start">
      <div fxFlex="90" fxFlex.lt-md="100"><ng-content></ng-content></div>
    </div>
  `,
  styles: [
    `
      :host.row div div {
        display: flex;
        flex-direction: row;
      }
      :host.row-center div div {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      :host.column div div {
        display: flex;
        flex-direction: column;
      }
      :host.column-center div div {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContainer {}
