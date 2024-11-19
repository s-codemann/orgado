import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEventType,
  HttpHandler,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { catchError, of, tap } from 'rxjs';
import { EventType } from '@angular/router';

export const AuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  if (authStore.token()) {
    req = req.clone({
      headers: req.headers.append(
        'Authorization',
        'Bearer ' + authStore.token()
      ),
    });
  }

  return next(req).pipe(
    catchError((e) => {
      if (e instanceof HttpErrorResponse) {
        if (e.status === 401) {
          console.log('OMG, LOGOUT');
          authStore.logout();
        }
      }
      return of(e);
    }),
    tap((ev) => {
      if ((ev as unknown as HttpErrorResponse).error) {
        return;
      }
      //@ts-ignore
      if (ev.error) {
        console.log('V ERR', ev);
        //@ts-ignore
        if (ev.status === 401) {
        }

        return;
      }
      console.log(
        'AUTH INTERCEPTOR',
        ev.type,
        ev.type === HttpEventType.Response
      );
      if (ev.type === HttpEventType.Response) {
        if (ev.status === 401) {
          console.log('OMG, LOGOUT');
          authStore.logout();
        }
      }
    })
  );
};
