import { ElementRef } from '@angular/core';

export interface Archivo {
  nombre: string;
  archivo: Blob;
  extension: string;
  element: ElementRef;
}
