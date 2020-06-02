import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'row-container',
  template: `
    <div
      fxLayout="row"
      fxLayoutAlign="start center"
      fxLayoutGap="8px"
      fxLayout.xs="column"
      fxLayoutAlign.xs="start"
    >
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowContainer {}
