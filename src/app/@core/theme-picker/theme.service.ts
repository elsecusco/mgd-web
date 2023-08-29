import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ThemeService {
  /**
   * Objeto observable, que sirve para  enviar y
   * recibir información.
   */
  private emitChangeNav = new Subject<any>();

  /**
   * Enviar información cuando hay un cambio.
   * @param data Información que se desea enviar.
   */
  enviar(data: any) {
    this.emitChangeNav.next(data);
  }

  /**
   * Escucha(detecta) cuando sucede un cambio,
   * recibe la información que se envío a
   * través del método enviar(data).
   */
  recibir(): Observable<any> {
    return this.emitChangeNav.asObservable();
  }
}
