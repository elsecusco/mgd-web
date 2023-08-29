import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { LoadingComponent } from './loading.component';

/**
 * Servicio para abrir LoadingComponent(dialog cargando)
 */

@Injectable()
export class LoadingService {
  /**
   *Dialog de tipo LoadingComponent
   */
  dialogRef: MatDialogRef<LoadingComponent>;

  /**
   * Representa una instancia de LoadingService
   * @constructor
   * @param dialog Componente MatDialog de Angular Material
   */
  constructor(private dialog: MatDialog) {}

  /**
   * Abre el dialog de tipo LoadingComponent(modal cargando)
   */
  open() {
    const config: MatDialogConfig = {
      position: { top: this.altura() },
      disableClose: true,
      panelClass: 'modal-loading',
      hasBackdrop: true,
      backdropClass: 'modal-loading-backdrop'
    };
    this.dialogRef = this.dialog.open(LoadingComponent, config);
  }

  /**
   * Cierra el dialog de tipo LoadingComponent
   */
  close() {
    try {
      //console.log('Aquí')
      this.dialogRef.close();
    } 
    catch (error) {}
  }

  /**
   * Calcula el alto de la ventana del navegador en pixels
   */
  private altura(): string {
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    h = h > 300 ? h - 300 : 70;
    const altura = h / 2;

    return altura.toString() + 'px';
  }
}
