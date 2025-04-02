import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import {
	APP_AUTHORS,
	APP_DESCRIPTION,
	APP_KEYWORDS,
	APP_NAME,
	APP_TITLE,
	SERVER_URL,
} from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: { template: `%s | ${APP_NAME}`, default: APP_TITLE },
	description: APP_DESCRIPTION,
	authors: APP_AUTHORS,
	applicationName: APP_NAME,
	keywords: APP_KEYWORDS,
	metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
