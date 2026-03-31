import { Routes } from '@angular/router';


export const routes: Routes = [
    { path: '', loadComponent: () => import('./inicio/inicio').then((m) => m.Inicio) },
    { path: 'servicios', loadComponent: () => import('./servicios/servicios').then((m) => m.Servicios) },
    { path: 'nosotros', loadComponent: () => import('./nosotros/nosotros').then((m) => m.Nosotros) },
    { path: 'novedades', loadComponent: () => import('./novedades/novedades').then((m) => m.Novedades) },
];
