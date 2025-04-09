import Footer from "@/components/footer/footer";
import Header from "@/components/header";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 wrapper">{children}</main>
			<Footer />
		</div>
	);
}
