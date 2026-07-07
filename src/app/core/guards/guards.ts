import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { ROUTES } from '../constants/routes';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree([`/${ROUTES.AUTH.LOGIN}`]);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  const dest = auth.isAdmin()
    ? `/${ROUTES.ADMIN.OVERVIEW}`
    : `/${ROUTES.DASHBOARD.OVERVIEW}`;
  return router.createUrlTree([dest]);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  return router.createUrlTree([`/${ROUTES.DASHBOARD.OVERVIEW}`]);
};

export const verifiedGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  if (auth.isVerified()) return true;
  return router.createUrlTree([`/${ROUTES.HOME}`]);
};