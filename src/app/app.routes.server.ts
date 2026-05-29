import { RenderMode, ServerRoute } from '@angular/ssr';

// Bloque anterior: solo se declaraban rutas publicas de novedades como SSR.
// Se comenta para conservar la base previa antes de sumar el area admin.
// export const serverRoutes: ServerRoute[] = [
//   {
//     path: 'novedades/:id_novedad',
//     renderMode: RenderMode.Server
//   },
//   {
//     path: 'novedades/:id_novedad/:slug',
//     renderMode: RenderMode.Server
//   },
//   {
//     path: '**',
//     renderMode: RenderMode.Prerender
//   }
// ];

// Bloque nuevo: el admin se renderiza en modo client y el resto mantiene el comportamiento previo.
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
    path: 'admin/login',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
