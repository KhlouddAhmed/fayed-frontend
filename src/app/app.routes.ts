import { Routes } from '@angular/router';
import { NotFoundPage } from './features/errors/pages/not-found-page/not-found-page';
import { authGuard, guestGuard, adminGuard, verifiedGuard } from './core/guards/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/landing/pages/landing-page/landing-page').then(m => m.LandingPage),
    title: 'فايض',
  },
  {
    path: 'marketplace',
    loadComponent: () =>
      import('./features/listings/pages/marketplace-page/marketplace-page').then(
        m => m.MarketplacePageComponent
      ),
    title: 'سوق فايض - تصفح الخامات',
  },
  {
    path: 'marketplace/:id',
    loadComponent: () =>
      import('./features/listings/components/listing-details/listing-details').then(
        m => m.ListingDetailsComponent
      ),
    title: 'تفاصيل الخامة - فايض',
  },

  // Auth routes — guests only (redirect if already logged in)
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
    title: 'تسجيل الدخول - فايض',
  },
  {
    path: 'auth/signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
    title: 'التسجيل - فايض',
  },

  // Admin Dashboard — admin role required
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/dashboards/layouts/admin-layout/admin-layout').then(
        m => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/overview/overview').then(m => m.OverviewComponent),
        title: 'لوحة تحكم الأدمن - فايض',
      },
      {
        path: 'kyb',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/kyb-verification/kyb-verification').then(
            m => m.KybComponent
          ),
        title: 'التحقق من الهوية - فايض',
      },
      {
        path: 'moderation',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/listings-moderation/listings-moderation').then(
            m => m.ModerationComponent
          ),
        title: 'إدارة الإعلانات - فايض',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/orders-payments/orders-payments').then(
            m => m.OrdersComponent
          ),
        title: 'الطلبات والمدفوعات - فايض',
      },
      {
        path: 'disputes',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/disputes-management/disputes-management').then(
            m => m.DisputesComponent
          ),
        title: 'إدارة النزاعات - فايض',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/user-management/user-management').then(
            m => m.UsersComponent
          ),
        title: 'إدارة المستخدمين - فايض',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/analytics/analytics').then(m => m.AnalyticsComponent),
        title: 'تحليلات المنصة - فايض',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboards/admin/pages/settings/settings').then(m => m.SettingsComponent),
        title: 'إعدادات المنصة - فايض',
      },
    ],
  },

  // Company Dashboard — authenticated + verified factory required
  {
    path: 'dashboard/company',
    canActivate: [authGuard, verifiedGuard],
    loadComponent: () =>
      import('./features/dashboards/layouts/company-layout/company-layout').then(
        m => m.CompanyLayout
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/dashboards/company/pages/overview/overview').then(m => m.Overview),
        title: 'الرئيسية - فايض',
      },
      {
        path: 'my-listings',
        loadComponent: () =>
          import('./features/dashboards/company/pages/my-listings/my-listings').then(
            m => m.MyListings
          ),
        title: 'المنتجات المعروضة - فايض',
      },
      {
        path: 'rfq-offers',
        loadComponent: () =>
          import('./features/dashboards/company/pages/rfq-offers/rfq-offers').then(m => m.RfqOffers),
        title: 'العروض وطلبات الأسعار - فايض',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/dashboards/company/pages/profile/profile').then(m => m.Profile),
        title: 'الملف الشخصي - فايض',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/dashboards/company/pages/orders/orders').then(m => m.Orders),
        title: 'الطلبات النشطة - فايض',
      },
      {
        path: 'disputes',
        loadComponent: () =>
          import('./features/dashboards/company/pages/disputes/disputes').then(m => m.Disputes),
        title: 'النزاعات - فايض',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/dashboards/company/pages/messages/messages').then(m => m.Messages),
        title: 'الرسائل - فايض',
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './features/notifications/pages/notification-center-page/notification-center-page'
          ).then(c => c.NotificationCenterPage),
        title: 'الإشعارات - فايض',
      },
      //    {
      //         path: 'payment', 
      //         loadComponent: () => import('./features/payment/payment')
      //           .then(m => m.PaymentComponent),
      //       },
      {
        path: 'payment/:contractId',
        loadComponent: () => import('./features/payment/payment')
          .then(m => m.PaymentComponent),
        title: 'إتمام الدفع - فايض'
      },
    ],
  },

  { path: '**', component: NotFoundPage },
];