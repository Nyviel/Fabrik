"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{
		title: "Profile",
		href: "/user/profile",
	},
	{
		title: "Orders",
		href: "/user/orders",
	},
	{
		title: "Wishlist",
		href: "/user/wishlist",
	},
];

const UserMainNav = ({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname();
	return (
		<nav {...props}>
			<ul
				className={cn(
					"flex items-center space-x-4 lg:space-x-6",
					className
				)}
			>
				{links.map((link) => (
					<li key={Math.random()}>
						<Link
							href={link.href}
							className={cn(
								"font-medium transition-all pb-1 hover:border-b hover:text-primary",
								!pathname.includes(link.href)
									? ""
									: "text-muted-foreground"
							)}
						>
							{link.title}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
export default UserMainNav;
