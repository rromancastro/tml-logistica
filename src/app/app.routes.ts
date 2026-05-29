import { Routes } from '@angular/router';
import { authAdminGuard } from './guards/auth-admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./inicio/inicio').then((m) => m.Inicio) },
  { path: 'servicios', loadComponent: () => import('./servicios/servicios').then((m) => m.Servicios) },
  { path: 'nosotros', loadComponent: () => import('./nosotros/nosotros').then((m) => m.Nosotros) },
  { path: 'novedades', loadComponent: () => import('./novedades/novedades').then((m) => m.Novedades) },
  {
    path: 'novedades/:id_novedad/:slug',
    loadComponent: () => import('./novedades/novedades-page/novedades-page').then((m) => m.NovedadesPage),
  },
  {
    path: 'novedades/:id_novedad',
    loadComponent: () => import('./novedades/novedades-page/novedades-page').then((m) => m.NovedadesPage),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/home/shop-login/shop-login.component').then((m) => m.ShopLoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authAdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'noticias',
      },
      {
        path: 'noticias',
        loadComponent: () => import('./admin/home/listados/listados.component').then((m) => m.ListadosComponent),
      },
      {
        path: 'noticias/nuevo',
        loadComponent: () => import('./admin/home/editar-blog/editar-blog.component').then((m) => m.EditarBlogComponent),
      },
      {
        path: 'noticias/:datoId',
        loadComponent: () => import('./admin/home/editar-blog/editar-blog.component').then((m) => m.EditarBlogComponent),
      },
    ],
  },
];
