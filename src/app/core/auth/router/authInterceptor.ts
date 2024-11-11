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
  if (req)
    if (authStore.token()) {
      req = req.clone({
        headers: req.headers.append(
          'Authorization',
          'Bearer ' + authStore.token()
        ),
      });
    }

  return next(req);
};
