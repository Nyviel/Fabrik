import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";
export const config = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60,
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: "email" },
				password: { type: "password" },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				//Find user in db
				const user = await prisma.user.findFirst({
					where: { email: credentials.email as string },
				});

				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}

				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, user, trigger, token }: any) {
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;
			console.log(`Session callback: ${session.user}`);
			if (trigger == "update") {
				session.user.name = user.name;
			}

			return session;
		},
		async jwt({ token, user, trigger, session }: any) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				console.log(`JWT callback: ${session.user}`);

				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];

					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}
				if (trigger === "signIn" || trigger === "signUp") {
					const currentCookies = await cookies();
					const sessionCartId =
						currentCookies.get("sessionCartId")?.value;

					if (sessionCartId) {
						const cart = await prisma.cart.findFirst({
							where: { sessionCartId },
						});

						// Cart made as a guest will overwrite cart the user might have had
						if (cart && !cart.userId) {
							await prisma.cart.deleteMany({
								where: { userId: user.id },
							});

							await prisma.cart.update({
								where: { id: cart.id },
								data: { userId: user.id },
							});
						}
					}
				}
			}
			if (session?.user.name && trigger === "update") {
				token.name = session.user.name;
			}
			return token;
		},
		...authConfig.callbacks,
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
