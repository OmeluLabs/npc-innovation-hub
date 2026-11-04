// /**
//  * API Routes Configuration
//  *
//  * Centralized endpoint definitions for all API routes.
//  * Provides type-safe route building with parameter injection.
//  */

// // ==================== BASE ROUTES ====================

// const API_BASE = "/api";

// // ==================== AUTH ROUTES ====================

// export const AUTH_ROUTES = {
//   LOGIN: `${API_BASE}/auth/login`,
//   REGISTER: `${API_BASE}/auth/register`,
//   GOOGLE_AUTH: `${API_BASE}/auth/google`,
//   VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
//   LOGOUT: `${API_BASE}/auth/logout`,
//   FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
//   RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
//   REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
// } as const;

// // ==================== USER ROUTES ====================

// export const USER_ROUTES = {
//   // Get all users (Admin only)
//   GET_ALL_USERS: `${API_BASE}/users/users`,

//   // Get single user by ID
//   GET_USER_BY_ID: (id: string) => `${API_BASE}/users/${id}`,

//   // Update user role (Admin only)
//   UPDATE_USER_ROLE: (id: string) => `${API_BASE}/users/${id}/role`,

//   // Change account status - activate/deactivate (Admin only)
//   CHANGE_ACCOUNT_STATUS: (id: string) =>
//     `${API_BASE}/users/change-account-status/${id}`,

//   // Delete user (Admin only)
//   DELETE_USER: (id: string) => `${API_BASE}/users/${id}`,

//   // Update user profile
//   UPDATE_PROFILE: (id: string) => `${API_BASE}/users/${id}`,

//   // Get current user profile
//   GET_CURRENT_USER: `${API_BASE}/users/me`,
// } as const;

// // ==================== MEMBER ROUTES ====================

// export const MEMBER_ROUTES = {
//   GET_ALL_MEMBERS: `${API_BASE}/members`,
//   GET_MEMBER_BY_ID: (id: string) => `${API_BASE}/members/${id}`,
//   CREATE_MEMBER: `${API_BASE}/members`,
//   UPDATE_MEMBER: (id: string) => `${API_BASE}/members/${id}`,
//   DELETE_MEMBER: (id: string) => `${API_BASE}/members/${id}`,
// } as const;

// // ==================== PROJECT ROUTES ====================

// export const PROJECT_ROUTES = {
//   GET_ALL_PROJECTS: `${API_BASE}/projects`,
//   GET_PROJECT_BY_ID: (id: string) => `${API_BASE}/projects/${id}`,
//   CREATE_PROJECT: `${API_BASE}/projects`,
//   UPDATE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
//   DELETE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
// } as const;

// // ==================== RESOURCE ROUTES ====================

// export const RESOURCE_ROUTES = {
//   GET_ALL_RESOURCES: `${API_BASE}/resources`,
//   GET_RESOURCE_BY_ID: (id: string) => `${API_BASE}/resources/${id}`,
//   GET_RESOURCES_BY_CATEGORY: (category: string) =>
//     `${API_BASE}/resources/category/${category}`,
//   CREATE_RESOURCE: `${API_BASE}/resources`,
//   UPDATE_RESOURCE: (id: string) => `${API_BASE}/resources/${id}`,
//   DELETE_RESOURCE: (id: string) => `${API_BASE}/resources/${id}`,
// } as const;

// // ==================== BLOG ROUTES ====================

// export const BLOG_ROUTES = {
//   GET_ALL_BLOGS: `${API_BASE}/blogs`,
//   GET_BLOG_BY_ID: (id: string) => `${API_BASE}/blogs/${id}`,
//   CREATE_BLOG: `${API_BASE}/blogs`,
//   UPDATE_BLOG: (id: string) => `${API_BASE}/blogs/${id}`,
//   DELETE_BLOG: (id: string) => `${API_BASE}/blogs/${id}`,
// } as const;

// // ==================== HIRE REQUEST ROUTES ====================

