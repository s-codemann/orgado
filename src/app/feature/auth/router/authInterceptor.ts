import {
  HTTP_INTERCEPTORS,
  HttpEventType,
  HttpHandler,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { tap } from 'rxjs';

export const AuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  console.log('TYPE', HttpEventType);
  if (req)
    console.log(
      'AUTH INTERCEPTOR RUNNING: ',
      authStore,
      authStore.token(),
      req
    );
  if (authStore.token()) {
    console.log('TOKEN EXISTS: ', 'Bearer ' + authStore.token());
    // req.headers.set('authorization:', 'Bearer ' + authStore.token());
    // req.headers.append('Authorization: ', 'Bearer ' + authStore.token());
    req = req.clone({
      headers: req.headers.append(
        'Authorization',
        'Bearer ' + authStore.token()
      ),
    });
    req = req.clone({
      headers: req.headers.append('X-New-Header', 'new header value'),
    });
    // req.headers.;
    console.log('SET HEADEARS', req.headers);
  }

  console.log('AUTH INTERCEPTOR RUNNING AFTER: ', authStore.token(), req);
  return next(req).pipe(
    tap((v) => {
      console.log('NEXTEDL: ', v);
    })
  );
};
