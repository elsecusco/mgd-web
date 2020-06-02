import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { swalError, notifyOk, notifyInfo, swalInfo } from '@core/swal';
import { Logout } from './auth/state/auth.action';

@Injectable()
export class ResponseHttpInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) this.eventAction(event);
        },
        error => {
          if (error instanceof HttpErrorResponse) this.errorAction(error);
        }
      )
    );
  }

  eventAction(res: HttpResponse<any>) {
    switch (res.status) {
      case 201:
        notifyOk(res.body['message']);
        break;
      case 204:
        notifyInfo(res.statusText);
        break;
      default:
        break;
    }
  }
  errorAction(error: HttpErrorResponse) {
    const title = error.statusText;
    const message =
      error.error.Message == undefined ? error.message : error.error.Message;

    switch (error.status) {
      case 401:
        swalInfo(title, message);
        this.store.dispatch(new Logout());
        break;
      case 500:
        swalError(title, message);
        break;
      default:
        swalError(title, message);
        break;
    }
  }
}
