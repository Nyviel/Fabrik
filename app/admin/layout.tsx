import Menu from "@/components/shared/header/menu";
import UserMainNav from "@/components/shared/user-main-nav/user-main-nav";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col">
			<div className="border-b w-full">
				<div className="wrapper mx-auto flex items-center h-16 px-4 my-3">
					<Link href="/" className="w-22">
						<Image
							src={"/images/logo.svg"}
							height={48}
							width={48}
							alt={`${APP_NAME} logo`}
						/>
					</Link>
					<UserMainNav className="mx-6" />
					<div className="ml-auto items-center flex space-x-4">
						<div>
							<Input
								type="search"
								placeholder="Search..."
								className="md:w-[100px] lg:w-[300px]"
							></Input>
						</div>
						<Menu />
					</div>
				</div>
			</div>
			<div className="flex-1 space-y-4 p-8 pt-6 wrapper mx-auto">
				{children}
			</div>
		</div>
	);
}
