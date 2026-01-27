/**
 * Authentication middleware
 * 
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const stalkerStore = useStalkerStore();
  const xtreamStore = useXtreamStore();

  // Check if user is authenticated
  const isAuthenticated = !!(stalkerStore.token || xtreamStore.isAuthenticated);

  // If route requires auth and user is not authenticated, redirect to login
  if (!isAuthenticated && to.path !== '/') {
    return navigateTo('/');
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && to.path === '/') {
    return navigateTo('/dashboard');
  }
});
