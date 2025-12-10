/**
 * Route classification helpers for middleware optimization
 */

const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/change-password',
  '/auth/callback',
  '_next',
  '/favicon.ico',
]

const GUEST_ROUTE_PREFIX = '/guest/'

/**
 * Check if a route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if a route is a guest route
 */
export function isGuestRoute(pathname: string): boolean {
  return pathname.startsWith(GUEST_ROUTE_PREFIX)
}

/**
 * Check if route requires session validation
 * Public and guest routes don't need blocking session updates
 */
export function requiresSessionValidation(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isGuestRoute(pathname)
}
