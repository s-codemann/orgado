import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  if (authStore.user()) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