// export const HIRE_REQUEST_ROUTES = {
//   GET_ALL_HIRE_REQUESTS: `${API_BASE}/hire-requests`,
//   GET_HIRE_REQUEST_BY_ID: (id: string) => `${API_BASE}/hire-requests/${id}`,
//   CREATE_HIRE_REQUEST: `${API_BASE}/hire-requests`,
//   UPDATE_HIRE_REQUEST_STATUS: (id: string) =>
//     `${API_BASE}/hire-requests/${id}/status`,
//   DELETE_HIRE_REQUEST: (id: string) => `${API_BASE}/hire-requests/${id}`,
// } as const;

// // ==================== EVENT ROUTES ====================

// export const EVENT_ROUTES = {
//   GET_ALL_EVENTS: `${API_BASE}/events`,
//   GET_EVENT_BY_ID: (id: string) => `${API_BASE}/events/${id}`,
//   CREATE_EVENT: `${API_BASE}/events`,
//   UPDATE_EVENT: (id: string) => `${API_BASE}/events/${id}`,
//   DELETE_EVENT: (id: string) => `${API_BASE}/events/${id}`,
// } as const;

// // ==================== MESSAGE ROUTES ====================

// export const MESSAGE_ROUTES = {
//   GET_ALL_MESSAGES: `${API_BASE}/messages`,
//   GET_MESSAGE_BY_ID: (id: string) => `${API_BASE}/messages/${id}`,
//   SEND_MESSAGE: `${API_BASE}/messages`,
//   DELETE_MESSAGE: (id: string) => `${API_BASE}/messages/${id}`,
// } as const;

// // ==================== ADMIN MEMBER LEADERSHIP ROUTES ====================

export const MEMBER_LEADERSHIP_ROUTES = {
  UPDATE_LEADERSHIP: (memberId: string) =>
    `${API_BASE}/admin/members/${memberId}/leadership`,
} as const;

// ==================== HELPER FUNCTIONS ====================

// /**
//  * Build a route with query parameters
//  */
// export const buildRouteWithQuery = (
//   route: string,
//   params: Record<string, string | number | boolean>,
// ): string => {
//   const queryString = Object.entries(params)
//     .filter(([_, value]) => value !== undefined && value !== null)
//     .map(
//       ([key, value]) =>
//         `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
//     )
//     .join("&");

//   return queryString ? `${route}?${queryString}` : route;
// };

// /**
//  * Build a route with path parameters
//  */
// export const buildRouteWithParams = (
//   route: string,
//   params: Record<string, string>,
// ): string => {
//   let finalRoute = route;

//   Object.entries(params).forEach(([key, value]) => {
//     finalRoute = finalRoute.replace(`:${key}`, value);
//   });

//   return finalRoute;
// };

/**
 * API Routes Configuration
 *
 * Centralized endpoint definitions for all API routes.
 * Provides type-safe route building with parameter injection.
 */

// ==================== BASE ROUTES ====================

const API_BASE = "/api";

// ==================== AUTH ROUTES ====================

