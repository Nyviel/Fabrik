import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const authConfig = {
	providers: [], // Required by NextAuthConfig type
	callbacks: {
		async authorized({ request, auth }: any) {
			const protectedPaths = [
				/\/shipping-address/,
				/\/payment-method/,
				/\/place-order/,
				/\/profile/,
				/\/user\/(.*)/,
				/\/order\/(.*)/,
				/\/admin\/(.*)/,
			];

			const adminPath = /\/admin\/(.*)/;

			// Get pathname from the req URL object
			const { pathname } = request.nextUrl;

			// Check if user is not authenticated and accessing a protected path
			if (!auth && protectedPaths.some((p) => p.test(pathname))) {
				return false;
			}

			const token = await getToken({
				req: request,
				secret: process.env.NEXTAUTH_SECRET,
			});

			const userRole = token?.role;
			console.log(`Authorized callback: ${token}`);

			if (adminPath.test(pathname) && userRole !== "admin") {
				return NextResponse.redirect(
					new URL("/unauthorized", request.url)
				);
			}

			// Check for session cart cookie
			if (!request.cookies.get("sessionCartId")) {
				// Generate new session cart id cookie
				const sessionCartId = crypto.randomUUID();

				// Create new response and add the new headers
				const response = NextResponse.next({
					request: {
						headers: new Headers(request.headers),
					},
				});

				// Set newly generated sessionCartId in the response cookies
				response.cookies.set("sessionCartId", sessionCartId);

				return response;
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
