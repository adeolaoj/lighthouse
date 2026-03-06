import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/results(.*)']);

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
  if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
    return nextjsMiddlewareRedirect(request, '/login');
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
