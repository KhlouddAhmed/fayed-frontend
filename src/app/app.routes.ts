import { Routes } from '@angular/router';
import { NotFoundPage } from './features/errors/pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/landing/pages/landing-page/landing-page')
      .then(m => m.LandingPage),
  },
  {
    path: 'marketplace',
    loadComponent: () => import('./features/listings/pages/marketplace-page/marketplace-page')
      .then(m => m.MarketplacePageComponent),
    title: 'سوق فايض - تصفح الخامات'
  },
  {
    path: 'marketplace/:id',
    loadComponent: () => import('./features/listings/components/listing-details/listing-details')
      .then(m => m.ListingDetailsComponent),
    title: 'تفاصيل الخامة - فايض'
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
  },
  // { 
  //   path: 'auth/sign-up', 
  //   component: SignUpPage 
  // },
  { path: '**', component: NotFoundPage },
];