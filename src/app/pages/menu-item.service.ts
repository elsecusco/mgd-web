import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../@core/http.service';

@Injectable()
export class MenuItemService {
  constructor(private http: HttpService) {}

  getItems(codigoItem: number): Observable<any> {
    return this.http.get({
      uri: `api/menu/${codigoItem}`,
      open: true,
      close: true,
    });
  }
}
