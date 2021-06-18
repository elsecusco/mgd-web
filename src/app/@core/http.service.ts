import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading/loading.service';

import { setUrl } from '@core/functions';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private loading: LoadingService) {}

  get(options: Options) {
    return this.Http('get', options);
  }
  post(options: Options) {
    return this.Http('post', options);
  }
  put(options: Options) {
    return this.Http('put', options);
  }
  delete(options: Options) {
    return this.Http('delete', options);
  }
  patch(options: Options) {
    return this.Http('patch', options);
  }

  private Http(type: string, options: Options) {
    const URL = setUrl(options.uri);

    let http: Observable<any>;
    switch (type) {
      case 'post':
        http = this.http.post(URL, options.body, options.options);
        break;
      case 'put':
        http = this.http.put(URL, options.body, options.options);
        break;
      case 'delete':
        http = this.http.delete(URL, options.options);
        break;
      case 'patch':
        http = this.http.patch(URL, options.body, options.options);
        break;
      default:
        // get
        http = this.http.get(URL, options.options);
        break;
    }

    if (options.open) this.loading.open();

    return http.pipe(
      finalize(() => {
        if (options.close) this.loading.close();
        }),
      catchError(e => {
        this.loading.close();
        return throwError(e);
      })
    );
  }
}

export interface Options {
  uri: string;
  open: boolean;
  close: boolean;
  body?: any;
  result?: any;
  options?: any;
}
