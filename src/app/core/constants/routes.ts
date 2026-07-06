export const ROUTES = {
  HOME: 'home',
  MARKETPLACE: 'marketplace',
  MARKETPLACE_DETAIL: (id: number | string) => `marketplace/${id}`,

  AUTH: {
    LOGIN: 'auth/login',
    SIGNUP: 'auth/signup',
    FORGOT_PASSWORD: 'auth/forgot-password',
  },

  DASHBOARD: {
    ROOT: 'dashboard/company',
    OVERVIEW: 'dashboard/company/overview',
    MY_LISTINGS: 'dashboard/company/my-listings',
    RFQ_OFFERS: 'dashboard/company/rfq-offers',
    PROFILE: 'dashboard/company/profile',
    ORDERS: 'dashboard/company/orders',
    DISPUTES: 'dashboard/company/disputes',
    MESSAGES: 'dashboard/company/messages',
    NOTIFICATIONS: 'dashboard/company/notifications',
  },

  ADMIN: {
    ROOT: 'admin',
    OVERVIEW: 'admin/overview',
    KYB: 'admin/kyb',
    MODERATION: 'admin/moderation',
    ORDERS: 'admin/orders',
    DISPUTES: 'admin/disputes',
    USERS: 'admin/users',
    ANALYTICS: 'admin/analytics',
    SETTINGS: 'admin/settings',
  },
} as const;