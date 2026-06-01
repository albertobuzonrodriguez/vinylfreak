import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const usuario = localStorage.getItem('usuario_logeado');

    if (usuario) {
      // ✅ Si intenta ir al login estando ya logueado, lo mandamos a inicio
      if (state.url === '/login' || state.url === '/registro') {
        router.navigate(['/inicio']);
        return false;
      }
      return true;
    } else {
      // ❌ No hay sesión: redirigir al login
      console.warn('Acceso denegado: redirigiendo al login...');
      router.navigate(['/login']);
      return false;
    }
  }

  // En el servidor (SSR), permitimos el paso para que Angular renderice la estructura,
  // pero el control real lo tomará el navegador en milisegundos.
  return true;
};
