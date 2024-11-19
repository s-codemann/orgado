import { TAuthState } from '../model/auth';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

const initialState: TAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('auth'),
  withState(initialState),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => {
      // const router = inject(Router)
      return {
        logout: () => {
          localStorage.removeItem('token');
          patchState(store, { user: null });
          patchState(store, { token: null });
          patchState(store, { isAuthenticated: false });
          console.log('SHOULD NAVIGATE ');
          router.navigateByUrl('/login');
          // if(router.getCurrentNavigation())
        },
        decode: (jwt: string) => authService.jwtDecode(jwt),
        setToken(token: string) {
          patchState(store, { token: token });
          const parsedToken = authService.jwtDecode(token);
          if (!parsedToken) {
            patchState(store, { user: null, isAuthenticated: false });
            localStorage.removeItem('token');
            return;
          }
          const { raw, header, payload } = parsedToken;
          patchState(store, { user: payload.user });
          patchState(store, { isAuthenticated: true });
          localStorage.setItem('token', token);
        },
      };
    }
  ),
  withHooks((store) => ({
    onInit: () => {
      console.log('AUTH STORE INITIALIZED ', store);
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        store.setToken(existingToken);
      }
    },
  }))
);
