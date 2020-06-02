import { Injectable } from '@angular/core';

import { HttpService } from '@core/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class MenuItemService {
  constructor(private http: HttpService) {}

  getItems(codigoItem: number): Observable<any> {
    return this.http.get({
      uri: `api/menu/${codigoItem}`,
      open: true,
      close: true
    });
  }
}
