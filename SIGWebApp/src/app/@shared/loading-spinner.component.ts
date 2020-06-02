import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-sp',
  template: `
    <div class="loading-sp" *ngIf="loading">
      <mat-spinner *ngIf="loading" strokeWidth="2" diameter="50"></mat-spinner>
    </div>
  `,
  styles: [
    `
      .loading-sp {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class LoadingSpinnerComponent {
  @Input() loading: boolean;
}
