import {clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher} from "@clerk/nextjs/server";
import {NextFetchEvent, NextRequest} from "next/server";

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest, next: NextFetchEvent): Promise<void> => {
    const protectedRoutes = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);
    if (protectedRoutes(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
