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
import { computed, inject } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

const initialState: TAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('auth'),
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => {
    // const authService = inject(AuthService);
    return {
      decode: (jwt: string) => authService.jwtDecode(jwt),
      authService: authService.generateLoginForm,
      setToken(token: string) {
        patchState(store, { token: token });
        const parsedToken = authService.jwtDecode(token);
        console.log('parsedTOKEN: ', parsedToken);
        console.log('setting token: ', parsedToken);
        if (!parsedToken) {
          patchState(store, { user: null, isAuthenticated: false });
          localStorage.removeItem('token');
          return;
        }
        const { raw, header, payload } = parsedToken;
        patchState(store, { user: payload.user });
        localStorage.setItem('token', token);
      },
      //   setUser: (user: any, token: string) => {
      //     patchState(store, { user, token });
      //   },
    };
  }),
  withHooks((store) => ({
    onInit: () => {
      console.log('AUTH STORE INITIALIZED ', store);
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        store.setToken(existingToken);
        // patchState(store, { token: existingToken });
      }
    },
  }))
);
