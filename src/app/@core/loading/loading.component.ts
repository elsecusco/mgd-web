import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/**
 * Componente (dialog), spinner que sirve para indicar que una página
 * esta cargando
 */
@Component({
  selector: 'loading',
  template: `
              <mat-spinner strokeWidth="5"></mat-spinner>
              <div class="cl-primary letra-spinner">CARGANDO</div>
              
  `,
  // aqui se muetra el componente cargando
  styles: [
    `
  .letra-spinner {
    font-weight: bold;
    font-size: 12px;
    margin-left: 17px;
    margin-top: -58px;
    position: absolute;
  }
  `
  ]
})
export class LoadingComponent {
  /**
   * Representa una instancia de LoadingComponent.
   * @constructor
   * @param dialogRef Referencia un dialog abierto con MatDialog service.
   */
  constructor(public dialogRef: MatDialogRef<LoadingComponent>) {}

  /**
   * Cierra el componente(cierra el dialog cargando)
   */
  close() {
    this.dialogRef.close();
  }
}
