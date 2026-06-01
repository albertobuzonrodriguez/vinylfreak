import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'biblioteca',
    renderMode: RenderMode.Server // Cambia Prerender por Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
