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

  // Admin Dashboard
  {
    path: 'admin',
    loadComponent: () => import('./features/dashboards/layouts/admin-layout/admin-layout')
      .then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./features/dashboards/admin/pages/overview/overview')
          .then(m => m.OverviewComponent),
        title: 'لوحة تحكم الأدمن - فايض'
      },
      {
        path: 'kyb',
        loadComponent: () => import('./features/dashboards/admin/pages/kyb-verification/kyb-verification')
          .then(m => m.KybComponent),
        title: 'التحقق من الهوية - فايض'
      },
      {
        path: 'moderation',
        loadComponent: () => import('./features/dashboards/admin/pages/listings-moderation/listings-moderation')
          .then(m => m.ModerationComponent),
        title: 'إدارة الإعلانات - فايض'
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/dashboards/admin/pages/orders-payments/orders-payments')
          .then(m => m.OrdersComponent),
        title: 'الطلبات والمدفوعات - فايض'
      }
    ]
  },

  // Company Dashboard
  {
    path: 'dashboard/company',
    loadComponent: () => import('./features/dashboards/layouts/company-layout/company-layout')
      .then(m => m.CompanyLayout),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./features/dashboards/company/pages/overview/overview')
          .then(m => m.Overview),
      },
    ],
  },

  { path: '**', component: NotFoundPage },
];