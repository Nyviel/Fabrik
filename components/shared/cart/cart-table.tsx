"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartTableQtyManager from "./cart-table-qty-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { ArrowRight, Loader } from "lucide-react";

interface CartTableProps {
	cart?: Cart;
}

const CartTable = ({ cart }: CartTableProps) => {
	const [pending, setPending] = useState(false);
	const [checkoutPending, startTransition] = useTransition();
	const router = useRouter();

	const goToCheckout = async () => {
		startTransition(async () => {
			router.push("/shipping-address");
		});
	};

	return (
		<div>
			<h1 className="py-4 h2-bold mb-4">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div>
					Cart is empty.{" "}
					<Link href={"/"} className="underline">
						Go shopping!
					</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Item</TableHead>
									<TableHead className="text-center">
										Quantity
									</TableHead>
									<TableHead className="text-end">
										Price
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.items.map((item) => {
									return (
										<TableRow key={item.slug}>
											<TableCell>
												<Link
													href={`/product/${item.slug}`}
													className="flex items-center"
												>
													<Image
														src={item.image}
														alt={`${item.name} image`}
														width={50}
														height={50}
													/>
													<span className="px-2">
														{item.name}
													</span>
												</Link>
											</TableCell>
											<TableCell className="flex items-center justify-center h-[75px] gap-2">
												<CartTableQtyManager
													item={item}
													checkoutPending={
														checkoutPending
													}
													setPending={setPending}
												/>
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(item.price)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
					<Card className="py-2 mx-2 h-fit">
						<CardContent className="p-4 gap-4 h-full ">
							<div className="h-full text-x">
								<div className="flex flex-col gap-1 px-2">
									<span className="flex justify-between">
										<span className="font-bold">
											Items netto{" "}
										</span>
										{formatCurrency(cart.itemsPrice)}
									</span>
									<span className="flex justify-between">
										<span className="font-bold">
											Shipping{" "}
										</span>
										{formatCurrency(cart.shippingPrice)}
									</span>
									<span className="flex justify-between">
										<span className="font-bold">Tax </span>{" "}
										{formatCurrency(cart.taxPrice)}
									</span>
									<span className="flex justify-between">
										<span className="font-bold">
											Total{" "}
										</span>{" "}
										{formatCurrency(cart.totalPrice)}
									</span>
									<Button
										className="w-full mt-4"
										disabled={pending}
										onClick={goToCheckout}
									>
										{checkoutPending ? (
											<Loader className="w-4 h-4 animate-spin" />
										) : (
											<>
												<ArrowRight className="w-4 h-4" />{" "}
												Checkout
											</>
										)}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};
export default CartTable;