export const AUTH_ROUTES = {
  LOGIN: `${API_BASE}/auth/login`,
  GOOGLE_AUTH: `${API_BASE}/auth/google`,
  VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
  LOGOUT: `${API_BASE}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
} as const;

// ==================== USER ROUTES ====================

export const USER_ROUTES = {
  // Get all users (Admin only)
  GET_ALL_USERS: `${API_BASE}/users/users`,

  // Get single user by ID
  GET_USER_BY_ID: (id: string) => `${API_BASE}/users/${id}`,

  // Update user role (Admin only)
  UPDATE_USER_ROLE: (id: string) => `${API_BASE}/users/${id}/role`,

  // Change account status - activate/deactivate (Admin only)
  CHANGE_ACCOUNT_STATUS: (id: string) =>
    `${API_BASE}/users/change-account-status/${id}`,

  // Delete user (Admin only)
  DELETE_USER: (id: string) => `${API_BASE}/users/${id}`,

  // Update user profile
  UPDATE_PROFILE: (id: string) => `${API_BASE}/users/${id}`,

  // Get current user profile
  GET_CURRENT_USER: `${API_BASE}/users/me`,
} as const;

// ==================== MEMBER ROUTES ====================

export const MEMBER_ROUTES = {
  GET_ALL_MEMBERS: `${API_BASE}/members`,
  GET_MEMBER_BY_ID: (id: string) => `${API_BASE}/members/${id}`,
  CREATE_MEMBER: `${API_BASE}/members`,
  UPDATE_MEMBER: (id: string) => `${API_BASE}/members/${id}`,
  DELETE_MEMBER: (id: string) => `${API_BASE}/members/${id}`,
} as const;

// ==================== PROJECT ROUTES ====================

export const PROJECT_ROUTES = {
  GET_ALL_PROJECTS: `${API_BASE}/projects`,
  GET_PROJECT_BY_ID: (id: string) => `${API_BASE}/projects/${id}`,
  CREATE_PROJECT: `${API_BASE}/projects`,
  UPDATE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
  DELETE_PROJECT: (id: string) => `${API_BASE}/projects/${id}`,
} as const;

// ==================== RESOURCE ROUTES ====================

export const RESOURCE_ROUTES = {
  GET_ALL_RESOURCES: `${API_BASE}/resources`,
  GET_RESOURCE_BY_ID: (id: string) => `${API_BASE}/resources/${id}`,
  GET_RESOURCES_BY_CATEGORY: (category: string) =>
    `${API_BASE}/resources/category/${category}`,
  CREATE_RESOURCE: `${API_BASE}/resources`,
  UPDATE_RESOURCE: (id: string) => `${API_BASE}/resources/${id}`,
  DELETE_RESOURCE: (id: string) => `${API_BASE}/resources/${id}`,
} as const;

// ==================== BLOG ROUTES ====================

export const BLOG_ROUTES = {
  // Public routes
  GET_ALL_PUBLISHED_BLOGS: `${API_BASE}/blogs`,
  GET_BLOG_BY_ID: (id: string) => `${API_BASE}/blogs/blog/${id}`,
  GET_BLOGS_BY_CATEGORY: (category: string) =>
    `${API_BASE}/blogs/category/${category}`,
  GET_FEATURED_BLOGS: `${API_BASE}/blogs/featured`,

  // Admin routes
  GET_ALL_ADMIN_BLOGS: `${API_BASE}/blogs/admin/all`,
  CREATE_BLOG: `${API_BASE}/blogs`,
  UPDATE_BLOG: (id: string) => `${API_BASE}/blogs/${id}`,
  DELETE_BLOG: (id: string) => `${API_BASE}/blogs/${id}`,
  TOGGLE_PUBLISH_BLOG: (id: string) => `${API_BASE}/blogs/${id}/toggle-publish`,
} as const;

// ==================== HIRE REQUEST ROUTES ====================

export const HIRE_REQUEST_ROUTES = {
  GET_ALL_HIRE_REQUESTS: `${API_BASE}/hire-requests`,
  GET_HIRE_REQUEST_BY_ID: (id: string) => `${API_BASE}/hire-requests/${id}`,
  CREATE_HIRE_REQUEST: `${API_BASE}/hire-requests`,
  UPDATE_HIRE_REQUEST_STATUS: (id: string) =>
    `${API_BASE}/hire-requests/${id}/status`,
  DELETE_HIRE_REQUEST: (id: string) => `${API_BASE}/hire-requests/${id}`,
} as const;

// ==================== EVENT ROUTES ====================

export const EVENT_ROUTES = {
  GET_ALL_EVENTS: `${API_BASE}/events`,
  GET_EVENT_BY_ID: (id: string) => `${API_BASE}/events/${id}`,
  CREATE_EVENT: `${API_BASE}/events`,
  UPDATE_EVENT: (id: string) => `${API_BASE}/events/${id}`,
  DELETE_EVENT: (id: string) => `${API_BASE}/events/${id}`,
} as const;

// ==================== MESSAGE ROUTES ====================

export const MESSAGE_ROUTES = {
  GET_ALL_MESSAGES: `${API_BASE}/messages`,
  GET_MESSAGE_BY_ID: (id: string) => `${API_BASE}/messages/${id}`,
  SEND_MESSAGE: `${API_BASE}/messages`,
  DELETE_MESSAGE: (id: string) => `${API_BASE}/messages/${id}`,
} as const;

// ==================== ADMIN HERO MEMBER ROUTES ====================

export const HERO_MEMBER_ROUTES = {
  GET_HERO_MEMBERS: `${API_BASE}/admin/hero-members`,
  ADD_HERO_MEMBER: `${API_BASE}/admin/hero-members`,
  REMOVE_HERO_MEMBER: (id: string) => `${API_BASE}/admin/hero-members/${id}`,
  REORDER_HERO_MEMBERS: `${API_BASE}/admin/hero-members/reorder`,
  GET_MEMBERS_PICKER: `${API_BASE}/admin/members/picker`,
} as const;

// ==================== ADMIN HUB VIDEO ROUTES ====================

export const HUB_VIDEO_ROUTES = {
  GET_HUB_VIDEO: `${API_BASE}/admin/hub-video`,
  UPLOAD_HUB_VIDEO: `${API_BASE}/admin/hub-video`,
  DELETE_HUB_VIDEO: `${API_BASE}/admin/hub-video`,
} as const;

// ==================== ADMIN HERO MEDIA ROUTES ====================

export const HERO_MEDIA_ROUTES = {
  GET_HERO_MEDIA: `${API_BASE}/admin/hero-media`,
  UPLOAD_HERO_MEDIA: `${API_BASE}/admin/hero-media`,
  UPDATE_HERO_MEDIA: (id: string) => `${API_BASE}/admin/hero-media/${id}`,
  ACTIVATE_HERO_MEDIA: (id: string) =>
    `${API_BASE}/admin/hero-media/${id}/activate`,
  DEACTIVATE_HERO_MEDIA: (id: string) =>
    `${API_BASE}/admin/hero-media/${id}/deactivate`,
  SET_DEFAULT_HERO_MEDIA: (id: string) =>
    `${API_BASE}/admin/hero-media/${id}/default`,
  REORDER_HERO_MEDIA: `${API_BASE}/admin/hero-media/reorder`,
  DELETE_HERO_MEDIA: (id: string) => `${API_BASE}/admin/hero-media/${id}`,
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Build a route with query parameters
 */
export const buildRouteWithQuery = (
  route: string,
  params: Record<string, string | number | boolean>,
): string => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return queryString ? `${route}?${queryString}` : route;
};

/**
 * Build a route with path parameters
 */
export const buildRouteWithParams = (
  route: string,
  params: Record<string, string>,
): string => {
  let finalRoute = route;

  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, value);
  });

  return finalRoute;
};

// ─── ROUTES ADDITIONS ──────────────────────────────────────────────────────
// Add these entries to your existing src/api/routes.ts under the ROUTES object.
// If ROUTES is exported as a plain object, just merge this block into it.

// PROJECTS: {
//   ALL: "/api/projects",
//   ME: "/api/projects/me",
//   BY_ID: (id: string) => `/api/projects/project/${id}`,
//   CREATE: "/api/projects",
//   UPDATE: (id: string) => `/api/projects/${id}`,
//   DELETE: (id: string) => `/api/projects/${id}`,
//   SEARCH: "/api/projects/search",
// },

// ─── EXAMPLE of what your routes.ts might look like after merging ───────────
export const ROUTES = {
  // ... your existing routes ...

  PROJECTS: {
    ALL: "/api/projects",
    ME: "/api/projects/me",
    BY_ID: (id: string) => `/api/projects/project/${id}`,
    CREATE: "/api/projects",
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    SEARCH: "/api/projects/search",
  },
};
