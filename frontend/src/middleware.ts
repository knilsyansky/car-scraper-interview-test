import { NextRequest, NextResponse } from "next/server";
import { TOKEN_PROVIDER } from "./shared/lib/providers";

export function middleware(request: NextRequest) {
	const token = request.cookies.get(TOKEN_PROVIDER);
	const isLoginPage = request.nextUrl.pathname === "/login";

	if (!token && !isLoginPage) {
		const loginUrl = new URL("/login", request.url);

		loginUrl.searchParams.set("from", request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (token && isLoginPage) {
		return NextResponse.redirect(new URL("/", request.url));
	}

    return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};