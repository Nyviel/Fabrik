import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import ThemeSwitcher from "./theme-switcher";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
	return (
		<div className="flex justify-end gap-3">
			<nav className="hidden md:flex w-full max-w-xs gap-1">
				<ThemeSwitcher />
				<Button asChild variant="ghost">
					<Link href="/cart">
						<ShoppingCart /> Cart
					</Link>
				</Button>
				<UserButton />
			</nav>
			<nav className="md:hidden">
				<Sheet>
					<SheetTrigger className="align-middle">
						<EllipsisVertical />
					</SheetTrigger>
					<SheetContent className="flex flex-col p-6 items-start">
						<SheetTitle>Menu</SheetTitle>
						<ThemeSwitcher />
						<Button asChild variant="ghost">
							<Link href="/cart">
								<ShoppingCart /> Cart
							</Link>
						</Button>
						<UserButton />
						<SheetDescription></SheetDescription>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
};
export default Menu;
