import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'loading',
    loadComponent: () => import('./components/loading/loading.component').then(m => m.LoadingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent)
      },
      {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
