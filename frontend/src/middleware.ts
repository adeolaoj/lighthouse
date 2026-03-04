import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// function runs before a page loads, checks for auth cookie, if not present redirects to login page
export const middleware = (request: NextRequest) => {

    // check for cookie
    const token = request.cookies.get("auth");

    if (!token) {
        // builds the login url e.g. http://localhost:3000/LoginPage
        const loginUrl = new URL("/LoginPage", request.url);
        // allows app to redirect back to the originally requested page after login
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        // redirects to login page
        return NextResponse.redirect(loginUrl);
    }
    // if cookie is present, allow access to the page
    return NextResponse.next();
}

// applies the middleware only to the ResultsPage route, allowing LoginPage to be accessed without authentication
export const config = {
    matcher: ["/ResultsPage"],
}