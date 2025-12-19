import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import {
  isBypassRoutes,
  isProtectedRoutes,
  isPublicRoutes,
} from "./lib/permissions";

const PublicMatcher = createRouteMatcher(isPublicRoutes);
const ProtectedMatcher = createRouteMatcher(isProtectedRoutes);
const BypassMatcher = createRouteMatcher(isBypassRoutes);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authed = await convexAuth.isAuthenticated();

    if (PublicMatcher(request) && authed) {
      return nextjsMiddlewareRedirect(request, "/dashboard");
    }
    if (ProtectedMatcher(request) && !authed) {
      return nextjsMiddlewareRedirect(request, "/auth/sign-in");
    }
    if (BypassMatcher(request)) return;

    return;
  },
  {
    cookieConfig: { maxAge: 60 * 60 * 24 * 30 },
  }
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
