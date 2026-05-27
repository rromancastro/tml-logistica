import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'novedades/:id_novedad',
    renderMode: RenderMode.Server
  },
  {
    path: 'novedades/:id_novedad/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
