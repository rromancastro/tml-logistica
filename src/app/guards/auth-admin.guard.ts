import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

// Bloque nuevo: protege el area /admin usando la sesion administrativa ya existente.
export const authAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedInAdmin) {
    return true;
  }

  return router.parseUrl('/admin/login');
};
